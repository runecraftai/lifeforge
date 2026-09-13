import { describe, expect, it, vi } from 'vitest'

vi.mock('./auth-adapter', () => ({ AuthAdapter: class AuthAdapter {} }))

import { BoardController } from './controller'

describe('BoardController', () => {
  it('authenticates and moves personal tasks through the PocketBase adapter', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const movePersonalTask = vi.fn().mockResolvedValue(undefined)
    const controller = new BoardController(
      { authenticate } as never,
      { movePersonalTask } as never,
      {} as never
    )

    await expect(controller.move({} as never, { source: 'personal', id: 'task-1', status: 'doing' })).resolves.toEqual({
      state: 'success',
      data: { id: 'task-1', source: 'personal', status: 'doing' }
    })
    expect(authenticate).toHaveBeenCalledOnce()
    expect(movePersonalTask).toHaveBeenCalledWith({}, 'task-1', 'doing')
  })

  it('rejects invalid lifecycle moves', async () => {
    const controller = new BoardController(
      { authenticate: vi.fn().mockResolvedValue({ pb: {} }) } as never,
      {} as never,
      {} as never
    )

    await expect(controller.move({} as never, { source: 'personal', id: '', status: 'todo' })).rejects.toThrow('Invalid board move')
  })

  it('creates and persists one deterministic mission link', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn().mockImplementation(async () => {
      task.squadMissionId = 'lifeforge-task-1'
    })
    const createMission = vi.fn().mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(controller.promote({} as never, { taskId: 'task-1' })).resolves.toEqual({
      state: 'success',
      data: { taskId: 'task-1', squadMissionId: 'lifeforge-task-1', already: false }
    })
    await expect(controller.promote({} as never, { taskId: 'task-1' })).resolves.toEqual({
      state: 'success',
      data: { taskId: 'task-1', squadMissionId: 'lifeforge-task-1', already: true }
    })

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).toHaveBeenCalledOnce()
    expect(createMission).toHaveBeenCalledWith({ id: 'lifeforge-task-1', title: 'Ship it' })
  })
})
