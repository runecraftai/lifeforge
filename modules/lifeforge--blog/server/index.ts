import { forgeRouter, writeContractFileToClient } from '@lifeforge/server-utils'

import blogEntriesRouter from './routes/entries'

const routes = forgeRouter({
  entries: blogEntriesRouter
})

writeContractFileToClient(routes, import.meta.dirname)

export default routes
