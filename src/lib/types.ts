export type TargetCategory = 'university' | 'city' | 'county' | 'mpo' | 'research_center' | 'signal_company' | 'other'
export type ActionPlanType = 'vision_zero' | 'ss4a_action_plan' | 'other' | 'unknown'
export type SS4AStage = 'no_known_activity' | 'likely_planning_candidate' | 'planning_demo_candidate' | 'has_action_plan' | 'implementation_candidate' | 'active_grantee' | 'unknown'
export type Relevance = 'high' | 'medium' | 'low' | 'unknown'
export type RelevanceNoUnknown = 'high' | 'medium' | 'low'
export type Strength = 'high' | 'medium' | 'low' | 'not_applicable'
export type YesNoUnknown = 'yes' | 'no' | 'unknown'
export type ContactType = 'professor' | 'director' | 'program_manager' | 'planner' | 'engineer' | 'admin' | 'researcher' | 'business_development' | 'other'
export type Seniority = 'high' | 'medium' | 'low'
export type RelationshipStatus = 'not_contacted' | 'queued' | 'emailed' | 'replied' | 'meeting_booked' | 'deprioritized'
export type ActivityType = 'email' | 'linkedin' | 'call' | 'meeting' | 'research' | 'note'

export interface Organization {
  id: string
  organization_name: string
  target_category: TargetCategory
  organization_type_detail: string
  website: string
  location_city: string
  location_state: string
  region: string
  notes: string
  had_prior_ss4a_grant: YesNoUnknown
  has_action_plan: YesNoUnknown
  action_plan_type: ActionPlanType
  ss4a_stage: SS4AStage
  underserved_community_relevance: Relevance
  pedestrian_safety_relevance: RelevanceNoUnknown
  university_research_strength: Strength
  grant_partner_fit: RelevanceNoUnknown
  strategic_notes: string
  source: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  first_name: string
  last_name: string
  full_name: string
  title: string
  email: string
  phone: string
  linkedin_url: string
  organization_id: string
  contact_type: ContactType
  seniority: Seniority
  relationship_status: RelationshipStatus
  last_contact_date: string
  next_action_date: string
  notes: string
  source: string
  created_at: string
  updated_at: string
}

export interface OutreachActivity {
  id: string
  organization_id: string
  contact_id: string
  activity_type: ActivityType
  activity_date: string
  summary: string
  outcome: string
  next_step: string
}

export interface ScoringWeights {
  organization_type_fit: number
  prior_ss4a_grant: number
  has_action_plan: number
  pedestrian_safety_relevance: number
  underserved_community_relevance: number
  research_capability: number
  ss4a_stage_advancement: number
  strategic_fit: number
  contact_quality: number
}

export interface ScoreBreakdown {
  total: number
  factors: { label: string; score: number; maxScore: number; reason: string }[]
  explanation: string
}

export const DEFAULT_WEIGHTS: ScoringWeights = {
  organization_type_fit: 15,
  prior_ss4a_grant: 10,
  has_action_plan: 15,
  pedestrian_safety_relevance: 15,
  underserved_community_relevance: 10,
  research_capability: 10,
  ss4a_stage_advancement: 10,
  strategic_fit: 10,
  contact_quality: 5,
}

export const CATEGORY_LABELS: Record<TargetCategory, string> = {
  university: 'University',
  city: 'City',
  county: 'County',
  mpo: 'MPO / Regional Agency',
  research_center: 'Research Center',
  signal_company: 'Signal Company',
  other: 'Other',
}

export const SS4A_STAGE_LABELS: Record<SS4AStage, string> = {
  no_known_activity: 'No Known Activity',
  likely_planning_candidate: 'Likely Planning Candidate',
  planning_demo_candidate: 'Planning/Demo Candidate',
  has_action_plan: 'Has Action Plan',
  implementation_candidate: 'Implementation Candidate',
  active_grantee: 'Active Grantee',
  unknown: 'Unknown',
}

export const RELATIONSHIP_LABELS: Record<RelationshipStatus, string> = {
  not_contacted: 'Not Contacted',
  queued: 'Queued',
  emailed: 'Emailed',
  replied: 'Replied',
  meeting_booked: 'Meeting Booked',
  deprioritized: 'Deprioritized',
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  professor: 'Professor',
  director: 'Director',
  program_manager: 'Program Manager',
  planner: 'Planner',
  engineer: 'Engineer',
  admin: 'Admin',
  researcher: 'Researcher',
  business_development: 'Business Development',
  other: 'Other',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  email: 'Email',
  linkedin: 'LinkedIn',
  call: 'Call',
  meeting: 'Meeting',
  research: 'Research',
  note: 'Note',
}

export const ACTION_PLAN_TYPE_LABELS: Record<ActionPlanType, string> = {
  vision_zero: 'Vision Zero',
  ss4a_action_plan: 'SS4A Action Plan',
  other: 'Other',
  unknown: 'Unknown',
}

export const PIPELINE_COLUMNS: { key: RelationshipStatus; label: string; color: string }[] = [
  { key: 'not_contacted', label: 'Research', color: '#9ca3af' },
  { key: 'queued', label: 'Ready to Email', color: '#3b82f6' },
  { key: 'emailed', label: 'Contacted', color: '#f59e0b' },
  { key: 'replied', label: 'Replied', color: '#22c55e' },
  { key: 'meeting_booked', label: 'Meeting Booked', color: '#166534' },
  { key: 'deprioritized', label: 'Deprioritized', color: '#ef4444' },
]
