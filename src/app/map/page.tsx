'use client'

import { useEffect, useState, useMemo } from 'react'
import { ensureSeeded, getOrganizations, getContacts } from '@/lib/store'
import { Organization, Contact } from '@/lib/types'
import { cn } from '@/lib/utils'

// US state abbreviation → SVG path data (simplified outlines)
// Using a standard US state map with viewBox coordinates
const STATE_PATHS: Record<string, string> = {
  AL: 'M628,466 L628,530 L614,542 L608,542 L604,550 L618,558 L598,558 L594,530 L594,466Z',
  AK: 'M161,485 L183,485 L183,516 L161,516Z',
  AZ: 'M205,410 L260,410 L270,478 L246,500 L204,500 L196,450Z',
  AR: 'M538,448 L594,448 L594,504 L540,504 L536,498Z',
  CA: 'M120,290 L172,290 L196,380 L196,450 L172,470 L128,450 L108,370Z',
  CO: 'M280,320 L360,320 L360,390 L280,390Z',
  CT: 'M810,240 L838,230 L844,248 L820,256Z',
  DE: 'M780,320 L794,310 L796,338 L784,338Z',
  FL: 'M620,560 L680,530 L720,560 L700,620 L660,640 L640,600 L620,570Z',
  GA: 'M638,466 L690,466 L694,542 L644,550 L628,530Z',
  HI: 'M300,550 L340,550 L340,580 L300,580Z',
  ID: 'M210,170 L260,170 L262,290 L220,290 L210,240Z',
  IL: 'M570,280 L600,280 L604,380 L586,400 L570,380Z',
  IN: 'M606,280 L638,280 L638,380 L606,380Z',
  IA: 'M490,260 L560,260 L560,320 L490,320Z',
  KS: 'M380,360 L480,360 L480,420 L380,420Z',
  KY: 'M600,380 L690,370 L692,400 L606,410Z',
  LA: 'M530,510 L588,506 L594,560 L558,574 L530,548Z',
  ME: 'M840,130 L862,120 L870,180 L846,200Z',
  MD: 'M730,310 L788,300 L790,330 L740,340Z',
  MA: 'M810,218 L852,210 L856,228 L814,234Z',
  MI: 'M590,170 L640,162 L652,240 L630,268 L600,260 L590,210Z',
  MN: 'M470,140 L540,140 L540,240 L470,240Z',
  MS: 'M580,460 L610,460 L614,540 L588,546 L580,510Z',
  MO: 'M490,340 L570,340 L580,420 L540,440 L490,420Z',
  MT: 'M240,120 L360,120 L360,200 L240,200Z',
  NE: 'M360,280 L470,280 L480,340 L370,340Z',
  NV: 'M170,260 L220,260 L220,400 L190,400 L170,340Z',
  NH: 'M832,155 L846,150 L848,208 L834,214Z',
  NJ: 'M790,268 L804,258 L808,310 L792,320Z',
  NM: 'M250,410 L330,410 L334,500 L250,500Z',
  NY: 'M730,180 L810,170 L818,250 L760,264 L730,240Z',
  NC: 'M660,400 L770,380 L774,410 L664,430Z',
  ND: 'M380,120 L470,120 L470,200 L380,200Z',
  OH: 'M640,270 L700,260 L704,350 L644,360Z',
  OK: 'M370,410 L480,400 L490,454 L400,460 L370,440Z',
  OR: 'M120,170 L210,170 L210,260 L130,260Z',
  PA: 'M708,250 L790,240 L792,300 L712,310Z',
  RI: 'M838,234 L850,230 L852,246 L840,248Z',
  SC: 'M670,440 L730,420 L740,470 L690,470Z',
  SD: 'M380,200 L470,200 L470,270 L380,270Z',
  TN: 'M580,400 L690,394 L692,430 L582,440Z',
  TX: 'M320,440 L440,430 L490,460 L500,560 L430,590 L360,560 L320,500Z',
  UT: 'M230,260 L280,260 L280,380 L230,380Z',
  VT: 'M820,150 L836,145 L838,208 L822,214Z',
  VA: 'M670,350 L770,330 L774,380 L670,394Z',
  WA: 'M130,100 L210,100 L210,170 L130,170Z',
  WV: 'M690,310 L730,300 L734,380 L694,370Z',
  WI: 'M530,150 L590,155 L600,260 L540,260 L530,200Z',
  WY: 'M270,200 L360,200 L360,280 L270,280Z',
  DC: 'M760,332 L768,328 L770,336 L762,338Z',
}

function getHeatColor(count: number, max: number): string {
  if (count === 0) return '#f3f4f6' // gray-100
  const intensity = Math.min(count / Math.max(max, 1), 1)
  if (intensity <= 0.25) return '#dcfce7' // wp-100
  if (intensity <= 0.5) return '#86efac' // wp-300
  if (intensity <= 0.75) return '#22c55e' // wp-500
  return '#166534' // wp-700
}

export default function MapPage() {
  const [mounted, setMounted] = useState(false)
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'contacted'>('all')

  useEffect(() => {
    ensureSeeded()
    setOrgs(getOrganizations())
    setContacts(getContacts())
    setMounted(true)
  }, [])

  // Count orgs per state
  const stateCounts = useMemo(() => {
    const counts = new Map<string, { total: number; contacted: number; orgNames: string[] }>()

    // Init all states
    Object.keys(STATE_PATHS).forEach(s => counts.set(s, { total: 0, contacted: 0, orgNames: [] }))

    orgs.forEach(org => {
      const state = org.location_state?.toUpperCase().trim()
      if (!state || !counts.has(state)) return
      const entry = counts.get(state)!
      entry.total++
      entry.orgNames.push(org.organization_name)

      // Check if any contact for this org has been contacted
      const orgContacts = contacts.filter(c => c.organization_id === org.id)
      const wasContacted = orgContacts.some(c =>
        c.relationship_status === 'emailed' || c.relationship_status === 'replied' || c.relationship_status === 'meeting_booked'
      )
      if (wasContacted) entry.contacted++
    })

    return counts
  }, [orgs, contacts])

  const maxCount = useMemo(() => {
    let max = 0
    stateCounts.forEach(v => {
      const val = filter === 'contacted' ? v.contacted : v.total
      if (val > max) max = val
    })
    return max
  }, [stateCounts, filter])

  const totalStates = useMemo(() => {
    let count = 0
    stateCounts.forEach(v => { if (v.total > 0) count++ })
    return count
  }, [stateCounts])

  const contactedStates = useMemo(() => {
    let count = 0
    stateCounts.forEach(v => { if (v.contacted > 0) count++ })
    return count
  }, [stateCounts])

  const hoveredData = hoveredState ? stateCounts.get(hoveredState) : null

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-7xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coverage Map</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalStates} states with organizations &middot; {contactedStates} states contacted
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              filter === 'all' ? 'bg-wp-pale text-wp-deep' : 'text-gray-500 hover:bg-gray-100')}
          >
            All Organizations
          </button>
          <button
            onClick={() => setFilter('contacted')}
            className={cn('px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
              filter === 'contacted' ? 'bg-wp-pale text-wp-deep' : 'text-gray-500 hover:bg-gray-100')}
          >
            Contacted Only
          </button>
        </div>
      </div>

      <div className="card p-6">
        {/* Map */}
        <div className="relative">
          <svg viewBox="80 80 820 560" className="w-full h-auto">
            {Object.entries(STATE_PATHS).map(([state, path]) => {
              const data = stateCounts.get(state)
              const count = data ? (filter === 'contacted' ? data.contacted : data.total) : 0
              const color = getHeatColor(count, maxCount)
              return (
                <path
                  key={state}
                  d={path}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="cursor-pointer transition-all duration-200 hover:opacity-80"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                />
              )
            })}
          </svg>

          {/* Tooltip */}
          {hoveredState && hoveredData && (
            <div className="absolute top-4 right-4 card p-4 min-w-[200px] shadow-elevated animate-fade-in">
              <p className="text-lg font-bold text-gray-900">{hoveredState}</p>
              <div className="space-y-1 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Organizations</span>
                  <span className="font-semibold text-gray-900">{hoveredData.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Contacted</span>
                  <span className="font-semibold text-wp-deep">{hoveredData.contacted}</span>
                </div>
              </div>
              {hoveredData.orgNames.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Organizations:</p>
                  <div className="space-y-0.5 max-h-[120px] overflow-y-auto">
                    {hoveredData.orgNames.slice(0, 8).map((name, i) => (
                      <p key={i} className="text-xs text-gray-600 truncate">{name}</p>
                    ))}
                    {hoveredData.orgNames.length > 8 && (
                      <p className="text-xs text-gray-400">+{hoveredData.orgNames.length - 8} more</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
            <span className="text-xs text-gray-500">No orgs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-wp-100" />
            <span className="text-xs text-gray-500">1–2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-wp-300" />
            <span className="text-xs text-gray-500">3–5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-wp-500" />
            <span className="text-xs text-gray-500">6–10</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-wp-700" />
            <span className="text-xs text-gray-500">10+</span>
          </div>
        </div>
      </div>

      {/* State list */}
      <div className="card p-0 overflow-hidden mt-6">
        <div className="px-6 py-4 border-b border-gray-50">
          <h2 className="text-base font-semibold text-gray-900">Coverage by State</h2>
        </div>
        <div className="grid grid-cols-4 gap-px bg-gray-100">
          {Array.from(stateCounts.entries())
            .filter(([, data]) => data.total > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .map(([state, data]) => (
              <div key={state} className="bg-white px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">{state}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 tabular-nums">{data.total} orgs</span>
                    {data.contacted > 0 && (
                      <span className="badge badge-green text-[10px]">{data.contacted} contacted</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
