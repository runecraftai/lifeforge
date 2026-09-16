import type {
  CalendarCategory,
  CalendarEvent
} from '@/pages/calendar/components/Calendar'

import EventDetailsDescription from './components/event-details-description'
import EventDetailsHeader from './components/event-details-header'

function EventDetails({
  event,
  category,
  editable = true
}: {
  event: CalendarEvent
  category: CalendarCategory | undefined
  editable?: boolean
}) {
  return (
    <>
      <EventDetailsHeader
        category={category}
        editable={editable}
        event={event}
      />
      <EventDetailsDescription event={event} />
    </>
  )
}

export default EventDetails
