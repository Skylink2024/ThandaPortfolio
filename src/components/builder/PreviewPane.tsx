'use client';

import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Segmented } from '@/components/ui/Segmented';
import { LiveSitePreview } from '@/components/builder/preview/LiveSitePreview';
import type { BuilderState } from '@/store/builder';
import { cn } from '@/lib/cn';

export function PreviewPane({
  device,
  onDeviceChange,
  state,
  className,
  compact = false,
}: {
  device: 'desktop' | 'phone';
  onDeviceChange: (d: 'desktop' | 'phone') => void;
  state: Pick<BuilderState, 'business' | 'style' | 'pages' | 'features'>;
  className?: string;
  compact?: boolean;
}) {
  const summary = `Preview: ${state.style.presetId} style, ${state.pages.length} pages${
    state.business.name ? `, ${state.business.name}` : ''
  }`;

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="sr-only">{summary}</p>
        <p className="text-micro text-gray-700" aria-hidden>
          Live preview
        </p>
        {compact ? null : (
          <Segmented
            ariaLabel="Preview device size"
            value={device}
            onChange={onDeviceChange}
            options={[
              { value: 'desktop', label: 'Desktop' },
              { value: 'phone', label: 'Phone' },
            ]}
          />
        )}
      </div>
      <div className="min-h-0 flex-1" aria-hidden="true">
        <DeviceFrame
          device={device}
          url={
            state.business.name
              ? `${state.business.name.toLowerCase().replace(/\s+/g, '')}.co.za`
              : 'yourbusiness.co.za'
          }
          className={cn(
            'h-full max-h-[min(720px,70vh)]',
            device === 'phone' && 'mx-auto max-h-[min(640px,68vh)]',
            compact && device === 'phone' && 'w-[min(100%,260px)] max-h-[min(480px,58vh)]',
          )}
        >
          <LiveSitePreview state={state} mobile={device === 'phone'} />
        </DeviceFrame>
      </div>
    </div>
  );
}
