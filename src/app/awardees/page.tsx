'use client'

import { useEffect, useState, useMemo } from 'react'
import { Search, SlidersHorizontal, Award, ArrowUpDown, Download, TrendingUp } from 'lucide-react'
import { SS4AAwardee, SS4AData } from '@/lib/types'
import { loadSS4AData } from '@/lib/store'
import { cn } from '@/lib/utils'

type SortKey = 'funding' | 'name' | 'awards' | 'state'

function formatMoney(n: number): string {
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`
  return `$${n}`
}

export default function AwardeesPage() {
  const [data, setData] = useState<SS4AData | null>(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('funding')
  const [filterState, setFilterState] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterPlan, setFilterPlan] = useState('')
  const [filterPed, setFilterPed] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 50

  useEffect(() => { loadSS4AData().then(setData) }, [])

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
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(o => o.lead_applicant.toLowerCase().includes(q) || o.state.toLowerCase().includes(q))
    }
    if (filterState) list = list.filter(o => o.state === filterState)
    if (filterType) list = list.filter(o => o.applicant_type === filterType)
    if (filterPlan === 'yes') list = list.filter(o => o.has_action_plan)
    else if (filterPlan === 'no') list = list.filter(o => !o.has_action_plan)
    if (filterPed) list = list.filter(o => o.pedestrian_related)

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'funding': return b.total_funding - a.total_funding
        case 'name': return a.lead_applicant.localeCompare(b.lead_applicant)
        case 'awards': return b.award_count - a.award_count
        case 'state': return a.state.localeCompare(b.state)
      }
    })
    return list
  }, [data, search, sortBy, filterState, filterType, filterPlan, filterPed])

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)

  // Stats
  const totalFunding = filtered.reduce((a, o) => a + o.total_funding, 0)
  const withActionPlan = filtered.filter(o => o.has_action_plan).length
  const withImplementation = filtered.filter(o => o.has_implementation).length
  const pedRelated = filtered.filter(o => o.pedestrian_related).length

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
          </p>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="card px-4 py-3">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{filtered.length.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Organizations</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-2xl font-bold text-wp-deep tabular-nums">{withActionPlan}</p>
          <p className="text-xs text-gray-500">With Action Plan</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-2xl font-bold text-purple-600 tabular-nums">{withImplementation}</p>
          <p className="text-xs text-gray-500">Implementation Grants</p>
        </div>
        <div className="card px-4 py-3">
          <p className="text-2xl font-bold text-amber-600 tabular-nums">{pedRelated}</p>
          <p className="text-xs text-gray-500">Pedestrian-Related</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-10" placeholder="Search awardees..." value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className={cn('btn-secondary', showFilters && 'ring-2 ring-wp-light/30')}>
          <SlidersHorizontal className="w-4 h-4" /> Filters
        </button>
        <select className="select max-w-[180px]" value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}>
          <option value="funding">Highest Funding</option>
          <option value="awards">Most Awards</option>
          <option value="name">Name A-Z</option>
          <option value="state">State</option>
        </select>
      </div>

      {showFilters && (
        <div className="card p-4 mb-4 animate-slide-up">
          <div className="grid grid-cols-4 gap-3">
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
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Action Plan</label>
              <select className="select text-sm" value={filterPlan} onChange={e => { setFilterPlan(e.target.value); setPage(0) }}>
                <option value="">All</option>
                <option value="yes">Has Action Plan</option>
                <option value="no">No Action Plan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Pedestrian Focus</label>
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input type="checkbox" checked={filterPed} onChange={e => { setFilterPed(e.target.checked); setPage(0) }}
                  className="rounded border-gray-300 text-wp-mid focus:ring-wp-light" />
                <span className="text-sm text-gray-700">Pedestrian-related only</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="table-header">Organization</th>
              <th className="table-header">State</th>
              <th className="table-header">Type</th>
              <th className="table-header text-right">Funding</th>
              <th className="table-header text-center">Awards</th>
              <th className="table-header">Years</th>
              <th className="table-header">Grant Types</th>
              <th className="table-header text-center">Ped.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paged.map((org, i) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
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
