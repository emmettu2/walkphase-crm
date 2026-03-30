'use client'

import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Organization, TargetCategory, SS4AStage, YesNoUnknown, ActionPlanType, Relevance, RelevanceNoUnknown, Strength, CATEGORY_LABELS, SS4A_STAGE_LABELS, ACTION_PLAN_TYPE_LABELS } from '@/lib/types'
import { saveOrganization } from '@/lib/store'

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

interface Props {
  onSave: () => void
  onCancel: () => void
  initialData?: Partial<Organization>
}

export function AddOrganizationForm({ onSave, onCancel, initialData }: Props) {
  const [form, setForm] = useState<Partial<Organization>>({
    organization_name: '',
    target_category: 'city',
    organization_type_detail: '',
    website: '',
    location_city: '',
    location_state: '',
    region: '',
    notes: '',
    had_prior_ss4a_grant: 'unknown',
    has_action_plan: 'unknown',
    action_plan_type: 'unknown',
    ss4a_stage: 'unknown',
    underserved_community_relevance: 'unknown',
    pedestrian_safety_relevance: 'medium',
    university_research_strength: 'not_applicable',
    grant_partner_fit: 'medium',
    strategic_notes: '',
    source: '',
    ...initialData,
  })

  const update = (key: keyof Organization, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.organization_name) return

    const org: Organization = {
      id: initialData?.id || uuid(),
      organization_name: form.organization_name || '',
      target_category: form.target_category as TargetCategory || 'other',
      organization_type_detail: form.organization_type_detail || '',
      website: form.website || '',
      location_city: form.location_city || '',
      location_state: form.location_state || '',
      region: form.region || '',
      notes: form.notes || '',
      had_prior_ss4a_grant: form.had_prior_ss4a_grant as YesNoUnknown || 'unknown',
      has_action_plan: form.has_action_plan as YesNoUnknown || 'unknown',
      action_plan_type: form.action_plan_type as ActionPlanType || 'unknown',
      ss4a_stage: form.ss4a_stage as SS4AStage || 'unknown',
      underserved_community_relevance: form.underserved_community_relevance as Relevance || 'unknown',
      pedestrian_safety_relevance: form.pedestrian_safety_relevance as RelevanceNoUnknown || 'medium',
      university_research_strength: form.university_research_strength as Strength || 'not_applicable',
      grant_partner_fit: form.grant_partner_fit as RelevanceNoUnknown || 'medium',
      strategic_notes: form.strategic_notes || '',
      source: form.source || '',
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveOrganization(org)
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
            <input className="input" value={form.organization_name} onChange={e => update('organization_name', e.target.value)} required placeholder="e.g. City of Portland" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="select" value={form.target_category} onChange={e => update('target_category', e.target.value)}>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type Detail</label>
            <input className="input" value={form.organization_type_detail} onChange={e => update('organization_type_detail', e.target.value)} placeholder="e.g. Transportation Dept" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input className="input" value={form.location_city} onChange={e => update('location_city', e.target.value)} placeholder="Portland" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select className="select" value={form.location_state} onChange={e => update('location_state', e.target.value)}>
              <option value="">Select...</option>
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
            <input className="input" value={form.region} onChange={e => update('region', e.target.value)} placeholder="e.g. Pacific Northwest" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input className="input" value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </div>

      {/* SS4A Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">SS4A Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SS4A Stage</label>
            <select className="select" value={form.ss4a_stage} onChange={e => update('ss4a_stage', e.target.value)}>
              {Object.entries(SS4A_STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prior SS4A Grant</label>
            <select className="select" value={form.had_prior_ss4a_grant} onChange={e => update('had_prior_ss4a_grant', e.target.value)}>
              <option value="unknown">Unknown</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Has Action Plan</label>
            <select className="select" value={form.has_action_plan} onChange={e => update('has_action_plan', e.target.value)}>
              <option value="unknown">Unknown</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Plan Type</label>
            <select className="select" value={form.action_plan_type} onChange={e => update('action_plan_type', e.target.value)}>
              {Object.entries(ACTION_PLAN_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Scoring Inputs */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Scoring Factors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pedestrian Safety Relevance</label>
            <select className="select" value={form.pedestrian_safety_relevance} onChange={e => update('pedestrian_safety_relevance', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Underserved Community Relevance</label>
            <select className="select" value={form.underserved_community_relevance} onChange={e => update('underserved_community_relevance', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Strength</label>
            <select className="select" value={form.university_research_strength} onChange={e => update('university_research_strength', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="not_applicable">N/A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grant Partner Fit</label>
            <select className="select" value={form.grant_partner_fit} onChange={e => update('grant_partner_fit', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Notes</h3>
        <textarea className="input min-h-[80px] resize-y" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="General notes..." rows={3} />
        <textarea className="input min-h-[80px] resize-y mt-3" value={form.strategic_notes} onChange={e => update('strategic_notes', e.target.value)} placeholder="Strategic notes (WalkPhase fit, approach ideas...)" rows={3} />
        <input className="input mt-3" value={form.source} onChange={e => update('source', e.target.value)} placeholder="Source (e.g. SS4A Award List, LinkedIn, Research)" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{initialData?.id ? 'Save Changes' : 'Add Organization'}</button>
      </div>
    </form>
  )
}
