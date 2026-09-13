import { forgeController, forgeRouter } from '@lifeforge/server-utils'

const list = forgeController
  .query()
  .description('Get all blog entries')
  .input({})
  .callback(({ pb }) => pb.getFullList.collection('blog__entries').execute())

export default forgeRouter({ list })
