import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { expectNo2FA, forgeAPI, getPB, unwrap } from '@tests/utils'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { clearAccessToken, setAccessToken } from '@lifeforge/api'

let email = ''
let password = ''
let userId = ''
let originalLanguage: string | undefined

beforeAll(async () => {
  const creds = await initAuthTests()
  email = creds.email
  password = creds.password

  const user = (await getPB().collection('users').getFullList())[0]

  userId = user.id
  originalLanguage = user.language
})

afterAll(async () => {
  if (!userId) return

  await getPB()
    .collection('users')
    .update(userId, {
      language: originalLanguage ?? ''
    })
  clearAccessToken()
  await cleanupTestTokens()
})

async function authenticate() {
  const login = await forgeAPI.auth.login.mutateRaw(
    { email, password },
    { raw: true }
  )

  setAccessToken(expectNo2FA(unwrap(login)).accessToken)
}

describe('GET /locales/listUnsupportedModules', () => {
  it('returns the unsupported-module list for an authenticated user language', async () => {
    await getPB().collection('users').update(userId, { language: 'en' })
    await authenticate()

    const res = await forgeAPI.locales.listUnsupportedModules.queryRaw({
      raw: true
    })

    expect(res.status).toBe(200)
    expect(unwrap(res)).toEqual(expect.any(Array))
  })

  it('keeps the designed 404 when the user has no matching language', async () => {
    await getPB().collection('users').update(userId, { language: 'xx' })
    await authenticate()

    const res = await forgeAPI.locales.listUnsupportedModules.queryRaw({
      raw: true,
      raiseError: false
    })

    expect(res.status).toBe(404)
    expect(res.data).toMatchObject({
      state: 'error',
      message: 'Not Found'
    })
  })
})
