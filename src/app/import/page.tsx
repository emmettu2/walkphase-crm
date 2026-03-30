'use client'

import { useEffect, useState, useRef } from 'react'
import { Upload, Download, FileSpreadsheet, CheckCircle, AlertCircle } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import Papa from 'papaparse'
import { Organization, Contact } from '@/lib/types'
import { ensureSeeded, getOrganizations, getContacts, importOrganizations, importContacts } from '@/lib/store'

type ImportResult = { success: boolean; message: string; count: number }

export default function ImportPage() {
  const [mounted, setMounted] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const orgFileRef = useRef<HTMLInputElement>(null)
  const contactFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ensureSeeded()
    setMounted(true)
  }, [])

  const handleOrgImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const orgs: Organization[] = results.data.map((row: any) => ({
            id: row.id || uuid(),
            organization_name: row.organization_name || row.name || '',
            target_category: row.target_category || 'other',
            organization_type_detail: row.organization_type_detail || '',
            website: row.website || '',
            location_city: row.location_city || row.city || '',
            location_state: row.location_state || row.state || '',
            region: row.region || '',
            notes: row.notes || '',
            had_prior_ss4a_grant: row.had_prior_ss4a_grant || 'unknown',
            has_action_plan: row.has_action_plan || 'unknown',
            action_plan_type: row.action_plan_type || 'unknown',
            ss4a_stage: row.ss4a_stage || 'unknown',
            underserved_community_relevance: row.underserved_community_relevance || 'unknown',
            pedestrian_safety_relevance: row.pedestrian_safety_relevance || 'medium',
            university_research_strength: row.university_research_strength || 'not_applicable',
            grant_partner_fit: row.grant_partner_fit || 'medium',
            strategic_notes: row.strategic_notes || '',
            source: row.source || 'CSV Import',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })).filter((o: Organization) => o.organization_name)

          const count = importOrganizations(orgs)
          setImportResult({ success: true, message: `Imported ${count} new organizations (${orgs.length - count} duplicates skipped)`, count })
        } catch (err) {
          setImportResult({ success: false, message: `Import failed: ${err}`, count: 0 })
        }
      },
      error: (err) => {
        setImportResult({ success: false, message: `CSV parse error: ${err.message}`, count: 0 })
      },
    })
  }

  const handleContactImport = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const contacts: Contact[] = results.data.map((row: any) => ({
            id: row.id || uuid(),
            first_name: row.first_name || '',
            last_name: row.last_name || '',
            full_name: row.full_name || `${row.first_name || ''} ${row.last_name || ''}`.trim(),
            title: row.title || '',
            email: row.email || '',
            phone: row.phone || '',
            linkedin_url: row.linkedin_url || '',
            organization_id: row.organization_id || '',
            contact_type: row.contact_type || 'other',
            seniority: row.seniority || 'medium',
            relationship_status: row.relationship_status || 'not_contacted',
            last_contact_date: row.last_contact_date || '',
            next_action_date: row.next_action_date || '',
            notes: row.notes || '',
            source: row.source || 'CSV Import',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })).filter((c: Contact) => c.first_name || c.last_name)

          const count = importContacts(contacts)
          setImportResult({ success: true, message: `Imported ${count} new contacts (${contacts.length - count} duplicates skipped)`, count })
        } catch (err) {
          setImportResult({ success: false, message: `Import failed: ${err}`, count: 0 })
        }
      },
    })
  }

  const exportOrganizations = () => {
    const orgs = getOrganizations()
    const csv = Papa.unparse(orgs)
    downloadCSV(csv, 'walkphase_organizations.csv')
  }

  const exportContacts = () => {
    const contacts = getContacts()
    const csv = Papa.unparse(contacts)
    downloadCSV(csv, 'walkphase_contacts.csv')
  }

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-4xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Import / Export</h1>
        <p className="text-sm text-gray-500 mt-1">Import organizations and contacts from CSV, or export your data</p>
      </div>

      {importResult && (
        <div className={`card p-4 mb-6 flex items-center gap-3 animate-slide-up ${importResult.success ? 'border-wp-light bg-wp-50' : 'border-red-200 bg-red-50'}`}>
          {importResult.success ? <CheckCircle className="w-5 h-5 text-wp-mid flex-shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
          <p className="text-sm text-gray-700">{importResult.message}</p>
          <button onClick={() => setImportResult(null)} className="ml-auto text-xs text-gray-400 hover:text-gray-600">Dismiss</button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Import Organizations */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-wp-pale flex items-center justify-center">
              <Upload className="w-5 h-5 text-wp-deep" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Import Organizations</h2>
              <p className="text-xs text-gray-500">Upload a CSV file</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            CSV should include columns: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">organization_name</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">target_category</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">location_city</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">location_state</code>
          </p>
          <input ref={orgFileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleOrgImport(e.target.files[0])} />
          <button onClick={() => orgFileRef.current?.click()} className="btn-primary w-full">
            <FileSpreadsheet className="w-4 h-4" /> Choose CSV File
          </button>
        </div>

        {/* Import Contacts */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Import Contacts</h2>
              <p className="text-xs text-gray-500">Upload a CSV file</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            CSV should include columns: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">first_name</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">last_name</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">email</code>,{' '}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">organization_id</code>
          </p>
          <input ref={contactFileRef} type="file" accept=".csv" className="hidden" onChange={e => e.target.files?.[0] && handleContactImport(e.target.files[0])} />
          <button onClick={() => contactFileRef.current?.click()} className="btn-primary w-full bg-blue-600 hover:bg-blue-700">
            <FileSpreadsheet className="w-4 h-4" /> Choose CSV File
          </button>
        </div>

        {/* Export Organizations */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Export Organizations</h2>
              <p className="text-xs text-gray-500">Download as CSV</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Export all {getOrganizations().length} organizations to a CSV file.</p>
          <button onClick={exportOrganizations} className="btn-secondary w-full">
            <Download className="w-4 h-4" /> Export Organizations CSV
          </button>
        </div>

        {/* Export Contacts */}
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
              <Download className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Export Contacts</h2>
              <p className="text-xs text-gray-500">Download as CSV</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-4">Export all {getContacts().length} contacts to a CSV file.</p>
          <button onClick={exportContacts} className="btn-secondary w-full">
            <Download className="w-4 h-4" /> Export Contacts CSV
          </button>
        </div>
      </div>

      {/* CSV Template Info */}
      <div className="card p-6 mt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">CSV Format Guide</h2>
        <p className="text-sm text-gray-500 mb-4">
          The easiest way to get the right format is to export first, then modify the CSV and re-import.
          The import will skip any rows with IDs that already exist.
        </p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-mono text-gray-600">
            organization_name,target_category,location_city,location_state,had_prior_ss4a_grant,has_action_plan,ss4a_stage,pedestrian_safety_relevance,grant_partner_fit
            <br />
            &quot;City of Portland&quot;,city,Portland,OR,no,yes,has_action_plan,high,high
          </p>
        </div>
      </div>
    </div>
  )
}
