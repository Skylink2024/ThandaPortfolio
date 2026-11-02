/** Analytics track() wrapper — implemented in later phases. */
export function track(event: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === 'development') {
    console.info('[analytics]', event, payload);
  }
}
