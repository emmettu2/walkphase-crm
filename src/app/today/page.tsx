'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { CheckCircle, Circle, Clock, Mail, MessageSquare, Zap, ChevronRight, ChevronDown, FileText, Target, Copy, Eye, Plus } from 'lucide-react'
import { v4 as uuid } from 'uuid'
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
  const [expandedTemplate, setExpandedTemplate] = useState<string | null>(null)
  const [showAddTask, setShowAddTask] = useState(false)
  const [newOrgId, setNewOrgId] = useState('')
  const [newAction, setNewAction] = useState('')
  const [newNotes, setNewNotes] = useState('')
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

  // Generate a draft email based on org data and best-matching template
  const generateDraftEmail = (org: Organization): { subject: string; body: string; templateName: string } => {
    // Pick the right template based on org category
    let tmpl = templates.find(t => t.category === 'university_initial')
    if (org.target_category === 'city' || org.target_category === 'county') tmpl = templates.find(t => t.category === 'city_initial') || tmpl
    else if (org.target_category === 'mpo') tmpl = templates.find(t => t.category === 'mpo_initial') || tmpl
    if (!tmpl) return { subject: '', body: '', templateName: '' }

    // Build target_reason from what we know
    let targetReason = 'pedestrian safety research'
    if (org.target_category === 'university' || org.target_category === 'research_center') {
      if (org.organization_type_detail) targetReason = org.organization_type_detail.toLowerCase()
      else targetReason = 'transportation and pedestrian safety research'
    } else if (org.has_action_plan === 'yes') {
      targetReason = ', particularly given your existing SS4A Action Plan'
    } else {
      targetReason = ' and your pedestrian safety initiatives'
    }

    const vars: Record<string, string> = {
      first_name: '[First Name]',
      organization_name: org.organization_name,
      city: org.location_city || '[City]',
      target_reason: targetReason,
      original_subject: 'Pedestrian signal timing research',
    }

    let subject = tmpl.subject
    let body = tmpl.body
    for (const [key, val] of Object.entries(vars)) {
      subject = subject.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
      body = body.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
    }

    return { subject, body, templateName: tmpl.name }
  }

  const [draftEmail, setDraftEmail] = useState<{ subject: string; body: string; templateName: string } | null>(null)

  // When org changes in modal, auto-generate draft
  const handleOrgChange = (orgId: string) => {
    setNewOrgId(orgId)
    if (orgId) {
      const org = orgs.find(o => o.id === orgId)
      if (org) {
        const draft = generateDraftEmail(org)
        setDraftEmail(draft)
        if (!newAction) setNewAction(`Research ${org.organization_name} team, identify key contacts, and send initial outreach email.`)
      }
    } else {
      setDraftEmail(null)
    }
  }

  const addTaskToday = (orgId?: string, action?: string) => {
    const targetOrgId = orgId || newOrgId
    const targetAction = action || newAction
    if (!targetOrgId || !targetAction) return
    const dayTasks = getPlaybookTasksForDate(selectedDate)
    const task: PlaybookTask = {
      id: uuid(), day_date: selectedDate, organization_id: targetOrgId,
      status: 'pending', priority: dayTasks.length + 1,
      suggested_action: targetAction, notes: orgId ? '' : newNotes,
    }
    // Find matching template to attach
    const org = orgs.find(o => o.id === targetOrgId)
    if (org) {
      let tmplId = 'tmpl-uni-initial'
      if (org.target_category === 'city' || org.target_category === 'county') tmplId = 'tmpl-city-initial'
      else if (org.target_category === 'mpo') tmplId = 'tmpl-mpo-initial'
      task.template_id = tmplId
    }
    savePlaybookTask(task)
    setShowAddTask(false)
    setNewOrgId(''); setNewAction(''); setNewNotes(''); setDraftEmail(null)
    reload()
  }

  const quickAddOrg = (orgId: string, orgName: string) => {
    addTaskToday(orgId, `Research ${orgName} team, identify key contacts, and prepare personalized outreach.`)
  }

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
          <button onClick={() => setShowAddTask(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Task</button>
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

                    {/* Template preview */}
                    {template && (() => {
                      const isExpanded = expandedTemplate === task.id
                      // Merge variables with org data
                      const vars: Record<string, string> = {
                        first_name: contact?.first_name || '[First Name]',
                        organization_name: org?.organization_name || '[Organization]',
                        city: org?.location_city || '[City]',
                        target_reason: org?.strategic_notes?.split('.')[0] || 'pedestrian safety research',
                        original_subject: 'Pedestrian signal timing research',
                      }
                      let previewBody = template.body
                      let previewSubject = template.subject
                      for (const [key, val] of Object.entries(vars)) {
                        previewBody = previewBody.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
                        previewSubject = previewSubject.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
                      }
                      return (
                        <div className="mb-2">
                          <button
                            onClick={() => setExpandedTemplate(isExpanded ? null : task.id)}
                            className="flex items-center gap-1.5 text-xs text-wp-mid font-medium hover:text-wp-deep transition-colors"
                          >
                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <FileText className="w-3 h-3" />
                            {isExpanded ? 'Hide template' : `View template: ${template.name}`}
                          </button>
                          {isExpanded && (
                            <div className="mt-2 bg-gray-50 rounded-xl p-4 border border-gray-100 animate-slide-up">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Subject</p>
                                  <p className="text-sm font-medium text-gray-900">{previewSubject}</p>
                                </div>
                                <button
                                  onClick={() => navigator.clipboard.writeText(`Subject: ${previewSubject}\n\n${previewBody}`)}
                                  className="btn-ghost text-gray-400 hover:text-wp-mid p-1.5"
                                  title="Copy to clipboard"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="border-t border-gray-200 pt-2">
                                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{previewBody}</pre>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })()}

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
              <div key={rec.org.id} className="card p-4 flex items-center gap-4">
                <Link href={`/organizations/${rec.org.id}`} className="flex items-center gap-4 flex-1 min-w-0 hover:opacity-80 transition-opacity">
                  <span className="text-lg">{categoryIcon(rec.org.target_category)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{rec.org.organization_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rec.talking_points[0]}</p>
                  </div>
                  <div className={cn('text-xs font-bold px-2 py-1 rounded-full tabular-nums',
                    rec.score.total >= 70 ? 'bg-wp-pale text-wp-deep' : 'bg-amber-50 text-amber-700')}>
                    {rec.score.total}
                  </div>
                </Link>
                <button
                  onClick={() => quickAddOrg(rec.org.id, rec.org.organization_name)}
                  className="btn-ghost text-wp-mid hover:text-wp-deep flex-shrink-0"
                  title="Add to today's outreach"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal open={showAddTask} onClose={() => { setShowAddTask(false); setDraftEmail(null); setNewOrgId(''); setNewAction(''); setNewNotes('') }} title={`Add Task — ${isToday ? 'Today' : formatDay(selectedDate)}`} wide>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <select className="select" value={newOrgId} onChange={e => handleOrgChange(e.target.value)}>
              <option value="">Select organization...</option>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.organization_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <textarea className="input min-h-[60px]" value={newAction} onChange={e => setNewAction(e.target.value)}
              placeholder="e.g. Research team and send initial outreach email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input className="input" value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Any additional notes..." />
          </div>

          {/* Draft Email Preview */}
          {draftEmail && draftEmail.body && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Draft Email <span className="text-xs text-gray-400 font-normal ml-1">({draftEmail.templateName})</span>
                </label>
                <button
                  onClick={() => navigator.clipboard.writeText(`Subject: ${draftEmail.subject}\n\n${draftEmail.body}`)}
                  className="btn-ghost text-xs text-gray-400 hover:text-wp-mid p-1"
                >
                  <Copy className="w-3.5 h-3.5 mr-1 inline" /> Copy
                </button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="mb-2">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide">Subject</p>
                  <p className="text-sm font-medium text-gray-900">{draftEmail.subject}</p>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed max-h-[250px] overflow-y-auto">{draftEmail.body}</pre>
                </div>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">
                Replace [First Name] with the contact&apos;s name before sending. Edit the template in Templates to customize further.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button onClick={() => { setShowAddTask(false); setDraftEmail(null); setNewOrgId(''); setNewAction(''); setNewNotes('') }} className="btn-secondary">Cancel</button>
            <button onClick={() => addTaskToday()} className="btn-primary" disabled={!newOrgId || !newAction}>Add Task</button>
          </div>
        </div>
      </Modal>

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
