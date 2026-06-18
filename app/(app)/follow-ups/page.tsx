import { fetchFollowUps, fetchProjects } from '@/lib/supabase/queries';
import { FollowUpsClient } from '@/components/follow-ups/FollowUpsClient';

export default async function FollowUpsPage() {
  const [followUps, projects] = await Promise.all([fetchFollowUps(), fetchProjects()]);
  return <FollowUpsClient initialFollowUps={followUps} initialProjects={projects} />;
}
