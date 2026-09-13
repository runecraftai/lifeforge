import { useCallback, useEffect, useMemo, useState } from 'react'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  KanbanCard,
  KanbanColumn,
  KanbanLane,
  ModuleHeaderTailwind
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'

import {
  type BoardItem,
  type BoardLane,
  type BoardResponse,
  type Column,
  normalizeBoard
} from './board-model'
import './index.css'

const columns: Column[] = ['todo', 'doing', 'done']

export default function UnifiedKanban() {
  const { t } = useModuleTranslation()
  const [board, setBoard] = useState<BoardLane>({ personal: [], work: [] })
  const [dragged, setDragged] = useState<BoardItem | null>(null)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = (await forgeAPI.board.get
        .input({})
        .query()) as BoardResponse
      setBoard(normalizeBoard(response))
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])
  const total = useMemo(
    () => board.personal.length + board.work.length,
    [board]
  )

  const onDrop = async (lane: 'personal' | 'work', status: Column) => {
    if (!dragged) return
    if (
      (dragged.source === 'personal' && lane !== 'personal') ||
      (dragged.source === 'mission' && lane !== 'work')
    )
      return

    const item = dragged
    setDragged(null)
    setBoard(current => ({
      personal:
        lane === 'personal'
          ? [
              ...current.personal.filter(
                candidate =>
                  candidate.id !== item.id || candidate.source !== item.source
              ),
              { ...item, status }
            ]
          : current.personal.filter(
              candidate =>
                candidate.id !== item.id || candidate.source !== item.source
            ),
      work:
        lane === 'work'
          ? [
              ...current.work.filter(
                candidate =>
                  candidate.id !== item.id || candidate.source !== item.source
              ),
              { ...item, status }
            ]
          : current.work.filter(
              candidate =>
                candidate.id !== item.id || candidate.source !== item.source
            )
    }))

    try {
      await forgeAPI.board.move.mutate({
        source: item.source,
        id: item.id,
        status
      })
      await refresh()
    } catch {
      setError(true)
      await refresh()
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#fafafa]">
      <ModuleHeaderTailwind />
      <main className="mx-auto w-full max-w-[1700px] space-y-8 px-6 py-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
              {t('board.eyebrow')}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {t('board.title')}
            </h1>
            <p className="mt-1 text-sm text-zinc-500">{t('board.subtitle')}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm">
            <span className="font-semibold text-zinc-900">{total}</span>{' '}
            {t('board.items')}
          </div>
        </header>
        {error && (
          <p
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {t('board.error')}
          </p>
        )}
        <div className="space-y-8">
          {(['personal', 'work'] as const).map(lane => (
            <KanbanLane key={lane} title={t(`board.lanes.${lane}`)}>
              {columns.map(column => {
                const items = board[lane].filter(item => item.status === column)

                return (
                  <KanbanColumn
                    key={column}
                    count={items.length}
                    emptyLabel={t('board.empty')}
                    isEmpty={items.length === 0}
                    title={t(`board.columns.${column}`)}
                    onDragOver={event => event.preventDefault()}
                    onDrop={() => onDrop(lane, column)}
                  >
                    {items.map(item => (
                      <KanbanCard
                        key={`${item.source}-${item.id}`}
                        itemId={item.id}
                        kind={item.kind}
                        priority={item.priority}
                        repo={item.repo}
                        source={
                          item.source === 'personal'
                            ? t('board.sources.personal')
                            : t('board.sources.mission')
                        }
                        title={item.title}
                        onDragStart={() => setDragged(item)}
                      />
                    ))}
                  </KanbanColumn>
                )
              })}
            </KanbanLane>
          ))}
        </div>
      </main>
    </div>
  )
}
