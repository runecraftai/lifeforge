import { Box, Flex, Text } from '@lifeforge/ui'

import { type Task, useTodoListContext } from '@/entities/task'

export function TaskTags({ entry }: { entry: Task }) {
  const { tagsListQuery } = useTodoListContext()

  const tags = tagsListQuery.data ?? []
  const taskTags = entry.tags ?? []
  const visibleTags = taskTags.slice(0, 3)
  const remainingTagCount = Math.max(taskTags.length - 3, 0)
  const hasMoreTags = remainingTagCount > 0
  const tagElements = visibleTags.map(tag => {
    const tagName = tags.find(item => item.id === tag)?.name

    return (
      <Text key={tag} className="relative isolate min-w-12 truncate rounded-full px-2 py-1 text-custom-500">
        <Box aria-hidden="true" as="span" className="absolute inset-0 -z-10 rounded-full bg-custom-500/20" />#
        {tagName}
      </Text>
    )
  })

  return (
    <Flex align="center" gap="xs" minWidth="0" width="100%">
      {tagElements}
      {hasMoreTags && (
        <Text className="shrink-0 text-xs text-bg-500" size="xs">
          +{remainingTagCount} more
        </Text>
      )}
    </Flex>
  )
}
