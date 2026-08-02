# Instituto de Inglés · Gestión de turnos (MVP)

Aplicación web para gestionar cursos, turnos de clase e inscripciones de un instituto de inglés, con paneles diferenciados por rol (`admin`, `profesor`, `alumno`).

**Stack:** React + TypeScript + Vite · Tailwind CSS v4 · Firebase (Auth + Firestore) · Despliegue en Vercel.

## 1. Instalación local

```bash
npm install
cp .env.example .env.local
```

Completá `.env.local` con las credenciales de tu proyecto de Firebase (`Configuración del proyecto → Tus apps → SDK setup and configuration`).

```bash
npm run dev
```

## 2. Configuración de Firebase

### Authentication
Habilitar el proveedor **Google** en `Authentication → Sign-in method`.

### Firestore
Crear la base de datos en modo producción y desplegar las reglas e índices incluidos:

```bash
npm install -g firebase-tools
firebase login
firebase use --add          # seleccionar tu proyecto
firebase deploy --only firestore
```

Esto sube `firestore.rules` (permisos por rol) y `firestore.indexes.json` (índices compuestos que las queries del proyecto necesitan).

### Alta del primer administrador

Como las reglas exigen que un `admin` dé de alta a los demás usuarios, el primer administrador se crea a mano:

1. Iniciar sesión una vez en la app con la cuenta de Google que va a ser admin (va a quedar bloqueada en "Acceso pendiente", es esperado).
2. En la consola de Firestore, crear manualmente el documento `usuarios_autorizados/{uid}` (el `uid` se ve en `Authentication → Users`):

```json
{
  "email": "admin@example.com",
  "nombre": "Nombre Apellido",
  "rol": "admin",
  "activo": true,
  "fechaAlta": <timestamp actual>
}
```

3. Recargar la app. Desde ahí, ese admin puede dar de alta a profesores y alumnos de la misma forma (a futuro, conviene mover esto a una pantalla de gestión de usuarios dentro de la app).

## 3. Estructura del proyecto

```
src/
├── components/       # UI genérica (Boton, Etiqueta, Spinner) y layout (Navbar)
├── modules/          # Un módulo por dominio: cursos, turnos, inscripciones, usuarios
│   └── {modulo}/
│       ├── components/  # Componentes propios del módulo
│       ├── hooks/       # Hooks que exponen datos ya listos para la UI
│       ├── services/    # Toda la lógica de Firestore vive acá
│       └── types.ts     # Tipos del dominio
├── context/          # AuthContext (sesión + rol)
├── routes/           # AppRouter, ProtectedRoute, RoleRoute
├── pages/            # Páginas que orquestan módulos
├── services/         # firebase.ts (inicialización)
└── types/            # Tipos globales compartidos
```

## 4. Modelo de datos (Firestore)

- **`usuarios_autorizados/{uid}`** — perfil y rol de cada usuario habilitado.
- **`cursos/{cursoId}`** — curso con nivel (MCER), profesor asignado y cupo.
- **`turnos/{turnoId}`** — una clase puntual de un curso (día, horario, aula, cupo).
- **`inscripciones/{inscripcionId}`** — vínculo alumno↔turno. La creación/cancelación se hace con `runTransaction` para mantener el contador `turnos.inscriptos` siempre consistente con el cupo real.

## 5. Deploy en Vercel

1. Subir el repo a GitHub.
2. En Vercel: **New Project → Import** el repo (framework detectado: Vite).
3. Cargar las mismas variables de `.env.example` en **Project Settings → Environment Variables**, para los entornos `Production`, `Preview` y `Development`.
4. Deploy. Cada Pull Request va a generar automáticamente su propio Preview Deployment.

## 6. Próximos pasos sugeridos (fuera de este MVP)

- Pantalla de gestión de usuarios (alta/baja/cambio de rol) para no depender de la consola de Firestore.
- Notificaciones (email o push) al inscribirse o al cancelarse un turno.
- Historial de asistencia por alumno.
- Code-splitting (el bundle actual es un único chunk; a medida que crezca conviene lazy-loading por ruta con `React.lazy`).
