import { Injectable } from '@nestjs/common'
import type PocketBase from 'pocketbase'

import type { PersonalTask } from '../data-source'

@Injectable()
export class PocketBaseAdapter {
  async listPersonalTasks(pb: PocketBase): Promise<PersonalTask[]> {
    const records = await pb.collection('todo_list__entries').getFullList({ sort: '-created' })

    return records.map(record => ({
      id: record.id,
      summary: String(record.summary),
      status: record.status === 'doing' || record.status === 'done' ? record.status : 'todo',
      priority: record.priority ? String(record.priority) : undefined,
      squadMissionId: record.squad_mission_id ? String(record.squad_mission_id) : undefined
    }))
  }

  async getPersonalTask(pb: PocketBase, id: string): Promise<PersonalTask | null> {
    try {
      const record = await pb.collection('todo_list__entries').getOne(id)

      return {
        id: record.id,
        summary: String(record.summary),
        status: record.status === 'doing' || record.status === 'done' ? record.status : 'todo',
        priority: record.priority ? String(record.priority) : undefined,
        squadMissionId: record.squad_mission_id ? String(record.squad_mission_id) : undefined
      }
    } catch {
      return null
    }
  }

  async linkPersonalTask(pb: PocketBase, id: string, squadMissionId: string) {
    return pb.collection('todo_list__entries').update(id, { squad_mission_id: squadMissionId })
  }

  async movePersonalTask(pb: PocketBase, id: string, status: PersonalTask['status']) {
    return pb.collection('todo_list__entries').update(id, {
      status,
      done: status === 'done',
      completed_at: status === 'done' ? new Date().toISOString() : null
    })
  }
}
