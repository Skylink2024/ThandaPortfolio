import { cn } from '@/lib/cn';

export interface DeviceFrameProps {
  device: 'desktop' | 'tablet' | 'phone';
  children: React.ReactNode;
  url?: string;
  tilt?: boolean;
  className?: string;
}

const sizes: Record<DeviceFrameProps['device'], string> = {
  desktop: 'aspect-[16/10] w-full',
  tablet: 'aspect-[3/4] w-[70%] max-w-md',
  phone: 'aspect-[9/19] w-[42%] max-w-[240px]',
};

export function DeviceFrame({
  device,
  children,
  url,
  tilt = false,
  className,
}: DeviceFrameProps) {
  return (
    <div
      className={cn(
        'mx-auto overflow-hidden rounded-[var(--radius-xl)] border border-border bg-navy-900 shadow-[var(--shadow-lg)]',
        sizes[device],
        tilt && '[transform:perspective(1600px)_rotateX(8deg)_rotateY(-14deg)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 bg-navy-700 px-3 py-2">
        <span className="size-2 rounded-full bg-danger/80" aria-hidden="true" />
        <span className="size-2 rounded-full bg-warning/80" aria-hidden="true" />
        <span className="size-2 rounded-full bg-success/80" aria-hidden="true" />
        {url ? (
          <span className="ml-2 truncate rounded-[var(--radius-sm)] bg-black/30 px-2 py-0.5 font-mono text-[10px] text-white/70">
            {url}
          </span>
        ) : null}
      </div>
      <div className="h-[calc(100%-2rem)] overflow-hidden bg-bg">{children}</div>
    </div>
  );
}
