import { describe, expect, it } from 'vitest'

import { normalizeBoard } from './board-model'

describe('normalizeBoard', () => {
  it('keeps both fixed lanes and replaces missing lane data with empty lists', () => {
    expect(normalizeBoard({ lanes: { personal: [{ id: '1', title: 'Task', source: 'personal', status: 'todo' }], work: undefined as never } })).toEqual({
      personal: [{ id: '1', title: 'Task', source: 'personal', status: 'todo' }],
      work: []
    })
  })
})
