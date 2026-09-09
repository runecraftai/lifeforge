import z from 'zod'

import forge from '../forge'
import todoListSchemas from '../schema'

export const list = forge
  .query({
    description: 'Get all todo priorities',
    output: {
      OK: z.array(todoListSchemas.priorities_aggregated)
    }
  })
  .callback(async ({ pb, response }) =>
    response.ok(
      await pb.getFullList.collection('priorities_aggregated').execute()
    )
  )

export const create = forge
  .mutation({
    description: 'Create a new priority level',
    input: {
      body: todoListSchemas.priorities
    },
    output: {
      CREATED: todoListSchemas.priorities
    }
  })
  .callback(async ({ pb, body, response }) =>
    response.created(
      await pb.create.collection('priorities').data(body).execute()
    )
  )

export const update = forge
  .mutation({
    description: 'Update priority details',
    input: {
      query: z.object({
        id: z.string()
      }),
      body: todoListSchemas.priorities
    },
    existenceCheck: {
      query: { id: 'priorities' }
    },
    output: {
      OK: todoListSchemas.priorities,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, body, response }) =>
    response.ok(
      await pb.update.collection('priorities').id(id).data(body).execute()
    )
  )

export const remove = forge
  .mutation({
    description: 'Delete a priority level',
    input: {
      query: z.object({
        id: z.string()
      })
    },
    existenceCheck: {
      query: { id: 'priorities' }
    },
    output: {
      NO_CONTENT: true,
      NOT_FOUND: true
    }
  })
  .callback(async ({ pb, query: { id }, response }) => {
    await pb.delete.collection('priorities').id(id).execute()

    return response.noContent()
  })
