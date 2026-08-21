export function Spinner({ label = 'Cargando...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-ink-light">
      <div className="relative w-8 h-8">
        <div className="absolute inset-0 border-2 border-mist rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-mustard-dark rounded-full animate-spin" />
      </div>
      <p className="text-sm font-mono">{label}</p>
    </div>
  );
}