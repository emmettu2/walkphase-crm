import { Organization, Contact, ScoringWeights, ScoreBreakdown, DEFAULT_WEIGHTS } from './types'

export function computeScore(
  org: Organization,
  contacts: Contact[],
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScoreBreakdown {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)
  const factors: ScoreBreakdown['factors'] = []

  // 1. Organization type fit
  const typeFitMap: Record<string, number> = {
    university: 1.0, research_center: 1.0, city: 0.95, county: 0.9, mpo: 0.85, signal_company: 0.6, other: 0.3,
  }
  const typeFitRaw = (typeFitMap[org.target_category] ?? 0.3) * weights.organization_type_fit
  factors.push({
    label: 'Organization Type Fit',
    score: Math.round(typeFitRaw * 10) / 10,
    maxScore: weights.organization_type_fit,
    reason: org.target_category === 'university' || org.target_category === 'research_center'
      ? 'Strong research partner potential'
      : org.target_category === 'city' || org.target_category === 'county' || org.target_category === 'mpo'
        ? 'Direct SS4A applicant'
        : 'Lower direct grant alignment',
  })

  // 2. Prior SS4A grant (no prior = higher for new entrant potential)
  const priorGrantScore = org.had_prior_ss4a_grant === 'no' ? 1.0
    : org.had_prior_ss4a_grant === 'unknown' ? 0.6
    : 0.4
  const priorGrantRaw = priorGrantScore * weights.prior_ss4a_grant
  factors.push({
    label: 'New Entrant Potential',
    score: Math.round(priorGrantRaw * 10) / 10,
    maxScore: weights.prior_ss4a_grant,
    reason: org.had_prior_ss4a_grant === 'no'
      ? 'No prior SS4A funding — strong new entrant candidate'
      : org.had_prior_ss4a_grant === 'yes'
        ? 'Prior grantee — may have existing tools'
        : 'Grant history unknown',
  })

  // 3. Action plan
  const actionPlanScore = org.has_action_plan === 'yes' ? 1.0
    : org.has_action_plan === 'unknown' ? 0.4
    : 0.2
  const actionPlanRaw = actionPlanScore * weights.has_action_plan
  factors.push({
    label: 'Action Plan Status',
    score: Math.round(actionPlanRaw * 10) / 10,
    maxScore: weights.has_action_plan,
    reason: org.has_action_plan === 'yes'
      ? 'Has action plan — fast path to implementation'
      : org.has_action_plan === 'no'
        ? 'No action plan — planning/demo opportunity'
        : 'Action plan status unknown',
  })

  // 4. Pedestrian safety relevance
  const pedSafetyMap: Record<string, number> = { high: 1.0, medium: 0.6, low: 0.2 }
  const pedSafetyRaw = (pedSafetyMap[org.pedestrian_safety_relevance] ?? 0.2) * weights.pedestrian_safety_relevance
  factors.push({
    label: 'Pedestrian Safety Focus',
    score: Math.round(pedSafetyRaw * 10) / 10,
    maxScore: weights.pedestrian_safety_relevance,
    reason: org.pedestrian_safety_relevance === 'high'
      ? 'Strong pedestrian safety focus — ideal WalkPhase fit'
      : 'Moderate or low pedestrian safety priority',
  })

  // 5. Underserved community relevance
  const underservedMap: Record<string, number> = { high: 1.0, medium: 0.6, low: 0.3, unknown: 0.4 }
  const underservedRaw = (underservedMap[org.underserved_community_relevance] ?? 0.4) * weights.underserved_community_relevance
  factors.push({
    label: 'Underserved Community Relevance',
    score: Math.round(underservedRaw * 10) / 10,
    maxScore: weights.underserved_community_relevance,
    reason: org.underserved_community_relevance === 'high'
      ? 'Serves underserved communities — aligns with SS4A equity goals'
      : 'Lower or unknown equity alignment',
  })

  // 6. Research / grant-writing capability
  const researchMap: Record<string, number> = { high: 1.0, medium: 0.6, low: 0.2, not_applicable: 0.0 }
  const researchRaw = (researchMap[org.university_research_strength] ?? 0) * weights.research_capability
  factors.push({
    label: 'Research Capability',
    score: Math.round(researchRaw * 10) / 10,
    maxScore: weights.research_capability,
    reason: org.university_research_strength === 'high'
      ? 'Strong research and grant-writing capacity'
      : org.university_research_strength === 'not_applicable'
        ? 'Not a research institution'
        : 'Some research capacity',
  })

  // 7. SS4A stage advancement
  const stageMap: Record<string, number> = {
    active_grantee: 0.5,
    implementation_candidate: 0.9,
    has_action_plan: 1.0,
    planning_demo_candidate: 0.8,
    likely_planning_candidate: 0.6,
    no_known_activity: 0.3,
    unknown: 0.3,
  }
  const stageRaw = (stageMap[org.ss4a_stage] ?? 0.3) * weights.ss4a_stage_advancement
  factors.push({
    label: 'SS4A Stage',
    score: Math.round(stageRaw * 10) / 10,
    maxScore: weights.ss4a_stage_advancement,
    reason: org.ss4a_stage === 'has_action_plan'
      ? 'Ready for implementation — highest value stage'
      : org.ss4a_stage === 'implementation_candidate'
        ? 'Implementation candidate — strong potential'
        : 'Earlier stage — may need more nurturing',
  })

  // 8. Strategic fit
  const fitMap: Record<string, number> = { high: 1.0, medium: 0.5, low: 0.2 }
  const fitRaw = (fitMap[org.grant_partner_fit] ?? 0.2) * weights.strategic_fit
  factors.push({
    label: 'Strategic Fit',
    score: Math.round(fitRaw * 10) / 10,
    maxScore: weights.strategic_fit,
    reason: org.grant_partner_fit === 'high'
      ? 'Excellent strategic alignment with WalkPhase'
      : 'Moderate or low strategic alignment',
  })

  // 9. Contact quality
  const orgContacts = contacts.filter(c => c.organization_id === org.id)
  const hasHighSeniority = orgContacts.some(c => c.seniority === 'high')
  const contactScore = orgContacts.length === 0 ? 0.1
    : hasHighSeniority ? 1.0
    : orgContacts.length >= 2 ? 0.7
    : 0.4
  const contactRaw = contactScore * weights.contact_quality
  factors.push({
    label: 'Contact Quality',
    score: Math.round(contactRaw * 10) / 10,
    maxScore: weights.contact_quality,
    reason: orgContacts.length === 0
      ? 'No contacts identified yet'
      : hasHighSeniority
        ? 'Has senior-level contact'
        : `Has ${orgContacts.length} contact(s)`,
  })

  const rawTotal = factors.reduce((a, f) => a + f.score, 0)
  const total = Math.round((rawTotal / totalWeight) * 100)

  const topFactors = factors
    .filter(f => f.score / f.maxScore >= 0.7)
    .map(f => f.label.toLowerCase())
    .slice(0, 3)

  const explanation = total >= 70
    ? `High-priority target — strong ${topFactors.join(', ')}`
    : total >= 45
      ? `Moderate potential — consider for ${org.has_action_plan === 'no' ? 'planning/demo' : 'implementation'} outreach`
      : `Lower priority — may need more research or nurturing`

  return { total: Math.min(total, 100), factors, explanation }
}
