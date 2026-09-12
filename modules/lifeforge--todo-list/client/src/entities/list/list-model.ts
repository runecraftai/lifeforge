import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type TaskList = InferOutput<typeof forgeAPI.lists.list>[number]
