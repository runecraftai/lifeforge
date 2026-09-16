import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type TaskPriority = InferOutput<typeof forgeAPI.priorities.list>[number]
