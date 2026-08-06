/**
 * Footer del panel interno. A propósito NO incluye WhatsApp/redes/contacto
 * comercial — esos elementos son para la landing pública (ver Footer.tsx),
 * no tienen sentido dentro de una herramienta de gestión para el equipo.
 */
export function AdminFooter() {
  return (
    <footer className="mt-10 border-t border-mist bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-4 text-center">
        <p className="text-xs text-ink-light">
          Sunshine Instituto · Panel de gestión interno
        </p>
      </div>
    </footer>
  );
}
