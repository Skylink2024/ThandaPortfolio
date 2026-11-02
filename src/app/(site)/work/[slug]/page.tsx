import { projects } from '@data/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function WorkSlugPageStub({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="container-brike py-24">
      <h1 className="text-h1">Case study stub</h1>
      <p className="mt-4 text-lead text-gray-500">/work/{slug}</p>
    </div>
  );
}
