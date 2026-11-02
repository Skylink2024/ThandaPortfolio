'use client';

import { useSyncExternalStore } from 'react';

function subscribe() {
  return () => {};
}

export function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => 2026,
  );

  return <>{year}</>;
}
