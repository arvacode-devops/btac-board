'use client'

import { useState } from 'react'
import UserProfileView from './UserProfileView'
import type { AgentRow } from '@/app/types/vacations'

type FilterPills = {
  role:         'all' | 'admin' | 'agent'
  service:      'all' | 'chat' | 'phone'
  scheduleType: 'all' | 'weekday' | 'weekend'
}

const ROLE_OPTS:     { value: FilterPills['role'];         label: string }[] = [{ value: 'all', label: 'All roles' }, { value: 'admin', label: 'Admin' }, { value: 'agent', label: 'Agent' }]
const SERVICE_OPTS:  { value: FilterPills['service'];      label: string }[] = [{ value: 'all', label: 'All services' }, { value: 'chat', label: 'Chat' }, { value: 'phone', label: 'Phone' }]
const SCHEDULE_OPTS: { value: FilterPills['scheduleType']; label: string }[] = [{ value: 'all', label: 'All schedules' }, { value: 'weekday', label: 'Weekday' }, { value: 'weekend', label: 'Weekend' }]

const DEFAULT_FILTERS: FilterPills = { role: 'all', service: 'all', scheduleType: 'all' }

export default function UserListView({ agents }: { agents: AgentRow[] }) {
  const [search,      setSearch]      = useState('')
  const [filters,     setFilters]     = useState<FilterPills>(DEFAULT_FILTERS)
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  const selected = agents.find(a => a.uid === selectedUid) ?? null

  if (selected) {
    return (
      <UserProfileView
        agent={selected}
        onBack={() => setSelectedUid(null)}
        onDeleted={() => setSelectedUid(null)}
      />
    )
  }

  const setFilter = <K extends keyof FilterPills>(key: K, value: FilterPills[K]) =>
    setFilters(prev => ({ ...prev, [key]: value }))

  const hasActiveFilters = filters.role !== 'all' || filters.service !== 'all' || filters.scheduleType !== 'all'

  const filtered = agents.filter(a => {
    if (filters.role         !== 'all' && a.level        !== filters.role)         return false
    if (filters.service      !== 'all' && a.service      !== filters.service)      return false
    if (filters.scheduleType !== 'all' && a.scheduleType !== filters.scheduleType) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      a.name.toLowerCase().includes(q) ||
      a.lastname.toLowerCase().includes(q) ||
      a.nnumber.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">User List</h2>
        <span className="text-xs text-gray-400">{agents.length} total</span>
      </div>

      <div className="flex flex-col gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, N-number, or email…"
          className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="flex flex-wrap items-center gap-2">
          <Pills label="Role"     opts={ROLE_OPTS}     active={filters.role}         onChange={v => setFilter('role', v as FilterPills['role'])} />
          <Pills label="Service"  opts={SERVICE_OPTS}  active={filters.service}      onChange={v => setFilter('service', v as FilterPills['service'])} />
          <Pills label="Schedule" opts={SCHEDULE_OPTS} active={filters.scheduleType} onChange={v => setFilter('scheduleType', v as FilterPills['scheduleType'])} />
          {hasActiveFilters && (
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(a => (
          <button
            key={a.uid}
            onClick={() => setSelectedUid(a.uid)}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-left hover:border-gray-300 hover:shadow transition-all"
          >
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">
                {a.name} {a.lastname}
              </p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                a.level === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {a.level}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-2 truncate">{a.email}</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-500">
              <span>{a.nnumber}</span>
              <span>·</span>
              <span className="capitalize">{a.service}</span>
              <span>·</span>
              <span>Sch {a.sch}h</span>
              {a.weekdayOff && <><span>·</span><span>Off: {a.weekdayOff}</span></>}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-10">No users found.</p>
      )}
    </div>
  )
}

function Pills({
  opts, active, onChange,
}: {
  label: string
  opts: { value: string; label: string }[]
  active: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1">
      {opts.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
            active === o.value
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
