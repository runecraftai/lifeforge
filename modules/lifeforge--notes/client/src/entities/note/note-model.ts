import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type Note = InferOutput<typeof forgeAPI.notes.list>[number]
