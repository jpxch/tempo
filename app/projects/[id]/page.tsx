import { notFound } from 'next/navigation';

import { createServerClient } from '@/lib/supabase/server';
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient';

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = createServerClient();
  const { data: project } = await supabase
    .from('projects')
    .select('id')
    .eq('id', id)
    .maybeSingle();

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient projectId={id} />;
}

// Statically enumerate the seeded project IDs so the build does not require
// a live Supabase connection. Update this list when new projects are added.
export function generateStaticParams() {
  return [
    { id: 'artist-choreo-package' },
    { id: 'live-show-prep' },
    { id: 'workshop-series' },
  ];
}
