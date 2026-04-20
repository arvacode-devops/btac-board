'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import { enrichAll } from '@/app/lib/vacations'
import Sidebar         from './admin/Sidebar'
import DashboardView   from './admin/DashboardView'
import NewRequestsView from './admin/NewRequestsView'
import CalendarView    from './admin/CalendarView'
import HistoryView     from './admin/HistoryView'
import AddVacationView from './admin/AddVacationView'
import AddUserView     from './admin/AddUserView'
import UserListView    from './admin/UserListView'
import SettingsView    from './admin/SettingsView'
import type { VacationRequest, AgentRow, EnrichedRequest, AdminNavView } from '@/app/types/vacations'

export default function AdminView() {
  const { userData, signOut } = useAuth()
  const [activeView,  setActiveView]  = useState<AdminNavView>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [requests,    setRequests]    = useState<VacationRequest[]>([])
  const [agents,      setAgents]      = useState<AgentRow[]>([])

  useEffect(() => {
    const q = query(collection(db, 'vacationRequest'), orderBy('requestDate', 'desc'))
    return onSnapshot(q, snap => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() } as VacationRequest)))
    })
  }, [])

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snap => {
      setAgents(snap.docs.map(d => ({ uid: d.id, ...d.data() } as AgentRow)))
    })
  }, [])

  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, 'vacationRequest', id), {
      status:     'approved',
      approvedBy: `${userData?.name} ${userData?.lastname}`,
    })
  }

  const handleReject = async (id: string) => {
    await updateDoc(doc(db, 'vacationRequest', id), {
      status:     'rejected',
      approvedBy: `${userData?.name} ${userData?.lastname}`,
    })
  }

  const handlePending = async (id: string) => {
    await updateDoc(doc(db, 'vacationRequest', id), {
      status:     'pending',
      approvedBy: '',
    })
  }

  // Enrich all requests with live agent data (single source of truth)
  const enriched: EnrichedRequest[] = enrichAll(requests, agents)
  const pending = enriched.filter(r => r.status === 'pending')

  const navigate = (v: AdminNavView) => {
    setActiveView(v)
    setSidebarOpen(false)
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">

      <header className="bg-gray-900 text-white shrink-0 z-20">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="md:hidden flex flex-col gap-1 w-5"
            >
              <span className="h-0.5 bg-white rounded" />
              <span className="h-0.5 bg-white rounded" />
              <span className="h-0.5 bg-white rounded" />
            </button>
            <div>
              <h1 className="text-base font-bold">BTAC Board</h1>
              <p className="text-[11px] text-gray-400">
                Vacations · {userData?.name} {userData?.lastname} · Admin
              </p>
            </div>
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

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeView={activeView}
          onNavigate={navigate}
          pendingCount={pending.length}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          {activeView === 'dashboard'    && <DashboardView requests={enriched} agents={agents} />}
          {activeView === 'new-requests' && <NewRequestsView requests={pending} onApprove={handleApprove} onReject={handleReject} />}
          {activeView === 'calendar'     && <CalendarView requests={enriched} onReject={handleReject} onPending={handlePending} />}
          {activeView === 'history'      && <HistoryView agents={agents} />}
          {activeView === 'add-vacation' && <AddVacationView agents={agents} />}
          {activeView === 'add-user'     && <AddUserView />}
          {activeView === 'user-list'    && <UserListView agents={agents} />}
          {activeView === 'settings'     && <SettingsView userData={userData} />}
        </main>
      </div>
    </div>
  )
}
