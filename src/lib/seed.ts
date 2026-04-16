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
  {
    id: 'org-sonoma', organization_name: 'Sonoma County',
    target_category: 'county', organization_type_detail: 'County Government — Public Infrastructure, Active Transportation',
    website: 'https://sonomacounty.ca.gov', location_city: 'Santa Rosa', location_state: 'CA', region: 'West Coast',
    notes: 'Lorien Rochioli (Active Transportation Program Group) attended USDOT SS4A webinar April 7 and asked about funding for outreach and engagement. Indicates active SS4A interest.',
    had_prior_ss4a_grant: 'unknown', has_action_plan: 'unknown', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'Lorien asked at webinar if outreach/engagement can be funded (answer: yes). Active Transportation focus aligns with WalkPhase. California county — may be coordinating with Caltrans or local MPO on SS4A.',
    source: 'USDOT SS4A Webinar Q&A, April 7 2026', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 'org-mebane', organization_name: 'City of Mebane',
    target_category: 'city', organization_type_detail: 'City Government — Planning Department',
    website: 'https://cityofmebane.com', location_city: 'Mebane', location_state: 'NC', region: 'Southeast',
    notes: 'Small city (~20K) in Piedmont Triad region. Within Burlington-Graham MPO ($100K FY23 Planning & Demo). Mitchell Pinsky (Planner) asked at SS4A webinar about project on high-injury roadway from MPO Action Plan, also in City Bicycle & Pedestrian Plan.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'Eligible through Burlington-Graham MPO Action Plan. Mitchell is a UNC-Chapel Hill grad — connection to Dr. Laura Sandt at UNC HSRC. High-injury roadway project identified.',
    source: 'USDOT SS4A Webinar Q&A', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'org-newbraunfels', organization_name: 'City of New Braunfels',
    target_category: 'city', organization_type_detail: 'City Government — Transportation & Capital Improvements',
    website: 'https://www.nbtexas.org', location_city: 'New Braunfels', location_state: 'TX', region: 'South Central',
    notes: 'Received $700K FY24 Planning & Demo. Elizabeth Dupont (Transportation Planner) said at SS4A webinar they have implemented 85% of Action Plan projects and want to update. Also within Bexar County Action Plan area.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Very advanced — 85% of plan projects implemented. Wants supplemental funding to update plan. WalkPhase provides fresh baseline data for the updated plan. San Antonio metro area.',
    source: 'USDOT SS4A Webinar Q&A + SS4A Award Data', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'org-orem', organization_name: 'City of Orem',
    target_category: 'city', organization_type_detail: 'City Government — Strategy and Innovation Division',
    website: 'https://www.orem.org', location_city: 'Orem', location_state: 'UT', region: 'West',
    notes: 'Received $200K FY24 Planning & Demo. Also within Mountainland Association of Governments Action Plan ($1.2M FY22-24). Heather Cox (Management Analyst / former Grant Specialist) asked at SS4A webinar about using MPO Action Plan for city application.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'planning_demo_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'medium', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'Eligible through Mountainland Association of Governments Action Plan. Heather is a grant writer — speaks the language of application competitiveness. WalkPhase data = stronger application evidence.',
    source: 'USDOT SS4A Webinar Q&A + SS4A Award Data', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'org-milwaukee', organization_name: 'Milwaukee County',
    target_category: 'county', organization_type_detail: 'County Government — Transportation',
    website: 'https://county.milwaukee.gov', location_city: 'Milwaukee', location_state: 'WI', region: 'Midwest',
    notes: 'Major SS4A recipient — $41.4M across FY22-FY25 (top 10 nationally). Has both countywide Comprehensive Safety Action Plan AND individual municipal Safety Action Plans. Jeff Sponcia coordinates across county + municipalities.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'implementation_candidate', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'HOT LEAD. Jeff Sponcia asked at USDOT webinar (April 7) about bundling Implementation + Demonstration across county and municipal plans. $41.4M in prior SS4A funding = proven grant-winner. Multi-jurisdictional coordination = WalkPhase can provide county-wide crossing data across all municipalities.',
    source: 'USDOT SS4A Webinar Q&A + SS4A Award Data', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 'org-ardurra', organization_name: 'Ardurra Group',
    target_category: 'signal_company', organization_type_detail: 'Engineering & Consulting Firm — Traffic & Safety',
    website: 'https://www.ardurra.com', location_city: 'Oviedo', location_state: 'FL', region: 'Southeast',
    notes: 'Engineering/consulting firm. Christy Lofye is Central Florida Traffic and Safety Team Leader. Asked at SS4A webinar about FYA signal modifications as systemic countermeasure — directly signal-timing related. Consultant relationship = multiplier (can bring WalkPhase into multiple client applications).',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'unknown',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'CONSULTANT MULTIPLIER. Ardurra prepares SS4A applications for client cities/counties in Central Florida. Winning Christy over could mean WalkPhase data in multiple applications. Her FYA signal modifications question is the closest to WalkPhase core tech of anyone at the webinar.',
    source: 'USDOT SS4A Webinar Q&A', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 'org-sarasota', organization_name: 'Sarasota County Government',
    target_category: 'county', organization_type_detail: 'County Government — Bicycle, Pedestrian & Trails',
    website: 'https://www.scgov.net', location_city: 'Sarasota', location_state: 'FL', region: 'Southeast',
    notes: 'Safety Action Plan adopted unanimously by Board of County Commissioners on Sept 24, 2025. Developed through SS4A planning grant. Plan found: pedestrian crashes are single largest fatal crash type; 50%+ fatal crashes at night; 45-55mph roads = nearly half of fatal crashes. Plan priorities: speed management, vulnerable road users, roadway lighting, aging road users, impaired driving. Commissioners specifically asked staff to focus on aging-driver demographics. Countermeasures: enhanced crosswalk visibility, medians/refuge islands, sidewalks, access management, lighting. Paula Wiggins (Interim Sr. Transportation Manager) confirmed plan positions county for implementation grants.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'implementation_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'HOT LEAD. Patrick Lui confirmed at USDOT webinar (April 7) they are applying for Implementation Grant. Plan adopted Sept 2025 — 1,800 fatal/incapacitating crashes over 5 years. Pedestrian crashes = #1 fatal crash type. Commissioners flagged aging road users as priority. WalkPhase is perfect fit: (1) measures real walking speeds of aging/vulnerable pedestrians, (2) identifies where signal timing falls short at specific intersections, (3) provides before/after data for countermeasure evaluation. Additional contact: Paula Wiggins (Interim Sr. Transportation Manager). Consultant: Chris Keller at Benesch.',
    source: 'USDOT SS4A Webinar Q&A, April 7 2026', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  {
    id: 'org-palmbeachmpo', organization_name: 'Palm Beach Metropolitan Planning Organization',
    target_category: 'mpo', organization_type_detail: 'Metropolitan Planning Organization',
    website: 'https://palmbeachmpo.org', location_city: 'West Palm Beach', location_state: 'FL', region: 'Southeast',
    notes: '$5.1M SS4A (FY22-24) Action Plan. $14M awarded to 11 cities + county through SS4A. Vision Zero Advisory Committee active. 13 municipalities adopted Vision Zero goals. FYA pilot and demonstration grant for pedestrian crosswalk safety.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Strong regional MPO with active Vision Zero program. Brian Ruscher (Deputy Director Multimodal) REPLIED asking for demo video — sent walkphase.com/demo. Valerie Neilson (ED) also contacted. Cities within plan are eligible for implementation funding.',
    source: 'LinkedIn outreach + SS4A Award Data', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'org-deerfieldbeach', organization_name: 'City of Deerfield Beach',
    target_category: 'city', organization_type_detail: 'City Government — Planning & Zoning',
    website: 'https://www.deerfield-beach.com', location_city: 'Deerfield Beach', location_state: 'FL', region: 'Southeast',
    notes: 'Within Broward MPO Action Plan ($5.0M FY22). Broward has 5-6 ped/bike crashes per day. Laurie Harari represents city on Broward MPO Technical Advisory Committee.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'Eligible through Broward MPO Action Plan. Laurie Harari sits on MPO Technical Advisory Committee — bridge between city and regional plan.',
    source: 'LinkedIn outreach', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'org-hgac', organization_name: 'Houston-Galveston Area Council',
    target_category: 'mpo', organization_type_detail: 'Metropolitan Planning Organization',
    website: 'https://www.h-gac.com', location_city: 'Houston', location_state: 'TX', region: 'South Central',
    notes: '$4.0M SS4A (FY22) Action Plan. Eight-county MPO region. Allie Isbell is MPO Assistant Director.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Large regional MPO covering 8 counties. WalkPhase can provide consistent crossing data across member jurisdictions for implementation applications.',
    source: 'LinkedIn outreach + SS4A Award Data', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'org-austin', organization_name: 'City of Austin',
    target_category: 'city', organization_type_detail: 'City Government — Transportation & Public Works',
    website: 'https://www.austintexas.gov', location_city: 'Austin', location_state: 'TX', region: 'South Central',
    notes: '$33.6M SS4A (FY22-24) across Implementation and Planning & Demo. Vision Zero city. Cody Stone is Managing Engineer for transportation safety.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'active_grantee', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Major SS4A recipient. Cody Stone has deep signal timing and safety analysis expertise (Synchro, Vissim, etc). WalkPhase provides complementary observed pedestrian data.',
    source: 'LinkedIn outreach + SS4A Award Data', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'org-mpc-chicago', organization_name: 'Metropolitan Planning Council (Chicago)',
    target_category: 'other', organization_type_detail: 'Nonprofit — Transportation Policy & Advocacy',
    website: 'https://www.metroplanning.org', location_city: 'Chicago', location_state: 'IL', region: 'Midwest',
    notes: 'Nonprofit that influences transportation policy for Chicago region. Audrey Wennink is Senior Director. Not an applicant but a policy connector to CMAP ($3.9M Action Plan) and Chicago ($40M+ implementation).',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'CONNECTOR. Audrey Wennink influences the agencies that apply. Chicago region has $44M+ in SS4A funding. Building relationship with her could open doors to CMAP and Chicago DOT.',
    source: 'LinkedIn outreach', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  {
    id: 'org-bostonmpo', organization_name: 'Boston Region Metropolitan Planning Organization',
    target_category: 'mpo', organization_type_detail: 'Metropolitan Planning Organization',
    website: 'https://www.ctps.org', location_city: 'Boston', location_state: 'MA', region: 'Northeast',
    notes: 'Boston MPO region has $33M+ SS4A funding. Action Plan ($2.2M FY22). David Hong manages MPO activities and won $1.5M USDOT grant for capital investment prioritization.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'David Hong has MIT background and grant-winning experience. WalkPhase data as a layer for capital investment prioritization aligns directly with his recent USDOT grant work.',
    source: 'LinkedIn outreach + SS4A Award Data', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // Palm Beach sub-jurisdictions (pincer strategy)
  {
    id: 'org-jupiter', organization_name: 'Town of Jupiter',
    target_category: 'city', organization_type_detail: 'Town Government — Engineering / Traffic',
    website: 'https://www.jupiter.fl.us', location_city: 'Jupiter', location_state: 'FL', region: 'Southeast',
    notes: 'Pop ~65,000. Covered by Palm Beach MPO SS4A Action Plan — eligible for Implementation Grants independently. Has bike/ped safety initiatives and traffic calming program. Chang-Jen Lan is Traffic and Transportation Engineer (former Assistant Professor, University of Miami).',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'PINCER STRATEGY — sub-jurisdiction of Palm Beach MPO. If Jupiter contacts Brian Ruscher at MPO about WalkPhase, it validates from both directions. No own SS4A funding yet = strong new entrant candidate.',
    source: 'Palm Beach MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'org-lakeworthbeach', organization_name: 'City of Lake Worth Beach',
    target_category: 'city', organization_type_detail: 'City Government — Public Works',
    website: 'https://lakeworthbeachfl.gov', location_city: 'Lake Worth Beach', location_state: 'FL', region: 'Southeast',
    notes: 'Pop ~37,000. Covered by Palm Beach MPO SS4A Action Plan. Diverse, lower-income community within wealthy Palm Beach County — strong equity angle for SS4A. Has a Mobility Plan addressing safety, access, equity. Jamie Brown is Public Works Director.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'PINCER STRATEGY + EQUITY ANGLE. Underserved community within Palm Beach MPO jurisdiction. Strong equity narrative for SS4A. No own SS4A funding = new entrant.',
    source: 'Palm Beach MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'org-royalpalmbeach', organization_name: 'Village of Royal Palm Beach',
    target_category: 'city', organization_type_detail: 'Village Government — Public Works / Engineering',
    website: 'https://www.royalpalmbeachfl.gov', location_city: 'Royal Palm Beach', location_state: 'FL', region: 'Southeast',
    notes: 'Pop ~40,000. Covered by Palm Beach MPO SS4A Action Plan. Suburban community with pedestrian infrastructure gaps. Paul Webster P.E. is Public Works Director.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'medium', university_research_strength: 'not_applicable', grant_partner_fit: 'medium',
    strategic_notes: 'PINCER STRATEGY. Suburban community within Palm Beach MPO. No own SS4A funding = new entrant.',
    source: 'Palm Beach MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  // Broward pincer strategy
  {
    id: 'org-fortlauderdale', organization_name: 'City of Fort Lauderdale',
    target_category: 'city', organization_type_detail: 'City Government — Transportation and Mobility Department',
    website: 'https://www.fortlauderdale.gov', location_city: 'Fort Lauderdale', location_state: 'FL', region: 'Southeast',
    notes: 'Has own Vision Zero Action Plan AND covered by Broward MPO Action Plan ($5.0M FY22). Own SS4A $400K FY24 Planning & Demo. Dedicated Transportation and Mobility Department (rare for FL cities). Pedestrians = 44% of fatal crashes. Milos Majstorovic is Director (since Jul 2025).',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'BROWARD PINCER — flagship city. Has own Vision Zero plan + Broward MPO plan. Milos has PE license, background in ped/bike master planning, and grant experience ($2.4M+ at Miami Beach). High-value contact.',
    source: 'Broward MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'org-hollywood', organization_name: 'City of Hollywood',
    target_category: 'city', organization_type_detail: 'City Government — Engineering, Transportation & Mobility',
    website: 'https://www.hollywoodfl.org', location_city: 'Hollywood', location_state: 'FL', region: 'Southeast',
    notes: 'Pop 153K. Covered by Broward MPO Action Plan. Has Engineering, Transportation & Mobility division. Hollywood Beach Broadwalk is major pedestrian area. Sidewalk improvements underway in Hollywood Gardens West via Broward MPO.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'likely_planning_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'BROWARD PINCER. Large city, no own SS4A funding = new entrant. Pedestrian-heavy Broadwalk area. Eligible through Broward MPO plan.',
    source: 'Broward MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'org-pompano', organization_name: 'City of Pompano Beach',
    target_category: 'city', organization_type_detail: 'City Government — Engineering',
    website: 'https://www.pompanobeachfl.gov', location_city: 'Pompano Beach', location_state: 'FL', region: 'Southeast',
    notes: 'Pop 112K. Already has $300K SS4A Planning & Demo (FY24). Covered by Broward MPO Action Plan. Key corridors: Dixie Highway, MLK Jr Blvd, NE 1st Street. Traffic Engineering involved in Broward Regional Comprehensive Safety Action Plan.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'planning_demo_candidate', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'BROWARD PINCER. Already SS4A engaged. MLK Jr Blvd = underserved community corridor. Eligible for implementation through Broward MPO plan.',
    source: 'Broward MPO sub-jurisdiction research', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  // Recent outreach targets
  {
    id: 'org-vcu', organization_name: 'Virginia Commonwealth University',
    target_category: 'university', organization_type_detail: 'State University — Parking & Transportation Services',
    website: 'https://www.vcu.edu', location_city: 'Richmond', location_state: 'VA', region: 'Mid-Atlantic',
    notes: 'VCU has $100K SS4A Planning & Demo (FY24). City of Richmond has $12.6M. Already discovered signal timing imbalance at Main & Linden (25s for students vs 55s for vehicles) and fixed it manually. WalkPhase could do this systematically at every campus crossing.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'planning_demo_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'VCU already LIVED the WalkPhase problem — found timing imbalance at one intersection manually. WalkPhase provides systematic measurement at every crossing. Strong story for pilot.',
    source: 'VCU News, SS4A Award Data', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'org-seattle', organization_name: 'Seattle Department of Transportation',
    target_category: 'city', organization_type_detail: 'City Government — Pedestrian & Neighborhood Projects',
    website: 'https://www.seattle.gov/transportation', location_city: 'Seattle', location_state: 'WA', region: 'Pacific Northwest',
    notes: '$25.7M SS4A Implementation (FY22). Covered by Puget Sound Regional Council Action Plan ($7.7M). Has dedicated Pedestrian & Neighborhood Projects team including Safe Routes to School.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'active_grantee', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Major SS4A Implementation grantee. Ashley Rhead manages ped crossings + Safe Routes to School — 20-40 school safety projects per year. WalkPhase for school crossings is a natural fit.',
    source: 'LinkedIn, SS4A Award Data', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'org-jacksonville', organization_name: 'City of Jacksonville',
    target_category: 'city', organization_type_detail: 'City Government — Bicycle & Pedestrian',
    website: 'https://www.coj.net', location_city: 'Jacksonville', location_state: 'FL', region: 'Southeast',
    notes: '$1.3M SS4A (FY22-24) Action Plan + Planning & Demo. Matt Fall is Bicycle-Pedestrian Coordinator. Previously at NCTCOG and USDOT (worked for Secretary Foxx).',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'ss4a_action_plan',
    ss4a_stage: 'has_action_plan', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Matt Fall has rare perspective — USDOT policy + local implementation. Understands SS4A from both sides. Has own Action Plan = ready for Implementation Grant.',
    source: 'LinkedIn, SS4A Award Data', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'org-tampa', organization_name: 'City of Tampa',
    target_category: 'city', organization_type_detail: 'City Government — Mobility Department',
    website: 'https://www.tampa.gov', location_city: 'Tampa', location_state: 'FL', region: 'Southeast',
    notes: '$24.1M SS4A (FY22-25) Implementation + Planning & Demo. Vision Zero city. Catherine Hayes (now WSP) secured $200M+ in grants as former Grants Supervisor at City of Tampa.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'yes', action_plan_type: 'vision_zero',
    ss4a_stage: 'active_grantee', underserved_community_relevance: 'high',
    pedestrian_safety_relevance: 'high', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'Massive SS4A recipient. Brandon Campbell (Mobility Director) + Tarek Kamal (Transportation Engineering Manager) = two contacts. Catherine Hayes at WSP is a connector.',
    source: 'LinkedIn, SS4A Award Data', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'org-volpe', organization_name: 'USDOT Volpe National Transportation Systems Center',
    target_category: 'research_center', organization_type_detail: 'Federal Research Center — Surface Transportation Safety',
    website: 'https://www.volpe.dot.gov', location_city: 'Cambridge', location_state: 'MA', region: 'Northeast',
    notes: 'Technical arm of USDOT. Evaluates SS4A applications. Runs SS4A webinars (Liz Biskar is Volpe staff). Alexander Epstein is Senior Engineer focused on vulnerable road user safety.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'medium',
    strategic_notes: 'NOT an applicant — federal evaluator and researcher. If Epstein validates WalkPhase, it carries enormous weight. Vision Zero task force for Boston MPO and City of Somerville.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'org-uarizona', organization_name: 'University of Arizona',
    target_category: 'university', organization_type_detail: 'State University — Parking & Transportation',
    website: 'https://parking.arizona.edu', location_city: 'Tucson', location_state: 'AZ', region: 'Southwest',
    notes: '$7.5M SS4A (FY24) Planning & Demo — largest university SS4A award. Huge campus with arterial crossings. Tucson heat = slower walking speeds for everyone.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'planning_demo_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Largest university SS4A award in the country. Jim Sayre is Executive Director of Parking & Transportation. Tucson heat angle is unique — walking speeds drop in extreme heat.',
    source: 'LinkedIn, SS4A Award Data', created_at: '2026-04-16T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
  },
  {
    id: 'org-umd', organization_name: 'University of Maryland, College Park',
    target_category: 'university', organization_type_detail: 'State University — Department of Transportation Services (DOTS)',
    website: 'https://transportation.umd.edu', location_city: 'College Park', location_state: 'MD', region: 'Mid-Atlantic',
    notes: '$800K SS4A (FY24-25) Planning & Demo. US Route 1 bisects campus — multiple pedestrian fatalities over the years. One of the most dangerous campus crossings in the US.',
    had_prior_ss4a_grant: 'yes', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'planning_demo_candidate', underserved_community_relevance: 'medium',
    pedestrian_safety_relevance: 'high', university_research_strength: 'high', grant_partner_fit: 'high',
    strategic_notes: 'Route 1 pedestrian safety is a documented crisis. David Allen is Executive Director of DOTS. Speed limit already lowered, median fences installed — WalkPhase adds crossing performance data.',
    source: 'LinkedIn, SS4A Award Data, UMD News', created_at: '2026-04-16T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
  },
  {
    id: 'org-wsp', organization_name: 'WSP',
    target_category: 'signal_company', organization_type_detail: 'Engineering & Consulting Firm — Grants Development',
    website: 'https://www.wsp.com', location_city: 'Tampa', location_state: 'FL', region: 'Southeast',
    notes: 'Major engineering/consulting firm. Catherine Hayes is Grants Development consultant — previously secured $200M+ at City of Tampa. CONSULTANT MULTIPLIER like Ardurra.',
    had_prior_ss4a_grant: 'no', has_action_plan: 'no', action_plan_type: 'unknown',
    ss4a_stage: 'no_known_activity', underserved_community_relevance: 'unknown',
    pedestrian_safety_relevance: 'medium', university_research_strength: 'not_applicable', grant_partner_fit: 'high',
    strategic_notes: 'CONSULTANT MULTIPLIER. Catherine Hayes writes grants for multiple WSP clients. One relationship = WalkPhase in multiple applications. She accepted LinkedIn connection.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
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
    title: 'Former Executive Director, CIDI (no longer in role)', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-gatech',
    contact_type: 'director', seniority: 'high', relationship_status: 'deprioritized',
    last_contact_date: '', next_action_date: '',
    notes: 'NO LONGER CIDI EXECUTIVE DIRECTOR. Replaced by Bill Curtis-Davidson (Aug 2025). Do not contact for CIDI — contact Bill instead.',
    source: 'CIDI website', created_at: '2026-04-04T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
  },
  {
    id: 'con-curtisdavidson', first_name: 'Bill', last_name: 'Curtis-Davidson', full_name: 'Bill Curtis-Davidson',
    title: 'Executive Director & Principal Research Scientist, CIDI', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-gatech',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-16', next_action_date: '2026-04-23',
    notes: 'LINKEDIN sent April 16. NEW CIDI Executive Director since Aug 2025. Replaced Chantal Kerssens. 15 years at IBM Accessibility, then Magic Leap (accessibility), Cadmus Group (AI governance for federal agencies). Inclusive design mission aligns perfectly with WalkPhase accessibility angle.',
    source: 'LinkedIn', created_at: '2026-04-16T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
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
  // Milwaukee County
  {
    id: 'con-sponcia', first_name: 'Jeff', last_name: 'Sponcia', full_name: 'Jeff Sponcia',
    title: '', email: 'jeff.sponcia@milwaukeecountywi.gov', phone: '',
    linkedin_url: '', organization_id: 'org-milwaukee',
    contact_type: 'program_manager', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-07', next_action_date: '2026-04-14',
    notes: 'EMAILED April 7. From SS4A webinar Q&A — asked about bundling Implementation + Demonstration across countywide and municipal plans. Confirmed email: jeff.sponcia@milwaukeecountywi.gov.',
    source: 'USDOT SS4A Webinar', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  // Ardurra (consultant)
  {
    id: 'con-lofye', first_name: 'Christy', last_name: 'Lofye', full_name: 'Christy Lofye',
    title: 'Central Florida Traffic and Safety Team Leader', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-ardurra',
    contact_type: 'engineer', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-07', next_action_date: '2026-04-14',
    notes: 'EMAILED April 7. From SS4A webinar — asked about FYA signal modifications as systemic countermeasure and structural analysis. Directly signal-timing related. At Ardurra since Sep 2023. Consultant = multiplier opportunity.',
    source: 'USDOT SS4A Webinar, LinkedIn', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  // City of Mebane
  {
    id: 'con-pinsky', first_name: 'Mitchell', last_name: 'Pinsky', full_name: 'Mitchell Pinsky',
    title: 'Planner', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-mebane',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-08', next_action_date: '2026-04-15',
    notes: 'LINKEDIN CONNECTION REQUEST sent April 8. From SS4A webinar — high-injury roadway project in MPO Action Plan + City Bike/Ped Plan. UNC-Chapel Hill grad (connection to HSRC). Ohio State undergrad.',
    source: 'USDOT SS4A Webinar, LinkedIn', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  // City of New Braunfels
  {
    id: 'con-dupont', first_name: 'Elizabeth', last_name: 'Dupont', full_name: 'Elizabeth Dupont',
    title: 'Transportation Planner', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-newbraunfels',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-08', next_action_date: '2026-04-15',
    notes: 'LINKEDIN CONNECTION REQUEST sent April 8. From SS4A webinar — 85% of plan projects already implemented, wants to update plan with supplemental funds. Works in Transportation & Capital Improvements. Road and pedestrian safety focus.',
    source: 'USDOT SS4A Webinar, LinkedIn', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  // City of Orem
  {
    id: 'con-cox', first_name: 'Heather', last_name: 'Cox', full_name: 'Heather Cox',
    title: 'Management Analyst II / Former Grant Specialist', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-orem',
    contact_type: 'admin', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-08', next_action_date: '2026-04-15',
    notes: 'LINKEDIN CONNECTION REQUEST sent April 8. From SS4A webinar — asked about using MPO Action Plan for city application. Grant writing background. Strategy and Innovation Division.',
    source: 'USDOT SS4A Webinar, LinkedIn', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  // Sonoma County
  {
    id: 'con-rochioli', first_name: 'Lorien', last_name: 'Rochioli', full_name: 'Lorien Rochioli',
    title: 'Active Transportation Program Group', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-sonoma',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'deprioritized',
    last_contact_date: '', next_action_date: '',
    notes: 'SKIP — Sonoma County has prior business relationship with Carma. Do not contact to keep personal/work separate. Originally from SS4A webinar April 7.',
    source: 'USDOT SS4A Webinar', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
  },
  // Sarasota County
  {
    id: 'con-lui', first_name: 'Patrick', last_name: 'Lui', full_name: 'Patrick Lui',
    title: 'Bicycle, Pedestrian & Trails Coordinator', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-sarasota',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-07', next_action_date: '2026-04-14',
    notes: 'EMAILED April 7 via LinkedIn. Personalized message referencing their Action Plan findings (ped crashes = #1 fatal type, aging road users priority) and how WalkPhase fits their Implementation Grant application. Identified from USDOT SS4A webinar Q&A. Also: Paula Wiggins (Interim Sr. Transportation Manager) presented to board.',
    source: 'USDOT SS4A Webinar, LinkedIn', created_at: '2026-04-07T10:00:00Z', updated_at: '2026-04-07T10:00:00Z',
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
  // Palm Beach MPO
  {
    id: 'con-neilson', first_name: 'Valerie', last_name: 'Neilson', full_name: 'Valerie Neilson, AICP',
    title: 'Executive Director', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-palmbeachmpo',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-08', next_action_date: '2026-04-15',
    notes: 'LINKEDIN sent April 8. Executive Director of Palm Beach MPO. Top decision-maker for regional SS4A applications.',
    source: 'LinkedIn', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-08T10:00:00Z',
  },
  {
    id: 'con-ruscher', first_name: 'Brian', last_name: 'Ruscher', full_name: 'Brian Ruscher',
    title: 'Deputy Director of Multimodal', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-palmbeachmpo',
    contact_type: 'director', seniority: 'high', relationship_status: 'replied',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-14',
    notes: 'REPLIED — asked "Do you have a video you can share on the product?" Sent walkphase.com/demo on April 9. Former Ped/Bike Coordinator, previously at City of Delray Beach. Technical person behind Valerie.',
    source: 'LinkedIn', created_at: '2026-04-08T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // City of Deerfield Beach
  {
    id: 'con-harari', first_name: 'Laurie', last_name: 'Harari', full_name: 'Laurie Harari, MURP, AICP',
    title: 'Senior Planner', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-deerfieldbeach',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-16',
    notes: 'LINKEDIN sent April 9. Represents Deerfield Beach on Broward MPO Technical Advisory Committee. Bridge between city and regional plan. ML/data interest per her profile.',
    source: 'LinkedIn', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // Houston-Galveston Area Council
  {
    id: 'con-isbell', first_name: 'Allie', last_name: 'Isbell', full_name: 'Allie Isbell, AICP',
    title: 'MPO Assistant Director', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-hgac',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-16',
    notes: 'LINKEDIN message sent April 9. Sent longer message with walkphase.com/demo link. 7+ years at HGAC, oversees regional planning including freight, mobility, and resilience across 8-county MPO.',
    source: 'LinkedIn', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // City of Austin
  {
    id: 'con-stone', first_name: 'Cody', last_name: 'Stone', full_name: 'Cody Stone',
    title: 'Managing Engineer', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-austin',
    contact_type: 'engineer', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-16',
    notes: 'LINKEDIN message sent April 9. Sent longer message with walkphase.com/demo. Vision Zero/safety expert. Uses Synchro, Vissim, Transmodeler for signal analysis. WalkPhase provides complementary observed pedestrian data.',
    source: 'LinkedIn', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // Metropolitan Planning Council (Chicago)
  {
    id: 'con-wennink', first_name: 'Audrey', last_name: 'Wennink', full_name: 'Audrey Wennink',
    title: 'Senior Director', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-mpc-chicago',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-16',
    notes: 'LINKEDIN connection note sent April 9. Policy connector — influences CMAP and Chicago DOT. 9+ years in transportation policy at Metropolitan Planning Council.',
    source: 'LinkedIn', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // Boston Region MPO
  {
    id: 'con-hong', first_name: 'David', last_name: 'Hong', full_name: 'David S. Hong',
    title: 'Manager of MPO Activities', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-bostonmpo',
    contact_type: 'program_manager', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-09', next_action_date: '2026-04-16',
    notes: 'LINKEDIN connection note sent April 9. MIT background. Won $1.5M USDOT grant for capital investment prioritization. WalkPhase data aligns with his prioritization work.',
    source: 'LinkedIn', created_at: '2026-04-09T10:00:00Z', updated_at: '2026-04-09T10:00:00Z',
  },
  // Palm Beach sub-jurisdictions (pincer strategy)
  {
    id: 'con-lan', first_name: 'Chang-Jen', last_name: 'Lan', full_name: 'Chang-Jen Lan',
    title: 'Traffic and Transportation Engineer', email: 'cjl@Jupiter.fl.us', phone: '561-741-2538',
    linkedin_url: '', organization_id: 'org-jupiter',
    contact_type: 'engineer', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN connection + EMAIL sent April 10. Former Assistant Professor at University of Miami — academic background, will appreciate data angle. Email: cjl@Jupiter.fl.us. Part of Palm Beach MPO pincer strategy.',
    source: 'Jupiter staff directory, LinkedIn', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'con-brown', first_name: 'Jamie', last_name: 'Brown', full_name: 'Jamie Brown',
    title: 'Public Works Director', email: 'jbrown@lakeworthbeachfl.gov', phone: '',
    linkedin_url: '', organization_id: 'org-lakeworthbeach',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN connection + EMAIL sent April 10. CFM, LEED AP BD/C, ENV SP. May have served as interim City Manager (Dec 2023). Email: jbrown@lakeworthbeachfl.gov. Equity angle for Lake Worth Beach.',
    source: 'Lake Worth Beach website, LinkedIn', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'con-webster', first_name: 'Paul', last_name: 'Webster', full_name: 'Paul L. Webster, P.E.',
    title: 'Public Works Director', email: 'pwebster@royalpalmbeach.com', phone: '',
    linkedin_url: '', organization_id: 'org-royalpalmbeach',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN connection + EMAIL sent April 10. P.E. licensed. Email: pwebster@royalpalmbeach.com. Part of Palm Beach MPO pincer strategy.',
    source: 'Royal Palm Beach website, LinkedIn', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  // Broward pincer strategy
  {
    id: 'con-majstorovic', first_name: 'Milos', last_name: 'Majstorovic', full_name: 'Milos Majstorovic, MSCE, PE',
    title: 'Director, Transportation and Mobility Department', email: 'mmajstorovic@fortlauderdale.gov', phone: '954-828-5216',
    linkedin_url: '', organization_id: 'org-fortlauderdale',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN + EMAIL sent April 10. Director since Jul 2025 (Acting since May 2024). PE licensed. Previously at City of Miami Beach — Transportation Manager for 7 years, secured $2.4M+ in grants, oversaw ped/bike master planning. High-value contact.',
    source: 'LinkedIn, Fort Lauderdale website', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'con-garcia', first_name: 'Jose', last_name: 'Garcia', full_name: 'Jose D. Garcia',
    title: 'Project Manager, Engineering Transportation & Mobility', email: 'jgarcia@hollywoodfl.org', phone: '754-221-8020',
    linkedin_url: '', organization_id: 'org-hollywood',
    contact_type: 'program_manager', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN + EMAIL sent April 10. Project Manager in Engineering, Transportation & Mobility. Part of Broward pincer strategy.',
    source: 'Hollywood FL website, LinkedIn', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  {
    id: 'con-barszewski', first_name: 'Maggie', last_name: 'Barszewski', full_name: 'Maggie Barszewski',
    title: 'Roadway Projects', email: 'Maggie.barszewski@copbfl.com', phone: '954-786-7921',
    linkedin_url: '', organization_id: 'org-pompano',
    contact_type: 'engineer', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-10', next_action_date: '2026-04-17',
    notes: 'LINKEDIN + EMAIL sent April 10. Handles roadway projects. Pompano already has SS4A Planning & Demo funding. Key corridors: Dixie Hwy, MLK Jr Blvd, NE 1st St. Part of Broward pincer strategy.',
    source: 'Pompano Beach website, LinkedIn', created_at: '2026-04-10T10:00:00Z', updated_at: '2026-04-10T10:00:00Z',
  },
  // VCU
  {
    id: 'con-stone-vcu', first_name: 'Josh', last_name: 'Stone', full_name: 'Josh Stone, PTMP',
    title: 'Executive Director, Parking & Transportation Services', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-vcu',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN connection note sent April 12. Referenced VCU Main & Linden signal timing story (25s students vs 55s vehicles). WalkPhase can do this systematically at every campus crossing.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // Seattle SDOT
  {
    id: 'con-rhead', first_name: 'Ashley', last_name: 'Rhead', full_name: 'Ashley Rhead',
    title: 'Pedestrian & Neighborhood Projects Team Manager', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-seattle',
    contact_type: 'program_manager', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN message sent April 12. Manages Safe Routes to School, New Sidewalks, Pedestrian Crossings, Neighborhood Greenways. 12 years at SDOT. 20-40 school traffic safety projects per year. Passionate about child-friendly cities.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // Jacksonville
  {
    id: 'con-fall', first_name: 'Matt', last_name: 'Fall', full_name: 'Matt Fall',
    title: 'Bicycle-Pedestrian Coordinator', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-jacksonville',
    contact_type: 'planner', seniority: 'medium', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN sent April 12. Incredible background: USDOT (worked for Secretary Foxx, policy on ped/bike programs), NCTCOG (DFW MPO), Caltrans, now Jacksonville Bike-Ped Coordinator. Understands SS4A from federal AND local side.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // Tampa
  {
    id: 'con-campbell', first_name: 'Brandon', last_name: 'Campbell', full_name: 'Brandon Campbell, P.E., PTOE, RSP1',
    title: 'Mobility Director', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-tampa',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN sent April 12. Mobility Director at City of Tampa. PE, PTOE (traffic operations), RSP1 (Road Safety Professional). Decision-maker for Tampa mobility/safety programs.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  {
    id: 'con-kamal', first_name: 'Tarek', last_name: 'Kamal', full_name: 'Tarek Lotfy Kamal, PE, PTOE, AICP',
    title: 'Transportation Engineering Manager', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-tampa',
    contact_type: 'engineer', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN sent April 12. Transportation Engineering Manager since Mar 2025. PE, PTOE, AICP. Synchro/Vissim/Sidra expert. Notable projects include Tampa Streetcar Extension, Complete Streets. Brandon Campbell\'s colleague — two paths into Tampa.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // WSP
  {
    id: 'con-hayes', first_name: 'Catherine', last_name: 'Hayes', full_name: 'Catherine Hayes',
    title: 'Grants Development & Management Consultant', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-wsp',
    contact_type: 'business_development', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN message sent April 12. ACCEPTED connection. Previously Grants Supervisor at City of Tampa — secured $200M+ in grants. Now at WSP doing grants consulting. CONSULTANT MULTIPLIER. 55 grant applications per year average.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // USDOT Volpe
  {
    id: 'con-epstein', first_name: 'Alexander', last_name: 'Epstein', full_name: 'Alexander Epstein',
    title: 'Senior Engineer, Surface Transportation System Safety Division', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-volpe',
    contact_type: 'researcher', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-12', next_action_date: '2026-04-19',
    notes: 'LINKEDIN sent April 12. 14 years at Volpe. Harvard PhD. Focus on vulnerable road user safety, Safe System Approach. Vision Zero task force for Boston MPO + City of Somerville. Traffic Board member. Colleague of Liz Biskar (SS4A webinar). NOT an applicant — federal evaluator. Validation from him carries enormous weight.',
    source: 'LinkedIn', created_at: '2026-04-12T10:00:00Z', updated_at: '2026-04-12T10:00:00Z',
  },
  // University of Arizona
  {
    id: 'con-sayre', first_name: 'Jim', last_name: 'Sayre', full_name: 'Jim Sayre',
    title: 'Executive Director, Parking and Transportation', email: '', phone: '',
    linkedin_url: '', organization_id: 'org-uarizona',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-16', next_action_date: '2026-04-23',
    notes: 'LINKEDIN sent April 16. Manages parking and transportation at University of Arizona — $7.5M SS4A (largest university award). Tucson heat angle = slower walking speeds.',
    source: 'LinkedIn', created_at: '2026-04-16T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
  },
  // University of Maryland
  {
    id: 'con-allen', first_name: 'David', last_name: 'Allen', full_name: 'David Allen',
    title: 'Executive Director, Transportation Services (DOTS)', email: 'jdallen@umd.edu', phone: '',
    linkedin_url: '', organization_id: 'org-umd',
    contact_type: 'director', seniority: 'high', relationship_status: 'emailed',
    last_contact_date: '2026-04-16', next_action_date: '2026-04-23',
    notes: 'LINKEDIN sent April 16. Executive Director of DOTS at UMD. Route 1 pedestrian safety is a documented crisis — multiple fatalities. Email: jdallen@umd.edu.',
    source: 'LinkedIn, UMD website', created_at: '2026-04-16T10:00:00Z', updated_at: '2026-04-16T10:00:00Z',
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
