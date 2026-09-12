import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/manifest'

export type TaskTag = InferOutput<typeof forgeAPI.tags.list>[number]
