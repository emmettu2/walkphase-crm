'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard, Building2, Users, Kanban, Settings, Upload,
  Zap, Award, FileText, CalendarDays,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_SECTIONS = [
  {
    title: 'Outreach',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/today', label: "Today's Outreach", icon: Zap },
      { href: '/planner', label: 'Planner', icon: CalendarDays },
      { href: '/templates', label: 'Templates', icon: FileText },
    ],
  },
  {
    title: 'Data',
    items: [
      { href: '/organizations', label: 'Organizations', icon: Building2 },
      { href: '/contacts', label: 'Contacts', icon: Users },
      { href: '/pipeline', label: 'Pipeline', icon: Kanban },
      { href: '/awardees', label: 'SS4A Awardees', icon: Award },
    ],
  },
  {
    title: 'System',
    items: [
      { href: '/import', label: 'Import / Export', icon: Upload },
      { href: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/walkphase_logo.png" alt="WalkPhase" width={140} height={32} className="h-7 w-auto" />
        </Link>
        <p className="text-[11px] text-gray-400 mt-1 font-medium tracking-wide uppercase">
          Outreach Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-4 overflow-y-auto">
        {NAV_SECTIONS.map(section => (
          <div key={section.title}>
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{section.title}</p>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const isActive = item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-wp-pale text-wp-deep'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <item.icon className={cn('w-[16px] h-[16px]', isActive ? 'text-wp-mid' : 'text-gray-400')} />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-gray-50">
        <p className="text-[10px] text-gray-400">
          <span className="font-medium text-gray-500">WalkPhase</span> &middot; Pedestrian Signal Intelligence
        </p>
      </div>
    </aside>
  )
}
