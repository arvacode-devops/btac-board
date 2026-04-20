'use client'

import { useState } from 'react'
import {
  dynamicSpeed,
  staticSpeed,
  PRIORITY_STYLE,
  type Profile,
  type PinCount,
} from '@/app/data/speeds'

export default function SpeedsTab({ onCopy }: { onCopy: (text: string) => void }) {
  const [profile,    setProfile]    = useState<Profile>('dynamic')
  const [pin,        setPin]        = useState<PinCount>(1)
  const [footage,    setFootage]    = useState('')
  const [dividedSet, setDividedSet] = useState<Set<number>>(new Set())

  const foot = parseInt(footage) || 0

  const dynamicResults = foot > 0
    ? dynamicSpeed.filter(s => s.pin === pin && foot >= s.foot[0] && foot <= s.foot[1])
    : []

  const staticResults = foot > 0
    ? staticSpeed.filter(s => foot >= s.foot[0] && foot <= s.foot[1])
    : []

  const toggleDivide = (i: number) => {
    setDividedSet(prev => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  const handleFootageChange = (val: string) => {
    setFootage(val.replace(/\D/g, ''))
    setDividedSet(new Set())
  }

  return (
    <div className="flex flex-col gap-4 p-3 sm:p-4 lg:p-6">
      {/* Profile toggle */}
      <div className="flex gap-2">
        {(['dynamic', 'fixed'] as Profile[]).map(p => (
          <button
            key={p}
            onClick={() => { setProfile(p); setDividedSet(new Set()) }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
              profile === p
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Pin count — dynamic only */}
      {profile === 'dynamic' && (
        <div className="flex gap-2">
          {([1, 2] as PinCount[]).map(p => (
            <button
              key={p}
              onClick={() => { setPin(p); setDividedSet(new Set()) }}
              className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                pin === p
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p === 1 ? 'Single' : 'Bonded'}
            </button>
          ))}
        </div>
      )}

      {/* Footage input */}
      <div>
        <label className="block text-xs text-gray-500 mb-1.5">Footage (ft)</label>
        <input
          value={footage}
          onChange={e => handleFootageChange(e.target.value)}
          placeholder="e.g. 1500"
          inputMode="numeric"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-base font-mono text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      </div>

      {/* Dynamic results */}
      {profile === 'dynamic' && foot > 0 && (
        dynamicResults.length === 0
          ? <p className="text-sm text-gray-400 text-center py-6">No profiles found for {footage} ft</p>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {dynamicResults.map((s, i) => {
                const style   = PRIORITY_STYLE[s.priority]
                const divided = dividedSet.has(i)
                const down    = divided ? s.downSpeed / 2 : s.downSpeed
                const up      = divided ? s.upSpeed   / 2 : s.upSpeed
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-xl border-l-4 ${style.border} shadow-sm p-3 flex flex-col gap-2`}
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">{s.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.labelColor}`}>
                        {style.label}
                      </span>
                    </div>

                    {/* Speed pills */}
                    <div className="flex gap-2">
                      <div
                        onClick={() => onCopy(String(down))}
                        className="flex-1 bg-gray-50 rounded-lg p-2 cursor-pointer active:scale-95 transition-transform select-none"
                      >
                        <p className="text-[10px] text-gray-400 mb-0.5">Down</p>
                        <p className="text-sm font-bold text-gray-900 tabular-nums">{down.toLocaleString()}</p>
                      </div>
                      <div
                        onClick={() => onCopy(String(up))}
                        className="flex-1 bg-gray-50 rounded-lg p-2 cursor-pointer active:scale-95 transition-transform select-none"
                      >
                        <p className="text-[10px] text-gray-400 mb-0.5">Up</p>
                        <p className="text-sm font-bold text-gray-900 tabular-nums">{up.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Divide toggle — bonded only */}
                    {pin === 2 && (
                      <button
                        onClick={() => toggleDivide(i)}
                        className={`w-full py-1 rounded-lg text-xs font-semibold border transition-all ${
                          divided
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {divided ? '× Restore full' : '÷ Split per pin'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )
      )}

      {/* Fixed results */}
      {profile === 'fixed' && foot > 0 && (
        staticResults.length === 0
          ? <p className="text-sm text-gray-400 text-center py-6">No plans found for {footage} ft</p>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {staticResults.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border-l-4 border-blue-400 shadow-sm p-3 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">{s.id}</span>
                    <span className="text-[10px] text-gray-400">
                      {Array.isArray(s.profile) ? s.profile.join(' · ') : s.profile}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div
                      onClick={() => onCopy(String(s.downSpeed))}
                      className="flex-1 bg-gray-50 rounded-lg p-2 cursor-pointer active:scale-95 transition-transform select-none"
                    >
                      <p className="text-[10px] text-gray-400 mb-0.5">Down</p>
                      <p className="text-sm font-bold text-gray-900 tabular-nums">{s.downSpeed.toLocaleString()}</p>
                    </div>
                    <div
                      onClick={() => onCopy(String(s.upSpeed))}
                      className="flex-1 bg-gray-50 rounded-lg p-2 cursor-pointer active:scale-95 transition-transform select-none"
                    >
                      <p className="text-[10px] text-gray-400 mb-0.5">Up</p>
                      <p className="text-sm font-bold text-gray-900 tabular-nums">{s.upSpeed.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )
}
