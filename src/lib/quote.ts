import { z } from 'zod';

/**
 * Quote payload shared by the client (configurator modal) and the /api/quote route.
 * Builder-only fields (businessName, industry, design) are optional so the pricing
 * configurator can use the same endpoint.
 */
export const quoteLineSchema = z.object({
  id: z.string().max(60),
  label: z.string().max(120),
  amount: z.number().min(0).max(1_000_000),
  billing: z.enum(['once', 'month', 'year', 'hour']),
  note: z.string().max(160).optional(),
});

export const quotePayloadSchema = z.object({
  source: z.enum(['builder', 'configurator', 'contact']),
  name: z.string().trim().min(2, 'Please enter your name.').max(100),
  email: z.email('Please enter a valid email address.').max(160),
  phone: z.string().trim().max(30).optional(),
  businessName: z.string().trim().max(120).optional(),
  industry: z.string().max(40).optional(),
  packageId: z.enum(['starter', 'business', 'google', 'editor', 'shop']),
  /** null when the quote is over the cap. */
  onceOff: z.number().min(0).max(15_000).nullable(),
  monthly: z.number().min(0).max(1_000_000),
  yearly: z.number().min(0).max(1_000_000),
  lines: z.array(quoteLineSchema).max(40),
  shareUrl: z.string().max(2000),
  design: z.unknown().optional(),
  createdAt: z.string().max(40),
  /** Honeypot: real visitors never fill this in. */
  company_website: z.string().max(0).optional(),
});

export type QuotePayload = z.infer<typeof quotePayloadSchema>;
