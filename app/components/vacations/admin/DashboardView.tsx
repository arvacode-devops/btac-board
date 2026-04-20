'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import type { EnrichedRequest, AgentRow } from '@/app/types/vacations'

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function vacationsByMonth(requests: EnrichedRequest[]) {
  const now   = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1)
  const counts: Record<string, number> = {}

  for (let i = 0; i < 12; i++) {
    const d   = new Date(start.getFullYear(), start.getMonth() + i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    counts[key] = 0
  }

  for (const r of requests) {
    if (r.status !== 'approved') continue
    const d   = new Date(r.startDate)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    if (key in counts) counts[key]++
  }

  return Object.entries(counts).map(([key, count]) => {
    const [y, m] = key.split('-').map(Number)
    return { label: `${MONTH_LABELS[m]} ${String(y).slice(2)}`, count }
  })
}

function topAgents(requests: EnrichedRequest[], limit = 8) {
  const map: Record<string, { name: string; count: number }> = {}
  for (const r of requests) {
    if (!map[r.agentUID]) map[r.agentUID] = { name: `${r.agentName} ${r.agentLastame}`, count: 0 }
    map[r.agentUID].count++
  }
  return Object.values(map)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

type Props = { requests: EnrichedRequest[]; agents: AgentRow[] }

export default function DashboardView({ requests, agents }: Props) {
  const now           = new Date()
  const thisMonthApproved = requests.filter(r => {
    const d = new Date(r.startDate)
    return r.status === 'approved' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length
  const pending     = requests.filter(r => r.status === 'pending').length
  const totalApproved = requests.filter(r => r.status === 'approved').length
  const monthData   = vacationsByMonth(requests)
  const agentData   = topAgents(requests)

  const stats = [
    { label: 'Total Agents',         value: agents.length,       color: 'bg-blue-50 text-blue-700' },
    { label: 'Pending Requests',      value: pending,             color: 'bg-amber-50 text-amber-700' },
    { label: 'Approved This Month',   value: thisMonthApproved,   color: 'bg-green-50 text-green-700' },
    { label: 'Total Approved',        value: totalApproved,       color: 'bg-purple-50 text-purple-700' },
  ]

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      <h2 className="text-lg font-bold text-gray-900">Dashboard</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className={`rounded-xl p-4 ${s.color}`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs mt-0.5 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Vacations approved per month */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-4">Approved vacations — last 12 months</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthData} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" name="Approved" fill="#6366f1" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top agents by request count */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-4">Top agents by requests</p>
          {agentData.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-12">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={agentData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 4, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="count" name="Requests" fill="#22c55e" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
