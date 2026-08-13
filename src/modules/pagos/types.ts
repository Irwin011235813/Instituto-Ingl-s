import type { Timestamp } from 'firebase/firestore';

export type TipoPago = 'matricula' | 'mensual';
export type EstadoCuota = 'pendiente' | 'pagada' | 'vencida' | 'cancelada';

/**
 * Documento en la colección cuotas/{cuotaId}.
 * Se crea SIEMPRE desde la Cloud Function (nunca desde el cliente) para que
 * el monto no pueda ser manipulado desde el navegador.
 */
export interface Cuota {
  alumnoUid: string;
  alumnoNombre: string;
  cursoId: string;
  cursoNombre: string;
  turnoId: string | null;
  tipo: TipoPago;
  monto: number;
  moneda: 'ARS';
  estado: EstadoCuota;
  periodo: string | null;
  mercadoPago: {
    preferenceId: string | null;
    paymentId: string | null;
    initPoint: string | null;
  };
  fechaCreacion: Timestamp;
  fechaVencimiento: Timestamp | null;
  fechaPago: Timestamp | null;
}

export interface CrearPreferenciaInput {
  cursoId: string;
  turnoId?: string;
  tipo: TipoPago;
}

export interface CrearPreferenciaOutput {
  cuotaId: string;
  initPoint: string;
}
