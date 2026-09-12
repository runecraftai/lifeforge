import { createKanbanRouter } from './nest/bootstrap'

export { getUnifiedBoard, listSquadMissions, moveSquadMission } from './data-source'
export type { BoardItem, BoardSource, LifecycleStatus, PersonalTask, SquadMission, UnifiedBoard } from './data-source'

export default await createKanbanRouter()
