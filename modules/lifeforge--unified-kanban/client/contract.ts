export const contract = {
  board: {
    get: {
      method: 'get',
      description: 'Get unified personal and Squad board data',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: { query: {} },
      output: { OK: {} }
    },
    move: {
      method: 'post',
      description: 'Move an item to a lifecycle column',
      noAuth: false,
      encrypted: true,
      isDownloadable: false,
      media: null,
      input: {
        query: {
          $schema: 'https://json-schema.org/draft/2020-12/schema',
          type: 'object',
          properties: {
            source: { type: 'string', enum: ['personal', 'mission'] },
            id: { type: 'string' },
            status: { type: 'string', enum: ['todo', 'doing', 'done'] }
          },
          required: ['source', 'id', 'status'],
          additionalProperties: false
        }
      },
      output: { OK: {} }
    }
  }
} as const

export default contract
