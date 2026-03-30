// ─── Core Enums ───
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
export type OutcomeType = 'sent' | 'replied' | 'no_response' | 'follow_up_due' | 'meeting_booked' | 'not_a_fit' | 'referred'
export type TemplateCategory = 'university_initial' | 'city_initial' | 'mpo_initial' | 'follow_up' | 'quick_intro' | 'meeting_request' | 'custom'
export type WaveStatus = 'upcoming' | 'active' | 'completed'
export type PlaybookTaskStatus = 'pending' | 'completed' | 'skipped' | 'moved'

// ─── Organization ───
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

// ─── Contact ───
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

// ─── Outreach Activity ───
export interface OutreachActivity {
  id: string
  organization_id: string
  contact_id: string
  activity_type: ActivityType
  activity_date: string
  summary: string
  outcome: string
  outcome_type?: OutcomeType
  next_step: string
  template_id?: string
}

// ─── Email Template ───
export interface EmailTemplate {
  id: string
  name: string
  category: TemplateCategory
  subject: string
  body: string
  use_case: string
  variables: string[] // e.g. ['first_name', 'organization_name', 'city', 'target_reason']
  created_at: string
  updated_at: string
}

// ─── Outreach Wave ───
export interface OutreachWave {
  id: string
  name: string
  description: string
  status: WaveStatus
  order: number
  messaging_angle: string
  objective: string
  organization_ids: string[]
  created_at: string
}

// ─── Playbook Day Plan ───
export interface PlaybookTask {
  id: string
  day_date: string // YYYY-MM-DD
  organization_id: string
  contact_id?: string
  template_id?: string
  status: PlaybookTaskStatus
  priority: number // 1 = highest
  suggested_action: string
  notes: string
  outcome_notes?: string
  wave_id?: string
}

// ─── SS4A Awardee (from XLSX data) ───
export interface SS4AAwardee {
  lead_applicant: string
  state: string
  applicant_type: string
  rural_urban: string
  award_count: number
  total_funding: number
  grant_types: string[]
  fiscal_years: string[]
  has_action_plan: boolean
  has_implementation: boolean
  has_planning: boolean
  project_names: string[]
  description_summary: string
  pedestrian_related: boolean
}

export interface SS4AData {
  total_awards: number
  unique_organizations: number
  organizations: SS4AAwardee[]
}

// ─── Scoring ───
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

// ─── Labels ───
export const CATEGORY_LABELS: Record<TargetCategory, string> = {
  university: 'University', city: 'City', county: 'County', mpo: 'MPO / Regional Agency',
  research_center: 'Research Center', signal_company: 'Signal Company', other: 'Other',
}

export const SS4A_STAGE_LABELS: Record<SS4AStage, string> = {
  no_known_activity: 'No Known Activity', likely_planning_candidate: 'Likely Planning Candidate',
  planning_demo_candidate: 'Planning/Demo Candidate', has_action_plan: 'Has Action Plan',
  implementation_candidate: 'Implementation Candidate', active_grantee: 'Active Grantee', unknown: 'Unknown',
}

export const RELATIONSHIP_LABELS: Record<RelationshipStatus, string> = {
  not_contacted: 'Not Contacted', queued: 'Queued', emailed: 'Emailed',
  replied: 'Replied', meeting_booked: 'Meeting Booked', deprioritized: 'Deprioritized',
}

export const CONTACT_TYPE_LABELS: Record<ContactType, string> = {
  professor: 'Professor', director: 'Director', program_manager: 'Program Manager',
  planner: 'Planner', engineer: 'Engineer', admin: 'Admin',
  researcher: 'Researcher', business_development: 'Business Development', other: 'Other',
}

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  email: 'Email', linkedin: 'LinkedIn', call: 'Call', meeting: 'Meeting', research: 'Research', note: 'Note',
}

export const ACTION_PLAN_TYPE_LABELS: Record<ActionPlanType, string> = {
  vision_zero: 'Vision Zero', ss4a_action_plan: 'SS4A Action Plan', other: 'Other', unknown: 'Unknown',
}

export const OUTCOME_LABELS: Record<OutcomeType, string> = {
  sent: 'Email Sent', replied: 'Replied', no_response: 'No Response',
  follow_up_due: 'Follow-up Due', meeting_booked: 'Meeting Booked',
  not_a_fit: 'Not a Fit', referred: 'Referred',
}

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  university_initial: 'University Initial', city_initial: 'City Initial',
  mpo_initial: 'MPO / Agency', follow_up: 'Follow-up', quick_intro: 'Quick Intro',
  meeting_request: 'Meeting Request', custom: 'Custom',
}

export const PIPELINE_COLUMNS: { key: RelationshipStatus; label: string; color: string }[] = [
  { key: 'not_contacted', label: 'Research', color: '#9ca3af' },
  { key: 'queued', label: 'Ready to Email', color: '#3b82f6' },
  { key: 'emailed', label: 'Contacted', color: '#f59e0b' },
  { key: 'replied', label: 'Replied', color: '#22c55e' },
  { key: 'meeting_booked', label: 'Meeting Booked', color: '#166534' },
  { key: 'deprioritized', label: 'Deprioritized', color: '#ef4444' },
]
