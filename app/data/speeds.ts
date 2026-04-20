export type PinCount = 1 | 2
export type Profile  = 'dynamic' | 'fixed'

export type DynamicSpeed = {
  id: string
  foot: [number, number]
  pin: PinCount
  downSpeed: number
  upSpeed: number
  priority: 0 | 1 | 2
}

export type StaticSpeed = {
  id: string
  foot: [number, number]
  profile: string | string[]
  downSpeed: number
  upSpeed: number
}

export const dynamicSpeed: DynamicSpeed[] = [
  // VDSL2 (17a) — Single pin
  { id: 'VDSL2 (17a)',           foot: [0,    500],  pin: 1, downSpeed: 108672, upSpeed: 31232, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [501,  1000], pin: 1, downSpeed: 93824,  upSpeed: 31232, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [1001, 1500], pin: 1, downSpeed: 83712,  upSpeed: 31232, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [1501, 2000], pin: 1, downSpeed: 57600,  upSpeed: 22528, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [2001, 2500], pin: 1, downSpeed: 57600,  upSpeed: 16640, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [2501, 3000], pin: 1, downSpeed: 46208,  upSpeed: 9088,  priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [3001, 3500], pin: 1, downSpeed: 40576,  upSpeed: 9088,  priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [3501, 4000], pin: 1, downSpeed: 35712,  upSpeed: 5504,  priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [4001, 4500], pin: 1, downSpeed: 23552,  upSpeed: 1152,  priority: 0 },
  // VDSL2 (8b) — Single pin
  { id: 'VDSL2 (8b)',            foot: [0,    500],  pin: 1, downSpeed: 57600,  upSpeed: 11648, priority: 0 },
  { id: 'VDSL2 (8b)',            foot: [501,  1000], pin: 1, downSpeed: 57600,  upSpeed: 11648, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [1001, 1500], pin: 1, downSpeed: 57600,  upSpeed: 11648, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [1501, 2000], pin: 1, downSpeed: 57600,  upSpeed: 9088,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [2001, 2500], pin: 1, downSpeed: 50688,  upSpeed: 9088,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [2501, 3000], pin: 1, downSpeed: 46208,  upSpeed: 9088,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [3001, 3500], pin: 1, downSpeed: 40576,  upSpeed: 9088,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [3501, 4000], pin: 1, downSpeed: 35712,  upSpeed: 5504,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [4001, 4500], pin: 1, downSpeed: 23552,  upSpeed: 1152,  priority: 0 },
  { id: 'VDSL2 (8b)',            foot: [4501, 5000], pin: 1, downSpeed: 23552,  upSpeed: 1152,  priority: 0 },
  // VDSL2 Vectored (35b) — Single pin
  { id: 'VDSL2 Vectored (35b)', foot: [0,    500],  pin: 1, downSpeed: 331264, upSpeed: 40704, priority: 1 },
  { id: 'VDSL2 Vectored (35b)', foot: [501,  1000], pin: 1, downSpeed: 245888, upSpeed: 40704, priority: 1 },
  // VDSL2 Vectored (17a) — Single pin
  { id: 'VDSL2 Vectored (17a)', foot: [0,    500],  pin: 1, downSpeed: 148608, upSpeed: 40704, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [501,  1000], pin: 1, downSpeed: 148608, upSpeed: 40704, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [1001, 1500], pin: 1, downSpeed: 120320, upSpeed: 40704, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [1501, 2000], pin: 1, downSpeed: 83712,  upSpeed: 31232, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [2001, 2500], pin: 1, downSpeed: 71296,  upSpeed: 22528, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [2501, 3000], pin: 1, downSpeed: 57600,  upSpeed: 11648, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [3001, 3500], pin: 1, downSpeed: 46208,  upSpeed: 9088,  priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [3501, 4000], pin: 1, downSpeed: 35712,  upSpeed: 5504,  priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [4001, 4500], pin: 1, downSpeed: 23552,  upSpeed: 1152,  priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [4501, 5000], pin: 1, downSpeed: 23552,  upSpeed: 1152,  priority: 2 },
  // VDSL2 (17a) — Bonded
  { id: 'VDSL2 (17a)',           foot: [0,    500],  pin: 2, downSpeed: 203776, upSpeed: 50560, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [501,  1000], pin: 2, downSpeed: 179200, upSpeed: 50560, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [1001, 1500], pin: 2, downSpeed: 179200, upSpeed: 50560, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [1501, 2000], pin: 2, downSpeed: 120320, upSpeed: 50560, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [2001, 2500], pin: 2, downSpeed: 108672, upSpeed: 31232, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [2501, 3000], pin: 2, downSpeed: 93824,  upSpeed: 22528, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [3001, 3500], pin: 2, downSpeed: 83712,  upSpeed: 16640, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [3501, 4000], pin: 2, downSpeed: 71296,  upSpeed: 11648, priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [4001, 4500], pin: 2, downSpeed: 46208,  upSpeed: 2560,  priority: 0 },
  { id: 'VDSL2 (17a)',           foot: [4501, 5000], pin: 2, downSpeed: 46208,  upSpeed: 1920,  priority: 0 },
  // ADSL2+ (G.Bond) — Bonded
  { id: 'ADSL2+ (G.Bond)',       foot: [0,    4000], pin: 2, downSpeed: 40576,  upSpeed: 2560,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [4001, 4500], pin: 2, downSpeed: 35712,  upSpeed: 1920,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [4501, 5000], pin: 2, downSpeed: 30464,  upSpeed: 1920,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [5001, 5500], pin: 2, downSpeed: 30464,  upSpeed: 1920,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [5501, 6000], pin: 2, downSpeed: 30464,  upSpeed: 1920,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [6001, 6500], pin: 2, downSpeed: 26752,  upSpeed: 2048,  priority: 1 },
  { id: 'ADSL2+ (G.Bond)',       foot: [6501, 7000], pin: 2, downSpeed: 23680,  upSpeed: 2048,  priority: 1 },
  // VDSL2 (8b) — Bonded
  { id: 'VDSL2 (8b)',            foot: [0,    500],  pin: 2, downSpeed: 120320, upSpeed: 22528, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [501,  1000], pin: 2, downSpeed: 120320, upSpeed: 22528, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [1001, 1500], pin: 2, downSpeed: 120320, upSpeed: 22528, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [1501, 2000], pin: 2, downSpeed: 108672, upSpeed: 22528, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [2001, 2500], pin: 2, downSpeed: 93824,  upSpeed: 22528, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [2501, 3000], pin: 2, downSpeed: 93824,  upSpeed: 16640, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [3001, 3500], pin: 2, downSpeed: 83712,  upSpeed: 16640, priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [3501, 4000], pin: 2, downSpeed: 71296,  upSpeed: 9088,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [4001, 4500], pin: 2, downSpeed: 46208,  upSpeed: 2560,  priority: 1 },
  { id: 'VDSL2 (8b)',            foot: [4501, 5000], pin: 2, downSpeed: 46208,  upSpeed: 1920,  priority: 1 },
  // VDSL2 Vectored (17a) — Bonded
  { id: 'VDSL2 Vectored (17a)', foot: [0,    500],  pin: 2, downSpeed: 299904, upSpeed: 81536, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [501,  1000], pin: 2, downSpeed: 299904, upSpeed: 81536, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [1001, 1500], pin: 2, downSpeed: 245888, upSpeed: 81536, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [1501, 2000], pin: 2, downSpeed: 179200, upSpeed: 67456, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [2001, 2500], pin: 2, downSpeed: 148608, upSpeed: 50560, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [2501, 3000], pin: 2, downSpeed: 108672, upSpeed: 22528, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [3001, 3500], pin: 2, downSpeed: 93824,  upSpeed: 16640, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [3501, 4000], pin: 2, downSpeed: 71296,  upSpeed: 11648, priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [4001, 4500], pin: 2, downSpeed: 50688,  upSpeed: 2560,  priority: 2 },
  { id: 'VDSL2 Vectored (17a)', foot: [4501, 5000], pin: 2, downSpeed: 46208,  upSpeed: 1920,  priority: 2 },
]

export const staticSpeed: StaticSpeed[] = [
  { id: '1Mb Internet Access', foot: [22000, 99999], profile: ['ADSL', 'ADSL2+'],         downSpeed: 1280, upSpeed: 384 },
  { id: '1.5 Extended Reach',  foot: [0, 22000],     profile: ['ADSL', 'ADSL2+'],         downSpeed: 1504, upSpeed: 384 },
  { id: '1.5 Best Effort',     foot: [0, 22000],     profile: ['ADSL', 'ADSL2+'],         downSpeed: 1504, upSpeed: 384 },
  { id: '1.5Mb/384k',          foot: [0, 22000],     profile: ['ADSL', 'ADSL2+', 'FTTP'], downSpeed: 1536, upSpeed: 384 },
  { id: '3Mb/768k',            foot: [0, 12000],     profile: 'ADSL',                     downSpeed: 3584, upSpeed: 768 },
  { id: '3Mb/768k',            foot: [0, 18000],     profile: ['ADSL2+', 'FTTP'],         downSpeed: 3584, upSpeed: 768 },
  { id: '4Mb/1Mb',             foot: [0, 18000],     profile: 'ADSL2+',                   downSpeed: 3584, upSpeed: 768 },
]

export const PRIORITY_STYLE: Record<number, { border: string; label: string; labelColor: string }> = {
  0: { border: 'border-teal-500',   label: 'Recommended', labelColor: 'bg-teal-100 text-teal-800' },
  1: { border: 'border-blue-400',   label: 'Alternative',  labelColor: 'bg-blue-100 text-blue-700' },
  2: { border: 'border-indigo-400', label: 'Vectored',     labelColor: 'bg-indigo-100 text-indigo-700' },
}
