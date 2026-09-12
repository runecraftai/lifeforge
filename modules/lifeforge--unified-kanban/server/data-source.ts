import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export type LifecycleStatus = 'todo' | 'doing' | 'done'
export type BoardSource = 'personal' | 'mission'
export type BoardItem = { id: string; title: string; source: BoardSource; status: LifecycleStatus; priority?: string; repo?: string; kind?: string }
export type PersonalTask = { id: string; summary: string; status: LifecycleStatus; priority?: string }
export type SquadMission = { id: string; title: string; state: string; priority: string; repo: string; kind: string }
export type UnifiedBoard = { lanes: { personal: BoardItem[]; work: BoardItem[] } }

function missionStatus(state: string): LifecycleStatus {
  if (state === 'done') return 'done'
  if (state === 'in_flight') return 'doing'
  return 'todo'
}

function csv(line: string): string[] {
  const values: string[] = []
  let value = ''
  let quoted = false
  for (const character of line) {
    if (character === '"') quoted = !quoted
    else if (character === ',' && !quoted) { values.push(value.trim()); value = '' }
    else value += character
  }
  values.push(value.trim())
  return values.map(item => item.replace(/^"|"$/g, ''))
}

export async function listSquadMissions(): Promise<SquadMission[]> {
  const command = process.env.SQ_TASKS || 'sq-tasks'
  const cwd = process.env.SQUAD_DIR || '/home/rehem/Projects/squad'
  const output = (await execFileAsync(command, ['list', '--fields', 'priority'], { cwd, timeout: 10000, maxBuffer: 1024 * 1024 })).stdout
  return output.split(/\r?\n/).filter(line => /^\s{2}\S/.test(line)).map(line => {
    const [id = '', state = '', kind = '', repo = '', title = '', priority = '-'] = csv(line.trim())
    return { id, state, kind, repo, title, priority }
  }).filter(item => item.id && item.title)
}

export async function getUnifiedBoard(listPersonalTasks: () => Promise<PersonalTask[]>): Promise<UnifiedBoard> {
  const [personalTasks, missions] = await Promise.all([listPersonalTasks(), listSquadMissions()])
  return {
    lanes: {
      personal: personalTasks.map(task => ({ id: task.id, title: task.summary, source: 'personal', status: task.status, priority: task.priority })),
      work: missions.map(mission => ({ id: mission.id, title: mission.title, source: 'mission', status: missionStatus(mission.state), priority: mission.priority, repo: mission.repo, kind: mission.kind }))
    }
  }
}
