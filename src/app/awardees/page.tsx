'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Download, ArrowUp, ArrowDown, Plus, Check, Building2 } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { SS4AAwardee, SS4AData, Organization } from '@/lib/types'
import { loadSS4AData, getOrganizations, saveOrganization } from '@/lib/store'
import { cn } from '@/lib/utils'

type SortKey = 'funding' | 'name' | 'awards' | 'state' | 'type' | 'years'
type SortDir = 'asc' | 'desc'
type StatFilter = 'all' | 'action_plan' | 'implementation' | 'pedestrian'

function formatMoney(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}

function SortHeader({ label, sortKey, currentSort, currentDir, onSort }: {
  label: string; sortKey: SortKey; currentSort: SortKey; currentDir: SortDir; onSort: (key: SortKey) => void
}) {
  const isActive = currentSort === sortKey
  return (
    <th
      className="table-header cursor-pointer select-none hover:text-gray-700 transition-colors group"
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          currentDir === 'desc' ? <ArrowDown className="w-3 h-3 text-wp-mid" /> : <ArrowUp className="w-3 h-3 text-wp-mid" />
        ) : (
          <ArrowDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </span>
    </th>
  )
}

export default function AwardeesPage() {
  const [data, setData] = useState<SS4AData | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('funding')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filterState, setFilterState] = useState('')
  const [filterType, setFilterType] = useState('')
  const [statFilter, setStatFilter] = useState<StatFilter>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const [addedOrgs, setAddedOrgs] = useState<Set<string>>(new Set())
  const PAGE_SIZE = 50

  useEffect(() => { loadSS4AData().then(setData) }, [])

  // Track which awardees are already in our organizations
  const existingOrgNames = useMemo(() => {
    const orgs = getOrganizations()
    return new Set(orgs.map(o => o.organization_name.toLowerCase()))
  }, [addedOrgs])

  const handleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortBy(key); setSortDir('desc') }
    setPage(0)
  }

  const states = useMemo(() => {
    if (!data) return []
    return [...new Set(data.organizations.map(o => o.state))].sort()
  }, [data])

  const applicantTypes = useMemo(() => {
    if (!data) return []
    return [...new Set(data.organizations.map(o => o.applicant_type))].filter(Boolean).sort()
  }, [data])

  const filtered = useMemo(() => {
    if (!data) return []
    let list = data.organizations

    // Stat card filters
    if (statFilter === 'action_plan') list = list.filter(o => o.has_action_plan)
    else if (statFilter === 'implementation') list = list.filter(o => o.has_implementation)
    else if (statFilter === 'pedestrian') list = list.filter(o => o.pedestrian_related)

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(o => o.lead_applicant.toLowerCase().includes(q) || o.state.toLowerCase().includes(q) ||
        o.project_names.some(n => n.toLowerCase().includes(q)))
    }
    if (filterState) list = list.filter(o => o.state === filterState)
    if (filterType) list = list.filter(o => o.applicant_type === filterType)

    const dir = sortDir === 'desc' ? -1 : 1
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'funding': return (a.total_funding - b.total_funding) * dir
        case 'name': return a.lead_applicant.localeCompare(b.lead_applicant) * dir
        case 'awards': return (a.award_count - b.award_count) * dir
        case 'state': return a.state.localeCompare(b.state) * dir
        case 'type': return a.applicant_type.localeCompare(b.applicant_type) * dir
        case 'years': return (a.fiscal_years.length - b.fiscal_years.length) * dir
      }
    })
    return list
  }, [data, search, sortBy, sortDir, filterState, filterType, statFilter])

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  // Stats (always from full dataset, not filtered)
  const allOrgs = data?.organizations || []
  const totalFunding = allOrgs.reduce((a, o) => a + o.total_funding, 0)
  const withActionPlan = allOrgs.filter(o => o.has_action_plan).length
  const withImplementation = allOrgs.filter(o => o.has_implementation).length
  const pedRelated = allOrgs.filter(o => o.pedestrian_related).length

  const addToOrganizations = (awardee: SS4AAwardee) => {
    const catMap: Record<string, string> = {
      'City or Township Government': 'city', 'County Government': 'county',
      'Metropolitan Planning Organization': 'mpo',
      'Public/State Controlled Institution of Higher Education': 'university',
      'Regional Organization': 'mpo',
    }
    const cat = catMap[awardee.applicant_type] || 'other'

    // Determine SS4A stage
    let stage = 'unknown'
    if (awardee.has_implementation) stage = 'active_grantee'
    else if (awardee.has_action_plan) stage = 'has_action_plan'
    else if (awardee.has_planning) stage = 'planning_demo_candidate'

    const org: Organization = {
      id: uuid(),
      organization_name: awardee.lead_applicant,
      target_category: cat as any,
      organization_type_detail: awardee.applicant_type,
      website: '',
      location_city: '',
      location_state: awardee.state,
      region: '',
      notes: awardee.description_summary ? awardee.description_summary.substring(0, 500) : '',
      had_prior_ss4a_grant: 'yes',
      has_action_plan: awardee.has_action_plan ? 'yes' : 'no',
      action_plan_type: awardee.has_action_plan ? 'ss4a_action_plan' : 'unknown',
      ss4a_stage: stage as any,
      underserved_community_relevance: 'unknown',
      pedestrian_safety_relevance: awardee.pedestrian_related ? 'high' : 'medium',
      university_research_strength: cat === 'university' ? 'high' : 'not_applicable',
      grant_partner_fit: awardee.pedestrian_related ? 'high' : 'medium',
      strategic_notes: `SS4A awardee: ${awardee.fiscal_years.join(', ')} — ${awardee.grant_types.join(', ')} — Total funding: ${formatMoney(awardee.total_funding)}${awardee.project_names.length > 0 ? '\nProject: ' + awardee.project_names[0] : ''}`,
      source: `SS4A Award List (${awardee.fiscal_years.join(', ')})`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    saveOrganization(org)
    setAddedOrgs(prev => new Set([...prev, awardee.lead_applicant.toLowerCase()]))
  }

  const exportCSV = () => {
    const header = 'Lead Applicant,State,Applicant Type,Award Count,Total Funding,Grant Types,Fiscal Years,Has Action Plan,Has Implementation,Pedestrian Related\n'
    const rows = filtered.map(o =>
      `"${o.lead_applicant}","${o.state}","${o.applicant_type}",${o.award_count},${o.total_funding},"${o.grant_types.join('; ')}","${o.fiscal_years.join('; ')}",${o.has_action_plan},${o.has_implementation},${o.pedestrian_related}`
    ).join('\n')
    const blob = new Blob([header + rows], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'ss4a_awardees_filtered.csv'
    a.click()
  }

  if (!data) return (
    <div className="p-8">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded-xl w-64" />
        <div className="h-4 bg-gray-100 rounded w-48" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SS4A Awardees</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length.toLocaleString()} organizations &middot; {formatMoney(totalFunding)} total funding &middot; FY22–FY25
            {statFilter !== 'all' && (
              <button onClick={() => { setStatFilter('all'); setPage(0) }} className="ml-2 text-wp-mid font-medium hover:text-wp-deep">
                Clear filter &times;
              </button>
            )}
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Clickable Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <button
          onClick={() => { setStatFilter(statFilter === 'all' ? 'all' : 'all'); setPage(0) }}
          className={cn('card px-4 py-3 text-left transition-all', statFilter === 'all' && 'ring-2 ring-wp-light/40')}
        >
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{allOrgs.length.toLocaleString()}</p>
          <p className="text-xs text-gray-500">All Organizations</p>
        </button>
        <button
          onClick={() => { setStatFilter(statFilter === 'action_plan' ? 'all' : 'action_plan'); setPage(0) }}
          className={cn('card px-4 py-3 text-left transition-all hover:shadow-card-hover',
            statFilter === 'action_plan' && 'ring-2 ring-wp-light/40 bg-wp-50')}
        >
          <p className="text-2xl font-bold text-wp-deep tabular-nums">{withActionPlan}</p>
          <p className="text-xs text-gray-500">With Action Plan</p>
        </button>
        <button
          onClick={() => { setStatFilter(statFilter === 'implementation' ? 'all' : 'implementation'); setPage(0) }}
          className={cn('card px-4 py-3 text-left transition-all hover:shadow-card-hover',
            statFilter === 'implementation' && 'ring-2 ring-purple-300/40 bg-purple-50')}
        >
          <p className="text-2xl font-bold text-purple-600 tabular-nums">{withImplementation}</p>
          <p className="text-xs text-gray-500">Implementation Grants</p>
        </button>
        <button
          onClick={() => { setStatFilter(statFilter === 'pedestrian' ? 'all' : 'pedestrian'); setPage(0) }}
          className={cn('card px-4 py-3 text-left transition-all hover:shadow-card-hover',
            statFilter === 'pedestrian' && 'ring-2 ring-amber-300/40 bg-amber-50')}
        >
          <p className="text-2xl font-bold text-amber-600 tabular-nums">{pedRelated}</p>
          <p className="text-xs text-gray-500">Pedestrian-Related</p>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-10" placeholder="Search awardees, projects..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={cn('btn-secondary', showFilters && 'ring-2 ring-wp-light/30')}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 animate-slide-up">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">State</label>
              <select className="select text-sm" value={filterState} onChange={e => { setFilterState(e.target.value); setPage(0) }}>
                <option value="">All States</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Applicant Type</label>
              <select className="select text-sm" value={filterType} onChange={e => { setFilterType(e.target.value); setPage(0) }}>
                <option value="">All Types</option>
                {applicantTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              {(filterState || filterType) && (
                <button onClick={() => { setFilterState(''); setFilterType(''); setPage(0) }}
                  className="text-xs text-wp-mid font-medium hover:text-wp-deep">Clear filters</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <SortHeader label="Organization" sortKey="name" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="State" sortKey="state" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Type" sortKey="type" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Funding" sortKey="funding" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Awards" sortKey="awards" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <SortHeader label="Years" sortKey="years" currentSort={sortBy} currentDir={sortDir} onSort={handleSort} />
              <th className="table-header">Grant Types</th>
              <th className="table-header text-center">Ped.</th>
              <th className="table-header text-center w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.map((org, i) => {
              const isAdded = existingOrgNames.has(org.lead_applicant.toLowerCase()) || addedOrgs.has(org.lead_applicant.toLowerCase())
              return (
                <tr key={`${org.lead_applicant}-${org.state}-${i}`} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell">
                    <p className="font-medium text-gray-900 text-sm">{org.lead_applicant}</p>
                    {org.project_names.length > 0 && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[250px]">{org.project_names[0]}</p>
                    )}
                  </td>
                  <td className="table-cell text-gray-600 text-sm">{org.state}</td>
                  <td className="table-cell text-xs text-gray-500 max-w-[140px] truncate">{org.applicant_type}</td>
                  <td className="table-cell text-right">
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{formatMoney(org.total_funding)}</span>
                  </td>
                  <td className="table-cell text-center">
                    <span className="text-sm font-medium text-gray-600 tabular-nums">{org.award_count}</span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1">
                      {org.fiscal_years.map(fy => (
                        <span key={fy} className="badge badge-gray text-[10px]">{fy}</span>
                      ))}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {org.has_action_plan && <span className="badge badge-green text-[10px]">Action Plan</span>}
                      {org.has_implementation && <span className="badge badge-purple text-[10px]">Implementation</span>}
                      {org.has_planning && !org.has_action_plan && !org.has_implementation && <span className="badge badge-blue text-[10px]">Planning</span>}
                    </div>
                  </td>
                  <td className="table-cell text-center">
                    {org.pedestrian_related && <span className="w-2 h-2 rounded-full bg-wp-light inline-block" title="Pedestrian-related" />}
                  </td>
                  <td className="table-cell text-center">
                    {isAdded ? (
                      <span className="text-wp-mid" title="Already in organizations"><Check className="w-4 h-4 inline" /></span>
                    ) : (
                      <button
                        onClick={() => addToOrganizations(org)}
                        className="text-gray-300 hover:text-wp-mid transition-colors" title="Add to Organizations"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length.toLocaleString()}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="btn-ghost disabled:opacity-30">&larr;</button>
            <span className="text-sm text-gray-500 tabular-nums">{page + 1} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="btn-ghost disabled:opacity-30">&rarr;</button>
          </div>
        </div>
      )}
    </div>
  )
}
