import { Scrollbar, Stack } from '@lifeforge/ui'

import type { BooksLibraryEntry } from '@/entities/book'

import EntryItem from './components/entry-item'

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
