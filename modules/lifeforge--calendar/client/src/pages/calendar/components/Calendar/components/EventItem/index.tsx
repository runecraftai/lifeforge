import { useQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'

import { forgeAPI } from '@/shared/api'

import { useInternalCategories } from '../../../../model/use-internal-categories'
import type { CalendarCategory, CalendarEvent } from '../../index.js'
import EventItemButton from './components/event-item-button.js'
import EventItemTooltip from './components/event-item-tooltip.js'

function EventItem({ event }: { event: CalendarEvent }) {
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const calendarsQuery = useQuery(forgeAPI.calendars.list.queryOptions())
  const { map: internalCategoryMap } = useInternalCategories()

  const category = useMemo(() => {
    if (event.category.startsWith('_')) {
      return internalCategoryMap[event.category] as CalendarCategory | undefined
    }

    return categoriesQuery.data?.find(
      category => category.id === event.category
    )
  }, [categoriesQuery, event.category, internalCategoryMap])

  const calendar = useMemo(() => {
    return calendarsQuery.data?.find(calendar => calendar.id === event.calendar)
  }, [calendarsQuery, event.calendar])

  const eventColor = category?.color || calendar?.color || ''

  return (
    <>
      <EventItemButton
        color={eventColor}
        icon={category?.icon ?? ''}
        id={event.id}
        isStrikethrough={event.is_strikethrough}
        title={event.title}
      />
      <EventItemTooltip category={category} event={event} />
    </>
  )
}

export default memo(EventItem)
