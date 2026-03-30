'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Globe, MapPin, FileText, Users, Plus, Edit2, Trash2,
  ExternalLink, Mail, Phone, Link2,
} from 'lucide-react'
import { Organization, Contact, OutreachActivity, CATEGORY_LABELS, SS4A_STAGE_LABELS, RELATIONSHIP_LABELS, CONTACT_TYPE_LABELS, ACTIVITY_TYPE_LABELS, ACTION_PLAN_TYPE_LABELS } from '@/lib/types'
import { ensureSeeded, getOrganization, getContacts, getActivities, getScoringWeights, deleteOrganization } from '@/lib/store'
import { computeScore } from '@/lib/scoring'
import { ScoreBadge } from '@/components/ScoreBadge'
import { Modal } from '@/components/Modal'
import { AddContactForm } from '@/components/AddContactForm'
import { AddOrganizationForm } from '@/components/AddOrganizationForm'
import { categoryIcon, formatDate, statusColor, relevanceLabel, cn } from '@/lib/utils'

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [org, setOrg] = useState<Organization | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [activities, setActivities] = useState<OutreachActivity[]>([])
  const [showAddContact, setShowAddContact] = useState(false)
  const [showEditOrg, setShowEditOrg] = useState(false)
  const [mounted, setMounted] = useState(false)

  const reload = () => {
    const o = getOrganization(params.id as string)
    if (o) {
      setOrg(o)
      setContacts(getContacts().filter(c => c.organization_id === o.id))
      setActivities(getActivities().filter(a => a.organization_id === o.id))
    }
  }

  useEffect(() => {
    ensureSeeded()
    reload()
    setMounted(true)
  }, [params.id])

  const weights = useMemo(() => mounted ? getScoringWeights() : undefined, [mounted])
  const allContacts = useMemo(() => mounted ? getContacts() : [], [mounted])
  const score = useMemo(() => {
    if (!org || !weights) return null
    return computeScore(org, allContacts, weights)
  }, [org, allContacts, weights])

  if (!mounted || !org) {
    return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>
  }

  const handleDelete = () => {
    if (confirm(`Delete "${org.organization_name}" and all associated contacts?`)) {
      deleteOrganization(org.id)
      router.push('/organizations')
    }
  }

  return (
    <div className="p-8 max-w-6xl animate-fade-in">
      {/* Back nav */}
      <Link href="/organizations" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Organizations
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-wp-pale flex items-center justify-center text-2xl">
            {categoryIcon(org.target_category)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{org.organization_name}</h1>
            <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{org.location_city}, {org.location_state}</span>
              <span>{CATEGORY_LABELS[org.target_category]}</span>
              {org.website && (
                <a href={org.website} target="_blank" rel="noopener" className="flex items-center gap-1 text-wp-mid hover:text-wp-deep transition-colors">
                  <Globe className="w-3.5 h-3.5" /> Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowEditOrg(true)} className="btn-secondary"><Edit2 className="w-4 h-4" /> Edit</button>
          <button onClick={handleDelete} className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* SS4A Status */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">SS4A Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Stage</p>
                <span className={`badge ${org.ss4a_stage === 'has_action_plan' || org.ss4a_stage === 'active_grantee' ? 'badge-green' : org.ss4a_stage === 'implementation_candidate' ? 'badge-purple' : 'badge-blue'}`}>
                  {SS4A_STAGE_LABELS[org.ss4a_stage]}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Action Plan</p>
                <p className="text-sm font-medium text-gray-900">
                  {org.has_action_plan === 'yes' ? `Yes — ${ACTION_PLAN_TYPE_LABELS[org.action_plan_type]}` : org.has_action_plan === 'no' ? 'No' : 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Prior SS4A Grant</p>
                <p className="text-sm font-medium text-gray-900">{org.had_prior_ss4a_grant === 'yes' ? 'Yes' : org.had_prior_ss4a_grant === 'no' ? 'No' : 'Unknown'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Region</p>
                <p className="text-sm font-medium text-gray-900">{org.region || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Pedestrian Safety</p>
                <p className="text-sm font-medium text-gray-900">{relevanceLabel(org.pedestrian_safety_relevance)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Underserved Community</p>
                <p className="text-sm font-medium text-gray-900">{relevanceLabel(org.underserved_community_relevance)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Research Strength</p>
                <p className="text-sm font-medium text-gray-900">{relevanceLabel(org.university_research_strength)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Grant Partner Fit</p>
                <p className="text-sm font-medium text-gray-900">{relevanceLabel(org.grant_partner_fit)}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {(org.notes || org.strategic_notes) && (
            <div className="card p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notes</h2>
              {org.notes && <p className="text-sm text-gray-700 mb-3">{org.notes}</p>}
              {org.strategic_notes && (
                <div className="p-3 rounded-xl bg-wp-50 border border-wp-100">
                  <p className="text-xs font-medium text-wp-deep mb-1">Strategic Notes</p>
                  <p className="text-sm text-gray-700">{org.strategic_notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Contacts */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-semibold text-gray-900">Contacts ({contacts.length})</h2>
              </div>
              <button onClick={() => setShowAddContact(true)} className="btn-ghost text-wp-mid hover:text-wp-deep">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {contacts.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <p className="text-sm text-gray-400 mb-2">No contacts for this organization</p>
                <button onClick={() => setShowAddContact(true)} className="text-sm text-wp-mid font-medium hover:text-wp-deep">
                  + Add contact
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {contacts.map(c => (
                  <div key={c.id} className="px-6 py-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{c.full_name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.title}</p>
                        <div className="flex items-center gap-3 mt-2">
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-wp-mid transition-colors">
                              <Mail className="w-3 h-3" /> {c.email}
                            </a>
                          )}
                          {c.phone && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <Phone className="w-3 h-3" /> {c.phone}
                            </span>
                          )}
                          {c.linkedin_url && (
                            <a href={c.linkedin_url} target="_blank" rel="noopener" className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-600 transition-colors">
                              <Link2 className="w-3 h-3" /> LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${statusColor(c.relationship_status)}`}>
                          {RELATIONSHIP_LABELS[c.relationship_status]}
                        </span>
                        <span className="badge badge-gray">{c.seniority}</span>
                      </div>
                    </div>
                    {c.notes && <p className="text-xs text-gray-400 mt-2">{c.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Activity History */}
          <div className="card p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h2 className="text-sm font-semibold text-gray-900">Outreach History</h2>
            </div>
            {activities.length === 0 ? (
              <div className="px-6 py-8 text-center text-sm text-gray-400">No outreach activity recorded</div>
            ) : (
              <div className="divide-y divide-gray-50">
                {activities.sort((a, b) => new Date(b.activity_date).getTime() - new Date(a.activity_date).getTime()).map(a => (
                  <div key={a.id} className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge badge-gray text-[10px]">{ACTIVITY_TYPE_LABELS[a.activity_type]}</span>
                      <span className="text-xs text-gray-400">{formatDate(a.activity_date)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{a.summary}</p>
                    {a.outcome && <p className="text-xs text-gray-500 mt-1"><span className="font-medium">Outcome:</span> {a.outcome}</p>}
                    {a.next_step && <p className="text-xs text-wp-mid mt-0.5"><span className="font-medium">Next:</span> {a.next_step}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar — Score */}
        <div className="space-y-6">
          {score && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Target Score</h2>
                <ScoreBadge score={score.total} size="lg" />
              </div>
              <p className="text-sm text-gray-600 mb-4">{score.explanation}</p>
              <div className="space-y-3">
                {score.factors.map((f, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-medium text-gray-600">{f.label}</p>
                      <p className="text-xs text-gray-400 tabular-nums">{f.score}/{f.maxScore}</p>
                    </div>
                    <div className="score-bar">
                      <div
                        className={cn('score-fill', f.score / f.maxScore >= 0.7 ? 'bg-wp-light' : f.score / f.maxScore >= 0.4 ? 'bg-amber-400' : 'bg-gray-300')}
                        style={{ width: `${(f.score / f.maxScore) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">{f.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meta */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Source</span>
                <span className="text-gray-700">{org.source || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Added</span>
                <span className="text-gray-700">{formatDate(org.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Updated</span>
                <span className="text-gray-700">{formatDate(org.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal open={showAddContact} onClose={() => setShowAddContact(false)} title="Add Contact" wide>
        <AddContactForm
          onSave={() => { setShowAddContact(false); reload() }}
          onCancel={() => setShowAddContact(false)}
          preselectedOrgId={org.id}
        />
      </Modal>

      <Modal open={showEditOrg} onClose={() => setShowEditOrg(false)} title="Edit Organization" wide>
        <AddOrganizationForm
          onSave={() => { setShowEditOrg(false); reload() }}
          onCancel={() => setShowEditOrg(false)}
          initialData={org}
        />
      </Modal>
    </div>
  )
}
