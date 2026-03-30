'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Contact, Organization, PIPELINE_COLUMNS, RelationshipStatus, RELATIONSHIP_LABELS } from '@/lib/types'
import { ensureSeeded, getContacts, getOrganizations, saveContact } from '@/lib/store'
import { statusColor, cn } from '@/lib/utils'

export default function PipelinePage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [mounted, setMounted] = useState(false)
  const [draggedContact, setDraggedContact] = useState<string | null>(null)

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

  const columnData = useMemo(() => {
    return PIPELINE_COLUMNS.map(col => ({
      ...col,
      contacts: contacts.filter(c => c.relationship_status === col.key),
    }))
  }, [contacts])

  const handleDrop = (status: RelationshipStatus) => {
    if (!draggedContact) return
    const contact = contacts.find(c => c.id === draggedContact)
    if (!contact || contact.relationship_status === status) return
    saveContact({ ...contact, relationship_status: status })
    reload()
    setDraggedContact(null)
  }

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
        <p className="text-sm text-gray-500 mt-0.5">Drag contacts between stages to update their status</p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columnData.map(col => (
          <div
            key={col.key}
            className="flex-shrink-0 w-72"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                <h3 className="text-sm font-semibold text-gray-700">{col.label}</h3>
              </div>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full tabular-nums">
                {col.contacts.length}
              </span>
            </div>

            {/* Column Body */}
            <div className="space-y-2.5 min-h-[200px] p-2 rounded-2xl bg-gray-50/80 border border-gray-100">
              {col.contacts.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-xs text-gray-300">
                  Drop contacts here
                </div>
              ) : (
                col.contacts.map(contact => {
                  const org = orgMap.get(contact.organization_id)
                  return (
                    <div
                      key={contact.id}
                      draggable
                      onDragStart={() => setDraggedContact(contact.id)}
                      onDragEnd={() => setDraggedContact(null)}
                      className={cn(
                        'bg-white rounded-xl p-3.5 shadow-card border border-gray-100 cursor-grab active:cursor-grabbing transition-all duration-200',
                        'hover:shadow-card-hover',
                        draggedContact === contact.id && 'opacity-50 scale-95'
                      )}
                    >
                      <p className="text-sm font-medium text-gray-900">{contact.full_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">{contact.title}</p>
                      {org && (
                        <Link
                          href={`/organizations/${org.id}`}
                          className="text-xs text-wp-mid hover:text-wp-deep font-medium mt-1.5 block truncate transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          {org.organization_name}
                        </Link>
                      )}
                      {contact.next_action_date && (
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          Next: {new Date(contact.next_action_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
