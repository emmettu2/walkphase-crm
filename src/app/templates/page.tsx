'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Copy, FileText, Eye } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { EmailTemplate, TemplateCategory, TEMPLATE_CATEGORY_LABELS } from '@/lib/types'
import { ensureSeeded, getTemplates, saveTemplate, deleteTemplate } from '@/lib/store'
import { Modal } from '@/components/Modal'
import { cn } from '@/lib/utils'

function TemplatePreview({ template, vars }: { template: EmailTemplate; vars?: Record<string, string> }) {
  let body = template.body
  let subject = template.subject
  const defaults: Record<string, string> = {
    first_name: 'Dr. Smith', organization_name: 'UC Berkeley SafeTREC', city: 'Berkeley',
    target_reason: 'pedestrian safety research and signal timing analysis', original_subject: 'Pedestrian signal timing research',
  }
  const mergedVars = { ...defaults, ...vars }
  for (const [key, val] of Object.entries(mergedVars)) {
    body = body.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
    subject = subject.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), val)
  }
  return (
    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-0.5">Subject</p>
        <p className="text-sm font-medium text-gray-900">{subject}</p>
      </div>
      <div className="border-t border-gray-200 pt-3">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{body}</pre>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [mounted, setMounted] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null)

  const reload = () => setTemplates(getTemplates())
  useEffect(() => { ensureSeeded(); reload(); setMounted(true) }, [])

  const startEdit = (tmpl?: EmailTemplate) => {
    setEditingTemplate(tmpl || {
      id: uuid(), name: '', category: 'custom' as TemplateCategory, subject: '', body: '',
      use_case: '', variables: ['first_name', 'organization_name'],
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    })
    setShowEdit(true)
  }

  const handleSave = () => {
    if (!editingTemplate) return
    saveTemplate(editingTemplate)
    setShowEdit(false)
    reload()
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this template?')) {
      deleteTemplate(id)
      reload()
    }
  }

  const copyToClipboard = (tmpl: EmailTemplate) => {
    navigator.clipboard.writeText(`Subject: ${tmpl.subject}\n\n${tmpl.body}`)
  }

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <p className="text-sm text-gray-500 mt-0.5">{templates.length} templates &middot; Personalize with variables</p>
        </div>
        <button onClick={() => startEdit()} className="btn-primary"><Plus className="w-4 h-4" /> New Template</button>
      </div>

      <div className="space-y-4">
        {templates.map(tmpl => (
          <div key={tmpl.id} className="card p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <h3 className="text-base font-semibold text-gray-900">{tmpl.name}</h3>
                  <span className="badge badge-blue text-[10px]">{TEMPLATE_CATEGORY_LABELS[tmpl.category]}</span>
                </div>
                <p className="text-sm text-gray-500">{tmpl.use_case}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setPreviewTemplate(tmpl); setShowPreview(true) }} className="btn-ghost" title="Preview">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => copyToClipboard(tmpl)} className="btn-ghost" title="Copy">
                  <Copy className="w-4 h-4" />
                </button>
                <button onClick={() => startEdit(tmpl)} className="btn-ghost" title="Edit">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(tmpl.id)} className="btn-ghost text-red-400 hover:text-red-600" title="Delete">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-400">Subject:</p>
              <p className="text-xs text-gray-600 font-medium">{tmpl.subject}</p>
            </div>
            <div className="flex gap-1.5 mt-2">
              {tmpl.variables.map(v => (
                <span key={v} className="badge badge-gray text-[10px] font-mono">{`{{${v}}}`}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title={editingTemplate?.id ? 'Edit Template' : 'New Template'} wide>
        {editingTemplate && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input className="input" value={editingTemplate.name} onChange={e => setEditingTemplate({ ...editingTemplate, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="select" value={editingTemplate.category} onChange={e => setEditingTemplate({ ...editingTemplate, category: e.target.value as TemplateCategory })}>
                  {Object.entries(TEMPLATE_CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Use Case</label>
                <input className="input" value={editingTemplate.use_case} onChange={e => setEditingTemplate({ ...editingTemplate, use_case: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                <input className="input" value={editingTemplate.subject} onChange={e => setEditingTemplate({ ...editingTemplate, subject: e.target.value })} />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea className="input min-h-[300px] resize-y font-mono text-sm" value={editingTemplate.body}
                  onChange={e => setEditingTemplate({ ...editingTemplate, body: e.target.value })} />
                <p className="text-xs text-gray-400 mt-1">
                  Available variables: {`{{first_name}}`}, {`{{organization_name}}`}, {`{{city}}`}, {`{{target_reason}}`}, {`{{original_subject}}`}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowEdit(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn-primary">Save Template</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal open={showPreview} onClose={() => setShowPreview(false)} title="Template Preview" wide>
        {previewTemplate && <TemplatePreview template={previewTemplate} />}
      </Modal>
    </div>
  )
}
