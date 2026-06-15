import { DashboardClient } from '@/components/dashboard/DashboardClient';
import { dashboardData } from '@/lib/dashboard-data';

export default function Home() {
  return <DashboardClient initialData={dashboardData} />;
}
