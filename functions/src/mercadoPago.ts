import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

if (admin.apps.length === 0) {
  admin.initializeApp();
}

const db = admin.firestore();

const MERCADOPAGO_ACCESS_TOKEN = defineSecret('MERCADOPAGO_ACCESS_TOKEN');
const APP_URL = defineSecret('APP_URL');

type TipoPago = 'matricula' | 'mensual';

interface CrearPreferenciaRequest {
  cursoId: string;
  turnoId?: string;
  tipo: TipoPago;
}

export const crearPreferenciaPago = onCall<CrearPreferenciaRequest>(
  { secrets: [MERCADOPAGO_ACCESS_TOKEN, APP_URL], region: 'us-central1' },
  async (request) => {
    const auth = request.auth;
    if (!auth) {
      throw new HttpsError('unauthenticated', 'Necesitás iniciar sesión para inscribirte.');
    }

    const { cursoId, turnoId, tipo } = request.data;
    if (!cursoId || !tipo) {
      throw new HttpsError('invalid-argument', 'Faltan datos: cursoId y tipo son obligatorios.');
    }
    if (tipo === 'matricula' && !turnoId) {
      throw new HttpsError('invalid-argument', 'Para pagar la matrícula es obligatorio elegir un turno.');
    }

    const perfilSnap = await db.collection('usuarios_autorizados').doc(auth.uid).get();
    if (!perfilSnap.exists || perfilSnap.data()?.activo !== true) {
      throw new HttpsError('permission-denied', 'Tu cuenta todavía no está habilitada.');
    }
    const perfil = perfilSnap.data() as { nombre: string; rol: string };

    const cursoSnap = await db.collection('cursos').doc(cursoId).get();
    if (!cursoSnap.exists) {
      throw new HttpsError('not-found', 'El curso no existe.');
    }
    const curso = cursoSnap.data() as {
      nombre: string;
      precioMatricula: number;
      precioCuotaMensual: number;
      activo: boolean;
    };
    if (!curso.activo) {
      throw new HttpsError('failed-precondition', 'Este curso ya no está activo.');
    }

    const monto = tipo === 'matricula' ? curso.precioMatricula : curso.precioCuotaMensual;
    if (!monto || monto <= 0) {
      throw new HttpsError('failed-precondition', 'El curso no tiene un precio configurado.');
    }

    if (tipo === 'matricula' && turnoId) {
      const turnoSnap = await db.collection('turnos').doc(turnoId).get();
      if (!turnoSnap.exists) throw new HttpsError('not-found', 'El turno no existe.');
      const turno = turnoSnap.data() as { inscriptos: number; cupoMaximo: number };
      if (turno.inscriptos >= turno.cupoMaximo) {
        throw new HttpsError('resource-exhausted', 'Ese turno ya no tiene cupo disponible.');
      }
    }

    const periodo = tipo === 'mensual' ? new Date().toISOString().slice(0, 7) : null;

    const cuotaRef = db.collection('cuotas').doc();
    await cuotaRef.set({
      alumnoUid: auth.uid,
      alumnoNombre: perfil.nombre,
      cursoId,
      cursoNombre: curso.nombre,
      turnoId: turnoId ?? null,
      tipo,
      monto,
      moneda: 'ARS',
      estado: 'pendiente',
      periodo,
      mercadoPago: { preferenceId: null, paymentId: null, initPoint: null },
      fechaCreacion: admin.firestore.FieldValue.serverTimestamp(),
      fechaVencimiento: null,
      fechaPago: null,
    });

    const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN.value() });
    const preferenceApi = new Preference(client);
    const appUrl = APP_URL.value();

    const titulo =
      tipo === 'matricula' ? `Matrícula - ${curso.nombre}` : `Cuota mensual - ${curso.nombre}`;

    const preferencia = await preferenceApi.create({
      body: {
        items: [
          {
            id: cuotaRef.id,
            title: titulo,
            quantity: 1,
            unit_price: monto,
            currency_id: 'ARS',
          },
        ],
        external_reference: cuotaRef.id,
        notification_url: `${process.env.FUNCTION_URL_MERCADOPAGO_WEBHOOK ?? ''}`,
        back_urls: {
          success: `${appUrl}/panel?pago=exitoso`,
          failure: `${appUrl}/panel?pago=fallido`,
          pending: `${appUrl}/panel?pago=pendiente`,
        },
        auto_return: 'approved',
      },
    });

    await cuotaRef.update({
      'mercadoPago.preferenceId': preferencia.id,
      'mercadoPago.initPoint': preferencia.init_point,
    });

    return { cuotaId: cuotaRef.id, initPoint: preferencia.init_point };
  }
);

export const webhookMercadoPago = onRequest(
  { secrets: [MERCADOPAGO_ACCESS_TOKEN] },
  async (req, res) => {
    try {
      const paymentId = req.query['data.id'] ?? req.body?.data?.id;
      const tipoNotificacion = req.query.type ?? req.body?.type;

      if (tipoNotificacion !== 'payment' || !paymentId) {
        res.status(200).send('ignorado');
        return;
      }

      const client = new MercadoPagoConfig({ accessToken: MERCADOPAGO_ACCESS_TOKEN.value() });
      const paymentApi = new Payment(client);
      const pago = await paymentApi.get({ id: String(paymentId) });

      const cuotaId = pago.external_reference;
      if (!cuotaId) {
        res.status(200).send('sin external_reference');
        return;
      }

      const cuotaRef = db.collection('cuotas').doc(cuotaId);
      const cuotaSnap = await cuotaRef.get();
      if (!cuotaSnap.exists) {
        res.status(200).send('cuota no encontrada');
        return;
      }
      const cuota = cuotaSnap.data() as {
        estado: string;
        tipo: TipoPago;
        turnoId: string | null;
        alumnoUid: string;
        alumnoNombre: string;
        cursoId: string;
      };

      if (pago.status === 'approved' && cuota.estado !== 'pagada') {
        await db.runTransaction(async (tx) => {
          tx.update(cuotaRef, {
            estado: 'pagada',
            'mercadoPago.paymentId': String(pago.id),
            fechaPago: admin.firestore.FieldValue.serverTimestamp(),
          });

          if (cuota.tipo === 'matricula' && cuota.turnoId) {
            const turnoRef = db.collection('turnos').doc(cuota.turnoId);
            const turnoSnap = await tx.get(turnoRef);
            if (turnoSnap.exists) {
              const turno = turnoSnap.data() as { inscriptos: number; cupoMaximo: number };
              if (turno.inscriptos < turno.cupoMaximo) {
                const inscripcionRef = db.collection('inscripciones').doc();
                tx.set(inscripcionRef, {
                  turnoId: cuota.turnoId,
                  cursoId: cuota.cursoId,
                  alumnoUid: cuota.alumnoUid,
                  alumnoNombre: cuota.alumnoNombre,
                  estado: 'activa',
                  fechaInscripcion: admin.firestore.FieldValue.serverTimestamp(),
                  fechaCancelacion: null,
                });
                tx.update(turnoRef, { inscriptos: admin.firestore.FieldValue.increment(1) });
              }
            }
          }
        });
      } else if (pago.status === 'rejected' || pago.status === 'cancelled') {
        await cuotaRef.update({ estado: 'cancelada' });
      }

      res.status(200).send('ok');
    } catch (error) {
      console.error('Error procesando webhook de Mercado Pago:', error);
      res.status(500).send('error');
    }
  }
);
