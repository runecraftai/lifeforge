import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import entriesRouter from './routes/entries'
import listsRouter from './routes/lists'

const routes = forgeRouter({
  lists: listsRouter,
  entries: entriesRouter
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
