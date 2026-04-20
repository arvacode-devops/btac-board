'use client'

import { useState } from 'react'
import { useAuth } from '@/app/context/AuthContext'

const DOMAIN = '@windstream.com'

const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found':    'No account found with this N-number.',
  'auth/wrong-password':    'Incorrect password.',
  'auth/invalid-email':     'Invalid N-number.',
  'auth/invalid-credential':'Invalid N-number or password.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
}

export default function LoginForm() {
  const { signIn } = useAuth()
  const [nnumber,  setNnumber]  = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(`${nnumber.trim().toLowerCase()}${DOMAIN}`, password)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? ''
      setError(ERROR_MESSAGES[code] ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">BTAC Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">N-Number</label>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-400">
              <input
                type="text"
                value={nnumber}
                onChange={e => setNnumber(e.target.value)}
                required
                placeholder="n123456"
                autoComplete="username"
                className="flex-1 px-4 py-2.5 text-sm text-gray-900 focus:outline-none"
              />
              <span className="px-3 text-sm text-gray-400 bg-gray-50 border-l border-gray-200 py-2.5 select-none">
                @windstream.com
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
