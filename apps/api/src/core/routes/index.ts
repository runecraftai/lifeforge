import { ROOT_DIR } from '@constants'
import { loadAndRegisterModuleRoutes } from '@functions/modules/loadAndRegisterModuleRoutes'
import { registerRoutes } from '@functions/routes/functions/forgeRouter'
import { clientError } from '@functions/routes/utils/response'
import express from 'express'
import jwt from 'jsonwebtoken'
import path from 'path'

import {
  connectToPocketBase,
  validateEnvironmentVariables
} from '@lifeforge/pocketbase'
import { forgeRouter } from '@lifeforge/server-utils'

import coreRoutes from './core.routes'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SIGNING_KEY!
let proxyPB: Awaited<ReturnType<typeof connectToPocketBase>> | null = null

async function getProxyPB() {
  if (!proxyPB || !proxyPB.authStore.isValid) {
    proxyPB = await connectToPocketBase(validateEnvironmentVariables())
  }

  return proxyPB
}

router.use(
  '/api/collections/todo_list__entries/records',
  async (req, res, next) => {
    const bearerToken = req.headers.authorization?.split(' ')[1]

    if (!bearerToken) {
      res.status(401).send({
        state: 'error',
        message: 'Authorization token is required'
      })

      return
    }

    try {
      jwt.verify(bearerToken, JWT_SECRET, { algorithms: ['HS512'] })
      const pb = await getProxyPB()
      const target = `${process.env.PB_HOST}${req.originalUrl}`
      const upstream = await fetch(target, {
        method: req.method,
        headers: {
          authorization: `Bearer ${pb.authStore.token}`,
          ...(req.headers['content-type']
            ? { 'content-type': req.headers['content-type'] }
            : {})
        },
        body: ['GET', 'HEAD'].includes(req.method)
          ? undefined
          : Buffer.isBuffer(req.body) || typeof req.body === 'string'
            ? (req.body as unknown as BodyInit)
            : JSON.stringify(req.body)
      })

      res.status(upstream.status)
      upstream.headers.forEach((value, key) => res.setHeader(key, value))
      res.send(Buffer.from(await upstream.arrayBuffer()))
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).send({
          state: 'error',
          message: 'Invalid authorization credentials'
        })

        return
      }

      next(error)
    }
  }
)

const appRoutes = await loadAndRegisterModuleRoutes()

const mainRoutes = forgeRouter({
  ...coreRoutes,
  modules: forgeRouter({
    ...coreRoutes.modules,
    ...appRoutes
  })
})

router.use('/modules/:moduleName/*', (req, res, next) => {
  const moduleName = req.params.moduleName

  // Strict whitelist check for moduleName to prevent traversal, spaces, or special characters
  const MODULE_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9_-]*$/

  if (!MODULE_NAME_REGEX.test(moduleName)) {
    return next()
  }

  const filePath =
    (req.params[0 as any as keyof typeof req.params] as string) || ''

  // Block null byte injection in filePath
  if (filePath.includes('\0')) {
    return next()
  }

  const moduleDistPath = path.resolve(
    ROOT_DIR,
    'modules',
    moduleName,
    'client',
    'dist'
  )

  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  // Serve file securely using the root sandbox parameter
  res.sendFile(filePath, { root: moduleDistPath }, err => {
    if (err) {
      next()
    }
  })
})

router.use('/', registerRoutes(mainRoutes))

router.get('*', (_, res) => {
  res.set('Cache-Control', 'no-store')

  return clientError({
    res,
    message: 'The requested endpoint does not exist',
    code: 404,
    moduleName: 'core'
  })
})

export { mainRoutes }

export default router
