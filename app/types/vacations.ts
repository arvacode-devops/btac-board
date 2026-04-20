export type UserData = {
  eid:          string
  email:        string
  name:         string
  lastname:     string
  level:        'agent' | 'admin'
  nnumber:      string
  sch:          string
  scheduleType: string
  service:      string
  weekdayOff:   string
}

export type AgentRow = UserData & { uid: string }

export type VacationRequest = {
  id:          string
  agentUID:    string
  approvedBy:  string
  endDate:     string
  requestDate: string
  startDate:   string
  status:      'pending' | 'approved' | 'rejected'
  // Legacy denormalized fields — present on old records, absent on new ones
  agentName?:    string
  agentLastame?: string
  agentNnumber?: string
  service?:      string
}

// VacationRequest enriched with live agent data — use this for display
export type EnrichedRequest = VacationRequest & {
  agentName:    string
  agentLastame: string
  agentNnumber: string
  service:      string
}

export type AdminNavView =
  | 'dashboard'
  | 'new-requests'
  | 'calendar'
  | 'history'
  | 'add-vacation'
  | 'add-user'
  | 'user-list'
  | 'settings'
