'use client'

import RequestCard from '../RequestCard'
import type { EnrichedRequest } from '@/app/types/vacations'

type Props = {
  requests:  EnrichedRequest[]
  onApprove: (id: string) => void
  onReject:  (id: string) => void
}

export default function NewRequestsView({ requests, onApprove, onReject }: Props) {
  const sorted = [...requests].sort(
    (a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime(),
  )

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-gray-900">New Requests</h2>
        {sorted.length > 0 && (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            {sorted.length} pending
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <p className="text-sm">No pending requests.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sorted.map(r => (
            <RequestCard key={r.id} request={r} onApprove={onApprove} onReject={onReject} />
          ))}
        </div>
      )}
    </div>
  )
}
