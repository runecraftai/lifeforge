import { describe, expect, it } from 'vitest'

import { missionStatus, parseSquadMissions } from './data-source'

describe('Squad mission adapter', () => {
  it('maps supported lifecycle states to board columns', () => {
    expect(missionStatus('queued')).toBe('todo')
    expect(missionStatus('in_flight')).toBe('doing')
    expect(missionStatus('done')).toBe('done')
  })

  it('parses the supported sq-tasks list format', () => {
    expect(parseSquadMissions('  sq-1,queued,ops,lifeforge,Ship board,-\n')).toEqual([
      { id: 'sq-1', state: 'queued', kind: 'ops', repo: 'lifeforge', title: 'Ship board', priority: '-' }
    ])
  })
})
