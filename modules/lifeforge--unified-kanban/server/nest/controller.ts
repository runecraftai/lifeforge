import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common'
import type { Request } from 'express'

import { getUnifiedBoard, moveSquadMission, type LifecycleStatus } from '../data-source'
import { AuthAdapter } from './auth-adapter'
import { PocketBaseAdapter } from './pocketbase-adapter'

const statuses = ['todo', 'doing', 'done'] as const

type MoveBody = { source: 'personal' | 'mission'; id: string; status: LifecycleStatus }

@Controller('board')
export class BoardController {
  constructor(private readonly auth: AuthAdapter, private readonly pocketbase: PocketBaseAdapter) {}

  @Get()
  async get(@Req() request: Request) {
    const { pb } = await this.auth.authenticate(request)
    return { state: 'success', data: await getUnifiedBoard(() => this.pocketbase.listPersonalTasks(pb)) }
  }

  @Post('move')
  async move(@Req() request: Request, @Body() body: MoveBody) {
    const { pb } = await this.auth.authenticate(request)
    if (!body || !statuses.includes(body.status) || !body.id || (body.source !== 'personal' && body.source !== 'mission')) {
      throw new BadRequestException('Invalid board move')
    }
    if (body.source === 'personal') await this.pocketbase.movePersonalTask(pb, body.id, body.status)
    else await moveSquadMission(body.id, body.status)
    return { state: 'success', data: { id: body.id, source: body.source, status: body.status } }
  }
}
