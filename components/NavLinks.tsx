'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Projects', href: '/projects' },
  { label: 'Clients', href: '/clients' },
  { label: 'Notes', href: '/notes' },
  { label: 'Reminders', href: '/reminders' },
  { label: 'Follow-ups', href: '/follow-ups' },
  { label: 'Weekly', href: '/weekly' },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm transition ${
              isActive
                ? 'border-violet-500/30 bg-violet-500/20 text-violet-300'
                : 'border-transparent text-neutral-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
