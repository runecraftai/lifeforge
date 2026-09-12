import { describe, expect, it } from 'vitest'

import { filterTasksBySummary, taskInputSchema } from './task-schema'

describe('task input', () => {
  it('rejects an empty summary', () => {
    expect(() =>
      taskInputSchema.parse({
        summary: ' ',
        notes: '',
        due_date: '',
        due_date_has_time: false,
        list: '',
        tags: [],
        priority: null
      })
    ).toThrow()
  })
})

describe('filterTasksBySummary', () => {
  const tasks = [{ summary: 'Buy groceries' }, { summary: 'Read a book' }]

  it('matches summaries case-insensitively', () => {
    expect(filterTasksBySummary(tasks, 'GROCER')).toEqual([tasks[0]])
  })

  it('returns all tasks for a blank query', () => {
    expect(filterTasksBySummary(tasks, '  ')).toBe(tasks)
  })
})
