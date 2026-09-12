import { Box, Scrollbar, Stack } from '@lifeforge/ui'

import type { Task } from '@/entities/task'

import { TaskItem } from '@/features/complete-task/task-item'

function TaskList({ entries }: { entries: Task[] }) {
  return (
    <Box flex="1" minHeight="0" mt="md">
      <Scrollbar>
        <Stack as="ul" flex="1" gap="sm" pb="xl" px="md">
          {entries.map(entry => (
            <TaskItem key={entry.id} entry={entry} />
          ))}
        </Stack>
      </Scrollbar>
    </Box>
  )
}

export { TaskList }
