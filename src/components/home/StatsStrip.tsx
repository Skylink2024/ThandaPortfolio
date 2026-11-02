import { Counter } from '@/components/ui/Counter';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

// No fake client counts — only facts that are true today.
const stats = [
  { to: 4, suffix: '+', label: 'years building websites' },
  { to: 0, prefix: 'R', label: 'deposit to start' },
  // TODO(Thanda): confirm
  { to: 7, suffix: ' days', label: 'typical delivery for a Business site' },
  { to: 15000, prefix: 'Max R', thousands: true, label: 'once-off. Most sites cost far less.' },
];

export function StatsStrip() {
  return (
    <Section id="stats" tone="surface" className="!py-12 md:!py-16">
      <Reveal>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label} className="text-center">
              <p className="font-heading text-3xl font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
                <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} thousands={s.thousands} />
              </p>
              <p className="text-small mx-auto mt-2 max-w-[16rem] text-gray-500">{s.label}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
