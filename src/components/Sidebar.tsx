'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  Settings,
  Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/organizations', label: 'Organizations', icon: Building2 },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/pipeline', label: 'Pipeline', icon: Kanban },
  { href: '/import', label: 'Import / Export', icon: Upload },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-50">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/walkphase_logo.png" alt="WalkPhase" width={140} height={32} className="h-8 w-auto" />
        </Link>
        <p className="text-[11px] text-gray-400 mt-1.5 font-medium tracking-wide uppercase">
          Grant Outreach Intelligence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-wp-pale text-wp-deep'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon className={cn('w-[18px] h-[18px]', isActive ? 'text-wp-mid' : 'text-gray-400')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-50">
        <div className="text-[11px] text-gray-400">
          <span className="font-medium text-gray-500">WalkPhase CRM</span>
          <br />
          Pedestrian Signal Intelligence
        </div>
      </div>
    </aside>
  )
}
