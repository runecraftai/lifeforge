import { NestFactory } from '@nestjs/core'
import { ExpressAdapter } from '@nestjs/platform-express'
import express, { type Router } from 'express'
import 'reflect-metadata'

import { KanbanModule } from './module'

export async function createKanbanRouter(): Promise<Router> {
  const router = express.Router()
  const app = await NestFactory.create(
    KanbanModule,
    new ExpressAdapter(router),
    { logger: false }
  )
  await app.init()

  return router
}
