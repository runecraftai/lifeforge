import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import z from 'zod'
import forge from '../forge'

const execFileAsync = promisify(execFile)
const cwd = process.env.SQUAD_DIR || '/home/rehem/Projects/squad'
const command = process.env.SQ_TASKS || 'sq-tasks'
const idSchema = z.string().regex(/^[a-z0-9][a-z0-9-]*$/)
const task = z.object({ id: z.string(), state: z.string(), kind: z.string(), repo: z.string(), title: z.string(), priority: z.string(), blocked_by: z.string(), blocked: z.string(), held: z.string(), hold_reason: z.string(), hold_kind: z.string(), links: z.string() })

function csv(line: string): string[] {
  const values: string[] = []; let value = ''; let quoted = false
  for (let i = 0; i < line.length; i++) { const char = line[i]; if (char === '"') quoted = !quoted; else if (char === ',' && !quoted) { values.push(value); value = '' } else value += char }
  values.push(value); return values.map(value => value.trim().replace(/^"|"$/g, ''))
}
async function parse(output: string) {
  const rows = output.split(/\r?\n/).filter(line => /^\s{2}\S/.test(line))
  const tasks = rows.map(line => { const [id = '', state = '', kind = '', repo = '', title = '', blocked = 'no', blocked_by = 'none', held = 'no', hold_reason = '-', hold_kind = '-', links = 'none', priority = '-'] = csv(line.trim()); return { id, state, kind, repo, title, priority, blocked_by, blocked, held, hold_reason, hold_kind, links } }).filter(item => item.id)

  return Promise.all(tasks.map(async item => {
    if (!item.title.includes('(truncated,')) return item

    try {
      const full = await run(['show', item.id, '--full'])
      const titleLine = full.split(/\r?\n/).find(line => /^\s{2}title:\s/.test(line))
      const rawTitle = titleLine?.replace(/^\s{2}title:\s/, '')

      return rawTitle ? { ...item, title: JSON.parse(rawTitle) as string } : item
    } catch {
      return item
    }
  }))
}
async function run(args: string[]) { return (await execFileAsync(command, args, { cwd, timeout: 10000, maxBuffer: 1024 * 1024 })).stdout }

export const list = forge.query({
  description: 'List Squad backlog tasks',
  input: { query: z.object({ state: z.enum(['in_flight', 'queued', 'held', 'done']).optional(), repo: z.string().optional(), blocked: z.boolean().optional(), kind: z.string().optional(), holdKind: z.string().optional() }) },
  output: { OK: z.array(task) }
}).callback(async ({ query, response }) => {
  const args = ['list', '--fields', 'blocked,blocked_by,held,hold_reason,hold_kind,links,priority']
  if (query.state) args.push('--state', query.state)
  if (query.repo) args.push('--repo', query.repo)
  if (query.blocked) args.push('--blocked')
  if (query.kind) args.push('--kind', query.kind)
  let tasks = await parse(await run(args))
  if (query.holdKind) tasks = tasks.filter(item => item.hold_kind === query.holdKind)
  return response.ok(tasks)
})

export const detail = forge.query({ description: 'Show a Squad task', input: { query: z.object({ id: idSchema }) }, output: { OK: z.record(z.string(), z.string()) } }).callback(async ({ query: { id }, response }) => response.ok(Object.fromEntries((await run(['show', id, '--full'])).split(/\r?\n/).flatMap(line => { const match = line.match(/^\s{2}([a-z_]+):\s?(.*)$/); return match ? [[match[1]!, match[2]!]] : [] }))))
