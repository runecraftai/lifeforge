import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type TaskPriority = InferOutput<typeof forgeAPI.priorities.list>[number]
