// force-dynamic: user-created projects have UUID IDs, so there is no finite
// static list to pre-render. All project URLs render at request time.
export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { ProjectDetailClient } from '@/components/projects/ProjectDetailClient';

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const supabase = await createClient();
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
