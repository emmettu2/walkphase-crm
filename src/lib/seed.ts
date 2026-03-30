import { Organization, Contact, OutreachActivity, EmailTemplate, OutreachWave, PlaybookTask } from './types'

// ─── Smart Target Organizations (seeded from research) ───
export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-berkeley', organization_name: 'UC Berkeley SafeTREC',
    target_category: 'research_center', organization_type_detail: 'Safe Transportation Research & Education Center',
    website: 'https://safetrec.berkeley.edu', location_city: 'Berkeley', location_state: 'CA', region: 'West Coast',
    notes: 'SafeTREC is one of the premier pedestrian safety research centers in the US. Focus on equity, Vision Zero, and data-driven safety analysis.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Top priority. SafeTREC\'s pedestrian focus and grant-writing expertise make them an ideal research partner. Their equity lens aligns perfectly with SS4A goals. WalkPhase data could power their pedestrian signal timing research.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-gatech', organization_name: 'Georgia Institute of Technology',
    target_category: 'university', organization_type_detail: 'School of Civil & Environmental Engineering + CIDI',
    website: 'https://ce.gatech.edu', location_city: 'Atlanta', location_state: 'GA', region: 'Southeast',
    notes: 'Strong transportation engineering program. Center for Inclusive Design and Innovation (CIDI) focuses on accessibility. Research on adaptive signal control and pedestrian detection.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Day 2 target. Georgia Tech CIDI + transportation engineering = accessibility angle for WalkPhase. Could validate that signal timing fails elderly and disabled pedestrians. Potential co-PI for research grant.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-utaustin', organization_name: 'University of Texas at Austin — CTR',
    target_category: 'university', organization_type_detail: 'Center for Transportation Research',
    website: 'https://ctr.utexas.edu', location_city: 'Austin', location_state: 'TX', region: 'South Central',
    notes: 'CTR is a major transportation research center. Austin is a Vision Zero city with significant pedestrian safety challenges.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Day 3 target. Strong research center in a city with serious pedestrian safety problems. Austin\'s Vision Zero commitment creates natural alignment.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-mit', organization_name: 'MIT AgeLab',
    target_category: 'research_center', organization_type_detail: 'Aging & Mobility Research Lab',
    website: 'https://agelab.mit.edu', location_city: 'Cambridge', location_state: 'MA', region: 'Northeast',
    notes: 'AgeLab studies how older adults interact with transportation infrastructure. Walking speed decline with age is a core research area.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Day 3 target. AgeLab\'s aging/mobility focus is the perfect validation partner for WalkPhase\'s core thesis: signals assume 1.0 m/s but many people walk slower.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-trinity', organization_name: 'Trinity College Dublin — TRIL',
    target_category: 'university', organization_type_detail: 'Technology Research for Independent Living',
    website: 'https://www.tcd.ie', location_city: 'Dublin', location_state: '', region: 'Ireland',
    notes: 'TRIL Centre researches aging-in-place and mobility. Trinity has strong connections to Irish and EU research funding. Could be a European validation partner.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'medium', university_research_strength: 'high', grant_partner_fit: 'medium',
    strategic_notes: 'European angle. Trinity is local to Emmett in Dublin. Could support EU research funding applications and provide European validation.',
    source: 'Local knowledge', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-ucd', organization_name: 'UCD Urban Institute',
    target_category: 'research_center', organization_type_detail: 'Urban Planning & Built Environment Research',
    website: 'https://www.ucd.ie/urbaninstitute', location_city: 'Dublin', location_state: '', region: 'Ireland',
    notes: 'UCD Urban Institute focuses on urban planning, transport, and smart cities. Active in Irish and EU transport research funding.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'medium', university_research_strength: 'high', grant_partner_fit: 'medium',
    strategic_notes: 'Secondary European target. Complementary to Trinity — urban planning angle rather than aging/mobility.',
    source: 'Local knowledge', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-portland', organization_name: 'Portland State University — TREC',
    target_category: 'university', organization_type_detail: 'Transportation Research & Education Center',
    website: 'https://trec.pdx.edu', location_city: 'Portland', location_state: 'OR', region: 'Pacific Northwest',
    notes: 'TREC is one of the top transportation research centers. Strong pedestrian safety research including signal timing studies.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'TREC researchers have published on pedestrian signal timing. Natural fit for WalkPhase validation study. Portland is a Vision Zero city.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-tti', organization_name: 'Texas A&M Transportation Institute',
    target_category: 'research_center', organization_type_detail: 'University Transportation Research Center',
    website: 'https://tti.tamu.edu', location_city: 'College Station', location_state: 'TX', region: 'South Central',
    notes: 'TTI is one of the largest university-based transportation research agencies. Extensive pedestrian and signal timing research.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'TTI could be an incredible research partner. Their signal timing expertise is directly complementary to WalkPhase.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'org-unc', organization_name: 'UNC Highway Safety Research Center',
    target_category: 'research_center', organization_type_detail: 'Pedestrian & Bicycle Safety Research',
    website: 'https://www.hsrc.unc.edu', location_city: 'Chapel Hill', location_state: 'NC', region: 'Southeast',
    notes: 'HSRC is a national leader in pedestrian and bicycle safety research. Runs the Pedestrian and Bicycle Information Center (PBIC).',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'PBIC connection valuable for credibility. Could partner on research validation of WalkPhase methodology.',
    source: 'Research', created_at: '2026-03-28T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
]

// ─── No seeded contacts — user will add them via form ───
export const SEED_CONTACTS: Contact[] = []

// ─── No seeded activities — start from zero ───
export const SEED_ACTIVITIES: OutreachActivity[] = []

// ─── Email Templates ───
export const SEED_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tmpl-uni-initial',
    name: 'University / Research Center — Initial Outreach',
    category: 'university_initial',
    subject: 'Pedestrian signal timing research — WalkPhase partnership',
    body: `Dear {{first_name}},

I'm reaching out because {{organization_name}}'s work on {{target_reason}} is closely aligned with something we've been building.

WalkPhase is a pedestrian signal timing intelligence platform that measures real walking speeds at signalized intersections. Our core finding is that many crossings assume a 1.0 m/s walking speed, but a significant portion of pedestrians — especially older adults, people with mobility impairments, and parents with children — walk considerably slower.

This creates a measurable safety gap that we believe is relevant to SS4A (Safe Streets for All) grant applications and pedestrian safety research.

I'd love to explore whether there's a potential research collaboration or pilot opportunity with your team. We can provide:

• Real-world walking speed data at signalized intersections
• Clearance analysis showing where walk phases are insufficient
• Data that could strengthen SS4A Planning & Demonstration or Implementation grant applications

Would you be open to a brief call this week or next to discuss?

Best regards,
Emmett Murphy
WalkPhase — walkphase.com`,
    use_case: 'First contact with a university transportation lab, accessibility center, or research institute',
    variables: ['first_name', 'organization_name', 'target_reason'],
    created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'tmpl-city-initial',
    name: 'City / County — Initial Outreach',
    category: 'city_initial',
    subject: 'Pedestrian signal timing data for {{city}} — SS4A support',
    body: `Dear {{first_name}},

I'm reaching out regarding {{organization_name}}'s pedestrian safety work{{target_reason}}.

WalkPhase is a pedestrian signal timing intelligence tool that measures real walking speeds at signalized crossings. We've found that many intersections assume pedestrians walk at 1.0 m/s — but real-world data shows many people walk significantly slower, particularly older adults and people with disabilities.

This means walk phases at some crossings may not provide enough time for vulnerable pedestrians to cross safely.

WalkPhase can help {{organization_name}} by:

• Identifying intersections where signal timing may be inadequate
• Providing data to support SS4A grant applications
• Strengthening the case for Implementation or Planning & Demonstration funding

Would you be open to a short conversation about how this might fit into your current safety planning?

Best,
Emmett Murphy
WalkPhase — walkphase.com`,
    use_case: 'First contact with a city, county, or local government transportation/safety official',
    variables: ['first_name', 'organization_name', 'city', 'target_reason'],
    created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'tmpl-mpo-initial',
    name: 'MPO / Regional Agency — Initial Outreach',
    category: 'mpo_initial',
    subject: 'Regional pedestrian safety intelligence — WalkPhase for {{organization_name}}',
    body: `Dear {{first_name}},

I'm writing about a regional pedestrian safety opportunity that I think may be relevant to {{organization_name}}'s work.

WalkPhase is a pedestrian signal timing platform that measures real walking speeds at signalized intersections across a region. We help organizations identify where signal timing may not provide enough crossing time for slower pedestrians.

For a regional agency like {{organization_name}}, this data could:

• Support SS4A Planning & Demonstration or Implementation applications
• Identify priority intersections across your member jurisdictions
• Provide equity-focused evidence for underserved communities

I'd welcome the chance to discuss whether a regional pilot might be valuable. Would you have 15 minutes for a call?

Best,
Emmett Murphy
WalkPhase — walkphase.com`,
    use_case: 'First contact with an MPO or regional transportation planning agency',
    variables: ['first_name', 'organization_name'],
    created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'tmpl-followup',
    name: 'Follow-up (5–7 days, no response)',
    category: 'follow_up',
    subject: 'Re: {{original_subject}}',
    body: `Hi {{first_name}},

Just following up on my note from last week about WalkPhase and pedestrian signal timing data.

I understand you're busy — happy to work around your schedule. Even a 10-minute call would be helpful to see if there's alignment.

If the timing isn't right, no worries at all. I can also share a brief one-pager if that's easier to review.

Best,
Emmett`,
    use_case: 'Follow-up after 5-7 days of no response to initial email',
    variables: ['first_name', 'original_subject'],
    created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'tmpl-quick-intro',
    name: 'Quick Intro (Short with Website Link)',
    category: 'quick_intro',
    subject: 'Quick intro — pedestrian signal timing intelligence',
    body: `Hi {{first_name}},

Quick note — I've been building WalkPhase, a tool that measures real pedestrian walking speeds at signalized intersections and identifies where signal timing may be unsafe.

Thought it might be relevant to {{organization_name}}'s work. More at walkphase.com.

Happy to chat if it resonates.

Emmett Murphy`,
    use_case: 'Shorter, lighter-touch intro for LinkedIn connections or secondary contacts',
    variables: ['first_name', 'organization_name'],
    created_at: '2026-03-30T10:00:00Z', updated_at: '2026-03-30T10:00:00Z',
  },
]

// ─── Outreach Waves ───
export const SEED_WAVES: OutreachWave[] = [
  {
    id: 'wave-1', name: 'Wave 1 — Top University Partners',
    description: 'Reach out to premier research centers with the strongest pedestrian safety and grant-writing capabilities.',
    status: 'active', order: 1,
    messaging_angle: 'Research partnership — WalkPhase data for pedestrian signal timing validation',
    objective: 'Secure 2-3 research conversations with top-tier university partners',
    organization_ids: ['org-berkeley', 'org-gatech', 'org-utaustin', 'org-mit'],
    created_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'wave-2', name: 'Wave 2 — Secondary Universities + Signal Timing Labs',
    description: 'Expand to additional strong research partners and specialized signal timing research centers.',
    status: 'upcoming', order: 2,
    messaging_angle: 'Specialized research collaboration — signal timing and pedestrian safety focus',
    objective: 'Build research network breadth with 3-4 additional institutional conversations',
    organization_ids: ['org-portland', 'org-tti', 'org-unc'],
    created_at: '2026-03-30T10:00:00Z',
  },
  {
    id: 'wave-3', name: 'Wave 3 — European / International Partners',
    description: 'Explore European research partnerships for international validation and EU funding opportunities.',
    status: 'upcoming', order: 3,
    messaging_angle: 'International research validation — aging, mobility, and urban design',
    objective: 'Establish European research presence with 1-2 conversations',
    organization_ids: ['org-trinity', 'org-ucd'],
    created_at: '2026-03-30T10:00:00Z',
  },
]

// ─── Playbook Tasks (seeded day plan) ───
export const SEED_PLAYBOOK: PlaybookTask[] = [
  // Day 1: Berkeley
  { id: 'task-001', day_date: '2026-03-30', organization_id: 'org-berkeley', status: 'pending', priority: 1,
    suggested_action: 'Research SafeTREC team, identify director and key pedestrian researchers. Prepare personalized email referencing their published work.',
    notes: 'Check safetrec.berkeley.edu/people for team directory', wave_id: 'wave-1' },
  { id: 'task-002', day_date: '2026-03-30', organization_id: 'org-berkeley', status: 'pending', priority: 2,
    suggested_action: 'Send initial outreach email to SafeTREC director using University template. Personalize with reference to their pedestrian safety publications.',
    notes: 'Use tmpl-uni-initial', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-003', day_date: '2026-03-30', organization_id: 'org-berkeley', status: 'pending', priority: 3,
    suggested_action: 'Send secondary outreach to a SafeTREC researcher who has published on crossing behavior or signal timing.',
    notes: 'Look for recent publications on pedestrian crossing speeds', wave_id: 'wave-1' },
  // Day 2: Georgia Tech
  { id: 'task-004', day_date: '2026-03-31', organization_id: 'org-gatech', status: 'pending', priority: 1,
    suggested_action: 'Research Georgia Tech CIDI (Center for Inclusive Design and Innovation) and transportation engineering faculty. Identify accessibility-focused researchers.',
    notes: 'CIDI angle: signal timing accessibility for people with disabilities', wave_id: 'wave-1' },
  { id: 'task-005', day_date: '2026-03-31', organization_id: 'org-gatech', status: 'pending', priority: 2,
    suggested_action: 'Send initial outreach to Georgia Tech transportation/accessibility researcher using University template. Emphasize accessibility angle.',
    notes: 'Use tmpl-uni-initial, customize for accessibility focus', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-006', day_date: '2026-03-31', organization_id: 'org-gatech', status: 'pending', priority: 3,
    suggested_action: 'Follow up on Berkeley outreach from yesterday if no response. Check sent emails.',
    notes: 'Only follow up if truly no response — be patient', wave_id: 'wave-1' },
  // Day 3: UT Austin + MIT
  { id: 'task-007', day_date: '2026-04-01', organization_id: 'org-utaustin', status: 'pending', priority: 1,
    suggested_action: 'Research UT Austin CTR team. Austin is a Vision Zero city — find researchers working on pedestrian safety and signal timing.',
    notes: 'Austin context: high pedestrian fatality rate, active Vision Zero program', wave_id: 'wave-1' },
  { id: 'task-008', day_date: '2026-04-01', organization_id: 'org-utaustin', status: 'pending', priority: 2,
    suggested_action: 'Send initial outreach to UT Austin CTR researcher.',
    notes: '', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-009', day_date: '2026-04-01', organization_id: 'org-mit', status: 'pending', priority: 3,
    suggested_action: 'Research MIT AgeLab team. Identify aging/mobility researchers. Send initial outreach emphasizing walking speed decline with age.',
    notes: 'AgeLab angle: WalkPhase data shows real-world walking speeds that validate their aging research', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
]
