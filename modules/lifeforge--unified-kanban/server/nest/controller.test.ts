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

  it('surfaces MCP failure without creating an orphaned link', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn()
    const createMission = vi.fn().mockRejectedValue(new Error('MCP server unavailable'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(controller.promote({} as never, { taskId: 'task-1' })).rejects.toThrow()

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).not.toHaveBeenCalled()
    expect(task.squadMissionId).toBeUndefined()
  })

  it('surfaces PocketBase failure during link after mission creation', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn().mockRejectedValue(new Error('PocketBase write failed'))
    const createMission = vi.fn().mockResolvedValue({ taskId: 'lifeforge-task-1' })
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(controller.promote({} as never, { taskId: 'task-1' })).rejects.toThrow()

    expect(createMission).toHaveBeenCalledOnce()
    expect(linkPersonalTask).toHaveBeenCalledOnce()
    expect(task.squadMissionId).toBeUndefined()
  })

  it('returns already-true when a concurrent request linked the task while the lock was held', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const taskFirst: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const taskSecond: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo',
      squadMissionId: 'lifeforge-task-1'
    }

    let callCount = 0
    const getPersonalTask = vi.fn().mockImplementation(async () => {
      callCount++
      return callCount === 1 ? taskFirst : taskSecond
    })
    const linkPersonalTask = vi.fn()
    const createMission = vi.fn()
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(controller.promote({} as never, { taskId: 'task-1' })).resolves.toEqual({
      state: 'success',
      data: { taskId: 'task-1', squadMissionId: 'lifeforge-task-1', already: true }
    })

    expect(createMission).not.toHaveBeenCalled()
    expect(linkPersonalTask).not.toHaveBeenCalled()
  })

  it('cleans up the promote lock after a successful promotion', async () => {
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

    await controller.promote({} as never, { taskId: 'task-1' })

    expect((controller as any).promoteLocks.has('task-1')).toBe(false)
  })

  it('cleans up the promote lock after a failed promotion', async () => {
    const authenticate = vi.fn().mockResolvedValue({ pb: {} })
    const task: { id: string; summary: string; status: 'todo'; squadMissionId?: string } = {
      id: 'task-1',
      summary: 'Ship it',
      status: 'todo'
    }
    const getPersonalTask = vi.fn().mockResolvedValue(task)
    const linkPersonalTask = vi.fn()
    const createMission = vi.fn().mockRejectedValue(new Error('MCP failure'))
    const controller = new BoardController(
      { authenticate } as never,
      { getPersonalTask, linkPersonalTask } as never,
      { createMission } as never
    )

    await expect(controller.promote({} as never, { taskId: 'task-1' })).rejects.toThrow()

    expect((controller as any).promoteLocks.has('task-1')).toBe(false)
  })
})
