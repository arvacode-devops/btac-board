'use client'

import { useState } from 'react'
import { copperCommands, resolveCommand, type DslamType, type InternetType } from '@/app/data/commands'

export default function CommandsTab({ onCopy }: { onCopy: (text: string) => void }) {
  const [internetType, setInternetType] = useState<InternetType>('copper')
  const [dslamType, setDslamType]       = useState<DslamType>('5K')
  const [shelf, setShelf] = useState('')
  const [slot,  setSlot]  = useState('')
  const [port,  setPort]  = useState('')

  const filtered = copperCommands.filter((c) => c.dslam === dslamType)

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6">
      {/* Internet type */}
      <div className="flex gap-2">
        {(['copper', 'fiber'] as InternetType[]).map((type) => (
          <button
            key={type}
            onClick={() => setInternetType(type)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              internetType === type
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {internetType === 'copper' && (
        <>
          {/* DSLAM type */}
          <div className="flex gap-2">
            {(['5K', 'E3', 'E5'] as DslamType[]).map((dslam) => (
              <button
                key={dslam}
                onClick={() => setDslamType(dslam)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  dslamType === dslam
                    ? 'bg-gray-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dslam}
              </button>
            ))}
          </div>

          {dslamType === '5K' && (
            <>
              {/* Shelf / Slot / Port inputs */}
              <div className="flex gap-2">
                {[
                  { label: 'Shelf', value: shelf, set: setShelf },
                  { label: 'Slot',  value: slot,  set: setSlot },
                  { label: 'Port',  value: port,  set: setPort },
                ].map(({ label, value, set }) => (
                  <div key={label} className="flex-1">
                    <label className="block text-[10px] text-gray-500 mb-1">{label}</label>
                    <input
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      placeholder="–"
                      className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                ))}
              </div>

              {/* Commands */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {filtered.map((cmd) => {
                  const resolved = resolveCommand(cmd.command, shelf, slot, port)
                  return (
                    <div
                      key={cmd.id}
                      onClick={() => onCopy(resolved)}
                      className="bg-gray-900 text-green-400 rounded-lg px-3 py-3 font-mono text-xs cursor-pointer active:scale-95 transition-transform select-none"
                    >
                      <span className="block text-gray-500 text-[10px] mb-0.5">{cmd.label}</span>
                      {resolved}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {(dslamType === 'E3' || dslamType === 'E5') && (
            <div className="rounded-lg bg-gray-100 p-6 text-center text-sm text-gray-400">
              {dslamType} commands coming soon
            </div>
          )}
        </>
      )}

      {internetType === 'fiber' && (
        <div className="rounded-lg bg-gray-100 p-6 text-center text-sm text-gray-400">
          Fiber commands coming soon
        </div>
      )}
    </div>
  )
}
