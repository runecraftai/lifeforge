const stateOptions = [
  ['in_flight', 'In Flight'],
  ['queued', 'Queued'],
  ['held', 'Held'],
  ['done', 'Done']
] as const

export const holdKinds = ['commander', 'external', 'load', 'parked', 'future'] as const

export type State = (typeof stateOptions)[number][0]
export type HoldKind = (typeof holdKinds)[number]

export type Task = {
  id: string
  state: State
  kind: string
  repo: string
  title: string
  priority: string
  blocked_by: string
  blocked: string
  held: string
  hold_reason: string
  hold_kind: string
  links: string
}

export type Filters = {
  state: State | ''
  repo: string
  blocked: boolean
  holdKind: string
  kind: string
}

export function isHoldKind(value: string): value is HoldKind {
  return holdKinds.some(kind => kind === value)
}
