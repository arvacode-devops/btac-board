'use client'

import { useAuth } from '@/app/context/AuthContext'
import LoginForm from './vacations/LoginForm'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, userData, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user || !userData) return <LoginForm />

  return <>{children}</>
}
