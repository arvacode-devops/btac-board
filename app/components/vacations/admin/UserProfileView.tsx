'use client'

import { useEffect, useState } from 'react'
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import RequestCard from '../RequestCard'
import type { AgentRow, VacationRequest, EnrichedRequest } from '@/app/types/vacations'

const inputCls  = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400'
const labelCls  = 'block text-[10px] text-gray-500 mb-1'

type EditForm = Omit<AgentRow, 'uid'>

type Props = {
  agent:     AgentRow
  onBack:    () => void
  onDeleted: () => void
}

export default function UserProfileView({ agent, onBack, onDeleted }: Props) {
  const [editing,        setEditing]        = useState(false)
  const [form,           setForm]           = useState<EditForm>({ ...agent })
  const [saving,         setSaving]         = useState(false)
  const [confirmDelete,  setConfirmDelete]  = useState(false)
  const [deleting,       setDeleting]       = useState(false)
  const [vacations,  setVacations]  = useState<EnrichedRequest[]>([])
  const [loadingVac, setLoadingVac] = useState(true)

  useEffect(() => {
    getDocs(query(collection(db, 'vacationRequest'), where('agentUID', '==', agent.uid)))
      .then(snap => {
        const rows = snap.docs.map(d => {
          const req = { id: d.id, ...d.data() } as VacationRequest
          return {
            ...req,
            agentName:    agent.name,
            agentLastame: agent.lastname,
            agentNnumber: agent.nnumber,
            service:      agent.service,
          } as EnrichedRequest
        })
        rows.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
        setVacations(rows)
      })
      .finally(() => setLoadingVac(false))
  }, [agent.uid])

  const set = (field: keyof EditForm) => (value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setSaving(true)
    await updateDoc(doc(db, 'users', agent.uid), {
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
    })
    setSaving(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteDoc(doc(db, 'users', agent.uid))
    onDeleted()
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">

      {/* Back + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {agent.name} {agent.lastname}
        </h2>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
          agent.level === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {agent.level}
        </span>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 max-w-lg">
        {!editing ? (
          <>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm mb-5">
              <Info label="Email"       value={agent.email} />
              <Info label="EID"         value={agent.eid} />
              <Info label="N-Number"    value={agent.nnumber} />
              <Info label="Service"     value={agent.service} />
              <Info label="Schedule"    value={`${agent.sch}h · ${agent.scheduleType}`} />
              <Info label="Weekday off" value={agent.weekdayOff || '—'} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => { setForm({ ...agent }); setEditing(true) }}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Edit
              </button>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-red-600 font-medium">Are you sure?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {deleting ? 'Deleting…' : 'Yes, delete'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" value={form.name}     onChange={set('name')} />
              <Field label="Last name"  value={form.lastname} onChange={set('lastname')} />
            </div>
            <Field label="Email"   value={form.email}   onChange={set('email')}   type="email" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="EID"      value={form.eid}     onChange={set('eid')} />
              <Field label="N-Number" value={form.nnumber} onChange={set('nnumber')} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Field label="Schedule (hrs)" value={form.sch} onChange={set('sch')} />
              <Select
                label="Type"
                value={form.scheduleType}
                onChange={set('scheduleType')}
                options={[{ value: 'weekday', label: 'Weekday' }, { value: 'weekend', label: 'Weekend' }]}
              />
              <Select
                label="Service"
                value={form.service}
                onChange={set('service')}
                options={[{ value: 'chat', label: 'Chat' }, { value: 'phone', label: 'Phone' }]}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Weekday off" value={form.weekdayOff} onChange={set('weekdayOff')} />
              <Select
                label="Role"
                value={form.level}
                onChange={set('level')}
                options={[{ value: 'agent', label: 'Agent' }, { value: 'admin', label: 'Admin' }]}
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Vacation history */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Vacation history</h3>
        {loadingVac ? (
          <p className="text-sm text-gray-400">Loading…</p>
        ) : vacations.length === 0 ? (
          <p className="text-sm text-gray-400">No vacation requests yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vacations.map(r => <RequestCard key={r.id} request={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm text-gray-800 font-medium">{value}</p>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} className={inputCls} />
    </div>
  )
}

function Select({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} className={inputCls}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}
