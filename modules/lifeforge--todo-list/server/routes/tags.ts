import z from 'zod'

import forge from '../forge'
import todoListSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all todo tags',
    output: {
      OK: z.array(todoListSchemas.tags_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(await pb.getFullList.collection('tags_aggregated').execute())
  )

export const create = forge
  .mutation({
    description: 'Create a new todo tag',
    input: {
      body: todoListSchemas.tags
    },
    output: {
      CREATED: todoListSchemas.tags
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('tags').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update todo tag details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: todoListSchemas.tags
    },
    existenceCheck: {
      query: { id: 'tags' }
    },
    output: {
      OK: todoListSchemas.tags,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(await pb.update.collection('tags').id(id).data(body).execute())
  )

export const remove = forge
  .mutation({
    description: 'Delete a todo tag',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'tags' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('tags').id(id).execute()

    return response.noContent()
  })
