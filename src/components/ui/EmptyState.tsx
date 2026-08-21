import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-mist bg-white/60 px-6 py-14">
      <div className="w-12 h-12 rounded-full bg-paper-dim flex items-center justify-center mb-4">
        <Icon size={22} className="text-ink-light" />
      </div>
      <p className="font-display font-semibold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-light mt-1.5 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}