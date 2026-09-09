import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'
import * as notesRouter from './routes/notes'

const routes = forgeRouter({ notes: notesRouter })
writeContractFileToClient(routes, import.meta.dirname)
export default routes
