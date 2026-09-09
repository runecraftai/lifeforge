import { useEffect, useState } from 'react'
import { ModuleHeader } from '@lifeforge/ui'
import { forgeAPI } from '@/manifest'

type Note = { id: string; title: string; content: string; created: string; updated: string }

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selected, setSelected] = useState<Note | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  async function refresh(search = query) {
    try { setNotes(await forgeAPI.notes.list.input({ query: search || undefined }).query()) }
    catch { setError('Unable to load notes') }
  }

  useEffect(() => { void refresh('') }, [])
  function edit(note: Note | null) { setSelected(note); setTitle(note?.title ?? ''); setContent(note?.content ?? '') }
  async function save(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim()) return
    try {
      if (selected) await forgeAPI.notes.update.input({ id: selected.id }).mutate({ title: title.trim(), content })
      else await forgeAPI.notes.create.mutate({ title: title.trim(), content })
      edit(null); await refresh()
    } catch { setError('Unable to save note') }
  }
  async function remove(id: string) {
    try { await forgeAPI.notes.remove.input({ id }).mutate(undefined); if (selected?.id === id) edit(null); await refresh() }
    catch { setError('Unable to delete note') }
  }

  return <><ModuleHeader /><main style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(320px, 2fr)', gap: 24, padding: 24, height: '100%', boxSizing: 'border-box' }}>
    <section style={{ minWidth: 0 }}><div style={{ display: 'flex', gap: 8, marginBottom: 16 }}><input aria-label="Search notes" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && void refresh()} placeholder="Search notes" style={{ flex: 1, padding: 10 }} /><button onClick={() => void refresh()}>Search</button></div><button onClick={() => edit(null)} style={{ marginBottom: 16 }}>New note</button>{notes.map(note => <article key={note.id} onClick={() => edit(note)} style={{ cursor: 'pointer', border: '1px solid var(--color-border, #ccc)', borderRadius: 8, padding: 12, marginBottom: 8 }}><strong>{note.title}</strong><p style={{ whiteSpace: 'pre-wrap', margin: '8px 0 0' }}>{note.content.slice(0, 140)}</p></article>)}{!notes.length && <p>No notes found.</p>}</section>
    <section><form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}><input aria-label="Note title" required value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={{ padding: 12, fontSize: 18 }} /><textarea aria-label="Note content" value={content} onChange={e => setContent(e.target.value)} placeholder="Write your note..." rows={16} style={{ padding: 12, resize: 'vertical' }} /><div style={{ display: 'flex', gap: 8 }}><button type="submit">{selected ? 'Save' : 'Create'}</button>{selected && <button type="button" onClick={() => void remove(selected.id)}>Delete</button>}{selected && <button type="button" onClick={() => edit(null)}>Cancel</button>}</div></form>{error && <p role="alert">{error}</p>}</section>
  </main></>
}
