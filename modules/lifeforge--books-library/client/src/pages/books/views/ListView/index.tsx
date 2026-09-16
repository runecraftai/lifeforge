import type { BooksLibraryEntry } from '@/entities/book'

import { Scrollbar, Stack } from '@lifeforge/ui'

import EntryItem from './components/EntryItem'

function ListView({ books }: { books: BooksLibraryEntry[] }) {
  return (
    <Scrollbar>
      <Stack>
        {books.map(item => (
          <EntryItem key={item.id} item={item} />
        ))}
      </Stack>
    </Scrollbar>
  )
}

export default ListView
