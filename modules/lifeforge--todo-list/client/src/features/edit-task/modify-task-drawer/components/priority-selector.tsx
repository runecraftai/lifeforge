import { Box, Flex, ListboxInput, ListboxOption, Text } from '@lifeforge/ui'

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
        <Flex align="center" gap="sm" minWidth="0">
          <Box
            flexShrink="0"
            height="1.5rem"
            r="sm"
            style={{
              backgroundColor:
                priorities.find(p => p.id === priority)?.color ?? 'lightgray',
              width: '0.25rem'
            }}
          />
          <Text truncate>
            {priorities.find(p => p.id === priority)?.name ?? 'None'}
          </Text>
        </Flex>
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
