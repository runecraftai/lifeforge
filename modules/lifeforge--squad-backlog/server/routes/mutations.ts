import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import z from 'zod'
import forge from '../forge'

const execFileAsync = promisify(execFile)
const cwd = process.env.SQUAD_DIR || '/home/rehem/Projects/squad'
const command = process.env.SQ_TASKS || 'sq-tasks'
const id = z.string().regex(/^[a-z0-9][a-z0-9-]*$/)
const input = z.object({ id })
const result = z.record(z.string(), z.string())
const holdKind = z.enum(['commander', 'external', 'load', 'parked', 'future'])

async function mutate(args: string[]) {
  await execFileAsync(command, [...args, '--json'], { cwd, timeout: 10000 })
  const output = (await execFileAsync(command, ['show', args[1]!, '--full'], { cwd, timeout: 10000 })).stdout
  return Object.fromEntries(output.split(/\r?\n/).flatMap(line => { const match = line.match(/^\s{2}([a-z_]+):\s?(.*)$/); return match ? [[match[1]!, match[2]!]] : [] }))
}
function route(description: string, args: (query: { id: string }) => string[]) {
  return forge.mutation({ description, input: { query: input }, output: { OK: result } }).callback(async ({ query, response }) => response.ok(await mutate(args(query))))
}

export const start = route('Start a queued task', ({ id }) => ['start', id])
export const reopen = route('Reopen a task', ({ id }) => ['reopen', id])
export const unblock = forge.mutation({ description: 'Remove a task blocker', input: { query: z.object({ id, by: id }) }, output: { OK: result } }).callback(async ({ query, response }) => response.ok(await mutate(['unblock', query.id, '--by', query.by])))
export const unhold = route('Release a held task', ({ id }) => ['unhold', id])
export const block = forge.mutation({ description: 'Block a task', input: { query: z.object({ id, by: id }) }, output: { OK: result } }).callback(async ({ query, response }) => response.ok(await mutate(['block', query.id, '--by', query.by])))
export const hold = forge.mutation({ description: 'Hold a task', input: { query: z.object({ id, reason: z.string().min(1).max(200).refine(value => !value.includes('(') && !value.includes(')')), kind: holdKind, until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional() }) }, output: { OK: result } }).callback(async ({ query, response }) => response.ok(await mutate(['hold', query.id, '--reason', query.reason, '--kind', query.kind, ...(query.until ? ['--until', query.until] : [])])))
export const done = forge.mutation({ description: 'Complete an in-flight task', input: { query: input, body: z.object({ pr: z.string().url().refine(value => /^https?:\/\//.test(value)).optional(), note: z.string().optional() }).optional() }, output: { OK: result } }).callback(async ({ query, body, response }) => response.ok(await mutate(['done', query.id, ...(body?.pr ? ['--pr', body.pr] : []), ...(body?.note ? ['--note', body.note] : [])])))
