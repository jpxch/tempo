export type TodayItem = {
  time: string;
  title: string;
  detail: string;
  type: string;
  projectId: string;
};

export type WeekItem = {
  title: string;
  dueLabel: string;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  status: string;
  next: string;
  color: string;
};

export type DashboardData = {
  todayItems: TodayItem[];
  weekItems: WeekItem[];
  projects: Project[];
  notes: string[];
};
