import { Module } from '@nestjs/common'

import { BoardController } from './controller'
import { AuthAdapter } from './auth-adapter'
import { PocketBaseAdapter } from './pocketbase-adapter'

@Module({ controllers: [BoardController], providers: [AuthAdapter, PocketBaseAdapter] })
export class KanbanModule {}
