'use client'

import { useEffect, useState } from 'react'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import type { UserData } from '@/app/types/vacations'

export default function SettingsView({ userData }: { userData: UserData | null }) {
  const [monthValue, setMonthValue] = useState('3')
  const [saving,     setSaving]     = useState(false)
  const [saved,      setSaved]      = useState(false)

  useEffect(() => {
    getDoc(doc(db, 'globalVariables', 'month')).then(snap => {
      if (snap.exists()) setMonthValue(snap.data().value ?? '3')
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    await setDoc(doc(db, 'globalVariables', 'month'), {
      value:     monthValue,
      updatedAt: serverTimestamp(),
      updatedBy: `${userData?.name} ${userData?.lastname}`,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Settings</h2>

      <div className="max-w-sm flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vacation window (months)
          </label>
          <p className="text-xs text-gray-400 mb-3">
            How many months ahead agents can request. E.g. 3 = current month + next 2 months.
          </p>
          <input
            type="number"
            min="1"
            max="12"
            value={monthValue}
            onChange={e => setMonthValue(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {saved && (
          <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">
            Saved successfully.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}
