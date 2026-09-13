import z from 'zod'

import forge from '../forge'
import todoListSchemas from '../schema'

const listInput = todoListSchemas.lists.omit({
  id: true,
  collectionId: true,
  collectionName: true
})

export const list = forge
  .query({
    description: 'Get all todo lists',
    output: {
      OK: z.array(todoListSchemas.lists_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList
        .collection('lists_aggregated')
        .sort(['name'])
        .execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new todo list',
    input: {
      body: listInput
    },
    output: {
      CREATED: todoListSchemas.lists
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(await pb.create.collection('lists').data(body).execute())
  )

export const update = forge
  .mutation({
    description: 'Update todo list details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: listInput
    },
    existenceCheck: {
      query: { id: 'lists' }
    },
    output: {
      OK: todoListSchemas.lists,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(await pb.update.collection('lists').id(id).data(body).execute())
  )

export const remove = forge
  .mutation({
    description: 'Delete a todo list',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'lists' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('lists').id(id).execute()

    return response.noContent()
  })
