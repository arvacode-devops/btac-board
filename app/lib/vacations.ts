import type { VacationRequest, AgentRow, EnrichedRequest } from '@/app/types/vacations'

export function enrich(req: VacationRequest, agents: AgentRow[]): EnrichedRequest {
  const agent = agents.find(a => a.uid === req.agentUID)
  return {
    ...req,
    agentName:    agent?.name     ?? req.agentName    ?? '',
    agentLastame: agent?.lastname ?? req.agentLastame ?? '',
    agentNnumber: agent?.nnumber  ?? req.agentNnumber ?? '',
    service:      agent?.service  ?? req.service      ?? '',
  }
}

export function enrichAll(reqs: VacationRequest[], agents: AgentRow[]): EnrichedRequest[] {
  return reqs.map(r => enrich(r, agents))
}
