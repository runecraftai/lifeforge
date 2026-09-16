import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type TaskList = InferOutput<typeof forgeAPI.lists.list>[number]
