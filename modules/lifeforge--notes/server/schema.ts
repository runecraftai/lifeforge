import z from 'zod'
import { cleanSchemas } from '@lifeforge/pocketbase'

export const schemas = {
  notes: {
    schema: z.object({
      title: z.string(),
      content: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    raw: {
      listRule: '@request.auth.id != ""',
      viewRule: '@request.auth.id != ""',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
      name: 'notes__notes',
      type: 'base',
      fields: [
        { autogeneratePattern: '[a-z0-9]{15}', hidden: false, max: 15, min: 15, name: 'id', pattern: '^[a-z0-9]+$', presentable: false, primaryKey: true, required: true, system: true, type: 'text' },
        { autogeneratePattern: '', hidden: false, max: 0, min: 1, name: 'title', pattern: '', presentable: true, primaryKey: false, required: true, system: false, type: 'text' },
        { autogeneratePattern: '', hidden: false, max: 0, min: 0, name: 'content', pattern: '', presentable: false, primaryKey: false, required: false, system: false, type: 'editor' }
      ],
      indexes: [],
      system: false
    }
  }
}

export default cleanSchemas(schemas)
