'use client'

import { useAuth } from '@/app/context/AuthContext'
import AgentView from '@/app/components/vacations/AgentView'
import AdminView from '@/app/components/vacations/AdminView'

export default function VacationsPage() {
  const { userData } = useAuth()
  if (userData?.level === 'admin') return <AdminView />
  return <AgentView />
}
