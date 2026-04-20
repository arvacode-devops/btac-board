'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import {
  collection, query, where, onSnapshot,
  addDoc, deleteDoc, doc,
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'
import { useAuth } from '@/app/context/AuthContext'
import MessagesTab from './MessagesTab'
import CommandsTab from './CommandsTab'
import MacTab from './MacTab'
import SpeedsTab from './SpeedsTab'

export type PersonalResponse = {
  id: string; title: string; content: string; createdAt: string
}

type Tab = 'messages' | 'commands' | 'mac' | 'speeds'

const TAB_LABELS: Record<Tab, string> = {
  messages: 'Messages',
  commands: 'Commands',
  mac:      'MAC',
  speeds:   'Speeds',
}

export default function QuickAnswer() {
  const { user, signOut }  = useAuth()
  const [activeTab,    setActiveTab]    = useState<Tab>('messages')
  const [toastVisible, setToastVisible] = useState(false)
  const [personalResponses, setPersonalResponses] = useState<PersonalResponse[]>([])

  // Subscription lives at this level — survives tab switches
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'perResponses'), where('uid', '==', user.uid))
    return onSnapshot(q, snap => {
      const rows = snap.docs.map(d => ({ id: d.id, ...d.data() } as PersonalResponse))
      rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setPersonalResponses(rows)
    })
  }, [user])

  const handleAddResponse = async (title: string, content: string) => {
    if (!user) return
    await addDoc(collection(db, 'perResponses'), {
      uid:       user.uid,
      title:     title.trim(),
      content:   content.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  const handleDeleteResponse = (id: string) => deleteDoc(doc(db, 'perResponses', id))

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 1400)
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <h1 className="text-base sm:text-lg font-bold tracking-tight">BTAC Board</h1>
          <div className="flex items-center gap-4">
            <Link href="/vacations" className="text-xs text-gray-400 hover:text-white transition-colors">
              Vacations
            </Link>
            <button onClick={signOut} className="text-xs text-gray-400 hover:text-white transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {(['messages', 'commands', 'mac', 'speeds'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>
      </nav>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto">
          {activeTab === 'messages' && (
            <MessagesTab
              onCopy={handleCopy}
              personalResponses={personalResponses}
              onAddResponse={handleAddResponse}
              onDeleteResponse={handleDeleteResponse}
            />
          )}
          {activeTab === 'commands' && <CommandsTab onCopy={handleCopy} />}
          {activeTab === 'mac'      && <MacTab      onCopy={handleCopy} />}
          {activeTab === 'speeds'   && <SpeedsTab   onCopy={handleCopy} />}
        </div>
      </main>

      {/* Copy toast */}
      {toastVisible && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-full shadow-lg z-50 pointer-events-none">
          Copied!
        </div>
      )}
    </div>
  )
}
