'use client'

import { useState } from 'react'
import { messages, categories as staticCategories, CATEGORY_COLORS, DEFAULT_COLORS } from '@/app/data/messages'
import type { PersonalResponse } from './QuickAnswer'

const PERSONAL_COLORS = {
  filter: 'bg-violet-600 text-white',
  border: 'border-violet-500',
  badge:  'bg-violet-100 text-violet-700',
}

type Props = {
  onCopy:            (text: string) => void
  personalResponses: PersonalResponse[]
  onAddResponse:     (title: string, content: string) => Promise<void>
  onDeleteResponse:  (id: string) => void
}

export default function MessagesTab({ onCopy, personalResponses, onAddResponse, onDeleteResponse }: Props) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [adding,  setAdding]  = useState(false)
  const [title,   setTitle]   = useState('')
  const [content, setContent] = useState('')
  const [saving,  setSaving]  = useState(false)

  const allCategories = [...staticCategories, 'Personal']

  const filtered = activeCategory === 'All'
    ? messages
    : activeCategory === 'Personal'
    ? null
    : messages.filter(m => m.tagName === activeCategory)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await onAddResponse(title, content)
    setTitle('')
    setContent('')
    setAdding(false)
    setSaving(false)
  }

  return (
    <div>
      {/* Category pills */}
      <div className="flex flex-wrap gap-2 px-3 sm:px-4 lg:px-6 py-3">
        {allCategories.map(cat => {
          const colors = cat === 'Personal'
            ? PERSONAL_COLORS
            : cat === 'All' ? DEFAULT_COLORS : (CATEGORY_COLORS[cat] ?? DEFAULT_COLORS)
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                isActive ? colors.filter : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat}
              {cat === 'Personal' && personalResponses.length > 0 && (
                <span className={`ml-1 ${isActive ? 'opacity-70' : 'text-gray-400'}`}>
                  ({personalResponses.length})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Personal category */}
      {filtered === null ? (
        <div className="px-3 sm:px-4 lg:px-6 pb-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              onClick={() => setAdding(a => !a)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                adding ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {adding ? 'Cancel' : '+ New response'}
            </button>
          </div>

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

          {personalResponses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-10">No personal responses yet. Add one!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {personalResponses.map(r => (
                <div key={r.id} className="bg-white rounded-lg border-l-4 border-violet-500 shadow-sm p-3 group">
                  <div className="flex items-start justify-between mb-1 gap-2">
                    <span className="text-sm font-semibold text-gray-900">{r.title}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-violet-100 text-violet-700">
                        Personal
                      </span>
                      <button
                        onClick={() => onDeleteResponse(r.id)}
                        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 text-lg leading-none transition-all"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p
                    className="text-xs text-gray-600 leading-relaxed cursor-pointer active:scale-95 transition-transform select-none"
                    onClick={() => onCopy(r.content)}
                  >
                    {r.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Static messages */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-3 sm:px-4 lg:px-6 pb-6">
          {filtered.map((msg, i) => {
            const colors = CATEGORY_COLORS[msg.tagName] ?? DEFAULT_COLORS
            return (
              <div
                key={`${msg.id}-${i}`}
                onClick={() => onCopy(msg.content)}
                className={`bg-white rounded-lg border-l-4 ${colors.border} shadow-sm p-3 cursor-pointer active:scale-95 transition-transform select-none`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-900">{msg.title}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${colors.badge}`}>
                    {msg.tagName}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{msg.content}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
