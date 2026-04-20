'use client'

import { useEffect, useState, useRef } from 'react'
import {
  collection, query, where, limit,
  startAfter, getDocs, type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { enrich } from '@/app/lib/vacations'
import RequestCard from '../RequestCard'
import type { VacationRequest, AgentRow, EnrichedRequest } from '@/app/types/vacations'

const PAGE = 15
type Filter = 'all' | 'approved' | 'rejected'

const FILTER_STYLE: Record<Filter, string> = {
  all:      'bg-gray-900 text-white',
  approved: 'bg-green-600 text-white',
  rejected: 'bg-red-500 text-white',
}

export default function HistoryView({ agents }: { agents: AgentRow[] }) {
  const [records,     setRecords]     = useState<EnrichedRequest[]>([])
  const [filter,      setFilter]      = useState<Filter>('all')
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore,     setHasMore]     = useState(false)
  const cursorRef = useRef<QueryDocumentSnapshot | null>(null)
  // Keep latest agents in a ref so fetchPage closure always sees current value
  const agentsRef = useRef(agents)
  useEffect(() => { agentsRef.current = agents }, [agents])

  const fetchPage = async (cursor: QueryDocumentSnapshot | null, replace: boolean) => {
    replace ? setLoading(true) : setLoadingMore(true)

    const constraints: Parameters<typeof query>[1][] = [
      where('status', 'in', ['approved', 'rejected']),
      limit(PAGE),
    ]
    if (cursor) constraints.push(startAfter(cursor))

    const snap = await getDocs(query(collection(db, 'vacationRequest'), ...constraints))
    const rows = snap.docs
      .map(d => enrich({ id: d.id, ...d.data() } as VacationRequest, agentsRef.current))
      .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())

    cursorRef.current = snap.docs[snap.docs.length - 1] ?? null
    setHasMore(snap.docs.length === PAGE)
    setRecords(prev => replace ? rows : [...prev, ...rows])
    replace ? setLoading(false) : setLoadingMore(false)
  }

  useEffect(() => {
    cursorRef.current = null
    fetchPage(null, true)
  }, [])

  // Re-enrich displayed records when agents list changes
  useEffect(() => {
    if (records.length === 0) return
    setRecords(prev => prev.map(r => enrich(r, agents)))
  }, [agents])

  const loadMore = () => fetchPage(cursorRef.current, false)

  const filtered = records.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.agentName.toLowerCase().includes(q) ||
        r.agentLastame.toLowerCase().includes(q) ||
        r.agentNnumber.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <h2 className="text-lg font-bold text-gray-900">History</h2>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by agent name or N-number…"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          {(['all', 'approved', 'rejected'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f ? FILTER_STYLE[f] : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-12">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">No records found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map(r => <RequestCard key={r.id} request={r} />)}
          </div>
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="self-center px-6 py-2 rounded-xl bg-gray-100 text-sm font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          )}
        </>
      )}
    </div>
  )
}
