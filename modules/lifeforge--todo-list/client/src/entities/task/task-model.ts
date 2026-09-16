import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type Task = InferOutput<typeof forgeAPI.entries.getById>

export type TaskStatusCounter = InferOutput<
  typeof forgeAPI.entries.getStatusCounter
>
