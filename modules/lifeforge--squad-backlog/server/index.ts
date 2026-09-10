import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'
import * as backlog from './routes/backlog'
import * as mutations from './routes/mutations'
import { events } from './watcher'

const routes = forgeRouter({ backlog, mutation: mutations, events })
writeContractFileToClient(routes, import.meta.dirname)
export default routes
