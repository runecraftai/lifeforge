import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useCallback, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import { toast } from 'react-toastify'

import {
  Button,
  Card,
  Checkbox,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import type { WishlistEntry } from '..'
import ModifyEntryModal from '../modals/ModifyEntryModal'

dayjs.extend(relativeTime)

function EntryItem({ entry }: { entry: WishlistEntry }) {
  const { open } = useModalStore()
  const { currency } = usePersonalization()
  const queryClient = useQueryClient()
  const [bought, setBought] = useState(entry.bought)

  const toggleBoughtMutation = useMutation(
    forgeAPI.entries.updateBoughtStatus
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          setTimeout(
            () =>
              queryClient.invalidateQueries({
                queryKey: ['wishlist']
              }),
            500
          )
        },
        onError: () => {
          setBought(prev => !prev)
          toast.error('Failed to update bought status')
        }
      })
  )

  const deleteMutation = useMutation(
    forgeAPI.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wishlist'] })
        },
        onError: () => {
          toast.error('Failed to delete entry')
        }
      })
  )

  const handleEdit = useCallback(() => {
    open(ModifyEntryModal, {
      type: 'update',
      initialData: entry
    })
  }, [entry])

  const handleDelete = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Entry',
      description: 'Are you sure you want to delete this entry?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [entry])

  return (
    <Card
      as="li"
      className="flex flex-col justify-between gap-3 sm:pr-8! md:flex-row md:items-center"
    >
      <div className="flex items-center justify-between gap-8">
        <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="bg-lf-bg-200 relative isolate aspect-square h-auto w-full shrink-0 overflow-hidden rounded-md sm:w-20">
            <Icon
              className="text-lf-bg-200 dark:text-lf-bg-700 absolute top-1/2 left-1/2 z-[-1] size-8 -translate-x-1/2 -translate-y-1/2"
              icon="tabler:shopping-bag"
            />
            {entry.image !== '' && (
              <Zoom>
                <img
                  alt=""
                  className="size-full rounded-md object-cover"
                  src={
                    forgeAPI.media.input({
                      collectionId: entry.collectionId,
                      recordId: entry.id,
                      fieldId: entry.image
                    }).endpoint
                  }
                />
              </Zoom>
            )}
          </div>
          <div className="w-full min-w-0">
            <h2 className="text-lf-bg-500 line-clamp-2 w-full min-w-0 text-lg font-medium">
              {entry.name}
            </h2>
            <p className="mt-2! text-2xl">
              {new Intl.NumberFormat(currency.locale, {
                style: 'currency',
                currency: currency.currency
              }).format(entry.price)}
            </p>
            {entry.bought && (
              <p className="text-lf-bg-500 mt-2! text-sm">
                Bought {dayjs(entry.bought_at).fromNow()}
              </p>
            )}
          </div>
        </div>
        <Checkbox
          checked={bought}
          className="hidden! sm:flex! md:hidden!"
          onCheckedChange={() => {
            setBought(prev => !prev)
            toggleBoughtMutation.mutate({})
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <Button
          as="a"
          className="w-auto px-0! sm:px-4!"
          href={entry.url}
          icon="iconamoon:arrow-top-right-1"
          iconPosition="end"
          namespace="apps.@lifeforge/lifeforge--wishlist"
          target="_blank"
          variant="plain"
        >
          Visit Website
        </Button>
        <Checkbox
          checked={bought}
          className="flex! sm:hidden! md:flex!"
          onCheckedChange={() => {
            setBought(prev => !prev)
            toggleBoughtMutation.mutate({})
          }}
        />
        <ContextMenu
          classNames={{
            wrapper: 'absolute right-4 top-4 sm:static'
          }}
        >
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleEdit}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDelete}
          />
        </ContextMenu>
      </div>
    </Card>
  )
}

export default EntryItem
