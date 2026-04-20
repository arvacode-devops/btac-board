'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { db, firebaseConfig } from '@/app/lib/firebase'
import type { UserData } from '@/app/types/vacations'

type AgentRow = UserData & { uid: string }

const BLANK_FORM = {
  name: '', lastname: '', email: '', password: '',
  eid: '', nnumber: '', sch: '8', scheduleType: 'weekday',
  service: 'chat', weekdayOff: '', level: 'agent' as 'agent' | 'admin',
}

export default function AgentManagement() {
  const [agents,    setAgents]    = useState<AgentRow[]>([])
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(BLANK_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]     = useState('')
  const [success,    setSuccess]   = useState('')

  useEffect(() => {
    return onSnapshot(collection(db, 'users'), snap => {
      setAgents(
        snap.docs.map(d => ({ uid: d.id, ...d.data() } as AgentRow))
          .sort((a, b) => a.lastname.localeCompare(b.lastname))
      )
    })
  }, [])

  const set = (field: keyof typeof BLANK_FORM, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const tempApp  = initializeApp(firebaseConfig, `temp-${Date.now()}`)
    const tempAuth = getAuth(tempApp)
    try {
      const { user: newUser } = await createUserWithEmailAndPassword(tempAuth, form.email, form.password)
      await setDoc(doc(db, 'users', newUser.uid), {
        name:         form.name,
        lastname:     form.lastname,
        email:        form.email,
        eid:          form.eid,
        nnumber:      form.nnumber,
        sch:          form.sch,
        scheduleType: form.scheduleType,
        service:      form.service,
        weekdayOff:   form.weekdayOff,
        level:        form.level,
        timeStamp:    serverTimestamp(),
      })
      setSuccess(`${form.name} ${form.lastname} registered successfully.`)
      setForm(BLANK_FORM)
      setShowForm(false)
      setTimeout(() => setSuccess(''), 4000)
    } catch (err: unknown) {
      const msg = (err as { message?: string }).message ?? 'Failed to create agent.'
      setError(msg)
    } finally {
      await deleteApp(tempApp)
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{agents.length} agents</p>
        <button
          onClick={() => { setShowForm(true); setError('') }}
          className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          + Register agent
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      {/* Agent list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {agents.map(a => (
          <div key={a.uid} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-start justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">{a.name} {a.lastname}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                a.level === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {a.level}
              </span>
            </div>
            <p className="text-xs text-gray-400">{a.email}</p>
            <div className="flex gap-3 mt-2 text-[11px] text-gray-500">
              <span>{a.nnumber}</span>
              <span>·</span>
              <span>{a.service}</span>
              <span>·</span>
              <span>Sch {a.sch}h</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create agent modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Register Agent</h3>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                {([['name','Name'],['lastname','Last name']] as [keyof typeof BLANK_FORM, string][]).map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
                    <input required value={form[f]} onChange={e => set(f, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Email</label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div>
                <label className="block text-[10px] text-gray-500 mb-1">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={e => set('password', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {([['eid','EID'],['nnumber','N-Number']] as [keyof typeof BLANK_FORM, string][]).map(([f, label]) => (
                  <div key={f}>
                    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
                    <input required value={form[f]} onChange={e => set(f, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Sch (hrs)</label>
                  <input value={form.sch} onChange={e => set('sch', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Schedule</label>
                  <select value={form.scheduleType} onChange={e => set('scheduleType', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="weekday">Weekday</option>
                    <option value="weekend">Weekend</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Service</label>
                  <select value={form.service} onChange={e => set('service', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="chat">Chat</option>
                    <option value="phone">Phone</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Weekday off</label>
                  <input value={form.weekdayOff} onChange={e => set('weekdayOff', e.target.value)} placeholder="e.g. Monday"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-500 mb-1">Role</label>
                  <select value={form.level} onChange={e => set('level', e.target.value as 'agent' | 'admin')}
                    className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors">
                  {submitting ? 'Creating…' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
