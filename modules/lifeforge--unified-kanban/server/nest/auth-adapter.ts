import { Injectable, UnauthorizedException } from '@nestjs/common'
import jwt from 'jsonwebtoken'
import type { Request } from 'express'

import { connectToPocketBase, validateEnvironmentVariables } from '@lifeforge/pocketbase'

@Injectable()
export class AuthAdapter {
  async authenticate(request: Request) {
    const token = request.headers.authorization?.split(' ')[1]

    if (!token) throw new UnauthorizedException()

    try {
      const payload = jwt.verify(token, process.env.JWT_SIGNING_KEY!, { algorithms: ['HS512'] })

      if (typeof payload === 'string' || typeof payload.sub !== 'string') throw new UnauthorizedException()

      const pb = await connectToPocketBase(validateEnvironmentVariables())
      await pb.collection('users').getOne(payload.sub)

      return { userId: payload.sub, pb }
    } catch {
      throw new UnauthorizedException()
    }
  }
}
