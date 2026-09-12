import { Box, Flex, ListboxInput, ListboxOption, Text } from '@lifeforge/ui'

import { useTodoListContext } from '@/entities/task'

function ListSelector({
  list,
  setList
}: {
  list: string
  setList: (list: string) => void
}) {
  const { listsQuery } = useTodoListContext()

  const lists = listsQuery.data ?? []

  return (
    <ListboxInput
      icon="tabler:list"
      label="list"
      renderContent={() => (
        <Flex align="center" gap="sm" minWidth="0">
          <Box
            flexShrink="0"
            height="1.5rem"
            r="sm"
            style={{
              backgroundColor:
                lists.find(l => l.id === list)?.color ?? 'lightgray',
              width: '0.25rem'
            }}
          />
          <Text truncate>
            {lists.find(l => l.id === list)?.name ?? 'None'}
          </Text>
        </Flex>
      )}
      value={list ?? ''}
      onChange={setList}
    >
      <ListboxOption color="lightgray" label="None" value="" />
      {lists.map(({ name, color, id }) => (
        <ListboxOption key={id} color={color} label={name} value={id} />
      ))}
    </ListboxInput>
  )
}

export { ListSelector }
