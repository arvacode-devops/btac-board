export type Message = {
  id: number
  tagName: string
  title: string
  content: string
}

export type CategoryStyle = {
  filter: string
  badge: string
  border: string
}

export const CATEGORY_COLORS: Record<string, CategoryStyle> = {
  greeting:    { filter: 'bg-teal-500 text-white',    badge: 'bg-teal-100 text-teal-800',      border: 'border-teal-400' },
  closing:     { filter: 'bg-red-500 text-white',     badge: 'bg-red-100 text-red-700',        border: 'border-red-400' },
  procedure:   { filter: 'bg-blue-500 text-white',    badge: 'bg-blue-100 text-blue-700',      border: 'border-blue-400' },
  information: { filter: 'bg-cyan-500 text-white',    badge: 'bg-cyan-100 text-cyan-700',      border: 'border-cyan-400' },
  transfer:    { filter: 'bg-yellow-400 text-black',  badge: 'bg-yellow-100 text-yellow-800',  border: 'border-yellow-400' },
  explaining:  { filter: 'bg-indigo-500 text-white',  badge: 'bg-indigo-100 text-indigo-700',  border: 'border-indigo-400' },
  LOGGER:      { filter: 'bg-emerald-500 text-white', badge: 'bg-emerald-100 text-emerald-700',border: 'border-emerald-400' },
}

export const DEFAULT_COLORS: CategoryStyle = {
  filter: 'bg-gray-400 text-white',
  badge:  'bg-gray-100 text-gray-700',
  border: 'border-gray-300',
}

export const messages: Message[] = [
  { id: 1,  tagName: 'greeting',    title: 'Confirmation',         content: 'Greetings!, just to confirm cx name: pins: and speed:' },
  { id: 2,  tagName: 'greeting',    title: 'Greeting',             content: 'Thank you so much for confirming!, how can I assist you today?' },
  { id: 3,  tagName: 'closing',     title: 'Closing 1',            content: 'Awesome! beside that is there anything else can I help you with?' },
  { id: 4,  tagName: 'closing',     title: 'Closing 2',            content: 'Have a great day! It was a pleasure assisting you!' },
  { id: 5,  tagName: 'procedure',   title: 'LMK',                  content: 'Sure, Let me know!' },
  { id: 6,  tagName: 'procedure',   title: 'Bear 1 🐻',            content: 'I m still working on it so please bear with me! ʕ´•ᴥ•`ʔ' },
  { id: 7,  tagName: 'procedure',   title: 'Bear 2 🐻',            content: 'Got it! doing the provisioning now please bear with me ʕ´•ᴥ•`ʔ' },
  { id: 8,  tagName: 'procedure',   title: 'Start working',        content: 'Got it, allow me a few minutes while I work on the account!' },
  { id: 9,  tagName: 'procedure',   title: 'My end',               content: 'All done on my end, can you please check on your side?' },
  { id: 10, tagName: 'procedure',   title: 'Changes on my end',    content: 'Just did a few changes, can you check?' },
  { id: 11, tagName: 'information', title: 'Ask fiber',            content: 'Just to confirm is this a Fiber account?' },
  { id: 12, tagName: 'information', title: 'Request MAC',          content: 'Can you please give me the Modem MAC Address?' },
  { id: 13, tagName: 'information', title: 'Request EID',          content: 'Can you please provide me with your EID?' },
  { id: 14, tagName: 'transfer',    title: 'Transfer - not trained', content: 'Unfortunately, I will not be able to complete your request due to Im not trained for fibers accounts, therefore I will transfer you right away to someone who can help! (•◡•)' },
  { id: 15, tagName: 'transfer',    title: 'Transfer - ATAC',      content: 'I wll transfer you now to ATAC so they can help you with the records!' },
  { id: 16, tagName: 'explaining',  title: 'Asymmetric 1',         content: 'Based on the speed chart we use, this customer is correctly provisioned, we match the footage to the speed on chart regardless the QoS' },
  { id: 17, tagName: 'explaining',  title: 'Asymmetric 2',         content: 'Based on engineering review and guidelines they are actually not supposed to match, rather the port should be provisioned at its full capacity and then the QoS controls the speed based on the product the customer acquired' },
  { id: 18, tagName: 'LOGGER',      title: 'ORDER',                content: 'Tech needed order pushed thru and provision' },
  { id: 19, tagName: 'LOGGER',      title: 'OVER',                 content: 'Customer was wrong/over-provisioned' },
  { id: 20, tagName: 'LOGGER',      title: 'Re-provision',         content: 'Tech was not pulling IP/training did a re-provision' },
]

export const categories = ['All', ...Array.from(new Set(messages.map(m => m.tagName)))]
