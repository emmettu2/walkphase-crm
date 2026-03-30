import { RelationshipStatus, SS4AStage, TargetCategory, Relevance, Strength } from './types'

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function relativeDate(dateStr: string): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return formatDateShort(dateStr)
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return Infinity
  const d = new Date(dateStr)
  const now = new Date()
  return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function statusColor(status: RelationshipStatus): string {
  const map: Record<RelationshipStatus, string> = {
    not_contacted: 'badge-gray',
    queued: 'badge-blue',
    emailed: 'badge-amber',
    replied: 'badge-green',
    meeting_booked: 'badge-purple',
    deprioritized: 'badge-red',
  }
  return map[status]
}

export function scoreColor(score: number): string {
  if (score >= 70) return 'bg-wp-light'
  if (score >= 45) return 'bg-amber-400'
  return 'bg-gray-300'
}

export function scoreTextColor(score: number): string {
  if (score >= 70) return 'text-wp-deep'
  if (score >= 45) return 'text-amber-700'
  return 'text-gray-500'
}

export function categoryIcon(category: TargetCategory): string {
  const map: Record<TargetCategory, string> = {
    university: '🎓',
    city: '🏙️',
    county: '🏛️',
    mpo: '🗺️',
    research_center: '🔬',
    signal_company: '🚦',
    other: '📋',
  }
  return map[category]
}

export function ss4aStageColor(stage: SS4AStage): string {
  const map: Record<SS4AStage, string> = {
    no_known_activity: 'badge-gray',
    likely_planning_candidate: 'badge-blue',
    planning_demo_candidate: 'badge-blue',
    has_action_plan: 'badge-green',
    implementation_candidate: 'badge-purple',
    active_grantee: 'badge-green',
    unknown: 'badge-gray',
  }
  return map[stage]
}

export function relevanceLabel(val: Relevance | Strength): string {
  const map: Record<string, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    unknown: 'Unknown',
    not_applicable: 'N/A',
  }
  return map[val] || val
}
