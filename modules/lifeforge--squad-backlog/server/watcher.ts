import fs from 'node:fs'
import path from 'node:path'
import forge from './forge'

const backlogFile = path.join(process.env.SQUAD_DIR || '/home/rehem/Projects/squad', 'data/backlog.md')
const clients = new Set<{ write(chunk: string): boolean }>()
let mode: 'watch' | 'polling' = 'watch'
let timer: NodeJS.Timeout | undefined

function broadcast() { for (const client of clients) client.write(`data: ${JSON.stringify({ type: 'backlog-changed', ts: Date.now() })}\n\n`) }
try {
  const watcher = fs.watch(backlogFile, { persistent: false }, () => { clearTimeout(timer); timer = setTimeout(broadcast, 500) })
  watcher.on('error', () => { mode = 'polling'; watcher.close() })
} catch { mode = 'polling' }

export const events = forge.query({ description: 'Stream Squad backlog changes', output: 'custom', noAuth: true, rateLimit: false }).callback(async ({ res }) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()
  res.write(`data: ${JSON.stringify({ type: 'mode', mode })}\n\n`)
  clients.add(res)
  res.on('close', () => clients.delete(res))
})
export { mode }
