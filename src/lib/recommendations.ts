import { Organization, Contact, OutreachActivity, ScoreBreakdown } from './types'
import { computeScore } from './scoring'
import { getContacts, getActivities, getScoringWeights } from './store'

export type RecommendationTier = 'recommended_next' | 'good_backup' | 'needs_research'

export interface OrgRecommendation {
  org: Organization
  score: ScoreBreakdown
  tier: RecommendationTier
  reason: string
  talking_points: string[]
  grant_path: string
  contacts: ContactRecommendation[]
}

export interface ContactRecommendation {
  contact: Contact
  rank: number
  reason: string
  is_decision_maker: boolean
  suggested_template_id?: string
}

export function getOrgRecommendations(orgs: Organization[]): OrgRecommendation[] {
  const contacts = getContacts()
  const activities = getActivities()
  const weights = getScoringWeights()

  return orgs.map(org => {
    const score = computeScore(org, contacts, weights)
    const orgContacts = contacts.filter(c => c.organization_id === org.id)
    const orgActivities = activities.filter(a => a.organization_id === org.id)

    // Determine tier
    const hasBeenContacted = orgContacts.some(c => c.relationship_status === 'emailed' || c.relationship_status === 'replied' || c.relationship_status === 'meeting_booked')
    const hasContacts = orgContacts.length > 0
    let tier: RecommendationTier
    if (score.total >= 60 && !hasBeenContacted && hasContacts) tier = 'recommended_next'
    else if (score.total >= 60 && !hasBeenContacted && !hasContacts) tier = 'needs_research'
    else if (score.total >= 40) tier = 'good_backup'
    else tier = 'needs_research'

    // Talking points
    const talking_points: string[] = []
    if (org.university_research_strength === 'high') talking_points.push('Strong university grant-writing partner')
    if (org.has_action_plan === 'yes') talking_points.push('Has existing Action Plan — implementation path possible')
    if (org.has_action_plan === 'no') talking_points.push('Good fit for Planning & Demonstration Grant')
    if (org.had_prior_ss4a_grant === 'no') talking_points.push('No prior SS4A funding — strategically attractive as new entrant')
    if (org.underserved_community_relevance === 'high') talking_points.push('Underserved community angle likely strong')
    if (org.pedestrian_safety_relevance === 'high') talking_points.push('Core pedestrian safety focus — direct WalkPhase alignment')
    if (org.target_category === 'university' || org.target_category === 'research_center') talking_points.push('Could provide academic validation for WalkPhase methodology')

    // Grant path
    let grant_path = 'Unknown'
    if (org.has_action_plan === 'yes' && org.ss4a_stage === 'has_action_plan') grant_path = 'Implementation Grant — has action plan, ready to apply'
    else if (org.has_action_plan === 'yes') grant_path = 'Implementation or Supplemental Planning'
    else if (org.ss4a_stage === 'planning_demo_candidate') grant_path = 'Planning & Demonstration Grant'
    else if (org.target_category === 'university' || org.target_category === 'research_center') grant_path = 'Research partnership — can co-apply with a city/county/MPO'
    else grant_path = 'Planning & Demonstration Grant (new entrant)'

    // Contact recommendations
    const contactRecs = rankContacts(orgContacts, org)

    return { org, score, tier, reason: score.explanation, talking_points, grant_path, contacts: contactRecs }
  }).sort((a, b) => {
    // Sort: recommended_next first, then good_backup, then needs_research. Within tier, by score
    const tierOrder = { recommended_next: 0, good_backup: 1, needs_research: 2 }
    const tierDiff = tierOrder[a.tier] - tierOrder[b.tier]
    return tierDiff !== 0 ? tierDiff : b.score.total - a.score.total
  })
}

function rankContacts(contacts: Contact[], org: Organization): ContactRecommendation[] {
  const seniorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
  const typeOrder: Record<string, number> = {
    director: 0, professor: 1, program_manager: 2, researcher: 3,
    planner: 4, engineer: 5, business_development: 6, admin: 7, other: 8,
  }

  return contacts
    .sort((a, b) => {
      const senDiff = (seniorityOrder[a.seniority] ?? 2) - (seniorityOrder[b.seniority] ?? 2)
      if (senDiff !== 0) return senDiff
      return (typeOrder[a.contact_type] ?? 8) - (typeOrder[b.contact_type] ?? 8)
    })
    .map((contact, i) => {
      const isDecisionMaker = contact.seniority === 'high' || contact.contact_type === 'director' || contact.contact_type === 'program_manager'
      let reason = ''
      if (contact.contact_type === 'director') reason = 'Center/program director — likely decision-maker'
      else if (contact.contact_type === 'professor') reason = 'Academic lead — can drive research collaboration'
      else if (contact.contact_type === 'program_manager') reason = 'Program manager — operational decision-maker'
      else if (contact.contact_type === 'researcher') reason = 'Researcher — potential collaborator or internal champion'
      else if (contact.contact_type === 'planner') reason = 'Planner — can integrate WalkPhase into safety planning'
      else if (contact.contact_type === 'engineer') reason = 'Engineer — technical evaluator for signal timing'
      else reason = 'Contact — may be connector to decision-makers'

      // Suggest template based on org type
      let suggested_template_id = 'tmpl-uni-initial'
      if (org.target_category === 'city' || org.target_category === 'county') suggested_template_id = 'tmpl-city-initial'
      else if (org.target_category === 'mpo') suggested_template_id = 'tmpl-mpo-initial'

      return { contact, rank: i + 1, reason, is_decision_maker: isDecisionMaker, suggested_template_id }
    })
}

// ─── Auto-suggest next steps based on outcome ───
export function suggestNextStep(outcomeType: string, daysSinceContact: number): string {
  switch (outcomeType) {
    case 'sent': return daysSinceContact >= 7 ? 'Send follow-up email (7+ days, no response)' : `Wait ${7 - daysSinceContact} more days before follow-up`
    case 'no_response': return 'Send follow-up using follow-up template'
    case 'replied': return 'Review response and schedule meeting or send additional info'
    case 'meeting_booked': return 'Prepare meeting brief — review org summary, talking points, and objective'
    case 'not_a_fit': return 'Deprioritize and focus on other targets'
    case 'referred': return 'Create new contact for referral and send intro email'
    case 'follow_up_due': return 'Send follow-up email today'
    default: return 'Review and determine next action'
  }
}
