import { Phone } from 'lucide-react';

const telefono = '5493757416333';

function IconoInstagram() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm10.5 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />
    </svg>
  );
}

function IconoFacebook() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M13.5 22v-8h2.8l.4-3.2h-3.2V7.2c0-.9.3-1.5 1.6-1.5H16V2.7c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.9v2.2H7.5V14h2.5v8h3.5Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="mt-10 border-t border-mist bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-ink">Sunshine</p>
          <p className="text-sm text-ink-light">Tu camino hacia una comunicación fluida.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-light">
          <a
            href={`https://wa.me/${telefono}?text=Hola%2C%20quiero%20consultar%20por%20turnos%20y%20cursos.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-[#25D366] bg-[#25D366]/10 px-3 py-2 text-ink transition-colors hover:bg-[#25D366]/20"
            aria-label="Contactar por WhatsApp"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.08 0C5.52 0 .17 5.35.17 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.33-1.66c1.75.96 3.72 1.46 5.75 1.46h.01c6.57 0 11.91-5.35 11.91-11.91 0-3.18-1.24-6.17-3.48-8.41ZM12.08 21.8c-1.75 0-3.47-.48-4.97-1.38l-.36-.21-3.76.98 1-3.66-.23-.37A9.86 9.86 0 0 1 2.2 11.9c0-5.46 4.42-9.88 9.88-9.88 2.64 0 5.12 1.03 6.99 2.9a9.82 9.82 0 0 1 2.9 6.98c0 5.46-4.42 9.88-9.88 9.88Zm5.42-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.46-.15-.66.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.08-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.48.13-.63.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.53-.07-.15-.66-1.6-.9-2.19-.23-.57-.47-.49-.66-.5l-.56-.01c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.08 3.18 5.04 4.46.7.3 1.25.48 1.68.62.71.22 1.35.19 1.86.12.57-.08 1.76-.72 2-1.42.24-.7.24-1.3.17-1.42-.08-.12-.27-.2-.57-.35Z" />
              </svg>
            </span>
            WhatsApp: +54 3757-508363
          </a>

          <a
            href="https://www.instagram.com/instituto.sunshine/"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/10 bg-ink/5 p-2 transition-colors hover:bg-ink/10"
            aria-label="Instagram"
          >
            <IconoInstagram />
          </a>

          <a
            href="https://www.facebook.com/profile.php?id=100067753920792"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-ink/10 bg-ink/5 p-2 transition-colors hover:bg-ink/10"
            aria-label="Facebook"
          >
            <IconoFacebook />
          </a>

          <a
            href="mailto:instituto@example.com"
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/5 px-3 py-1.5 transition-colors hover:bg-ink/10"
            aria-label="Mail de contacto"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Zm2.2-.75 6.8 5.4 6.8-5.4H5.2Zm13.05 2.3-6.24 4.95a1.25 1.25 0 0 1-1.52 0L5.75 8.3v9h12.5v-9Z" />
            </svg>
            Contacto
          </a>

        </div>
      </div>
    </footer>
  );
}
