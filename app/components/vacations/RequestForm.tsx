'use client'

import { useEffect, useState } from 'react'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAY_LABELS  = ['Su','Mo','Tu','We','Th','Fr','Sa']

function toYMD(d: Date) {
  return d.toISOString().split('T')[0]
}

function getDateWindow(monthsAllowed: number) {
  const now = new Date()
  const min = toYMD(now)
  const maxDate = new Date(now.getFullYear(), now.getMonth() + monthsAllowed, 0)
  const max = toYMD(maxDate)
  return { min, max }
}

function toStartISO(dateStr: string) { return `${dateStr}T05:00:00.000Z` }
function toEndISO(dateStr: string) {
  const d = new Date(`${dateStr}T05:00:00.000Z`)
  d.setDate(d.getDate() + 1)
  d.setMilliseconds(-1)
  return d.toISOString()
}

function fmtLabel(ymd: string) {
  if (!ymd) return ''
  const [y, m, d] = ymd.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`
}

function monthStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

type Props = { onClose: () => void; onSuccess: () => void }

export default function RequestForm({ onClose, onSuccess }: Props) {
  const { user, userData } = useAuth()
  const [startDate,  setStartDate]  = useState('')
  const [endDate,    setEndDate]    = useState('')
  const [window,     setWindow]     = useState({ min: '', max: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const now = new Date()
  const [calYear,  setCalYear]  = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())

  useEffect(() => {
    getDoc(doc(db, 'globalVariables', 'month')).then(snap => {
      const months = snap.exists() ? parseInt(snap.data().value ?? '3') : 3
      setWindow(getDateWindow(months))
    })
  }, [])

  const firstDay    = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  const cur  = monthStr(calYear, calMonth)
  const prev = calMonth === 0
    ? monthStr(calYear - 1, 11)
    : monthStr(calYear, calMonth - 1)
  const next = calMonth === 11
    ? monthStr(calYear + 1, 0)
    : monthStr(calYear, calMonth + 1)

  const canPrev = window.min ? prev >= window.min.slice(0, 7) : true
  const canNext = window.max ? next <= window.max.slice(0, 7) : true

  const goPrev = () => {
    if (!canPrev) return
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const goNext = () => {
    if (!canNext) return
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const isSunday = (ymd: string) => {
    const [y, m, d] = ymd.split('-').map(Number)
    return new Date(y, m - 1, d).getDay() === 0
  }

  const handleDayClick = (ymd: string) => {
    if (isSunday(ymd)) return
    if (!startDate || (startDate && endDate)) {
      setStartDate(ymd)
      setEndDate('')
    } else if (ymd < startDate) {
      setStartDate(ymd)
      setEndDate('')
    } else {
      setEndDate(ymd)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate) { setError('Please select a start and end date.'); return }
    if (!user || !userData) return
    setError('')
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'vacationRequest'), {
        agentUID:    user.uid,
        startDate:   toStartISO(startDate),
        endDate:     toEndISO(endDate),
        requestDate: new Date().toISOString(),
        status:      'pending',
        approvedBy:  '',
      })
      onSuccess()
    } catch {
      setError('Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-5">

        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Request Vacation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Calendar */}
          <div className="border border-gray-100 rounded-xl overflow-hidden">

            {/* Month nav */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-b border-gray-100">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canPrev}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-600"
              >
                ‹
              </button>
              <span className="text-sm font-semibold text-gray-700">
                {MONTH_NAMES[calMonth]} {calYear}
              </span>
              <button
                type="button"
                onClick={goNext}
                disabled={!canNext}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors text-gray-600"
              >
                ›
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-50">
              {DAY_LABELS.map(d => (
                <div key={d} className="py-1.5 text-center text-[10px] font-semibold text-gray-400">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 p-1 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}

              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const ymd      = `${calYear}-${String(calMonth + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
                const disabled = (window.min && ymd < window.min) || (window.max && ymd > window.max) || isSunday(ymd)
                const isStart  = ymd === startDate
                const isEnd    = ymd === endDate
                const inRange  = startDate && endDate && ymd > startDate && ymd < endDate
                const isToday  = ymd === toYMD(now)

                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!!disabled}
                    onClick={() => handleDayClick(ymd)}
                    className={`
                      h-8 w-full flex items-center justify-center rounded-lg text-xs font-medium transition-colors
                      ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${isStart || isEnd ? 'bg-gray-900 text-white' : ''}
                      ${inRange ? 'bg-blue-100 text-blue-800' : ''}
                      ${!disabled && !isStart && !isEnd && !inRange
                        ? isToday
                          ? 'text-blue-600 font-bold hover:bg-gray-100'
                          : 'text-gray-700 hover:bg-gray-100'
                        : ''}
                    `}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selected range summary */}
          <div className="flex gap-2 text-xs">
            <div className="flex-1 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-gray-400 mb-0.5">From</p>
              <p className="font-semibold text-gray-800">{startDate ? fmtLabel(startDate) : '—'}</p>
            </div>
            <div className="flex-1 rounded-lg bg-gray-50 px-3 py-2">
              <p className="text-gray-400 mb-0.5">To</p>
              <p className="font-semibold text-gray-800">{endDate ? fmtLabel(endDate) : '—'}</p>
            </div>
          </div>

          {window.max && (
            <p className="text-[11px] text-gray-400 -mt-1">
              Requests available up to {fmtLabel(window.max)}.
            </p>
          )}

          {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !startDate || !endDate}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
