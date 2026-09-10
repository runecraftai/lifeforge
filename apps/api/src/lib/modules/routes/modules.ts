import { ROOT_DIR } from '@constants'
import { checkModulesAvailability } from '@functions/modules/checkModulesAvailability'
import { execFileSync } from 'node:child_process'
import z from 'zod'

import {
  moduleManifestSchema,
  moduleSchema,
  moduleWidgetSchema
} from '@lifeforge/configs'
import { ModuleRegistry } from '@lifeforge/server-utils'

import forge from '../forge'

export const manifest = forge
  .query({
    description: 'Get installed modules manifest for runtime loading',
    input: {},
    output: {
      OK: z.object({
        modules: z.array(moduleManifestSchema)
      })
    }
  })
  .callback(async ({ response }) =>
    response.ok({ modules: ModuleRegistry.manifests })
  )

export const list = forge
  .query({
    description: 'List installed modules with metadata',
    input: {},
    output: {
      OK: z.array(moduleSchema)
    }
  })
  .callback(async ({ response }) => response.ok(ModuleRegistry.list))

export const uninstall = forge
  .mutation({
    description: 'Uninstall an installed module',
    input: {
      body: z.object({
        moduleName: z
          .string()
          .regex(
            /^@lifeforge\/[a-z0-9-_]+--[a-z0-9-_]+$/i,
            'Invalid module name'
          )
      })
    },
    output: {
      OK: z.object({
        success: z.boolean(),
        error: z.string().optional()
      })
    }
  })
  .callback(async ({ body: { moduleName }, response }) => {
    try {
      execFileSync('pnpm', ['forge', 'modules', 'uninstall', moduleName], {
        cwd: ROOT_DIR,
        stdio: 'pipe'
      })

      ModuleRegistry.unregister(moduleName)

      return response.ok({ success: true })
    } catch (error) {
      return response.ok({
        success: false,
        error: error instanceof Error ? error.message : 'Uninstall failed'
      })
    }
  })

export const checkModuleAvailability = forge
  .query({
    description: 'Check if a module is available (installed)',
    input: {
      query: z.object({
        moduleId: z.string().min(1)
      })
    },
    output: {
      OK: z.boolean()
    }
  })
  .callback(async ({ query: { moduleId }, response }) =>
    response.ok(await checkModulesAvailability(moduleId))
  )

export const widgets = forge
  .query({
    description: 'Get all available widgets configuration',
    input: {},
    output: {
      OK: z.array(moduleWidgetSchema)
    }
  })
  .callback(async ({ response }) => response.ok(ModuleRegistry.widgets))
