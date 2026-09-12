// PriorityListbox.tsx
import { ListboxInput, ListboxOption } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string
  setPriority: React.Dispatch<React.SetStateAction<string>>
}) {
  const { prioritiesQuery } = useTodoListContext()

  const priorities = prioritiesQuery.data ?? []

  return (
    <ListboxInput
      icon="tabler:alert-triangle"
      label="priority"
      renderContent={() => (
        <>
          <span
            className="block h-6 w-1 rounded-full"
            style={{
              backgroundColor:
                priorities.find(p => p.id === priority)?.color ?? 'lightgray'
            }}
          />
          <span className="-mt-px block truncate">
            {priorities.find(p => p.id === priority)?.name ?? 'None'}
          </span>
        </>
      )}
      value={priority}
      onChange={setPriority}
    >
      <ListboxOption key={'none'} color="lightgray" label="None" value="" />
      {priorities.map(({ name, color, id }, i) => (
        <ListboxOption key={i} color={color} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export { PrioritySelector }
