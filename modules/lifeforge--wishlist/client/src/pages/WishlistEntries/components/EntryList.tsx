import { useModuleTranslation } from '@lifeforge/localization'
import { EmptyStateScreen, Scrollbar, useModalStore } from '@lifeforge/ui'

import type { WishlistEntry } from '..'
import ModifyEntryModal from '../modals/ModifyEntryModal'
import EntryItem from './EntryItem'

function EntryList({
  filteredEntries,
  isTotallyEmpty
}: {
  filteredEntries: WishlistEntry[]
  isTotallyEmpty: boolean
}) {
  const { open } = useModalStore()
  const { t } = useModuleTranslation()

  if (isTotallyEmpty) {
    return (
      <EmptyStateScreen
        CTAButtonProps={{
          children: 'new',
          onClick: () => {
            open(ModifyEntryModal, {
              type: 'create'
            })
          },
          tProps: { item: t('items.entry') },
          icon: 'tabler:plus'
        }}
        icon="tabler:shopping-cart-off"
        name="entries"
        namespace="apps.@lifeforge/lifeforge--wishlist"
      />
    )
  }

  if (!filteredEntries?.length) {
    return (
      <EmptyStateScreen
        icon="tabler:search-off"
        name="search"
        namespace="apps.@lifeforge/lifeforge--wishlist"
      />
    )
  }

  return (
    <Scrollbar>
      <ul className="mb-14 flex flex-col space-y-2 sm:mb-6">
        {filteredEntries.map(entry => (
          <EntryItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </Scrollbar>
  )
}

export default EntryList
