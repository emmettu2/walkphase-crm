'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2, Users, Target, Search, Mail, Clock, ArrowRight, TrendingUp,
  CalendarClock, MessageSquare, Zap,
} from 'lucide-react'
import { Organization, Contact, OutreachActivity, CATEGORY_LABELS, SS4A_STAGE_LABELS, RELATIONSHIP_LABELS, ACTIVITY_TYPE_LABELS } from '@/lib/types'
import { ensureSeeded, getOrganizations, getContacts, getActivities, getScoringWeights } from '@/lib/store'
import { computeScore } from '@/lib/scoring'
import { ScoreBar } from '@/components/ScoreBadge'
import { categoryIcon, formatDateShort, relativeDate, daysUntil, statusColor } from '@/lib/utils'

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  color: string
  href?: string
}) {
  const inner = (
    <div className="card px-5 py-4 flex items-center gap-4 group cursor-pointer">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
      {href && <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />}
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

export default function DashboardPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activities, setActivities] = useState<OutreachActivity[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ensureSeeded()
    setOrgs(getOrganizations())
    setContacts(getContacts())
    setActivities(getActivities())
    setMounted(true)
  }, [])

  const weights = useMemo(() => mounted ? getScoringWeights() : undefined, [mounted])

  const scoredOrgs = useMemo(() => {
    if (!weights) return []
    return orgs.map(o => ({
      org: o,
      score: computeScore(o, contacts, weights),
    })).sort((a, b) => b.score.total - a.score.total)
  }, [orgs, contacts, weights])

  const highPriority = scoredOrgs.filter(s => s.score.total >= 70).length
  const needsResearch = contacts.filter(c => c.relationship_status === 'not_contacted').length

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const contactedThisWeek = activities.filter(a => new Date(a.activity_date) >= weekAgo).length
  const awaitingReply = contacts.filter(c => c.relationship_status === 'emailed').length

  const upcomingActions = contacts
    .filter(c => c.next_action_date && daysUntil(c.next_action_date) >= 0 && daysUntil(c.next_action_date) <= 14)
    .sort((a, b) => new Date(a.next_action_date).getTime() - new Date(b.next_action_date).getTime())
    .slice(0, 5)

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime())
    .slice(0, 5)

  const bestNextActions = scoredOrgs
    .filter(s => {
      const orgContacts = contacts.filter(c => c.organization_id === s.org.id)
      return orgContacts.some(c => c.relationship_status !== 'deprioritized' && c.relationship_status !== 'meeting_booked')
    })
    .slice(0, 5)

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">WalkPhase grant outreach overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Organizations" value={orgs.length} color="bg-wp-pale text-wp-deep" href="/organizations" />
        <StatCard icon={Users} label="Contacts" value={contacts.length} color="bg-blue-50 text-blue-600" href="/contacts" />
        <StatCard icon={Target} label="High Priority" value={highPriority} color="bg-purple-50 text-purple-600" href="/organizations" />
        <StatCard icon={Search} label="Needs Research" value={needsResearch} color="bg-amber-50 text-amber-600" href="/contacts" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Mail} label="Contacted This Week" value={contactedThisWeek} color="bg-green-50 text-green-600" />
        <StatCard icon={MessageSquare} label="Awaiting Reply" value={awaitingReply} color="bg-orange-50 text-orange-600" />
        <StatCard icon={CalendarClock} label="Upcoming Actions" value={upcomingActions.length} color="bg-indigo-50 text-indigo-600" />
        <StatCard icon={TrendingUp} label="Avg Score" value={scoredOrgs.length ? Math.round(scoredOrgs.reduce((a, s) => a + s.score.total, 0) / scoredOrgs.length) : 0} color="bg-teal-50 text-teal-600" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top 10 Targets */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Top 10 Targets</h2>
            <Link href="/organizations" className="text-xs text-wp-mid font-medium hover:text-wp-deep transition-colors">
              View all &rarr;
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {scoredOrgs.slice(0, 10).map(({ org, score }, i) => (
              <Link
                key={org.id}
                href={`/organizations/${org.id}`}
                className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors"
              >
                <span className="text-xs font-bold text-gray-300 w-5 text-right tabular-nums">{i + 1}</span>
                <span className="text-lg">{categoryIcon(org.target_category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{org.organization_name}</p>
                  <p className="text-xs text-gray-400">{org.location_city}, {org.location_state} &middot; {CATEGORY_LABELS[org.target_category]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-[11px] ${org.has_action_plan === 'yes' ? 'badge-green' : 'badge-gray'}`}>
                    {org.has_action_plan === 'yes' ? 'Action Plan' : 'No Plan'}
                  </span>
                  <ScoreBar score={score.total} />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Best Next Actions */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
              <Zap className="w-4 h-4 text-wp-light" />
              <h3 className="text-sm font-semibold text-gray-900">Best Next Actions</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {bestNextActions.map(({ org, score }) => {
                const orgContacts = contacts.filter(c => c.organization_id === org.id)
                const bestContact = orgContacts.sort((a, b) =>
                  (a.seniority === 'high' ? 0 : 1) - (b.seniority === 'high' ? 0 : 1)
                )[0]
                return (
                  <Link key={org.id} href={`/organizations/${org.id}`} className="block px-5 py-3 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{org.organization_name}</p>
                      <span className="text-xs font-bold text-wp-deep tabular-nums">{score.total}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {bestContact
                        ? `Contact ${bestContact.full_name} — ${RELATIONSHIP_LABELS[bestContact.relationship_status]}`
                        : 'Identify contacts'
                      }
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Upcoming Actions */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
              <CalendarClock className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-900">Upcoming Actions</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingActions.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-gray-400">No upcoming actions</div>
              ) : upcomingActions.map(c => {
                const org = orgs.find(o => o.id === c.organization_id)
                const days = daysUntil(c.next_action_date)
                return (
                  <div key={c.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-medium text-gray-900">{c.full_name}</p>
                      <span className={`text-xs font-medium tabular-nums ${days <= 1 ? 'text-red-500' : days <= 3 ? 'text-amber-500' : 'text-gray-400'}`}>
                        {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days}d`}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{org?.organization_name} &middot; {formatDateShort(c.next_action_date)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentActivities.map(a => {
                const org = orgs.find(o => o.id === a.organization_id)
                return (
                  <div key={a.id} className="px-5 py-3">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="badge badge-gray text-[10px]">{ACTIVITY_TYPE_LABELS[a.activity_type]}</span>
                      <span className="text-xs text-gray-400">{relativeDate(a.activity_date)}</span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-1">{a.summary}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{org?.organization_name}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
