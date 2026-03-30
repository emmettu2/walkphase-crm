'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, Circle, Clock, Mail, MessageSquare, Zap, ChevronRight, FileText, Target } from 'lucide-react'
import { PlaybookTask, Organization, Contact, EmailTemplate, OutreachWave, RELATIONSHIP_LABELS } from '@/lib/types'
import { ensureSeeded, getPlaybookTasksForDate, getOrganizations, getContacts, getTemplates, getWaves, savePlaybookTask, getPlaybookTasks, savePlaybookTasks } from '@/lib/store'
import { getOrgRecommendations } from '@/lib/recommendations'
import { Modal } from '@/components/Modal'
import { AddContactForm } from '@/components/AddContactForm'
import { categoryIcon, cn } from '@/lib/utils'

function formatDay(date: string) {
  return new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function TodayPage() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<PlaybookTask[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [waves, setWaves] = useState<OutreachWave[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [addContactOrgId, setAddContactOrgId] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0])

  const reload = () => {
    setTasks(getPlaybookTasksForDate(selectedDate))
    setOrgs(getOrganizations())
    setContacts(getContacts())
    setTemplates(getTemplates())
    setWaves(getWaves())
  }

  useEffect(() => { ensureSeeded(); reload(); setMounted(true) }, [])
  useEffect(() => { if (mounted) reload() }, [selectedDate])

  const orgMap = useMemo(() => new Map(orgs.map(o => [o.id, o])), [orgs])
  const contactMap = useMemo(() => new Map(contacts.map(c => [c.id, c])), [contacts])
  const templateMap = useMemo(() => new Map(templates.map(t => [t.id, t])), [templates])
  const waveMap = useMemo(() => new Map(waves.map(w => [w.id, w])), [waves])

  const recommendations = useMemo(() => {
    if (!mounted) return []
    return getOrgRecommendations(orgs)
  }, [orgs, mounted])

  const completedCount = tasks.filter(t => t.status === 'completed').length
  const totalCount = tasks.length

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'
    savePlaybookTask({ ...task, status: newStatus })
    reload()
  }

  const moveToTomorrow = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    const tomorrow = new Date(selectedDate + 'T12:00:00')
    tomorrow.setDate(tomorrow.getDate() + 1)
    savePlaybookTask({ ...task, day_date: tomorrow.toISOString().split('T')[0], status: 'moved' })
    reload()
  }

  // Date navigation
  const goDay = (offset: number) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + offset)
    setSelectedDate(d.toISOString().split('T')[0])
  }

  const isToday = selectedDate === new Date().toISOString().split('T')[0]

  // Find recommended next orgs not yet on any playbook day
  const allTasks = useMemo(() => mounted ? getPlaybookTasks() : [], [mounted, tasks])
  const plannedOrgIds = new Set(allTasks.map(t => t.organization_id))
  const unplannedRecs = recommendations.filter(r => r.tier === 'recommended_next' && !plannedOrgIds.has(r.org.id)).slice(0, 3)

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-5xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isToday ? "Today's Outreach" : formatDay(selectedDate)}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {isToday ? 'Your daily outreach action plan' : formatDay(selectedDate)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => goDay(-1)} className="btn-ghost">&larr; Prev</button>
          {!isToday && <button onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])} className="btn-secondary text-xs">Today</button>}
          <button onClick={() => goDay(1)} className="btn-ghost">Next &rarr;</button>
        </div>
      </div>

      {/* Progress */}
      {totalCount > 0 && (
        <div className="card p-4 mb-6 flex items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-gray-700">{completedCount} of {totalCount} tasks completed</span>
              <span className="text-sm font-bold text-wp-deep tabular-nums">{Math.round((completedCount / totalCount) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-wp-light transition-all duration-500" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No tasks planned for this day</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Use the Planner to schedule outreach tasks, or check the recommendations below.
          </p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {tasks.map(task => {
            const org = orgMap.get(task.organization_id)
            const contact = task.contact_id ? contactMap.get(task.contact_id) : undefined
            const template = task.template_id ? templateMap.get(task.template_id) : undefined
            const wave = task.wave_id ? waveMap.get(task.wave_id) : undefined
            const orgContacts = contacts.filter(c => c.organization_id === task.organization_id)
            const isDone = task.status === 'completed'

            return (
              <div key={task.id} className={cn('card p-5 transition-all duration-200', isDone && 'opacity-60')}>
                <div className="flex items-start gap-4">
                  <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
                    {isDone
                      ? <CheckCircle className="w-5 h-5 text-wp-light" />
                      : <Circle className="w-5 h-5 text-gray-300 hover:text-wp-light transition-colors" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-400 tabular-nums">#{task.priority}</span>
                      {org && (
                        <Link href={`/organizations/${org.id}`} className="flex items-center gap-1.5 text-sm font-medium text-gray-900 hover:text-wp-deep transition-colors">
                          <span>{categoryIcon(org.target_category)}</span>
                          {org.organization_name}
                        </Link>
                      )}
                      {wave && <span className="badge badge-blue text-[10px]">{wave.name.split('—')[0].trim()}</span>}
                    </div>
                    <p className={cn('text-sm text-gray-700 mb-2', isDone && 'line-through')}>{task.suggested_action}</p>

                    {/* Contact info */}
                    {contact && (
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-400">Contact:</span>
                        <span className="text-xs font-medium text-gray-700">{contact.full_name}</span>
                        <span className="badge badge-gray text-[10px]">{contact.title}</span>
                      </div>
                    )}

                    {/* No contacts warning */}
                    {orgContacts.length === 0 && (
                      <button
                        onClick={() => { setAddContactOrgId(task.organization_id); setShowAddContact(true) }}
                        className="text-xs text-wp-mid font-medium hover:text-wp-deep transition-colors mb-2 block"
                      >
                        + Add a contact for this organization
                      </button>
                    )}

                    {/* Template link */}
                    {template && (
                      <Link href="/templates" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-wp-mid transition-colors mb-2">
                        <FileText className="w-3 h-3" />
                        Template: {template.name}
                      </Link>
                    )}

                    {task.notes && <p className="text-xs text-gray-400 italic">{task.notes}</p>}

                    {/* Actions */}
                    {!isDone && (
                      <div className="flex items-center gap-2 mt-3">
                        <button onClick={() => toggleTask(task.id)} className="text-xs text-wp-mid font-medium hover:text-wp-deep">Mark complete</button>
                        <span className="text-gray-200">|</span>
                        <button onClick={() => moveToTomorrow(task.id)} className="text-xs text-gray-400 font-medium hover:text-gray-600">Move to tomorrow</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Recommendations */}
      {unplannedRecs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-wp-mid" /> Recommended Next
          </h2>
          <div className="space-y-2">
            {unplannedRecs.map(rec => (
              <Link key={rec.org.id} href={`/organizations/${rec.org.id}`}
                className="card p-4 flex items-center gap-4 hover:shadow-card-hover transition-all">
                <span className="text-lg">{categoryIcon(rec.org.target_category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{rec.org.organization_name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{rec.talking_points[0]}</p>
                </div>
                <div className={cn('text-xs font-bold px-2 py-1 rounded-full tabular-nums',
                  rec.score.total >= 70 ? 'bg-wp-pale text-wp-deep' : 'bg-amber-50 text-amber-700')}>
                  {rec.score.total}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <Modal open={showAddContact} onClose={() => setShowAddContact(false)} title="Add Contact" wide>
        <AddContactForm
          onSave={() => { setShowAddContact(false); reload() }}
          onCancel={() => setShowAddContact(false)}
          preselectedOrgId={addContactOrgId}
        />
      </Modal>
    </div>
  )
}
