const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const files = [
  { path: path.join(process.env.HOME, 'Downloads/FY22-SS4A-Full-Award-List-March2025(2).xlsx'), fy: 'FY22' },
  { path: path.join(process.env.HOME, 'Downloads/FY23-SS4A-Award-List-March2025(2).xlsx'), fy: 'FY23' },
  { path: path.join(process.env.HOME, 'Downloads/FY24-SS4A-Award-List-March2025(4).xlsx'), fy: 'FY24' },
  { path: path.join(process.env.HOME, 'Downloads/FY25-SS4A-Award-List-2025-12-23.xlsx'), fy: 'FY25' },
];

let allAwards = [];

files.forEach(f => {
  const wb = XLSX.readFile(f.path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);
  data.forEach(row => {
    const funding = parseFloat(String(row['Total Federal Funding '] || row['Total Federal Funding'] || 0).replace(/[,$]/g, '')) || 0;
    const cost = parseFloat(String(row['Total Project Cost'] || 0).replace(/[,$]/g, '')) || 0;
    allAwards.push({
      fy: f.fy,
      lead_applicant: (row['Lead Applicant'] || '').trim(),
      state: (row['State'] || '').trim(),
      grant_type: (row['Grant Type'] || row['Grant Type Awarded'] || '').trim(),
      planning_activities: (row['Planning and Demonstration Activities'] || '').trim(),
      implementation_activities: (row['Implementation Activities'] || '').trim(),
      project_name: (row['Project Name'] || '').trim(),
      project_description: (row['Project Description'] || '').trim(),
      total_federal_funding: funding,
      total_project_cost: cost,
      applicant_type: (row['Applicant Type'] || '').trim(),
      rural_urban: (row['Rural/ Urban'] || '').trim(),
    });
  });
});

// Aggregate by unique applicant+state
const orgMap = new Map();
allAwards.forEach(a => {
  const key = `${a.lead_applicant}|${a.state}`;
  if (!orgMap.has(key)) {
    orgMap.set(key, {
      lead_applicant: a.lead_applicant,
      state: a.state,
      applicant_type: a.applicant_type,
      rural_urban: a.rural_urban,
      awards: [],
      total_funding: 0,
      grant_types: new Set(),
      fiscal_years: new Set(),
      descriptions: [],
      project_names: [],
    });
  }
  const org = orgMap.get(key);
  org.awards.push(a);
  org.total_funding += a.total_federal_funding;
  if (a.grant_type) org.grant_types.add(a.grant_type);
  org.fiscal_years.add(a.fy);
  if (a.project_description) org.descriptions.push(a.project_description);
  if (a.project_name) org.project_names.push(a.project_name);
});

// Convert to array and sort by total funding
const orgs = Array.from(orgMap.values()).map(o => ({
  lead_applicant: o.lead_applicant,
  state: o.state,
  applicant_type: o.applicant_type,
  rural_urban: o.rural_urban,
  award_count: o.awards.length,
  total_funding: Math.round(o.total_funding),
  grant_types: Array.from(o.grant_types),
  fiscal_years: Array.from(o.fiscal_years).sort(),
  has_action_plan: o.grant_types.has('Action Plan'),
  has_implementation: o.grant_types.has('Implementation'),
  has_planning: o.grant_types.has('Planning and Demonstration') || o.grant_types.has('Supplemental Planning'),
  project_names: o.project_names,
  descriptions: o.descriptions,
  pedestrian_related: o.descriptions.some(d => {
    const dl = d.toLowerCase();
    return dl.includes('pedestrian') || dl.includes('crosswalk') || dl.includes('crossing') || dl.includes('walk') || dl.includes('signal timing');
  }) || o.project_names.some(n => {
    const nl = n.toLowerCase();
    return nl.includes('pedestrian') || nl.includes('crosswalk') || nl.includes('walk');
  }),
})).sort((a, b) => b.total_funding - a.total_funding);

// Write output
const output = {
  total_awards: allAwards.length,
  unique_organizations: orgs.length,
  organizations: orgs,
};

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'lib', 'ss4a-awardees.json'),
  JSON.stringify(output, null, 2)
);

console.log(`Wrote ${orgs.length} unique organizations`);
console.log(`Total awards: ${allAwards.length}`);
console.log(`With Action Plans: ${orgs.filter(o => o.has_action_plan).length}`);
console.log(`With Implementation: ${orgs.filter(o => o.has_implementation).length}`);
console.log(`Pedestrian-related: ${orgs.filter(o => o.pedestrian_related).length}`);
console.log(`Top 10 by funding:`);
orgs.slice(0, 10).forEach((o, i) => {
  console.log(`  ${i+1}. ${o.lead_applicant}, ${o.state} — $${(o.total_funding/1e6).toFixed(1)}M (${o.fiscal_years.join(', ')})`);
});
