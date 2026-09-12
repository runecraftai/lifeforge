import { type IPBService } from '@lifeforge/pocketbase'

import schema from './schema'

type LegacyEntry = { id: string; done: boolean; status?: 'todo' | 'doing' | 'done' }

export async function backfillEntryStatuses(pb: IPBService<typeof schema>) {
  const entries = (await pb.getFullList.collection('entries').execute()) as LegacyEntry[]
  const pending = entries.filter(entry => entry.status !== (entry.done ? 'done' : 'todo'))

  await Promise.all(
    pending.map(entry =>
      pb.update
        .collection('entries')
        .id(entry.id)
        .data({ status: entry.done ? 'done' : 'todo' })
        .execute()
    )
  )

  return pending.length
}
