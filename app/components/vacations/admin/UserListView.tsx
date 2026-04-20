'use client'

import { useState } from 'react'
import UserProfileView from './UserProfileView'
import type { AgentRow } from '@/app/types/vacations'

export default function UserListView({ agents }: { agents: AgentRow[] }) {
  const [search,      setSearch]      = useState('')
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

  const filtered = agents.filter(a => {
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

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search by name, N-number, or email…"
        className="w-full max-w-sm border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

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
