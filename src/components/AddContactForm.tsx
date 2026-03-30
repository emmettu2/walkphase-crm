'use client'

import { useState, useMemo } from 'react'
import { v4 as uuid } from 'uuid'
import { Contact, ContactType, Seniority, RelationshipStatus, CONTACT_TYPE_LABELS, Organization } from '@/lib/types'
import { saveContact, getOrganizations } from '@/lib/store'

interface Props {
  onSave: () => void
  onCancel: () => void
  initialData?: Partial<Contact>
  preselectedOrgId?: string
  onCreateOrg?: () => void
}

export function AddContactForm({ onSave, onCancel, initialData, preselectedOrgId, onCreateOrg }: Props) {
  const orgs = useMemo(() => getOrganizations(), [])
  const [orgSearch, setOrgSearch] = useState('')
  const [showOrgDropdown, setShowOrgDropdown] = useState(false)

  const [form, setForm] = useState<Partial<Contact>>({
    first_name: '',
    last_name: '',
    title: '',
    email: '',
    phone: '',
    linkedin_url: '',
    organization_id: preselectedOrgId || '',
    contact_type: 'other',
    seniority: 'medium',
    relationship_status: 'not_contacted',
    last_contact_date: '',
    next_action_date: '',
    notes: '',
    source: '',
    ...initialData,
  })

  const filteredOrgs = useMemo(() => {
    if (!orgSearch) return orgs.slice(0, 10)
    const q = orgSearch.toLowerCase()
    return orgs.filter(o => o.organization_name.toLowerCase().includes(q)).slice(0, 10)
  }, [orgs, orgSearch])

  const selectedOrg = orgs.find(o => o.id === form.organization_id)

  const update = (key: keyof Contact, value: string) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.first_name || !form.last_name) return

    const contact: Contact = {
      id: initialData?.id || uuid(),
      first_name: form.first_name || '',
      last_name: form.last_name || '',
      full_name: `${form.first_name} ${form.last_name}`.trim(),
      title: form.title || '',
      email: form.email || '',
      phone: form.phone || '',
      linkedin_url: form.linkedin_url || '',
      organization_id: form.organization_id || '',
      contact_type: form.contact_type as ContactType || 'other',
      seniority: form.seniority as Seniority || 'medium',
      relationship_status: form.relationship_status as RelationshipStatus || 'not_contacted',
      last_contact_date: form.last_contact_date || '',
      next_action_date: form.next_action_date || '',
      notes: form.notes || '',
      source: form.source || '',
      created_at: initialData?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    saveContact(contact)
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input className="input" value={form.first_name} onChange={e => update('first_name', e.target.value)} required placeholder="Jennifer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input className="input" value={form.last_name} onChange={e => update('last_name', e.target.value)} required placeholder="Dill" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input className="input" value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Director of Transportation" />
          </div>
        </div>
      </div>

      {/* Organization */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Organization</h3>
        <div className="relative">
          {selectedOrg ? (
            <div className="flex items-center justify-between p-3 rounded-xl border border-wp-200 bg-wp-50">
              <div>
                <p className="text-sm font-medium text-gray-900">{selectedOrg.organization_name}</p>
                <p className="text-xs text-gray-500">{selectedOrg.location_city}, {selectedOrg.location_state}</p>
              </div>
              <button type="button" onClick={() => update('organization_id', '')} className="text-xs text-gray-400 hover:text-gray-600">Change</button>
            </div>
          ) : (
            <div>
              <input
                className="input"
                value={orgSearch}
                onChange={e => { setOrgSearch(e.target.value); setShowOrgDropdown(true) }}
                onFocus={() => setShowOrgDropdown(true)}
                placeholder="Search organizations..."
              />
              {showOrgDropdown && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-elevated border border-gray-100 max-h-48 overflow-y-auto">
                  {filteredOrgs.map(o => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => { update('organization_id', o.id); setOrgSearch(''); setShowOrgDropdown(false) }}
                      className="w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors"
                    >
                      <p className="text-sm font-medium text-gray-900">{o.organization_name}</p>
                      <p className="text-xs text-gray-400">{o.location_city}, {o.location_state}</p>
                    </button>
                  ))}
                  {filteredOrgs.length === 0 && (
                    <div className="px-4 py-3 text-center">
                      <p className="text-sm text-gray-400 mb-2">No matching organizations</p>
                      {onCreateOrg && (
                        <button type="button" onClick={onCreateOrg} className="text-sm text-wp-mid font-medium hover:text-wp-deep">
                          + Create new organization
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Contact Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="input" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="jdill@pdx.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className="input" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="(503) 555-0100" />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input className="input" value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/in/..." />
          </div>
        </div>
      </div>

      {/* Role & Status */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Role & Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Type</label>
            <select className="select" value={form.contact_type} onChange={e => update('contact_type', e.target.value)}>
              {Object.entries(CONTACT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seniority</label>
            <select className="select" value={form.seniority} onChange={e => update('seniority', e.target.value)}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
            <select className="select" value={form.relationship_status} onChange={e => update('relationship_status', e.target.value)}>
              <option value="not_contacted">Not Contacted</option>
              <option value="queued">Queued</option>
              <option value="emailed">Emailed</option>
              <option value="replied">Replied</option>
              <option value="meeting_booked">Meeting Booked</option>
              <option value="deprioritized">Deprioritized</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Next Action Date</label>
            <input className="input" type="date" value={form.next_action_date} onChange={e => update('next_action_date', e.target.value)} />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <textarea className="input min-h-[80px] resize-y" value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Notes about this contact..." rows={3} />
        <input className="input mt-3" value={form.source} onChange={e => update('source', e.target.value)} placeholder="Source (e.g. LinkedIn, Conference, Research)" />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">{initialData?.id ? 'Save Changes' : 'Add Contact'}</button>
      </div>
    </form>
  )
}
