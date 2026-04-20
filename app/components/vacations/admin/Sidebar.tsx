'use client'

import type { AdminNavView } from '@/app/types/vacations'

type NavItem = { id: AdminNavView; label: string; badge?: boolean }
type Section = { title?: string; items: NavItem[] }

const SECTIONS: Section[] = [
  {
    items: [{ id: 'dashboard', label: 'Dashboard' }],
  },
  {
    title: 'Users',
    items: [
      { id: 'add-user',   label: 'Add User' },
      { id: 'user-list',  label: 'User List' },
    ],
  },
  {
    title: 'Vacations',
    items: [
      { id: 'new-requests',  label: 'New Requests', badge: true },
      { id: 'calendar',      label: 'Calendar' },
      { id: 'history',       label: 'History' },
      { id: 'add-vacation',  label: 'Add Vacation' },
    ],
  },
  {
    items: [{ id: 'settings', label: 'Settings' }],
  },
]

type Props = {
  activeView:   AdminNavView
  onNavigate:   (v: AdminNavView) => void
  pendingCount: number
  open:         boolean
  onClose:      () => void
}

export default function Sidebar({ activeView, onNavigate, pendingCount, open, onClose }: Props) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-56 bg-gray-900 flex flex-col shrink-0
          transform transition-transform duration-200 ease-in-out
          md:relative md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
          {SECTIONS.map((section, si) => (
            <div key={si}>
              {section.title && (
                <p className="px-4 pt-4 pb-1 text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                  {section.title}
                </p>
              )}
              {section.items.map(item => {
                const isActive = activeView === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm rounded-none transition-colors text-left ${
                      isActive
                        ? 'bg-gray-700 text-white font-semibold'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    {item.label}
                    {item.badge && pendingCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-amber-400 text-gray-900 rounded-full">
                        {pendingCount}
                      </span>
                    )}
                  </button>
                )
              })}
              {si < SECTIONS.length - 1 && section.title && (
                <div className="mt-2 border-t border-gray-800" />
              )}
            </div>
          ))}
        </div>
      </aside>
    </>
  )
}
