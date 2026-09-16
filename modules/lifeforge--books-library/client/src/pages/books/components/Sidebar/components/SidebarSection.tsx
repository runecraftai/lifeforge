import type { UseQueryResult } from '@tanstack/react-query'
import { useCallback } from 'react'

import {
  EmptyStateScreen,
  SidebarTitle,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import ModifyModal from '@/features/modify-book/ModifyModal'

import SidebarItem from './SidebarItem'

function SidebarSection<T>({
  stuff,
  fallbackIcon,
  hasActionButton = true,
  hasContextMenu = true,
  dataQuery,
  useNamespace = false
}: {
  stuff: 'collections' | 'languages' | 'fileTypes' | 'readStatus'
  fallbackIcon?: string
  hasActionButton?: boolean
  hasContextMenu?: boolean
  dataQuery: UseQueryResult<T[]>
  useNamespace?: boolean
}) {
  const { open } = useModalStore()

  const handleCreateItem = useCallback(() => {
    open(ModifyModal, {
      type: 'create',
      initialData: null,
      stuff: stuff as 'collections' | 'languages'
    })
  }, [stuff])

  return (
    <>
      <SidebarTitle
        label={stuff}
        {...(hasActionButton
          ? {
              actionButtonIcon: 'tabler:plus',
              actionButtonOnClick: handleCreateItem
            }
          : {})}
      />
      <WithQuery query={dataQuery}>
        {data =>
          data.length > 0 ? (
            <>
              {data.map(item => (
                <SidebarItem
                  key={item.id}
                  fallbackIcon={fallbackIcon}
                  hasContextMenu={hasContextMenu}
                  item={item}
                  stuff={stuff}
                  useNamespace={useNamespace}
                />
              ))}
            </>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:box-off"
              message={{
                id: stuff
              }}
            />
          )
        }
      </WithQuery>
    </>
  )
}

export default SidebarSection
