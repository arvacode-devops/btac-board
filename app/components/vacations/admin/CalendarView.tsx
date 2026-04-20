'use client'

import { useState } from 'react'
import type { EnrichedRequest } from '@/app/types/vacations'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const PALETTE = [
  'bg-blue-500 text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-600 text-white',
  'bg-fuchsia-500 text-white',
  'bg-lime-600 text-white',
  'bg-orange-500 text-white',
  'bg-teal-600 text-white',
  'bg-pink-500 text-white',
  'bg-indigo-500 text-white',
]

function buildColorMap(requests: EnrichedRequest[]): Record<string, string> {
  const map: Record<string, string> = {}
  let idx = 0
  for (const r of requests) {
    if (r.status !== 'approved') continue
    if (!map[r.agentUID]) { map[r.agentUID] = PALETTE[idx % PALETTE.length]; idx++ }
  }
  return map
}

function isSunday(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month, day)).getUTCDay() === 0
}

function getRequestsForDay(
  requests: EnrichedRequest[],
  year: number,
  month: number,
  day: number,
): EnrichedRequest[] {
  if (isSunday(year, month, day)) return []
  const dayStart = new Date(Date.UTC(year, month, day, 0, 0, 0, 0))
  const dayEnd   = new Date(Date.UTC(year, month, day, 23, 59, 59, 999))
  return requests.filter(r =>
    r.status === 'approved' &&
    new Date(r.startDate) <= dayEnd &&
    new Date(r.endDate) >= dayStart
  )
}

type Props = {
  requests:  EnrichedRequest[]
  onReject:  (id: string) => void
  onPending: (id: string) => void
}

type SelectedDay = { day: number; items: EnrichedRequest[] }

export default function CalendarView({ requests, onReject, onPending }: Props) {
  const now   = new Date()
  const [year,     setYear]     = useState(now.getFullYear())
  const [month,    setMonth]    = useState(now.getMonth())
  const [selected, setSelected] = useState<SelectedDay | null>(null)

  const colorMap    = buildColorMap(requests)
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const handleDayClick = (day: number, items: EnrichedRequest[]) => {
    if (isSunday(year, month, day)) return
    if (items.length === 0) { setSelected(null); return }
    setSelected(prev => prev?.day === day ? null : { day, items })
  }

  // Refresh detail panel when requests change (e.g. after status update)
  const selectedItems = selected
    ? getRequestsForDay(requests, year, month, selected.day)
    : []

  const bgColor  = (uid: string) => colorMap[uid]?.split(' ')[0] ?? 'bg-gray-400'

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg transition-colors">‹</button>
          <span className="text-sm font-semibold text-gray-700 min-w-[140px] text-center">{MONTH_NAMES[month]} {year}</span>
          <button onClick={next} className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-lg transition-colors">›</button>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {DAY_LABELS.map((d, i) => (
            <div key={d} className={`py-2 text-center text-[11px] font-semibold ${i === 0 ? 'text-red-400' : 'text-gray-400'}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`e${i}`} className="min-h-[80px] border-b border-r border-gray-50" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const col         = (firstDay + day - 1) % 7
            const sunday      = isSunday(year, month, day)
            const dayRequests = sunday ? [] : getRequestsForDay(requests, year, month, day)
            const isToday     = day === now.getDate() && month === now.getMonth() && year === now.getFullYear()
            const isSelected  = selected?.day === day

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day, dayRequests)}
                disabled={sunday}
                className={`min-h-[80px] border-b border-r border-gray-50 p-1 text-left align-top transition-colors
                  ${col === 6 ? 'border-r-0' : ''}
                  ${sunday ? 'bg-gray-50 cursor-default' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}
                `}
              >
                <span className={`inline-flex items-center justify-center w-5 h-5 text-[11px] font-semibold rounded-full mb-1
                  ${isToday ? 'bg-gray-900 text-white' : sunday ? 'text-gray-300' : 'text-gray-500'}
                `}>
                  {day}
                </span>

                <div className="flex flex-col gap-0.5">
                  {dayRequests.slice(0, 3).map(r => (
                    <span
                      key={r.id}
                      className={`block truncate rounded px-1 text-[10px] font-medium leading-4 ${colorMap[r.agentUID] ?? 'bg-gray-400 text-white'}`}
                    >
                      {r.agentName} {r.agentLastame}
                    </span>
                  ))}
                  {dayRequests.length > 3 && (
                    <span className="text-[10px] text-gray-400 pl-1">+{dayRequests.length - 3} more</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Day detail panel */}
      {selected && selectedItems.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-700">
              {MONTH_NAMES[month]} {selected.day}, {year}
            </p>
            <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          {selectedItems.map(r => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-2 py-2 border-t border-gray-50">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${bgColor(r.agentUID)}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {r.agentName} {r.agentLastame}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {r.agentNnumber} · {r.service} ·{' '}
                    {new Date(r.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' – '}
                    {new Date(r.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onPending(r.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                >
                  Move to pending
                </button>
                <button
                  onClick={() => onReject(r.id)}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {Object.keys(colorMap).length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {requests
            .filter(r => r.status === 'approved')
            .filter((r, i, arr) => arr.findIndex(x => x.agentUID === r.agentUID) === i)
            .map(r => (
              <div key={r.agentUID} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${bgColor(r.agentUID)}`} />
                <span className="text-[11px] text-gray-500">{r.agentName} {r.agentLastame}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
