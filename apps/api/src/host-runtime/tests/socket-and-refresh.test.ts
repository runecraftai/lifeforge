import { cleanupTestTokens, initAuthTests } from '@tests/e2e-setup'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

const publicHost = process.env.PUBLIC_HOST ?? 'http://localhost:5173'

let email = ''
let password = ''

beforeAll(async () => {
  const creds = await initAuthTests()
  email = creds.email
  password = creds.password
})

afterAll(cleanupTestTokens)

function getSetCookieHeaders(response: Response): string[] {
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[]
  }

  return headers.getSetCookie?.() ?? [headers.get('set-cookie') ?? '']
}

describe('public host runtime routes', () => {
  it('proxies Socket.IO polling and WebSocket upgrades to the API', async () => {
    const polling = await fetch(
      `${publicHost}/socket.io/?EIO=4&transport=polling`
    )

    expect(polling.headers.get('content-type')).not.toContain('text/html')
    expect((await polling.text()).startsWith('<')).toBe(false)

    const websocketHost = publicHost.replace(/^http/, 'ws')
    const socket = new WebSocket(
      `${websocketHost}/socket.io/?EIO=4&transport=websocket`
    )

    const firstMessage = await new Promise<string>((resolve, reject) => {
      socket.addEventListener('message', event => resolve(String(event.data)), {
        once: true
      })
      socket.addEventListener(
        'error',
        () => reject(new Error('WebSocket failed')),
        {
          once: true
        }
      )
    })

    expect(firstMessage).toMatch(/^0/)
    socket.close()
  })

  it('stores the public refresh cookie and refreshes through the public URL', async () => {
    const login = await fetch(`${publicHost}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const setCookies = getSetCookieHeaders(login)
    const refreshCookie = setCookies.find(cookie =>
      cookie.startsWith('refresh_token=')
    )

    expect(login.status).toBe(200)
    expect(refreshCookie).toBeTruthy()
    expect(refreshCookie).toMatch(/(?:^|; )Path=\//)
    expect(refreshCookie).not.toMatch(/(?:^|; )Secure(?:;|$)/i)

    const refresh = await fetch(`${publicHost}/api/auth/refresh`, {
      method: 'POST',
      headers: { cookie: refreshCookie!.split(';', 1)[0] }
    })

    expect(refresh.status).toBe(200)
  })
})
