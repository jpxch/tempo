export type TodayItem = {
  time: string;
  title: string;
  detail: string;
  type: string;
  projectColor: string;
};

export type Project = {
  name: string;
  status: string;
  next: string;
  color: string;
};

export type DashboardData = {
  todayItems: TodayItem[];
  weekItems: string[];
  projects: Project[];
  notes: string[];
};
