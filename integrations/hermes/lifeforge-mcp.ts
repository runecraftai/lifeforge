type Json = null | boolean | number | string | Json[] | { [key: string]: Json }
type RpcRequest = { id?: number | string; method: string; params?: Record<string, Json> }
type Task = {
  id: string
  summary: string
  notes: string
  due_date: string
  due_date_has_time: boolean
  list: string
  tags: string[]
  priority: string
  done: boolean
  completed_at: string
  created: string
  updated: string
}

type CreateArgs = { summary: string; notes?: string; due_date?: string }
type Note = { id: string; title: string; content: string; created: string; updated: string }
type CreateNoteArgs = { title: string; content: string }
type IdArgs = { id: string }

const host = process.env.PB_HOST
const email = process.env.PB_EMAIL
const password = process.env.PB_PASSWORD
if (!host || !email || !password) throw new Error('PB_HOST, PB_EMAIL, and PB_PASSWORD are required')

let token: string | undefined
const collection = 'todo_list__entries'
const notesCollection = 'notes__notes'

async function request(path: string, init: RequestInit = {}): Promise<Json> {
  const response = await fetch(`${host}${path}`, {
    ...init,
    headers: {
      ...(init.body ? { 'content-type': 'application/json' } : {}),
      ...(token ? { Authorization: token } : {}),
      ...init.headers
    }
  })
  const body = await response.text()
  const value = body ? JSON.parse(body) : null
  if (!response.ok) throw new Error(`LifeForge request failed (${response.status})`)
  return value as Json
}

async function authenticate(): Promise<void> {
  const result = (await request('/api/collections/users/auth-with-password', {
    method: 'POST',
    body: JSON.stringify({ identity: email, password })
  })) as { token: string; record?: { collectionName?: string } }
  if (!result.token || result.record?.collectionName !== 'users') {
    throw new Error('LifeForge user authentication failed')
  }
  token = result.token
}

async function callTool(name: string, args: Record<string, Json>): Promise<Json> {
  if (!token) await authenticate()
  if (name === 'list_tasks') {
    const result = (await request(`/api/collections/${collection}/records?sort=-created&perPage=100`)) as { items: Task[] }
    return result.items
  }
  if (name === 'create_task') {
    const input = args as unknown as CreateArgs
    return request(`/api/collections/${collection}/records`, {
      method: 'POST',
      body: JSON.stringify({
        summary: input.summary,
        notes: input.notes ?? '',
        due_date: input.due_date ?? '',
        due_date_has_time: false,
        list: '',
        tags: [],
        priority: ''
      })
    })
  }
  if (name === 'create_note') {
    const input = args as unknown as CreateNoteArgs
    return request(`/api/collections/${notesCollection}/records`, {
      method: 'POST',
      body: JSON.stringify({ title: input.title, content: input.content })
    })
  }
  if (name === 'search_notes') {
    const query = String(args.query ?? '').trim().toLowerCase()
    const result = (await request(`/api/collections/${notesCollection}/records?sort=-id&perPage=100`)) as { items: Note[] }
    return query ? result.items.filter(note => `${note.title}\n${note.content}`.toLowerCase().includes(query)) : result.items
  }
  if (name === 'complete_task') {
    const { id } = args as unknown as IdArgs
    return request(`/api/collections/${collection}/records/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ done: true, completed_at: new Date().toISOString() })
    })
  }
  throw new Error(`Unknown tool: ${name}`)
}

const tools = [
  {
    name: 'list_tasks',
    description: 'List official LifeForge Todo List entries.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false }
  },
  {
    name: 'create_task',
    description: 'Create an official LifeForge Todo List entry.',
    inputSchema: {
      type: 'object',
      properties: { summary: { type: 'string' }, notes: { type: 'string' }, due_date: { type: 'string' } },
      required: ['summary'],
      additionalProperties: false
    }
  },
  {
    name: 'create_note',
    description: 'Create a LifeForge note.',
    inputSchema: {
      type: 'object',
      properties: { title: { type: 'string' }, content: { type: 'string' } },
      required: ['title', 'content'],
      additionalProperties: false
    }
  },
  {
    name: 'search_notes',
    description: 'Search LifeForge notes by title and content.',
    inputSchema: {
      type: 'object',
      properties: { query: { type: 'string' } },
      required: ['query'],
      additionalProperties: false
    }
  },
  {
    name: 'complete_task',
    description: 'Mark an official LifeForge Todo List entry complete.',
    inputSchema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'], additionalProperties: false }
  }
]

process.stdin.setEncoding('utf8')
let buffer = ''
process.stdin.on('data', async (chunk: string) => {
  buffer += chunk
  const lines = buffer.split('\n')
  buffer = lines.pop() ?? ''
  for (const line of lines) {
    if (!line.trim()) continue
    const requestMessage = JSON.parse(line) as RpcRequest
    let result: Json
    try {
      if (requestMessage.method === 'initialize') {
        result = { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'lifeforge-mcp', version: '1.0.0' } }
      } else if (requestMessage.method === 'notifications/initialized') {
        continue
      } else if (requestMessage.method === 'tools/list') {
        result = { tools }
      } else if (requestMessage.method === 'tools/call') {
        const params = requestMessage.params as { name: string; arguments?: Record<string, Json> }
        const value = await callTool(params.name, params.arguments ?? {})
        result = {
          content: [{ type: 'text', text: JSON.stringify(value) }],
          structuredContent: Array.isArray(value) ? { tasks: value } : value
        }
      } else {
        throw new Error(`Unsupported method: ${requestMessage.method}`)
      }
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: requestMessage.id, result }) + '\n')
    } catch (error) {
      process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: requestMessage.id, error: { code: -32000, message: error instanceof Error ? error.message : 'MCP request failed' } }) + '\n')
    }
  }
})
