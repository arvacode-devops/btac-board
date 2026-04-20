export type DslamType = '5K' | 'E3' | 'E5'
export type InternetType = 'copper' | 'fiber'

export type Command = {
  id: number
  dslam: DslamType
  label: string
  command: string
}

export const copperCommands: Command[] = [
  { id: 1, dslam: '5K', label: 'Show EVC table',    command: 'show tab evc' },
  { id: 2, dslam: '5K', label: 'Show EVC-map',      command: 'show tab evc-map {shelf}/{slot} sub' },
  { id: 3, dslam: '5K', label: 'Show VDSL table',   command: 'show tab int vdsl {shelf}/{slot} real' },
  { id: 4, dslam: '5K', label: 'Show VDSL port',    command: 'show int vdsl {shelf}/{slot}/{port} real' },
  { id: 5, dslam: '5K', label: 'Show EFM group',    command: 'show efm-group {shelf}/{slot}' },
]

export function resolveCommand(template: string, shelf: string, slot: string, port: string): string {
  return template
    .replace('{shelf}', shelf || 'shelf')
    .replace('{slot}',  slot  || 'slot')
    .replace('{port}',  port  || 'port')
}
