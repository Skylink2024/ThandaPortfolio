'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DeviceFrame } from '@/components/ui/DeviceFrame';
import { Segmented } from '@/components/ui/Segmented';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Project } from '@data/projects';
import { cn } from '@/lib/cn';

type Device = 'desktop' | 'tablet' | 'phone';

export function LivePreview({
  name,
  url,
  embeddable,
  fallbackImages,
}: {
  name: string;
  url?: string;
  embeddable: boolean;
  fallbackImages: Project['screenshots'];
}) {
  const [device, setDevice] = useState<Device>('desktop');
  const [loaded, setLoaded] = useState(false);

  const canEmbed = Boolean(url && embeddable);

  return (
    <div>
      <div className="mb-4 flex justify-center">
        <Segmented<Device>
          ariaLabel="Preview device"
          value={device}
          onChange={(value) => setDevice(value)}
          options={[
            { value: 'desktop', label: 'Desktop' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'phone', label: 'Phone' },
          ]}
        />
      </div>
      <DeviceFrame
        device={device === 'tablet' ? 'tablet' : device}
        url={url}
        className={cn('transition-all duration-300', device === 'phone' && 'mx-auto')}
      >
        {canEmbed ? (
          <div className="relative h-full w-full">
            {!loaded ? <Skeleton className="absolute inset-0" /> : null}
            <iframe
              src={url}
              title={`${name} live preview`}
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
              className="h-full w-full border-0 bg-white"
              onLoad={() => setLoaded(true)}
            />
          </div>
        ) : fallbackImages.length > 0 ? (
          <div className="h-full overflow-hidden">
            <div className="animate-[scrollPreview_12s_ease-in-out_infinite] space-y-2 p-2">
              {fallbackImages.map((shot) => (
                <Image
                  key={shot.src}
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.device === 'phone' ? 390 : 1280}
                  height={shot.device === 'phone' ? 844 : 800}
                  className="w-full rounded-[var(--radius-sm)]"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center bg-surface-2 p-8 text-center text-sm text-gray-500">
            Preview coming soon. Screenshots will appear here.
          </div>
        )}
      </DeviceFrame>
    </div>
  );
}
