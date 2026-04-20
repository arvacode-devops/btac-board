'use client'

import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import type { AgentRow } from '@/app/types/vacations'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS  = ['Su','Mo','Tu','We','Th','Fr','Sa']

function toYMD(d: Date) { return d.toISOString().split('T')[0] }
function toStartISO(s: string) { return `${s}T05:00:00.000Z` }
function toEndISO(s: string) {
  const d = new Date(`${s}T05:00:00.000Z`)
  d.setDate(d.getDate() + 1)
  d.setMilliseconds(-1)
  return d.toISOString()
}
function fmtLabel(ymd: string) {
  if (!ymd) return ''
  const [y, m, d] = ymd.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`
}

type Props = { agents: AgentRow[] }

export default function AddVacationView({ agents }: Props) {
  const { userData } = useAuth()
  const now = new Date()

  const [agentUid,   setAgentUid]   = useState('')
  const [startDate,  setStartDate]  = useState('')
  const [endDate,    setEndDate]    = useState('')
  const [status,     setStatus]     = useState<'approved' | 'pending'>('approved')
  const [submitting, setSubmitting] = useState(false)
  const [success,    setSuccess]    = useState('')
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')

  const [calYear,  setCalYear]  = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

  const firstDay    = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  const isSunday = (ymd: string) => {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(y, m - 1, d).getDay() === 0
  }

  const handleDayClick = (ymd: string) => {
    if (isSunday(ymd)) return
    if (!startDate || (startDate && endDate)) {
      setStartDate(ymd); setEndDate('')
    } else if (ymd < startDate) {
      setStartDate(ymd); setEndDate('')
    } else {
      setEndDate(ymd)
    }
  }

  const goPrev = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const goNext = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const selectedAgent = agents.find(a => a.uid === agentUid)

  const filteredAgents = agents.filter(a => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.lastname.toLowerCase().includes(q) ||
      a.nnumber.toLowerCase().includes(q)
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agentUid || !startDate || !endDate) {
      setError('Please select an agent and a date range.')
      return
    }
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'vacationRequest'), {
        agentUID:    agentUid,
        startDate:   toStartISO(startDate),
        endDate:     toEndISO(endDate),
        requestDate: new Date().toISOString(),
        status,
        approvedBy:  status === 'approved'
          ? `${userData?.name} ${userData?.lastname}`
          : '',
      })
      const agent = agents.find(a => a.uid === agentUid)!
      setSuccess(`Vacation added for ${agent.name} ${agent.lastname}.`)
      setStartDate('')
      setEndDate('')
      setAgentUid('')
      setSearch('')
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Add Vacation</h2>

      <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-5">

        {/* Agent picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Agent</label>

          {selectedAgent ? (
            <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedAgent.name} {selectedAgent.lastname}
                </p>
                <p className="text-xs text-gray-500">{selectedAgent.nnumber} · {selectedAgent.service}</p>
              </div>
              <button
                type="button"
                onClick={() => { setAgentUid(''); setSearch('') }}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or N-number…"
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {search && (
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {filteredAgents.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-4">No agents found.</p>
                  ) : filteredAgents.map(a => (
                    <button
                      key={a.uid}
                      type="button"
                      onClick={() => { setAgentUid(a.uid); setSearch('') }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{a.name} {a.lastname}</p>
                        <p className="text-xs text-gray-400">{a.nnumber}</p>
                      </div>
                      <span className="text-xs text-gray-400 capitalize">{a.service}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date range</label>
          <div className="border border-gray-200 rounded-xl overflow-hidden">

            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
              <button type="button" onClick={goPrev} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">‹</button>
              <span className="text-sm font-semibold text-gray-700">{MONTH_NAMES[calMonth]} {calYear}</span>
              <button type="button" onClick={goNext} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 text-gray-600 transition-colors">›</button>
            </div>

            <div className="grid grid-cols-7 border-b border-gray-50">
              {DAY_LABELS.map(d => (
                <div key={d} className="py-1.5 text-center text-[10px] font-semibold text-gray-400">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 p-1 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const ymd     = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                const sunday  = isSunday(ymd)
                const isStart = ymd === startDate
                const isEnd   = ymd === endDate
                const inRange = startDate && endDate && ymd > startDate && ymd < endDate
                const isToday = ymd === toYMD(now)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={sunday}
                    onClick={() => handleDayClick(ymd)}
                    className={`h-8 w-full flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                      ${sunday ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${isStart || isEnd ? 'bg-gray-900 text-white' : ''}
                      ${inRange ? 'bg-blue-100 text-blue-800' : ''}
                      ${!sunday && !isStart && !isEnd && !inRange
                        ? isToday ? 'text-blue-600 font-bold hover:bg-gray-100' : 'text-gray-700 hover:bg-gray-100'
                        : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Range summary */}
          <div className="flex gap-2 mt-2 text-xs">
            <div className="flex-1 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-gray-400 mb-0.5">From</p>
              <p className="font-semibold text-gray-800">{startDate ? fmtLabel(startDate) : '—'}</p>
            </div>
            <div className="flex-1 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-gray-400 mb-0.5">To</p>
              <p className="font-semibold text-gray-800">{endDate ? fmtLabel(endDate) : '—'}</p>
            </div>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Save as</label>
          <div className="flex gap-2">
            {(['approved', 'pending'] as const).map(s => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  status === s
                    ? s === 'approved' ? 'bg-green-600 text-white' : 'bg-amber-400 text-gray-900'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error   && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>}

        <button
          type="submit"
          disabled={submitting || !agentUid || !startDate || !endDate}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Saving…' : 'Add vacation'}
        </button>
      </form>
    </div>
  )
}
