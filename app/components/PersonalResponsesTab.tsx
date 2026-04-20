'use client'

import { useEffect, useState } from 'react'
import {
  collection, query, where, onSnapshot,
  addDoc, deleteDoc, doc, orderBy,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'

type PersonalResponse = {
  id:        string
  title:     string
  content:   string
  createdAt: string
}

type Props = { onCopy: (text: string) => void }

export default function PersonalResponsesTab({ onCopy }: Props) {
  const { user } = useAuth()
  const [responses, setResponses] = useState<PersonalResponse[]>([])
  const [loading,   setLoading]   = useState(true)
  const [adding,    setAdding]    = useState(false)
  const [title,     setTitle]     = useState('')
  const [content,   setContent]   = useState('')
  const [saving,    setSaving]    = useState(false)

  useEffect(() => {
    if (!user) return
    const q = query(
      collection(db, 'perResponses'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc'),
    )
    return onSnapshot(q, snap => {
      setResponses(snap.docs.map(d => ({ id: d.id, ...d.data() } as PersonalResponse)))
      setLoading(false)
    })
  }, [user])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !content.trim()) return
    setSaving(true)
    await addDoc(collection(db, 'perResponses'), {
      uid:       user.uid,
      title:     title.trim(),
      content:   content.trim(),
      createdAt: new Date().toISOString(),
    })
    setTitle('')
    setContent('')
    setAdding(false)
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, 'perResponses', id))
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">

      {/* Header + add button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">My Responses</h2>
          {!loading && (
            <p className="text-xs text-gray-400">{responses.length} saved</p>
          )}
        </div>
        <button
          onClick={() => setAdding(a => !a)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
            adding
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
        >
          {adding ? 'Cancel' : '+ New'}
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <form onSubmit={handleAdd} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Response content…"
            required
            rows={4}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <button
            type="submit"
            disabled={saving}
            className="self-end px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      )}

      {/* Response list */}
      {loading ? (
        <p className="text-sm text-gray-400 text-center py-10">Loading…</p>
      ) : responses.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">No personal responses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {responses.map(r => (
            <div
              key={r.id}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-lg leading-none transition-all"
                  title="Delete"
                >
                  ×
                </button>
              </div>
              <p className="text-xs text-gray-500 flex-1 whitespace-pre-wrap line-clamp-4">{r.content}</p>
              <button
                onClick={() => onCopy(r.content)}
                className="self-start mt-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
