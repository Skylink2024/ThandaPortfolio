import { NextResponse } from 'next/server';
import { site } from '@data/site';
import { formatZAR } from '@/lib/format';
import { quotePayloadSchema, type QuotePayload } from '@/lib/quote';

/**
 * Quote email route.
 * - Validates with zod, drops honeypot submissions silently, rate-limits by IP (5/min, in-memory).
 * - Forwards to FORMSPREE_ENDPOINT when configured.
 * TODO(Thanda): create a free Formspree form for brike.webdev@gmail.com and set FORMSPREE_ENDPOINT.
 */

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Keep the map from growing without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function summarise(p: QuotePayload): string {
  const lines = p.lines.map((l) => {
    const amount = l.billing === 'once' && p.onceOff === null ? '' : ` ${formatZAR(l.amount)}`;
    return `- ${l.label}${amount} (${l.billing})${l.note ? ` - ${l.note}` : ''}`;
  });
  return [
    `Source: ${p.source}`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone || 'not given'}`,
    `Package: ${p.packageId}`,
    `Once-off: ${p.onceOff === null ? 'Custom quote (over R15,000)' : formatZAR(p.onceOff)}`,
    `Monthly: ${formatZAR(p.monthly)}/month`,
    `Yearly: ${formatZAR(p.yearly)}/year`,
    '',
    ...lines,
    '',
    `Link: ${p.shareUrl}`,
  ].join('\n');
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a minute.' },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot filled in: pretend success so bots learn nothing.
  const honeypot =
    typeof body === 'object' && body !== null
      ? (body as Record<string, unknown>).company_website
      : undefined;
  if (typeof honeypot === 'string' && honeypot.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = quotePayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid quote.' },
      { status: 400 },
    );
  }
  const payload = parsed.data;

  const endpoint = process.env.FORMSPREE_ENDPOINT;
  if (!endpoint) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[quote] FORMSPREE_ENDPOINT not set; dev payload:\n' + summarise(payload));
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json(
      { ok: false, error: `Email isn't set up yet. Please WhatsApp ${site.owner} instead.` },
      { status: 503 },
    );
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: `New Brike Web quote: ${payload.name} (${payload.packageId})`,
        _replyto: payload.email,
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? '',
        message: summarise(payload),
      }),
    });
    if (!res.ok) throw new Error(`Upstream ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please WhatsApp me instead.' },
      { status: 502 },
    );
  }
}
