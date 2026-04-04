'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, Users, Mail, Phone, Link2, CheckCircle, AlertTriangle } from 'lucide-react'
import { Contact, Organization, RELATIONSHIP_LABELS, CONTACT_TYPE_LABELS } from '@/lib/types'
import { ensureSeeded, getContacts, getOrganizations, saveContact } from '@/lib/store'
import { EmptyState } from '@/components/EmptyState'
import { Modal } from '@/components/Modal'
import { AddContactForm } from '@/components/AddContactForm'
import { AddOrganizationForm } from '@/components/AddOrganizationForm'
import { formatDateShort, statusColor, cn } from '@/lib/utils'

type SortKey = 'name' | 'status' | 'last_contact' | 'next_action' | 'seniority'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('next_action')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')
  const [showAddContact, setShowAddContact] = useState(false)
  const [showAddOrg, setShowAddOrg] = useState(false)
  const [mounted, setMounted] = useState(false)

  const reload = () => {
    setContacts(getContacts())
    setOrgs(getOrganizations())
  }

  useEffect(() => {
    ensureSeeded()
    reload()
    setMounted(true)
  }, [])

  const orgMap = useMemo(() => {
    const m = new Map<string, Organization>()
    orgs.forEach(o => m.set(o.id, o))
    return m
  }, [orgs])

  const filtered = useMemo(() => {
    let list = contacts.map(c => ({ contact: c, org: orgMap.get(c.organization_id) }))
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(({ contact, org }) =>
        contact.full_name.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.title.toLowerCase().includes(q) ||
        (org?.organization_name.toLowerCase().includes(q) ?? false)
      )
    }
    if (filterStatus) list = list.filter(({ contact }) => contact.relationship_status === filterStatus)
    if (filterType) list = list.filter(({ contact }) => contact.contact_type === filterType)

    list.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.contact.full_name.localeCompare(b.contact.full_name)
        case 'status': return a.contact.relationship_status.localeCompare(b.contact.relationship_status)
        case 'last_contact':
          return (new Date(b.contact.last_contact_date || 0).getTime()) - (new Date(a.contact.last_contact_date || 0).getTime())
        case 'next_action':
          const aDate = a.contact.next_action_date ? new Date(a.contact.next_action_date).getTime() : Infinity
          const bDate = b.contact.next_action_date ? new Date(b.contact.next_action_date).getTime() : Infinity
          return aDate - bDate
        case 'seniority':
          const senMap: Record<string, number> = { high: 0, medium: 1, low: 2 }
          return (senMap[a.contact.seniority] ?? 2) - (senMap[b.contact.seniority] ?? 2)
      }
    })
    return list
  }, [contacts, search, sortBy, filterStatus, filterType, orgMap])

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {contacts.length} contacts</p>
        </div>
        <button onClick={() => setShowAddContact(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-10" placeholder="Search contacts..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="select max-w-[160px]" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Statuses</option>
          {Object.entries(RELATIONSHIP_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="select max-w-[160px]" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">All Types</option>
          {Object.entries(CONTACT_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="select max-w-[180px]" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
          <option value="next_action">Next Action</option>
          <option value="name">Name A-Z</option>
          <option value="status">Status</option>
          <option value="last_contact">Last Contact</option>
          <option value="seniority">Seniority</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="w-8 h-8" />}
          title="No contacts found"
          description={search ? 'Try adjusting your search or filters' : 'Add your first contact to get started'}
          action={!search ? <button onClick={() => setShowAddContact(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Contact</button> : undefined}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Title</th>
                <th className="table-header">Organization</th>
                <th className="table-header">Contact</th>
                <th className="table-header">Status</th>
                <th className="table-header">Last Contact</th>
                <th className="table-header">Next Action</th>
                <th className="table-header text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(({ contact, org }) => (
                <tr key={contact.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-gray-900">{contact.full_name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="badge badge-gray text-[10px]">{CONTACT_TYPE_LABELS[contact.contact_type]}</span>
                      <span className="badge badge-gray text-[10px]">{contact.seniority}</span>
                    </div>
                  </td>
                  <td className="table-cell text-gray-600 text-xs max-w-[160px] truncate">{contact.title}</td>
                  <td className="table-cell">
                    {org ? (
                      <Link href={`/organizations/${org.id}`} className="text-sm text-wp-mid hover:text-wp-deep font-medium transition-colors">
                        {org.organization_name}
                      </Link>
                    ) : <span className="text-gray-400">—</span>}
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      {contact.email && (
                        <a href={`mailto:${contact.email}`} title={contact.email} className="text-gray-400 hover:text-wp-mid transition-colors">
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {contact.phone && (
                        <span title={contact.phone} className="text-gray-400">
                          <Phone className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {contact.linkedin_url && (
                        <a href={contact.linkedin_url} target="_blank" rel="noopener" className="text-gray-400 hover:text-blue-600 transition-colors">
                          <Link2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${statusColor(contact.relationship_status)}`}>
                      {RELATIONSHIP_LABELS[contact.relationship_status]}
                    </span>
                  </td>
                  <td className="table-cell text-gray-600 text-xs">{formatDateShort(contact.last_contact_date)}</td>
                  <td className="table-cell text-gray-600 text-xs">
                    {contact.next_action_date ? (
                      <span className={cn(
                        'font-medium',
                        new Date(contact.next_action_date) <= new Date() ? 'text-red-500' : ''
                      )}>
                        {formatDateShort(contact.next_action_date)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="table-cell text-center">
                    <div className="flex items-center justify-center gap-1">
                      {contact.relationship_status !== 'emailed' && contact.relationship_status !== 'replied' && contact.relationship_status !== 'meeting_booked' && contact.relationship_status !== 'bounced' ? (
                        <button
                          onClick={() => {
                            saveContact({
                              ...contact,
                              relationship_status: 'emailed',
                              last_contact_date: new Date().toISOString().split('T')[0],
                            })
                            reload()
                          }}
                          className="btn-ghost text-xs text-gray-400 hover:text-wp-mid whitespace-nowrap"
                          title="Mark as contacted today"
                        >
                          <Mail className="w-3.5 h-3.5 mr-1 inline" />
                          Contacted
                        </button>
                      ) : contact.relationship_status === 'bounced' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <AlertTriangle className="w-3.5 h-3.5" /> Bounced
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-wp-mid">
                          <CheckCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {contact.relationship_status === 'emailed' && (
                        <button
                          onClick={() => {
                            saveContact({ ...contact, relationship_status: 'bounced' })
                            reload()
                          }}
                          className="btn-ghost text-xs text-gray-300 hover:text-red-500 p-1"
                          title="Email bounced"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showAddContact} onClose={() => setShowAddContact(false)} title="Add Contact" wide>
        <AddContactForm
          onSave={() => { setShowAddContact(false); reload() }}
          onCancel={() => setShowAddContact(false)}
          onCreateOrg={() => { setShowAddContact(false); setShowAddOrg(true) }}
        />
      </Modal>

      <Modal open={showAddOrg} onClose={() => setShowAddOrg(false)} title="Add Organization" wide>
        <AddOrganizationForm
          onSave={() => { setShowAddOrg(false); reload(); setShowAddContact(true) }}
          onCancel={() => { setShowAddOrg(false); setShowAddContact(true) }}
        />
      </Modal>
    </div>
  )
}
