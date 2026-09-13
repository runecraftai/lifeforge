import { forgeController, forgeRouter } from '@lifeforge/server-utils'
import z from 'zod'

import scrapeProviders from '../helpers/scrapers'

const listByListId = forgeController
  .query()
  .description('Get wishlist entries by list ID')
  .input({
    query: z.object({
      id: z.string(),
      bought: z
        .string()
        .optional()
        .transform(val => val === 'true')
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__lists'
  })
  .callback(async ({ pb, query: { id, bought } }) =>
    pb.getFullList
      .collection('wishlist__entries')
      .filter([
        {
          field: 'list',
          operator: '=',
          value: id
        },
        {
          field: 'bought',
          operator: '=',
          value: bought
        }
      ])
      .execute()
  )

const scrapeExternal = forgeController
  .mutation()
  .description('Scrape external website for wishlist entry data')
  .input({
    body: z.object({
      url: z.string(),
      provider: z.string()
    })
  })
  .callback(async ({ pb, body: { url, provider }, core }) => {
    const result = await scrapeProviders[
      provider as keyof typeof scrapeProviders
    ]?.(pb, url, core)

    if (!result) {
      throw new Error('Error scraping provider')
    }

    return result
  })

const create = forgeController
  .mutation()
  .description('Create a new wishlist entry')
  .input({
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.number().min(0),
      list: z.string()
    })
  })
  .media({
    image: {
      optional: true
    }
  })
  .existenceCheck('body', {
    list: 'wishlist__lists'
  })
  .statusCode(201)
  .callback(async ({ pb, body, media: { image }, core: { media: { retrieveMedia } } }) => {
    const imageData = await retrieveMedia('image', image)
    return pb.create
      .collection('wishlist__entries')
      .data({
        ...body,
        bought: false,
        ...imageData
      })
      .execute()
  })

const update = forgeController
  .mutation()
  .description('Update an existing wishlist entry')
  .input({
    query: z.object({
      id: z.string()
    }),
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.number().min(0),
      list: z.string()
    })
  })
  .media({
    image: {
      optional: true
    }
  })
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .existenceCheck('body', {
    list: 'wishlist__lists'
  })
  .callback(async ({
      pb,
      query: { id },
      body: { list, name, url, price },
      media: { image },
      core: { media: { retrieveMedia } }
    }) => {
      const imageData = await retrieveMedia('image', image)
      return pb.update
        .collection('wishlist__entries')
        .id(id)
        .data({
          list,
          name,
          url,
          price,
          ...imageData
        })
        .execute()
    }
  )

const updateBoughtStatus = forgeController
  .mutation()
  .description('Update wishlist entry bought status')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .callback(async ({ pb, query: { id } }) => {
    const oldEntry = await pb.getOne
      .collection('wishlist__entries')
      .id(id)
      .execute()

    return await pb.update
      .collection('wishlist__entries')
      .id(id)
      .data({
        bought: !oldEntry.bought,
        bought_at: oldEntry.bought ? null : new Date().toISOString()
      })
      .execute()
  })

const remove = forgeController
  .mutation()
  .description('Delete a wishlist entry')
  .input({
    query: z.object({
      id: z.string()
    })
  })
  .existenceCheck('query', {
    id: 'wishlist__entries'
  })
  .statusCode(204)
  .callback(
    async ({ pb, query: { id } }) =>
      await pb.delete.collection('wishlist__entries').id(id).execute()
  )

export default forgeRouter({
  listByListId,
  scrapeExternal,
  create,
  update,
  updateBoughtStatus,
  remove
})
