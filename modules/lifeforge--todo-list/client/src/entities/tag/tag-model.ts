import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type TaskTag = InferOutput<typeof forgeAPI.tags.list>[number]
