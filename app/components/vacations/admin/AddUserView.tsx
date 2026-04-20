'use client'

import { useState } from 'react'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { initializeApp, deleteApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { db, firebaseConfig } from '@/app/lib/firebase'

const BLANK = {
  name: '', lastname: '', email: '', password: '',
  eid: '', nnumber: '', sch: '8', scheduleType: 'weekday',
  service: 'chat', weekdayOff: '', level: 'agent' as 'agent' | 'admin',
}

type FormState = typeof BLANK

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400'

function TextInput({
  label, value, onChange, type = 'text', required = true,
}: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inputCls}
      />
    </div>
  )
}

function SelectInput({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={inputCls}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export default function AddUserView() {
  const [form,       setForm]       = useState<FormState>(BLANK)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

  const set = (field: keyof FormState) => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    const tempApp  = initializeApp(firebaseConfig, `temp-${Date.now()}`)
    const tempAuth = getAuth(tempApp)
    try {
      const { user } = await createUserWithEmailAndPassword(tempAuth, form.email, form.password)
      await setDoc(doc(db, 'users', user.uid), {
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
      setForm(BLANK)
    } catch (err: unknown) {
      setError((err as { message?: string }).message ?? 'Failed to create user.')
    } finally {
      await deleteApp(tempApp)
      setSubmitting(false)
    }
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Add User</h2>

      <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="First name" value={form.name}     onChange={set('name')} />
          <TextInput label="Last name"  value={form.lastname} onChange={set('lastname')} />
        </div>
        <TextInput label="Email"    value={form.email}    onChange={set('email')}    type="email" />
        <TextInput label="Password" value={form.password} onChange={set('password')} type="password" />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="EID"      value={form.eid}     onChange={set('eid')} />
          <TextInput label="N-Number" value={form.nnumber} onChange={set('nnumber')} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <TextInput label="Schedule (hrs)" value={form.sch} onChange={set('sch')} />
          <SelectInput
            label="Type"
            value={form.scheduleType}
            onChange={set('scheduleType')}
            options={[{ value: 'weekday', label: 'Weekday' }, { value: 'weekend', label: 'Weekend' }]}
          />
          <SelectInput
            label="Service"
            value={form.service}
            onChange={set('service')}
            options={[{ value: 'chat', label: 'Chat' }, { value: 'phone', label: 'Phone' }]}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Weekday off" value={form.weekdayOff} onChange={set('weekdayOff')} required={false} />
          <SelectInput
            label="Role"
            value={form.level}
            onChange={set('level')}
            options={[{ value: 'agent', label: 'Agent' }, { value: 'admin', label: 'Admin' }]}
          />
        </div>

        {error   && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        {success && <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {submitting ? 'Creating…' : 'Register User'}
        </button>
      </form>
    </div>
  )
}
