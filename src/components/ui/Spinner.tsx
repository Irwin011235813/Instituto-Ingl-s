export function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-light">
      <div className="w-8 h-8 border-2 border-mist border-t-mustard rounded-full animate-spin" />
      <p className="text-sm font-mono">{label}</p>
    </div>
  );
}
