'use client'

import { useEffect, useState } from 'react'
import { Save, RotateCcw, Cloud, CloudDownload, CloudUpload, CheckCircle, AlertCircle } from 'lucide-react'
import { ScoringWeights, DEFAULT_WEIGHTS } from '@/lib/types'
import { getScoringWeights, saveScoringWeights, syncToCloud, syncFromCloud } from '@/lib/store'

const WEIGHT_LABELS: Record<keyof ScoringWeights, { label: string; description: string }> = {
  organization_type_fit: { label: 'Organization Type Fit', description: 'How well the org type matches WalkPhase targets (university, city, MPO)' },
  prior_ss4a_grant: { label: 'New Entrant Potential', description: 'Organizations without prior SS4A funding score higher for geographic distribution' },
  has_action_plan: { label: 'Action Plan Status', description: 'Organizations with action plans are faster path to implementation grants' },
  pedestrian_safety_relevance: { label: 'Pedestrian Safety Focus', description: 'How central pedestrian safety is to the organization\'s mission' },
  underserved_community_relevance: { label: 'Underserved Community Relevance', description: 'Alignment with SS4A equity goals and underserved populations' },
  research_capability: { label: 'Research Capability', description: 'Grant-writing and research capacity, especially for universities' },
  ss4a_stage_advancement: { label: 'SS4A Stage Advancement', description: 'How far along the organization is in the SS4A pipeline' },
  strategic_fit: { label: 'Strategic Fit', description: 'Overall strategic alignment with WalkPhase business model' },
  contact_quality: { label: 'Contact Quality', description: 'Quality and seniority of identified contacts within the organization' },
}

export default function SettingsPage() {
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS)
  const [saved, setSaved] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setWeights(getScoringWeights())
    setMounted(true)
  }, [])

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0)

  const handleSave = () => {
    saveScoringWeights(weights)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    setWeights(DEFAULT_WEIGHTS)
    saveScoringWeights(DEFAULT_WEIGHTS)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure scoring weights to prioritize outreach targets</p>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Scoring Weights</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Total: <span className="font-mono font-medium">{totalWeight}</span> points
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn-secondary">
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <button onClick={handleSave} className="btn-primary">
              <Save className="w-4 h-4" /> {saved ? 'Saved!' : 'Save'}
            </button>
          </div>
        </div>

        <div className="space-y-5">
          {(Object.keys(WEIGHT_LABELS) as Array<keyof ScoringWeights>).map(key => {
            const { label, description } = WEIGHT_LABELS[key]
            const value = weights[key]
            const percentage = totalWeight > 0 ? Math.round((value / totalWeight) * 100) : 0
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400">{description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 tabular-nums">{percentage}%</span>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={value}
                      onChange={e => setWeights(prev => ({ ...prev, [key]: parseInt(e.target.value) || 0 }))}
                      className="w-16 px-2 py-1.5 rounded-lg border border-gray-200 text-sm text-center font-mono
                                 focus:outline-none focus:ring-2 focus:ring-wp-light/30 focus:border-wp-mid"
                    />
                  </div>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill bg-wp-light"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cloud Sync */}
      <CloudSyncCard />

      {/* Data Management */}
      <div className="card p-6 mt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Data Management</h2>
        <p className="text-sm text-gray-500 mb-4">All data is stored locally in your browser. Use Cloud Sync above to back up and restore across devices.</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (confirm('This will delete all data and reload the seed demo data. Are you sure?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="btn-secondary text-red-600 border-red-200 hover:bg-red-50"
          >
            Reset to Demo Data
          </button>
          <button
            onClick={() => {
              if (confirm('This will permanently delete all data. Are you sure?')) {
                localStorage.clear()
                window.location.reload()
              }
            }}
            className="btn-ghost text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  )
}

function CloudSyncCard() {
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null)

  const handleSave = async () => {
    setSyncing(true)
    setMessage(null)
    const result = await syncToCloud()
    setMessage({ text: result.message, success: result.success })
    setSyncing(false)
  }

  const handleRestore = async () => {
    if (!confirm('This will replace all local data with the cloud backup. Any local changes not saved to cloud will be lost. Continue?')) return
    setSyncing(true)
    setMessage(null)
    const result = await syncFromCloud()
    setMessage({ text: result.message, success: result.success })
    setSyncing(false)
    if (result.success) {
      setTimeout(() => window.location.reload(), 1500)
    }
  }

  return (
    <div className="card p-6 mt-6">
      <div className="flex items-center gap-3 mb-2">
        <Cloud className="w-5 h-5 text-wp-mid" />
        <h2 className="text-base font-semibold text-gray-900">Cloud Sync</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Save your CRM data to the cloud so it persists across browsers and devices. Your data is stored securely on Vercel.
      </p>

      {message && (
        <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 text-sm ${message.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.success ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={syncing} className="btn-primary disabled:opacity-50">
          <CloudUpload className="w-4 h-4" /> {syncing ? 'Syncing...' : 'Save to Cloud'}
        </button>
        <button onClick={handleRestore} disabled={syncing} className="btn-secondary disabled:opacity-50">
          <CloudDownload className="w-4 h-4" /> {syncing ? 'Syncing...' : 'Restore from Cloud'}
        </button>
      </div>
    </div>
  )
}
