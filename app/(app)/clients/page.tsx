import { fetchClients, fetchProjects } from '@/lib/supabase/queries';
import { ClientsClient } from '@/components/clients/ClientsClient';

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([fetchClients(), fetchProjects()]);
  return <ClientsClient initialClients={clients} initialProjects={projects} />;
}
