'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Building2, Users, Target, Zap, ArrowRight, TrendingUp,
  CalendarDays, Award, FileText, CheckCircle,
} from 'lucide-react'
import { Organization, Contact, OutreachActivity, PlaybookTask, OutreachWave, CATEGORY_LABELS } from '@/lib/types'
import { ensureSeeded, getOrganizations, getContacts, getActivities, getScoringWeights, getPlaybookTasks, getWaves } from '@/lib/store'
import { computeScore } from '@/lib/scoring'
import { getOrgRecommendations } from '@/lib/recommendations'
import { ScoreBar } from '@/components/ScoreBadge'
import { categoryIcon, formatDateShort, relativeDate, cn } from '@/lib/utils'

function StatCard({ icon: Icon, label, value, color, href }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: number | string; color: string; href?: string
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
  const [playbookTasks, setPlaybookTasks] = useState<PlaybookTask[]>([])
  const [waves, setWaves] = useState<OutreachWave[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    ensureSeeded()
    setOrgs(getOrganizations())
    setContacts(getContacts())
    setActivities(getActivities())
    setPlaybookTasks(getPlaybookTasks())
    setWaves(getWaves())
    setMounted(true)
  }, [])

  const weights = useMemo(() => mounted ? getScoringWeights() : undefined, [mounted])

  const scoredOrgs = useMemo(() => {
    if (!weights) return []
    return orgs.map(o => ({ org: o, score: computeScore(o, contacts, weights) })).sort((a, b) => b.score.total - a.score.total)
  }, [orgs, contacts, weights])

  const recommendations = useMemo(() => {
    if (!mounted) return []
    return getOrgRecommendations(orgs)
  }, [orgs, mounted])

  const today = new Date().toISOString().split('T')[0]
  const todayTasks = playbookTasks.filter(t => t.day_date === today)
  const todayCompleted = todayTasks.filter(t => t.status === 'completed').length
  const totalPlaybookCompleted = playbookTasks.filter(t => t.status === 'completed').length
  const activeWave = waves.find(w => w.status === 'active')
  const highPriority = scoredOrgs.filter(s => s.score.total >= 70).length

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">WalkPhase outreach intelligence overview</p>
      </div>

      {/* Today's Focus Banner */}
      {todayTasks.length > 0 && (
        <Link href="/today" className="block card p-5 mb-6 bg-gradient-to-r from-wp-50 to-white border-wp-100 hover:shadow-card-hover transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-wp-pale flex items-center justify-center">
                <Zap className="w-6 h-6 text-wp-deep" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Today&apos;s Outreach</h2>
                <p className="text-sm text-gray-500">{todayCompleted} of {todayTasks.length} tasks completed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-32 h-2 rounded-full bg-white overflow-hidden">
                <div className="h-full rounded-full bg-wp-light transition-all" style={{ width: `${todayTasks.length > 0 ? (todayCompleted / todayTasks.length) * 100 : 0}%` }} />
              </div>
              <ArrowRight className="w-5 h-5 text-wp-mid" />
            </div>
          </div>
        </Link>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Target Organizations" value={orgs.length} color="bg-wp-pale text-wp-deep" href="/organizations" />
        <StatCard icon={Users} label="Contacts" value={contacts.length} color="bg-blue-50 text-blue-600" href="/contacts" />
        <StatCard icon={Target} label="High Priority" value={highPriority} color="bg-purple-50 text-purple-600" href="/organizations" />
        <StatCard icon={CheckCircle} label="Tasks Completed" value={totalPlaybookCompleted} color="bg-green-50 text-green-600" href="/planner" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Targets */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Top Targets by Score</h2>
            <Link href="/organizations" className="text-xs text-wp-mid font-medium hover:text-wp-deep">View all &rarr;</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {scoredOrgs.slice(0, 10).map(({ org, score }, i) => (
              <Link key={org.id} href={`/organizations/${org.id}`} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50/50 transition-colors">
                <span className="text-xs font-bold text-gray-300 w-5 text-right tabular-nums">{i + 1}</span>
                <span className="text-lg">{categoryIcon(org.target_category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{org.organization_name}</p>
                  <p className="text-xs text-gray-400">{org.location_city}{org.location_state ? `, ${org.location_state}` : ''} &middot; {CATEGORY_LABELS[org.target_category]}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-[11px] ${org.has_action_plan === 'yes' ? 'badge-green' : 'badge-gray'}`}>
                    {org.has_action_plan === 'yes' ? 'Action Plan' : 'No Plan'}
                  </span>
                  <ScoreBar score={score.total} />
                </div>
              </Link>
            ))}
            {scoredOrgs.length === 0 && (
              <div className="px-6 py-8 text-center text-sm text-gray-400">No organizations yet — add your first target</div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Active Wave */}
          {activeWave && (
            <div className="card p-5 border-wp-100 bg-wp-50/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2.5 h-2.5 rounded-full bg-wp-light" />
                <h3 className="text-sm font-semibold text-gray-900">{activeWave.name}</h3>
              </div>
              <p className="text-xs text-gray-500 mb-2">{activeWave.objective}</p>
              <p className="text-xs text-gray-400 italic">{activeWave.messaging_angle}</p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/today" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <Zap className="w-4 h-4 text-wp-mid" />
                <span className="text-sm text-gray-700">Today&apos;s outreach plan</span>
              </Link>
              <Link href="/planner" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <CalendarDays className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Weekly planner</span>
              </Link>
              <Link href="/awardees" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <Award className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-gray-700">Browse SS4A awardees</span>
              </Link>
              <Link href="/templates" className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <FileText className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-700">Email templates</span>
              </Link>
            </div>
          </div>

          {/* Recommended Next */}
          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-50 flex items-center gap-2">
              <Target className="w-4 h-4 text-wp-light" />
              <h3 className="text-sm font-semibold text-gray-900">Recommended Next</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recommendations.filter(r => r.tier === 'recommended_next').slice(0, 5).map(rec => (
                <Link key={rec.org.id} href={`/organizations/${rec.org.id}`} className="block px-5 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-medium text-gray-900 truncate">{rec.org.organization_name}</p>
                    <span className="text-xs font-bold text-wp-deep tabular-nums">{rec.score.total}</span>
                  </div>
                  <p className="text-xs text-gray-400">{rec.talking_points[0]}</p>
                </Link>
              ))}
              {recommendations.filter(r => r.tier === 'recommended_next').length === 0 && (
                <div className="px-5 py-6 text-center text-xs text-gray-400">Add contacts to see recommendations</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
