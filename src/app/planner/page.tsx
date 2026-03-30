'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, CheckCircle, Circle, Clock, ChevronLeft, ChevronRight, CalendarDays, Trash2 } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { PlaybookTask, Organization, OutreachWave } from '@/lib/types'
import { ensureSeeded, getPlaybookTasks, getOrganizations, getWaves, savePlaybookTask, savePlaybookTasks } from '@/lib/store'
import { Modal } from '@/components/Modal'
import { categoryIcon, cn } from '@/lib/utils'

function getWeekDays(startDate: Date): string[] {
  const days: string[] = []
  const d = new Date(startDate)
  // Start from Monday
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  for (let i = 0; i < 7; i++) {
    days.push(new Date(d).toISOString().split('T')[0])
    d.setDate(d.getDate() + 1)
  }
  return days
}

function formatDayShort(date: string) {
  const d = new Date(date + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function isToday(date: string) {
  return date === new Date().toISOString().split('T')[0]
}

export default function PlannerPage() {
  const [mounted, setMounted] = useState(false)
  const [tasks, setTasks] = useState<PlaybookTask[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [waves, setWaves] = useState<OutreachWave[]>([])
  const [weekStart, setWeekStart] = useState(() => {
    const now = new Date()
    const day = now.getDay()
    const diff = now.getDate() - day + (day === 0 ? -6 : 1)
    return new Date(now.getFullYear(), now.getMonth(), diff)
  })
  const [showAddTask, setShowAddTask] = useState(false)
  const [addTaskDate, setAddTaskDate] = useState('')
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  // New task form
  const [newOrgId, setNewOrgId] = useState('')
  const [newAction, setNewAction] = useState('')
  const [newNotes, setNewNotes] = useState('')

  const reload = () => {
    setTasks(getPlaybookTasks())
    setOrgs(getOrganizations())
    setWaves(getWaves())
  }

  useEffect(() => { ensureSeeded(); reload(); setMounted(true) }, [])

  const orgMap = useMemo(() => new Map(orgs.map(o => [o.id, o])), [orgs])
  const days = useMemo(() => getWeekDays(weekStart), [weekStart])

  const tasksByDay = useMemo(() => {
    const m = new Map<string, PlaybookTask[]>()
    days.forEach(d => m.set(d, []))
    tasks.forEach(t => {
      if (m.has(t.day_date)) m.get(t.day_date)!.push(t)
    })
    // Sort by priority within each day
    m.forEach((list) => list.sort((a, b) => a.priority - b.priority))
    return m
  }, [tasks, days])

  const navigateWeek = (offset: number) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + offset * 7)
    setWeekStart(d)
  }

  const toggleTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    savePlaybookTask({ ...task, status: task.status === 'completed' ? 'pending' : 'completed' })
    reload()
  }

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId)
    savePlaybookTasks(newTasks)
    reload()
  }

  const handleDrop = (targetDate: string) => {
    if (!draggedTask) return
    const task = tasks.find(t => t.id === draggedTask)
    if (!task || task.day_date === targetDate) return
    savePlaybookTask({ ...task, day_date: targetDate })
    reload()
    setDraggedTask(null)
  }

  const handleAddTask = () => {
    if (!newOrgId || !newAction) return
    const dayTasks = tasksByDay.get(addTaskDate) || []
    const task: PlaybookTask = {
      id: uuid(), day_date: addTaskDate, organization_id: newOrgId,
      status: 'pending', priority: dayTasks.length + 1,
      suggested_action: newAction, notes: newNotes,
    }
    savePlaybookTask(task)
    setShowAddTask(false)
    setNewOrgId(''); setNewAction(''); setNewNotes('')
    reload()
  }

  if (!mounted) return <div className="p-8"><div className="animate-pulse h-8 bg-gray-100 rounded-xl w-48" /></div>

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Outreach Planner</h1>
          <p className="text-sm text-gray-500 mt-0.5">Plan and track your outreach day by day</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigateWeek(-1)} className="btn-ghost"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setWeekStart(new Date())} className="btn-secondary text-xs">This Week</button>
          <button onClick={() => navigateWeek(1)} className="btn-ghost"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Waves Summary */}
      {waves.length > 0 && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {waves.map(wave => {
            const waveTaskCount = tasks.filter(t => t.wave_id === wave.id).length
            const completedCount = tasks.filter(t => t.wave_id === wave.id && t.status === 'completed').length
            return (
              <div key={wave.id} className={cn('card px-4 py-3 flex-shrink-0 min-w-[200px]',
                wave.status === 'active' && 'border-wp-200 bg-wp-50')}>
                <div className="flex items-center gap-2 mb-1">
                  <div className={cn('w-2 h-2 rounded-full',
                    wave.status === 'active' ? 'bg-wp-light' : wave.status === 'completed' ? 'bg-gray-400' : 'bg-gray-200')} />
                  <p className="text-sm font-semibold text-gray-900">{wave.name.split('—')[0].trim()}</p>
                </div>
                <p className="text-xs text-gray-500 line-clamp-1">{wave.objective}</p>
                {waveTaskCount > 0 && (
                  <p className="text-xs text-gray-400 mt-1">{completedCount}/{waveTaskCount} tasks done</p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Week Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map(day => {
          const dayTasks = tasksByDay.get(day) || []
          const completed = dayTasks.filter(t => t.status === 'completed').length
          const today = isToday(day)
          const isPast = new Date(day + 'T23:59:59') < new Date() && !today

          return (
            <div
              key={day}
              className={cn(
                'min-h-[300px] rounded-2xl border p-3 transition-all',
                today ? 'border-wp-200 bg-wp-50/30' : 'border-gray-100 bg-white',
                isPast && 'opacity-70'
              )}
              onDragOver={e => e.preventDefault()}
              onDrop={() => handleDrop(day)}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className={cn('text-xs font-semibold', today ? 'text-wp-deep' : 'text-gray-500')}>
                    {formatDayShort(day)}
                  </p>
                  {dayTasks.length > 0 && (
                    <p className="text-[10px] text-gray-400">{completed}/{dayTasks.length}</p>
                  )}
                </div>
                {today && <span className="w-2 h-2 rounded-full bg-wp-light" />}
              </div>

              {/* Tasks */}
              <div className="space-y-2">
                {dayTasks.map(task => {
                  const org = orgMap.get(task.organization_id)
                  const isDone = task.status === 'completed'
                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => setDraggedTask(task.id)}
                      onDragEnd={() => setDraggedTask(null)}
                      className={cn(
                        'p-2.5 rounded-xl border border-gray-100 bg-white text-xs cursor-grab active:cursor-grabbing transition-all hover:shadow-card',
                        isDone && 'opacity-50',
                        draggedTask === task.id && 'opacity-30 scale-95'
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        <button onClick={() => toggleTask(task.id)} className="mt-0.5 flex-shrink-0">
                          {isDone ? <CheckCircle className="w-3.5 h-3.5 text-wp-light" /> : <Circle className="w-3.5 h-3.5 text-gray-300" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          {org && (
                            <p className="font-medium text-gray-700 truncate flex items-center gap-1">
                              <span className="text-xs">{categoryIcon(org.target_category)}</span>
                              {org.organization_name}
                            </p>
                          )}
                          <p className={cn('text-gray-500 mt-0.5 line-clamp-2', isDone && 'line-through')}>{task.suggested_action}</p>
                        </div>
                        <button onClick={() => deleteTask(task.id)} className="text-gray-300 hover:text-red-400 flex-shrink-0">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add Task */}
              <button
                onClick={() => { setAddTaskDate(day); setShowAddTask(true) }}
                className="w-full mt-2 py-2 rounded-xl border border-dashed border-gray-200 text-xs text-gray-400 hover:text-wp-mid hover:border-wp-200 transition-colors"
              >
                + Add task
              </button>
            </div>
          )
        })}
      </div>

      {/* Add Task Modal */}
      <Modal open={showAddTask} onClose={() => setShowAddTask(false)} title={`Add Task — ${formatDayShort(addTaskDate)}`}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
            <select className="select" value={newOrgId} onChange={e => setNewOrgId(e.target.value)}>
              <option value="">Select organization...</option>
              {orgs.map(o => <option key={o.id} value={o.id}>{o.organization_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
            <textarea className="input min-h-[80px]" value={newAction} onChange={e => setNewAction(e.target.value)}
              placeholder="e.g. Research team and send initial outreach email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input className="input" value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Any additional notes..." />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowAddTask(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleAddTask} className="btn-primary" disabled={!newOrgId || !newAction}>Add Task</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
