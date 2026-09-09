import dayjs from 'dayjs'

import { type IPBService } from '@lifeforge/pocketbase'

import schema from './schema'

export default async function getEvents({
  pb,
  start,
  end
}: {
  pb: IPBService<typeof schema>
  start: string
  end: string
}) {
  return (
    await pb.getFullList
      .collection('entries')
      .filter([
        { field: 'due_date', operator: '>=', value: start },
        { field: 'due_date', operator: '<=', value: end }
      ])
      .execute()
      .catch(() => [])
  ).map(entry => ({
    id: entry.id,
    type: 'single' as const,
    title: entry.summary,
    start: entry.due_date,
    end: dayjs(entry.due_date).add(1, 'millisecond').toISOString(),
    category: '_todo',
    calendar: '',
    description: entry.notes,
    location: '',
    location_coords: { lat: 0, lon: 0 },
    reference_link: `/todo-list?entry=${entry.id}`,
    is_strikethrough: entry.done
  }))
}
