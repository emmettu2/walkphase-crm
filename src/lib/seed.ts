import { Organization, Contact, OutreachActivity, EmailTemplate, OutreachWave, PlaybookTask } from './types'

// ─── Smart Target Organizations (seeded from research) ───
export const SEED_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-berkeley', organization_name: 'UC Berkeley SafeTREC',
    target_category: 'research_center', organization_type_detail: 'Safe Transportation Research & Education Center',
    website: 'https://safetrec.berkeley.edu', location_city: 'Berkeley', location_state: 'CA', region: 'West Coast',
    notes: 'SafeTREC is one of the premier pedestrian safety research centers in the US. Focus on equity, Vision Zero, and data-driven safety analysis. General email: safetrec@berkeley.edu.',
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
  {
    id: 'org-arlington', organization_name: 'Arlington County',
    target_category: 'county', organization_type_detail: 'County Government — Transportation Division',
    website: 'https://www.arlingtonva.us', location_city: 'Arlington', location_state: 'VA', region: 'Mid-Atlantic',
    notes: 'Arlington County is actively updating their Vision Zero Action Plan — expected to adopt in fall 2026. Matthew Holden (Traffic Analyst) responded positively to WalkPhase outreach via LinkedIn.',
    had_prior_ss4a_grant: 'unknown', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'WARM LEAD. Matthew Holden replied April 7 — will pass to colleagues and said WalkPhase could be of interest once new Vision Zero Action Plan is adopted (fall 2026). Follow up after plan adoption. Could be strong SS4A Implementation Grant candidate for future rounds.',
    source: 'LinkedIn outreach', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
]

// ─── Verified Research Contacts ───
export const SEED_CONTACTS: Contact[] = [
  // UC Berkeley SafeTREC
  {
    id: 'con-griswold', first_name: 'Julia', last_name: 'Griswold', full_name: 'Dr. Julia Griswold',
    title: 'Director, SafeTREC', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-berkeley',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-03-30', next_action_date: '2026-04-07',
    notes: 'New SafeTREC director. Previously Acting Co-Director and Safety Research Lead. Key decision-maker for research partnerships. EMAILED Mon March 30 — no reply yet (5 days). Follow up Mon April 7 if still no reply.',
    source: 'SafeTREC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  {
    id: 'con-oum', first_name: 'SangHyouk', last_name: 'Oum', full_name: 'SangHyouk Oum',
    title: 'Associate Director, SafeTREC', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-berkeley',
    contact_type: 'director', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-04',
    notes: 'Co-leads SafeTREC. Secondary contact after Dr. Griswold.',
    source: 'SafeTREC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  {
    id: 'con-peterson', first_name: 'Lisa', last_name: 'Peterson', full_name: 'Lisa Peterson',
    title: 'Former Communications & Outreach Lead, SafeTREC', email: 'lisapeterson@berkeley.edu', phone: '',
    linkedin_url: '', organization_id: 'org-berkeley',
    contact_type: 'admin', seniority: 'low', relationship_status: 'deprioritized',
    last_contact_date: '2026-04-05', next_action_date: '',
    notes: 'RETIRED from UC Berkeley March 1, 2026. Auto-reply received April 5. Use safetrec@berkeley.edu for general SafeTREC inquiries instead.',
    source: 'SafeTREC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // Georgia Tech
  {
    id: 'con-watkins', first_name: 'Kari', last_name: 'Watkins', full_name: 'Dr. Kari Watkins',
    title: 'Associate Professor, Civil & Environmental Engineering', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-gatech',
    contact_type: 'professor', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-05',
    notes: 'Published on pedestrian & bicycle safety and signal timing. Frederick Law Olmsted Assoc. Professor. CUTC 2017 New Faculty Award winner. Research on how technology can encourage active transportation.',
    source: 'Georgia Tech faculty page', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  {
    id: 'con-kerssens', first_name: 'Chantal', last_name: 'Kerssens', full_name: 'Dr. Chantal Kerssens',
    title: 'Executive Director, Center for Inclusive Design & Innovation (CIDI)', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-gatech',
    contact_type: 'director', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-05',
    notes: 'Leads CIDI — inclusive design for all ages and abilities. Accessibility angle for WalkPhase: signal timing fails people with mobility impairments.',
    source: 'CIDI website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // MIT AgeLab
  {
    id: 'con-coughlin', first_name: 'Joseph', last_name: 'Coughlin', full_name: 'Dr. Joseph Coughlin',
    title: 'Founder & Director, MIT AgeLab', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-mit',
    contact_type: 'director', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-07',
    notes: 'Founded AgeLab in 1999. Core focus on aging, mobility, and transportation infrastructure for older adults. WalkPhase data directly validates his thesis that infrastructure fails aging pedestrians.',
    source: 'MIT AgeLab website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  {
    id: 'con-reimer', first_name: 'Bryan', last_name: 'Reimer', full_name: 'Bryan Reimer',
    title: 'Co-Director, Advanced Vehicle Technology Consortium', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-mit',
    contact_type: 'researcher', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-07',
    notes: 'Named to USDOT innovation committee (2024). Mobility futurist. Secondary contact — may be connector to AgeLab pedestrian research.',
    source: 'MIT News', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // Portland State TREC
  {
    id: 'con-dill', first_name: 'Jennifer', last_name: 'Dill', full_name: 'Dr. Jennifer Dill',
    title: 'Director, TREC; Professor, Urban Studies & Planning', email: 'jdill@pdx.edu', phone: '503-725-5173',
    linkedin_url: '', organization_id: 'org-portland',
    contact_type: 'professor', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-08',
    notes: 'Internationally known active transportation scholar. Editor-in-Chief of Transportation Research Record. 2020 APBP Research Professional of the Year. Direct email confirmed: jdill@pdx.edu.',
    source: 'TREC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // Texas A&M TTI
  {
    id: 'con-sunkari', first_name: 'Srinivasa', last_name: 'Sunkari', full_name: 'Srinivasa Sunkari',
    title: 'Research Engineer', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-tti',
    contact_type: 'engineer', seniority: 'medium', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-08',
    notes: 'Works on pedestrian safety at signalized intersections. Smart Intersection project — automated and connected vehicle test bed for transit, bicycle, and pedestrian safety.',
    source: 'TTI website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // UNC HSRC
  {
    id: 'con-sandt', first_name: 'Laura', last_name: 'Sandt', full_name: 'Dr. Laura Sandt',
    title: 'Co-Director, HSRC; Director, Pedestrian & Bicycle Info Center', email: 'sandt@hsrc.unc.edu', phone: '',
    linkedin_url: '', organization_id: 'org-unc',
    contact_type: 'director', seniority: 'high', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-08',
    notes: 'Leads the national Pedestrian and Bicycle Information Center (PBIC). Co-directs HSRC. Direct email confirmed: sandt@hsrc.unc.edu. Key contact for pedestrian safety research credibility.',
    source: 'HSRC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  {
    id: 'con-pullenseufert', first_name: 'Nancy', last_name: 'Pullen-Seufert', full_name: 'Nancy Pullen-Seufert',
    title: 'Senior Research Associate; Director, National Center for Safe Routes to School', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-unc',
    contact_type: 'researcher', seniority: 'medium', relationship_status: 'not_contacted',
    last_contact_date: '', next_action_date: '2026-04-09',
    notes: 'Pedestrian and bicycle safety specialist. Secondary contact after Dr. Sandt.',
    source: 'HSRC website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-04T10:00:00Z',
  },
  // Arlington County
  {
    id: 'con-holden', first_name: 'Matthew', last_name: 'Holden', full_name: 'Matthew Holden',
    title: 'Traffic Analyst', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-arlington',
    contact_type: 'engineer', seniority: 'medium', relationship_status: 'replied',
    last_contact_date: '2026-04-07', next_action_date: '2026-10-01',
    notes: 'Replied via LinkedIn April 7: "This sounds really interesting. I\'ll pass this along to some of my colleagues." Arlington is updating their Vision Zero Action Plan — adopting in fall 2026. WalkPhase could be of interest after adoption. Follow up in fall.',
    source: 'LinkedIn', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
]

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

// ─── Playbook Tasks ───
// KEY DEADLINES:
// - April 24, 2026: Implementation Grant pre-application review (optional, Implementation only)
// - May 26, 2026: Full application deadline (both Planning & Demo AND Implementation)
export const SEED_PLAYBOOK: PlaybookTask[] = [
  // TODAY: Berkeley SafeTREC
  { id: 'task-001', day_date: '2026-04-04', organization_id: 'org-berkeley', contact_id: 'con-griswold', status: 'completed', priority: 1,
    suggested_action: 'Email Dr. Julia Griswold (SafeTREC Director). Reference SafeTREC pedestrian research and propose WalkPhase as a data source for signal timing validation.',
    notes: 'DONE — emailed Mon March 30. No reply after 5 days. Follow up Mon April 7.', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-002', day_date: '2026-04-04', organization_id: 'org-berkeley', contact_id: 'con-oum', status: 'pending', priority: 2,
    suggested_action: 'Email SangHyouk Oum (SafeTREC Associate Director). Second senior contact at SafeTREC — increases chance of a reply.',
    notes: 'Associate Director. Secondary outreach alongside Dr. Griswold.', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  // Apr 5: Georgia Tech
  { id: 'task-004', day_date: '2026-04-05', organization_id: 'org-gatech', contact_id: 'con-watkins', status: 'pending', priority: 1,
    suggested_action: 'Email Dr. Kari Watkins. Reference her published work on pedestrian & bicycle safety and signal timing. Propose WalkPhase data partnership.',
    notes: 'Olmsted Assoc. Professor. Published on signal timing adjustments for pedestrian safety.', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-005', day_date: '2026-04-05', organization_id: 'org-gatech', contact_id: 'con-kerssens', status: 'pending', priority: 2,
    suggested_action: 'Email Dr. Chantal Kerssens (CIDI Executive Director). Frame WalkPhase as accessibility tool — signal timing fails people with mobility impairments.',
    notes: 'CIDI angle: inclusive design. Signals assume 1.0 m/s but many disabled pedestrians walk slower.', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  // Apr 7: MIT AgeLab
  { id: 'task-006', day_date: '2026-04-07', organization_id: 'org-mit', contact_id: 'con-coughlin', status: 'pending', priority: 1,
    suggested_action: 'Email Dr. Joseph Coughlin (MIT AgeLab Director). WalkPhase data proves his thesis: infrastructure fails aging pedestrians. Walking speed decline with age = core WalkPhase finding.',
    notes: 'AgeLab founded 1999 within MIT Center for Transportation. AGNES suit simulates aging — WalkPhase provides real-world data.', template_id: 'tmpl-uni-initial', wave_id: 'wave-1' },
  { id: 'task-007', day_date: '2026-04-07', organization_id: 'org-mit', contact_id: 'con-reimer', status: 'pending', priority: 2,
    suggested_action: 'Email Bryan Reimer (AgeLab, USDOT innovation committee). Secondary contact — may connect to pedestrian mobility research within AgeLab.',
    notes: 'Named to USDOT innovation committee 2024. Connector.', template_id: 'tmpl-quick-intro', wave_id: 'wave-1' },
  // Apr 8: Wave 2 — Portland, TTI, UNC
  { id: 'task-008', day_date: '2026-04-08', organization_id: 'org-portland', contact_id: 'con-dill', status: 'pending', priority: 1,
    suggested_action: 'Email Dr. Jennifer Dill (TREC Director) at jdill@pdx.edu. Leading active transport researcher. Editor-in-Chief of Transportation Research Record.',
    notes: 'Confirmed email: jdill@pdx.edu. Phone: 503-725-5173. APBP 2020 Research Professional of the Year.', template_id: 'tmpl-uni-initial', wave_id: 'wave-2' },
  { id: 'task-009', day_date: '2026-04-08', organization_id: 'org-unc', contact_id: 'con-sandt', status: 'pending', priority: 2,
    suggested_action: 'Email Dr. Laura Sandt (HSRC Co-Director, PBIC Director) at sandt@hsrc.unc.edu. PBIC is THE national pedestrian info center — huge credibility if they engage.',
    notes: 'Confirmed email: sandt@hsrc.unc.edu. Leads Pedestrian & Bicycle Information Center.', template_id: 'tmpl-uni-initial', wave_id: 'wave-2' },
  { id: 'task-010', day_date: '2026-04-08', organization_id: 'org-tti', contact_id: 'con-sunkari', status: 'pending', priority: 3,
    suggested_action: 'Email Srinivasa Sunkari (TTI Research Engineer). Works on pedestrian safety at signalized intersections. Smart Intersection project is directly complementary.',
    notes: 'TTI Smart Intersection project — automated tech for pedestrian safety at signals.', template_id: 'tmpl-uni-initial', wave_id: 'wave-2' },
  // Apr 9: UT Austin + follow-ups
  { id: 'task-011', day_date: '2026-04-09', organization_id: 'org-utaustin', status: 'pending', priority: 1,
    suggested_action: 'Research UT Austin CTR pedestrian safety faculty (check ctr.utexas.edu/people). Add contacts. Austin is a Vision Zero city with high pedestrian fatality rate.',
    notes: 'CTR contact page: ctr.utexas.edu/contact. Faculty: ctr.utexas.edu/education/prospective-students/academic-programs/transportation-faculty/', wave_id: 'wave-1' },
  { id: 'task-012', day_date: '2026-04-09', organization_id: 'org-berkeley', status: 'pending', priority: 2,
    suggested_action: 'Follow up on Berkeley outreach if no response (5 days since initial email).',
    notes: 'Use follow-up template if no response.', template_id: 'tmpl-followup', wave_id: 'wave-1' },
  // Apr 14-18: CRITICAL WEEK — help agencies before April 24 pre-application deadline
  { id: 'task-013', day_date: '2026-04-14', organization_id: 'org-berkeley', status: 'pending', priority: 1,
    suggested_action: 'DEADLINE AWARENESS: SS4A FY26 Implementation Grant pre-apps due April 24 (optional review). Full applications due May 26 for both Planning & Implementation. Review all outreach responses — any positive replies → offer WalkPhase data for their applications.',
    notes: '~$688M Implementation + ~$306M Planning & Demo available. May 26 is the real deadline for all applicants.', wave_id: 'wave-1' },
]
