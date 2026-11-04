'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SocialIcon } from '@/components/ui/SocialIcons';
import { WhatsAppIcon } from '@/components/ui/WhatsAppIcon';
import { packages } from '@data/pricing';
import { site } from '@data/site';
import { cn } from '@/lib/cn';
import { whatsappLink } from '@/lib/whatsapp';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  businessName: z.string().min(2, 'Please enter your business name'),
  phone: z.string().min(8, 'Please enter a phone number'),
  email: z.string().email('Please enter a valid email'),
  packageInterest: z.string(),
  message: z.string().min(10, 'Tell me a little more'),
  company_website: z.string().optional(),
  designCode: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm({ designCode }: { designCode?: string }) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      packageInterest: 'not-sure',
      designCode: designCode ?? '',
      company_website: '',
    },
  });

  const waFallback = useMemo(
    () =>
      whatsappLink(
        site.whatsappNumber,
        "Hi Thanda, I'd like to talk about a website for my business.",
      ),
    [],
  );

  async function onSubmit(values: FormValues) {
    setStatus('idle');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contact',
          name: values.name,
          email: values.email,
          phone: values.phone,
          businessName: values.businessName,
          industry: 'other',
          packageId: values.packageInterest === 'not-sure' ? 'business' : values.packageInterest,
          onceOff: null,
          monthly: 0,
          yearly: 0,
          lines: [
            {
              id: 'message',
              label: values.message,
              amount: 0,
              billing: 'once',
            },
          ],
          shareUrl: values.designCode
            ? `${site.url}/build?d=${values.designCode}`
            : `${site.url}/contact`,
          design: {
            v: 1,
            b: {
              name: values.businessName,
              industry: 'other',
              tagline: '',
              location: 'Cape Town',
            },
            s: {
              presetId: 'modern',
              primary: '#1E6FFF',
              accent: '#0B1F3A',
              fontPairId: 'modern',
            },
            p: ['home', 'contact'],
            f: ['whatsapp', 'contactForm'],
            e: [],
            k: values.packageInterest === 'not-sure' ? undefined : values.packageInterest,
          },
          createdAt: new Date().toISOString(),
          company_website: values.company_website,
        }),
      });
      if (!res.ok) throw new Error('fail');
      setStatus('ok');
      reset({ packageInterest: 'not-sure', company_website: '', designCode: designCode ?? '' });
    } catch {
      setStatus('error');
    }
  }

  return (
    <Card className="p-6 md:p-8">
      {designCode ? (
        <div className="border-navy/20 bg-bg mb-6 rounded-[var(--radius-md)] border p-4 text-sm text-gray-900">
          Your design is attached. I&apos;ll open it from the link when I reply.
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
          {...register('company_website')}
        />
        <input type="hidden" {...register('designCode')} />

        {(
          [
            ['name', 'Name', 'text'],
            ['businessName', 'Business name', 'text'],
            ['phone', 'Phone', 'tel'],
            ['email', 'Email', 'email'],
          ] as const
        ).map(([key, label, type]) => (
          <label key={key} className="block">
            <span className="text-micro text-gray-500">{label} *</span>
            <input
              type={type}
              {...register(key)}
              className={cn(
                'mt-2 h-12 w-full rounded-[var(--radius-md)] border bg-bg px-4 text-gray-900 outline-none focus:border-navy',
                errors[key] ? 'border-danger' : 'border-border',
              )}
              aria-invalid={Boolean(errors[key])}
              aria-describedby={errors[key] ? `${key}-err` : undefined}
            />
            {errors[key] ? (
              <span id={`${key}-err`} className="text-danger mt-1 block text-sm">
                {errors[key]?.message}
              </span>
            ) : null}
          </label>
        ))}

        <label className="block">
          <span className="text-micro text-gray-500">Package interest</span>
          <select
            {...register('packageInterest')}
            className="mt-2 h-12 w-full rounded-[var(--radius-md)] border border-border bg-bg px-4 text-gray-900 outline-none focus:border-navy"
          >
            <option value="not-sure">Not sure yet</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-micro text-gray-500">Message *</span>
          <textarea
            rows={5}
            {...register('message')}
            className={cn(
              'mt-2 w-full rounded-[var(--radius-md)] border bg-bg px-4 py-3 text-gray-900 outline-none focus:border-navy',
              errors.message ? 'border-danger' : 'border-border',
            )}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? 'message-err' : undefined}
          />
          {errors.message ? (
            <span id="message-err" className="text-danger mt-1 block text-sm">
              {errors.message.message}
            </span>
          ) : null}
        </label>

        <Button type="submit" loading={isSubmitting} fullWidth>
          Send message
        </Button>

        {status === 'ok' ? (
          <p role="status" className="text-success text-sm font-medium">
            Thanks! I&apos;ll get back to you within one working day.
          </p>
        ) : null}
        {status === 'error' ? (
          <div role="status" className="space-y-3">
            <p className="text-danger text-sm">
              Something went wrong. Please WhatsApp me instead.
            </p>
            <Button href={waFallback} variant="whatsapp" icon={<WhatsAppIcon />}>
              WhatsApp me
            </Button>
          </div>
        ) : null}
      </form>
    </Card>
  );
}

export function ContactDetails() {
  const waHref = whatsappLink(
    site.whatsappNumber,
    "Hi Thanda, I'd like to talk about a website for my business.",
  );

  const rows = [
    { label: 'Email', value: <a className="link-draw text-link" href={`mailto:${site.email}`}>{site.email}</a> },
    { label: 'Studio', value: site.location },
    { label: 'Hours', value: site.hours },
  ];

  return (
    <div className="space-y-10">
      <Button href={waHref} variant="whatsapp" size="lg" icon={<WhatsAppIcon />} className="w-full sm:w-auto">
        WhatsApp me
      </Button>
      <dl className="border-border border-t">
        {rows.map((r) => (
          <div
            key={r.label}
            className="border-border flex flex-col gap-1 border-b py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
          >
            <dt className="text-micro pt-1 text-gray-700">{r.label}</dt>
            <dd className="min-w-0 break-words text-gray-900 sm:text-right">{r.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-wrap gap-2">
        {site.socials
          .filter((s) => !s.placeholder)
          .map((s) => (
            <Button
              key={s.label}
              href={s.href}
              variant="outline"
              size="sm"
              icon={<SocialIcon name={s.label} className="size-4" />}
            >
              {s.label}
            </Button>
          ))}
      </div>
    </div>
  );
}
