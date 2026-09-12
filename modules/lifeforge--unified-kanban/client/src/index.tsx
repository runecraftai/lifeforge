import { useCallback, useEffect, useMemo, useState } from 'react'

import { ModuleHeader } from '@lifeforge/ui'
import { useModuleTranslation } from '@lifeforge/localization'

import { forgeAPI } from '@/manifest'

import { type BoardItem, type BoardLane, type BoardResponse, type Column, normalizeBoard } from './board-model'
import './index.css'

const columns: Column[] = ['todo', 'doing', 'done']

function BoardCard({ item, onDragStart }: { item: BoardItem; onDragStart: (item: BoardItem) => void }) {
  const { t } = useModuleTranslation()
  const sourceLabel = item.source === 'personal' ? t('board.sources.personal') : t('board.sources.mission')

  return (
    <article
      draggable
      onDragStart={() => onDragStart(item)}
      className="group rounded-lg border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-5 text-zinc-900">{item.title}</h3>
        <span className="text-zinc-400" aria-hidden="true">⠿</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-600">{sourceLabel}</span>
        {item.priority && <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">{item.priority}</span>}
        {item.repo && <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">{item.repo}</span>}
        {item.kind && <span className="rounded-md border border-zinc-200 px-2 py-1 text-xs text-zinc-500">{item.kind}</span>}
      </div>
      <p className="mt-3 text-[11px] text-zinc-400">{item.id}</p>
    </article>
  )
}

function BoardColumn({ lane, column, items, onDrop, onDragStart }: { lane: 'personal' | 'work'; column: Column; items: BoardItem[]; onDrop: (lane: 'personal' | 'work', column: Column) => void; onDragStart: (item: BoardItem) => void }) {
  const { t } = useModuleTranslation()
  return (
    <section
      onDragOver={event => event.preventDefault()}
      onDrop={() => onDrop(lane, column)}
      className="flex min-h-80 min-w-72 flex-1 flex-col rounded-xl bg-zinc-100/80 p-3"
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-600">{t(`board.columns.${column}`)}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-zinc-500 shadow-sm">{items.length}</span>
      </header>
      <div className="flex flex-1 flex-col gap-2">
        {items.map(item => <BoardCard key={`${item.source}-${item.id}`} item={item} onDragStart={onDragStart} />)}
        {items.length === 0 && <p className="rounded-lg border border-dashed border-zinc-300 p-4 text-center text-xs text-zinc-400">{t('board.empty')}</p>}
      </div>
    </section>
  )
}

function Lane({ lane, items, onDrop, onDragStart }: { lane: 'personal' | 'work'; items: BoardItem[]; onDrop: (lane: 'personal' | 'work', column: Column) => void; onDragStart: (item: BoardItem) => void }) {
  const { t } = useModuleTranslation()
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <h2 className="text-base font-semibold text-zinc-900">{t(`board.lanes.${lane}`)}</h2>
        <div className="h-px flex-1 bg-zinc-200" />
      </div>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {columns.map(column => <BoardColumn key={column} lane={lane} column={column} items={items.filter(item => item.status === column)} onDrop={onDrop} onDragStart={onDragStart} />)}
      </div>
    </section>
  )
}

export default function UnifiedKanban() {
  const { t } = useModuleTranslation()
  const [board, setBoard] = useState<BoardLane>({ personal: [], work: [] })
  const [dragged, setDragged] = useState<BoardItem | null>(null)
  const [error, setError] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const response = await forgeAPI.board.get.input({}).query() as BoardResponse
      setBoard(normalizeBoard(response))
      setError(false)
    } catch {
      setError(true)
    }
  }, [])

  useEffect(() => { void refresh() }, [refresh])

  const total = useMemo(() => board.personal.length + board.work.length, [board])
  const onDrop = async (lane: 'personal' | 'work', status: Column) => {
    if (!dragged) return
    const item = dragged
    setDragged(null)
    setBoard(current => ({
      personal: lane === 'personal'
        ? [...current.personal.filter(candidate => candidate.id !== item.id || candidate.source !== item.source), { ...item, status }]
        : current.personal.filter(candidate => candidate.id !== item.id || candidate.source !== item.source),
      work: lane === 'work'
        ? [...current.work.filter(candidate => candidate.id !== item.id || candidate.source !== item.source), { ...item, status }]
        : current.work.filter(candidate => candidate.id !== item.id || candidate.source !== item.source)
    }))
    try {
      await forgeAPI.board.move.input({ source: item.source, id: item.id, status }).mutate(undefined)
      await refresh()
    } catch {
      setError(true)
      await refresh()
    }
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#fafafa]">
      <ModuleHeader />
      <main className="mx-auto w-full max-w-[1700px] space-y-8 px-6 py-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">{t('board.eyebrow')}</p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">{t('board.title')}</h1>
            <p className="mt-1 text-sm text-zinc-500">{t('board.subtitle')}</p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm"><span className="font-semibold text-zinc-900">{total}</span> {t('board.items')}</div>
        </header>
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{t('board.error')}</p>}
        <div className="space-y-8">
          <Lane lane="personal" items={board.personal} onDrop={onDrop} onDragStart={setDragged} />
          <Lane lane="work" items={board.work} onDrop={onDrop} onDragStart={setDragged} />
        </div>
      </main>
    </div>
  )
}
