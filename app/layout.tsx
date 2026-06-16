import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { TempoProvider } from "@/components/TempoProvider";
import { fetchProjects, fetchReminders, fetchNotes } from "@/lib/supabase/queries";
import { mockWeekItems, mockFollowUps } from "@/lib/dashboard-data";
import type { DashboardData } from "@/types/dashboard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tempo",
  description: "Tempo is a personal operations assistant for creative freelancers.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [projects, todayItems, notes] = await Promise.all([
    fetchProjects(),
    fetchReminders(),
    fetchNotes(),
  ]);

  const initialData: DashboardData = {
    projects,
    todayItems,
    notes,
    weekItems: mockWeekItems,
    followUps: mockFollowUps,
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TempoProvider initialData={initialData}>
          <AppShell>{children}</AppShell>
        </TempoProvider>
      </body>
    </html>
  );
}
