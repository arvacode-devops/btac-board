'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import RequestCard from './RequestCard'
import RequestForm from './RequestForm'
import type { VacationRequest, EnrichedRequest } from '@/app/types/vacations'

export default function AgentView() {
  const { user, userData, signOut } = useAuth()
  const [requests,   setRequests]   = useState<EnrichedRequest[]>([])
  const [showForm,   setShowForm]   = useState(false)
  const [successMsg, setSuccessMsg] = useState(false)

  useEffect(() => {
    if (!user || !userData) return
    const q = query(
      collection(db, 'vacationRequest'),
      where('agentUID', '==', user.uid),
    )
    return onSnapshot(q, snap => {
      const rows = snap.docs.map(d => {
        const req = { id: d.id, ...d.data() } as VacationRequest
        return {
          ...req,
          agentName:    userData.name,
          agentLastame: userData.lastname,
          agentNnumber: userData.nnumber,
          service:      userData.service,
        } as EnrichedRequest
      })
      rows.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
      setRequests(rows)
    })
  }, [user, userData])

  const handleSuccess = () => {
    setShowForm(false)
    setSuccessMsg(true)
    setTimeout(() => setSuccessMsg(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">BTAC Board</h1>
            <p className="text-[11px] text-gray-400">
              Vacations · {userData?.name} {userData?.lastname}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xs text-gray-400 hover:text-white transition-colors">
              Quick Answer
            </Link>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-gray-700">
            {requests.length === 0 ? 'No requests yet' : `${requests.length} request${requests.length !== 1 ? 's' : ''}`}
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            + Request vacation
          </button>
        </div>

        {successMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3">
            Vacation request submitted! It is now pending approval.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {requests.map(r => <RequestCard key={r.id} request={r} />)}
        </div>

        {requests.length === 0 && (
          <div className="text-center text-sm text-gray-400 py-16">
            You have no vacation requests yet.
          </div>
        )}
      </main>

      {showForm && (
        <RequestForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
    </div>
  )
}
