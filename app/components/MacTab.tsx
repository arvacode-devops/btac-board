'use client'

import { useState } from 'react'

function formatMac(raw: string): string {
  const clean = raw.replace(/[:\-.\s]/g, '').toLowerCase().slice(0, 12)
  return (clean.match(/.{1,2}/g) ?? []).join(':')
}

const COMMANDS = [
  {
    tag: 'IPoE',
    tagColor: 'bg-cyan-100 text-cyan-700',
    template: 'show service id 21 subscriber-hosts mac {mac} detail',
  },
  {
    tag: 'PPPoE',
    tagColor: 'bg-yellow-100 text-yellow-800',
    template: 'show service id 21 pppoe session mac {mac} detail',
  },
]

export default function MacTab({ onCopy }: { onCopy: (text: string) => void }) {
  const [raw, setRaw] = useState('')

  const formatted  = formatMac(raw)
  const hexLen     = formatted.replace(/:/g, '').length
  const isComplete = hexLen === 12

  return (
    <div className="p-3 sm:p-4 lg:p-6 flex flex-col gap-4 max-w-lg">
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Paste MAC Address</label>
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value.replace(/[^0-9a-fA-F:\-.\s]/g, ''))}
          placeholder="aabbccddeeff"
          spellCheck={false}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {formatted && (
        <div
          onClick={() => isComplete && onCopy(formatted)}
          className={`flex items-center justify-between rounded-xl px-4 py-3 transition-transform select-none ${
            isComplete
              ? 'bg-gray-900 text-green-400 cursor-pointer active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-default'
          }`}
        >
          <span className="font-mono text-xl font-semibold tracking-widest">{formatted}</span>
          <span className="text-xs text-gray-500">
            {isComplete ? 'tap to copy' : `${hexLen} / 12`}
          </span>
        </div>
      )}

      {isComplete && (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Commands</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {COMMANDS.map((cmd) => {
              const resolved = cmd.template.replace('{mac}', formatted)
              return (
                <div
                  key={cmd.tag}
                  onClick={() => onCopy(resolved)}
                  className="bg-gray-900 text-green-400 rounded-lg px-3 py-3 font-mono text-xs cursor-pointer active:scale-95 transition-transform select-none"
                >
                  <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mb-1.5 ${cmd.tagColor}`}>
                    {cmd.tag}
                  </span>
                  <div>{resolved}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
