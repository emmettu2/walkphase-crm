'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, SlidersHorizontal, Building2 } from 'lucide-react'
import { Organization, Contact, CATEGORY_LABELS, SS4A_STAGE_LABELS, TargetCategory, SS4AStage } from '@/lib/types'
import { ensureSeeded, getOrganizations, getContacts, getScoringWeights } from '@/lib/store'
import { computeScore } from '@/lib/scoring'
import { ScoreBar } from '@/components/ScoreBadge'
import { EmptyState } from '@/components/EmptyState'
import { Modal } from '@/components/Modal'
import { AddOrganizationForm } from '@/components/AddOrganizationForm'
import { categoryIcon, ss4aStageColor, cn } from '@/lib/utils'

type SortKey = 'score' | 'name' | 'created' | 'contacts' | 'state'

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('score')
  const [filterCategory, setFilterCategory] = useState<string>('')
  const [filterStage, setFilterStage] = useState<string>('')
  const [filterPlan, setFilterPlan] = useState<string>('')
  const [filterGrant, setFilterGrant] = useState<string>('')
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  const reload = () => {
    setOrgs(getOrganizations())
    setContacts(getContacts())
  }

  useEffect(() => {
    ensureSeeded()
    reload()
    setMounted(true)
  }, [])

  const weights = useMemo(() => mounted ? getScoringWeights() : undefined, [mounted])

  const scored = useMemo(() => {
    if (!weights) return []
    return orgs.map(o => ({
      org: o,
      score: computeScore(o, contacts, weights),
      contactCount: contacts.filter(c => c.organization_id === o.id).length,
    }))
  }, [orgs, contacts, weights])

  const filtered = useMemo(() => {
    let list = scored
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.org.organization_name.toLowerCase().includes(q) ||
        s.org.location_city.toLowerCase().includes(q) ||
        s.org.location_state.toLowerCase().includes(q)
      )
    }
    if (filterCategory) list = list.filter(s => s.org.target_category === filterCategory)
    if (filterStage) list = list.filter(s => s.org.ss4a_stage === filterStage)
    if (filterPlan) list = list.filter(s => s.org.has_action_plan === filterPlan)
    if (filterGrant) list = list.filter(s => s.org.had_prior_ss4a_grant === filterGrant)

    list.sort((a, b) => {
      switch (sortBy) {
        case 'score': return b.score.total - a.score.total
        case 'name': return a.org.organization_name.localeCompare(b.org.organization_name)
        case 'created': return new Date(b.org.created_at).getTime() - new Date(a.org.created_at).getTime()
        case 'contacts': return b.contactCount - a.contactCount
        case 'state': return a.org.location_state.localeCompare(b.org.location_state)
      }
    })
    return list
  }, [scored, search, sortBy, filterCategory, filterStage, filterPlan, filterGrant])

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500 mt-0.5">{filtered.length} of {orgs.length} organizations</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Organization
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input pl-10"
            placeholder="Search organizations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn('btn-secondary', showFilters && 'ring-2 ring-wp-light/30')}
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <select className="select max-w-[180px]" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
          <option value="score">Highest Score</option>
          <option value="name">Name A-Z</option>
          <option value="created">Recently Added</option>
          <option value="contacts">Most Contacts</option>
          <option value="state">State</option>
        </select>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 animate-slide-up">
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select className="select text-sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="">All</option>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SS4A Stage</label>
              <select className="select text-sm" value={filterStage} onChange={e => setFilterStage(e.target.value)}>
                <option value="">All</option>
                {Object.entries(SS4A_STAGE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Action Plan</label>
              <select className="select text-sm" value={filterPlan} onChange={e => setFilterPlan(e.target.value)}>
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Prior SS4A Grant</label>
              <select className="select text-sm" value={filterGrant} onChange={e => setFilterGrant(e.target.value)}>
                <option value="">All</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>
          {(filterCategory || filterStage || filterPlan || filterGrant) && (
            <button
              onClick={() => { setFilterCategory(''); setFilterStage(''); setFilterPlan(''); setFilterGrant('') }}
              className="text-xs text-wp-mid font-medium mt-3 hover:text-wp-deep"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Building2 className="w-8 h-8" />}
          title="No organizations found"
          description={search ? 'Try adjusting your search or filters' : 'Add your first target organization to get started'}
          action={!search ? <button onClick={() => setShowAddModal(true)} className="btn-primary"><Plus className="w-4 h-4" /> Add Organization</button> : undefined}
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="table-header">Organization</th>
                <th className="table-header">Category</th>
                <th className="table-header">Location</th>
                <th className="table-header">SS4A Stage</th>
                <th className="table-header">Action Plan</th>
                <th className="table-header">Prior Grant</th>
                <th className="table-header text-center">Contacts</th>
                <th className="table-header">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(({ org, score, contactCount }) => (
                <tr key={org.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                  <td className="table-cell">
                    <Link href={`/organizations/${org.id}`} className="block">
                      <p className="font-medium text-gray-900 group-hover:text-wp-deep transition-colors">{org.organization_name}</p>
                      {org.organization_type_detail && (
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">{org.organization_type_detail}</p>
                      )}
                    </Link>
                  </td>
                  <td className="table-cell">
                    <span className="flex items-center gap-1.5 text-sm">
                      <span>{categoryIcon(org.target_category)}</span>
                      <span className="text-gray-600">{CATEGORY_LABELS[org.target_category]}</span>
                    </span>
                  </td>
                  <td className="table-cell text-gray-600">
                    {org.location_city}{org.location_state ? `, ${org.location_state}` : ''}
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${ss4aStageColor(org.ss4a_stage)}`}>
                      {SS4A_STAGE_LABELS[org.ss4a_stage]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${org.has_action_plan === 'yes' ? 'badge-green' : org.has_action_plan === 'no' ? 'badge-gray' : 'badge-gray'}`}>
                      {org.has_action_plan === 'yes' ? 'Yes' : org.has_action_plan === 'no' ? 'No' : '?'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`badge ${org.had_prior_ss4a_grant === 'yes' ? 'badge-blue' : org.had_prior_ss4a_grant === 'no' ? 'badge-gray' : 'badge-gray'}`}>
                      {org.had_prior_ss4a_grant === 'yes' ? 'Yes' : org.had_prior_ss4a_grant === 'no' ? 'No' : '?'}
                    </span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-sm font-medium text-gray-600 tabular-nums">{contactCount}</span>
                  </td>
                  <td className="table-cell">
                    <ScoreBar score={score.total} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add Organization" wide>
        <AddOrganizationForm onSave={() => { setShowAddModal(false); reload() }} onCancel={() => setShowAddModal(false)} />
      </Modal>
    </div>
  )
}
