'use client'

import type { EnrichedRequest } from '@/app/types/vacations'

const STATUS_STYLE = {
  pending:  'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100  text-green-800',
  rejected: 'bg-red-100    text-red-700',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

function countDays(start: string, end: string) {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  return Math.round(ms / 86_400_000)
}

type Props = {
  request:   EnrichedRequest
  onApprove?: (id: string) => void
  onReject?:  (id: string) => void
}

export default function RequestCard({ request, onApprove, onReject }: Props) {
  const days = countDays(request.startDate, request.endDate)

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {request.agentName} {request.agentLastame}
            <span className="ml-2 text-xs text-gray-400 font-normal">{request.agentNnumber}</span>
          </p>
          <p className="text-xs text-gray-400">
            Requested {formatDate(request.requestDate)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
            {request.service}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[request.status]}`}>
            {request.status}
          </span>
        </div>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
        <span className="text-sm font-mono text-gray-900">{formatDate(request.startDate)}</span>
        <span className="text-gray-400 text-xs">→</span>
        <span className="text-sm font-mono text-gray-900">{formatDate(request.endDate)}</span>
        <span className="ml-auto text-xs text-gray-400">{days} {days === 1 ? 'day' : 'days'}</span>
      </div>

      {/* Approved by */}
      {request.approvedBy && (
        <p className="text-[11px] text-gray-400">
          {request.status === 'approved' ? 'Approved' : 'Reviewed'} by {request.approvedBy}
        </p>
      )}

      {/* Admin actions */}
      {onApprove && request.status === 'pending' && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onApprove(request.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Approve
          </button>
          <button
            onClick={() => onReject!(request.id)}
            className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  )
}
