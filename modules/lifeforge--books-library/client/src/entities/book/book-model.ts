import type { InferOutput } from '@lifeforge/api'

import { forgeAPI } from '@/shared/api'

export type BooksLibraryEntry = InferOutput<
  typeof forgeAPI.entries.list
>['items'][number]

export type BooksLibraryCollection = InferOutput<
  typeof forgeAPI.collections.list
>[number]

export type BooksLibraryLanguage = InferOutput<
  typeof forgeAPI.languages.list
>[number]

export type BooksLibraryFileType = InferOutput<
  typeof forgeAPI.fileTypes.list
>[number]
