import { describe, expect, it, vi } from 'vitest'

vi.mock('./auth-adapter', () => ({ AuthAdapter: class AuthAdapter {} }))

import { BoardController } from './controller'

describe('BoardController', () => {
  it('authenticates and moves personal tasks through the PocketBase adapter', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const movePersonalTask = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController({ authenticate } as never, { movePersonalTask } as never)

    await expect(controller.move({} as never, { source: 'personal', id: 'task-1', status: 'doing' })).resolves.toEqual({
      state: 'success',
      data: { id: 'task-1', source: 'personal', status: 'doing' }
    })
    expect(authenticate).toHaveBeenCalledOnce()
    expect(movePersonalTask).toHaveBeenCalledWith({}, 'task-1', 'doing')
  })

  it('rejects invalid lifecycle moves', async () => {
    const controller = new BoardController({ authenticate: vi.fn().mockResolvedValue({ pb: {} }) } as never, {} as never)

    await expect(controller.move({} as never, { source: 'personal', id: '', status: 'todo' })).rejects.toThrow('Invalid board move')
  })
})
