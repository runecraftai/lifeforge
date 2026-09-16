import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type CalendarEvent = InferOutput<
  typeof forgeAPI.events.getByDateRange
>[number]

export type CalendarCategory = InferOutput<
  typeof forgeAPI.categories.list
>[number]

export type CalendarCalendar = InferOutput<
  typeof forgeAPI.calendars.list
>[number]
