'use client'

import { Organization, Contact, OutreachActivity, ScoringWeights, DEFAULT_WEIGHTS } from './types'
import { SEED_ORGANIZATIONS, SEED_CONTACTS, SEED_ACTIVITIES } from './seed'

const KEYS = {
  organizations: 'wp_crm_organizations',
  contacts: 'wp_crm_contacts',
  activities: 'wp_crm_activities',
  weights: 'wp_crm_scoring_weights',
  seeded: 'wp_crm_seeded',
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
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
  localStorage.setItem(KEYS.seeded, 'true')
}

// Organizations
export function getOrganizations(): Organization[] {
  return load<Organization[]>(KEYS.organizations, [])
}

export function getOrganization(id: string): Organization | undefined {
  return getOrganizations().find(o => o.id === id)
}

export function saveOrganization(org: Organization) {
  const orgs = getOrganizations()
  const idx = orgs.findIndex(o => o.id === org.id)
  if (idx >= 0) {
    orgs[idx] = { ...org, updated_at: new Date().toISOString() }
  } else {
    orgs.push({ ...org, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  }
  save(KEYS.organizations, orgs)
}

export function deleteOrganization(id: string) {
  save(KEYS.organizations, getOrganizations().filter(o => o.id !== id))
  save(KEYS.contacts, getContacts().filter(c => c.organization_id !== id))
  save(KEYS.activities, getActivities().filter(a => a.organization_id !== id))
}

// Contacts
export function getContacts(): Contact[] {
  return load<Contact[]>(KEYS.contacts, [])
}

export function getContact(id: string): Contact | undefined {
  return getContacts().find(c => c.id === id)
}

export function saveContact(contact: Contact) {
  const contacts = getContacts()
  const idx = contacts.findIndex(c => c.id === contact.id)
  if (idx >= 0) {
    contacts[idx] = { ...contact, updated_at: new Date().toISOString() }
  } else {
    contacts.push({ ...contact, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
  }
  save(KEYS.contacts, contacts)
}

export function deleteContact(id: string) {
  save(KEYS.contacts, getContacts().filter(c => c.id !== id))
}

// Activities
export function getActivities(): OutreachActivity[] {
  return load<OutreachActivity[]>(KEYS.activities, [])
}

export function saveActivity(activity: OutreachActivity) {
  const activities = getActivities()
  const idx = activities.findIndex(a => a.id === activity.id)
  if (idx >= 0) {
    activities[idx] = activity
  } else {
    activities.push(activity)
  }
  save(KEYS.activities, activities)
}

// Scoring weights
export function getScoringWeights(): ScoringWeights {
  return load<ScoringWeights>(KEYS.weights, DEFAULT_WEIGHTS)
}

export function saveScoringWeights(weights: ScoringWeights) {
  save(KEYS.weights, weights)
}

// Bulk import
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

// Search helpers
export function searchOrganizations(query: string): Organization[] {
  const q = query.toLowerCase()
  return getOrganizations().filter(o =>
    o.organization_name.toLowerCase().includes(q) ||
    o.location_city.toLowerCase().includes(q) ||
    o.location_state.toLowerCase().includes(q) ||
    o.target_category.toLowerCase().includes(q)
  )
}
