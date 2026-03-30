'use client'

import { Organization, Contact, OutreachActivity, ScoringWeights, DEFAULT_WEIGHTS, EmailTemplate, OutreachWave, PlaybookTask, SS4AData } from './types'
import { SEED_ORGANIZATIONS, SEED_CONTACTS, SEED_ACTIVITIES, SEED_TEMPLATES, SEED_WAVES, SEED_PLAYBOOK } from './seed'

const KEYS = {
  organizations: 'wp_crm_organizations_v3',
  contacts: 'wp_crm_contacts_v3',
  activities: 'wp_crm_activities_v3',
  weights: 'wp_crm_scoring_weights',
  templates: 'wp_crm_templates_v2',
  waves: 'wp_crm_waves_v2',
  playbook: 'wp_crm_playbook_v2',
  seeded: 'wp_crm_seeded_v3',
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}

export function ensureSeeded() {
  if (typeof window === 'undefined') return
  if (localStorage.getItem(KEYS.seeded)) return
  save(KEYS.organizations, SEED_ORGANIZATIONS)
  save(KEYS.contacts, SEED_CONTACTS)
  save(KEYS.activities, SEED_ACTIVITIES)
  save(KEYS.templates, SEED_TEMPLATES)
  save(KEYS.waves, SEED_WAVES)
  save(KEYS.playbook, SEED_PLAYBOOK)
  localStorage.setItem(KEYS.seeded, 'true')
}

// ─── Organizations ───
export function getOrganizations(): Organization[] { return load(KEYS.organizations, []) }
export function getOrganization(id: string): Organization | undefined { return getOrganizations().find(o => o.id === id) }
export function saveOrganization(org: Organization) {
  const orgs = getOrganizations()
  const idx = orgs.findIndex(o => o.id === org.id)
  if (idx >= 0) orgs[idx] = { ...org, updated_at: new Date().toISOString() }
  else orgs.push({ ...org, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  save(KEYS.organizations, orgs)
}
export function deleteOrganization(id: string) {
  save(KEYS.organizations, getOrganizations().filter(o => o.id !== id))
  save(KEYS.contacts, getContacts().filter(c => c.organization_id !== id))
  save(KEYS.activities, getActivities().filter(a => a.organization_id !== id))
}

// ─── Contacts ───
export function getContacts(): Contact[] { return load(KEYS.contacts, []) }
export function getContact(id: string): Contact | undefined { return getContacts().find(c => c.id === id) }
export function saveContact(contact: Contact) {
  const contacts = getContacts()
  const idx = contacts.findIndex(c => c.id === contact.id)
  if (idx >= 0) contacts[idx] = { ...contact, updated_at: new Date().toISOString() }
  else contacts.push({ ...contact, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  save(KEYS.contacts, contacts)
}
export function deleteContact(id: string) { save(KEYS.contacts, getContacts().filter(c => c.id !== id)) }

// ─── Activities ───
export function getActivities(): OutreachActivity[] { return load(KEYS.activities, []) }
export function saveActivity(activity: OutreachActivity) {
  const activities = getActivities()
  const idx = activities.findIndex(a => a.id === activity.id)
  if (idx >= 0) activities[idx] = activity
  else activities.push(activity)
  save(KEYS.activities, activities)
}

// ─── Templates ───
export function getTemplates(): EmailTemplate[] { return load(KEYS.templates, []) }
export function getTemplate(id: string): EmailTemplate | undefined { return getTemplates().find(t => t.id === id) }
export function saveTemplate(template: EmailTemplate) {
  const templates = getTemplates()
  const idx = templates.findIndex(t => t.id === template.id)
  if (idx >= 0) templates[idx] = { ...template, updated_at: new Date().toISOString() }
  else templates.push({ ...template, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  save(KEYS.templates, templates)
}
export function deleteTemplate(id: string) { save(KEYS.templates, getTemplates().filter(t => t.id !== id)) }

// ─── Waves ───
export function getWaves(): OutreachWave[] { return load<OutreachWave[]>(KEYS.waves, []).sort((a, b) => a.order - b.order) }
export function saveWave(wave: OutreachWave) {
  const waves = getWaves()
  const idx = waves.findIndex(w => w.id === wave.id)
  if (idx >= 0) waves[idx] = wave
  else waves.push(wave)
  save(KEYS.waves, waves)
}

// ─── Playbook ───
export function getPlaybookTasks(): PlaybookTask[] { return load(KEYS.playbook, []) }
export function getPlaybookTasksForDate(date: string): PlaybookTask[] {
  return getPlaybookTasks().filter(t => t.day_date === date).sort((a, b) => a.priority - b.priority)
}
export function savePlaybookTask(task: PlaybookTask) {
  const tasks = getPlaybookTasks()
  const idx = tasks.findIndex(t => t.id === task.id)
  if (idx >= 0) tasks[idx] = task
  else tasks.push(task)
  save(KEYS.playbook, tasks)
}
export function savePlaybookTasks(tasks: PlaybookTask[]) { save(KEYS.playbook, tasks) }

// ─── Scoring Weights ───
export function getScoringWeights(): ScoringWeights { return load(KEYS.weights, DEFAULT_WEIGHTS) }
export function saveScoringWeights(weights: ScoringWeights) { save(KEYS.weights, weights) }

// ─── Bulk Import ───
export function importOrganizations(orgs: Organization[]) {
  const existing = getOrganizations()
  const existingIds = new Set(existing.map(o => o.id))
  const newOrgs = orgs.filter(o => !existingIds.has(o.id))
  save(KEYS.organizations, [...existing, ...newOrgs])
  return newOrgs.length
}
export function importContacts(contacts: Contact[]) {
  const existing = getContacts()
  const existingIds = new Set(existing.map(c => c.id))
  const newContacts = contacts.filter(c => !existingIds.has(c.id))
  save(KEYS.contacts, [...existing, ...newContacts])
  return newContacts.length
}

// ─── SS4A Awardee Data (loaded from public JSON) ───
let _ss4aCache: SS4AData | null = null
export async function loadSS4AData(): Promise<SS4AData> {
  if (_ss4aCache) return _ss4aCache
  const res = await fetch('/ss4a-awardees.json')
  _ss4aCache = await res.json()
  return _ss4aCache!
}

// ─── Search ───
export function searchOrganizations(query: string): Organization[] {
  const q = query.toLowerCase()
  return getOrganizations().filter(o =>
    o.organization_name.toLowerCase().includes(q) ||
    o.location_city.toLowerCase().includes(q) ||
    o.location_state.toLowerCase().includes(q) ||
    o.target_category.toLowerCase().includes(q)
  )
}
