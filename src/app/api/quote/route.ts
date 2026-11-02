import { NextResponse } from 'next/server';

/** Quote email route — implemented in Phase 6. */
export async function POST() {
  return NextResponse.json(
    { ok: false, error: 'Quote API not implemented yet.' },
    { status: 501 },
  );
}
