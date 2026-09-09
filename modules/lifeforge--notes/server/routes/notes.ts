import z from 'zod'
import forge from '../forge'
import noteSchemas from '../schema'

export const list = forge.query({
  description: 'List notes, optionally matching title or content',
  input: { query: z.object({ query: z.string().optional() }) },
  output: { OK: z.array(noteSchemas.notes) }
}).callback(async ({ pb, query: { query }, response }) => {
  const records = await pb.getFullList.collection('notes').sort(['-id']).execute()
  const needle = query?.trim().toLowerCase()
  return response.ok(needle ? records.filter(note => `${note.title}\n${note.content}`.toLowerCase().includes(needle)) : records)
})

export const create = forge.mutation({
  description: 'Create a note',
  input: { body: z.object({ title: z.string().min(1), content: z.string() }) },
  output: { CREATED: noteSchemas.notes }
}).callback(async ({ pb, body, response }) => response.created(await pb.create.collection('notes').data(body).execute()))

export const update = forge.mutation({
  description: 'Update a note',
  input: { query: z.object({ id: z.string() }), body: z.object({ title: z.string().min(1), content: z.string() }) },
  existenceCheck: { query: { id: 'notes' } },
  output: { OK: noteSchemas.notes, NOT_FOUND: true }
}).callback(async ({ pb, query: { id }, body, response }) => response.ok(await pb.update.collection('notes').id(id).data(body).execute()))

export const remove = forge.mutation({
  description: 'Delete a note',
  input: { query: z.object({ id: z.string() }) },
  existenceCheck: { query: { id: 'notes' } },
  output: { NO_CONTENT: true, NOT_FOUND: true }
}).callback(async ({ pb, query: { id }, response }) => {
  await pb.delete.collection('notes').id(id).execute()
  return response.noContent()
})
