import type { Request } from 'express'
import { afterEach, describe, expect, it, vi } from 'vitest'

// @ts-expect-error Vitest must resolve the TypeScript source over the ignored JS build artifact.
import { getClearCookieOptions, getCookieOptions } from '../constants/cookie.ts'

function request(hostname: string, origin?: string): Request {
  return {
    hostname,
    protocol: 'http',
    secure: false,
    headers: origin ? { origin } : {}
  } as Request
}

describe('auth cookie options', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('keeps lax cookies for same-host HTTP development requests', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(getCookieOptions(request('localhost'))).toMatchObject({
      secure: false,
      sameSite: 'lax',
      path: '/auth'
    })
  })

  it('allows a different loopback host to send the refresh cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('127.0.0.1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/auth'
    })
  })

  it('uses the same policy when clearing a cross-host loopback cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getClearCookieOptions(request('127.0.0.1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/auth',
      maxAge: 0
    })
  })

  it('keeps Lax for non-loopback cross-origin requests', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('api.example.com', 'http://evil.com'))
    ).toMatchObject({
      secure: false,
      sameSite: 'lax',
      path: '/auth'
    })
  })

  it('keeps Lax for same loopback host with a different port', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('localhost', 'http://localhost:5173'))
    ).toMatchObject({
      secure: false,
      sameSite: 'lax',
      path: '/auth'
    })
  })

  it('allows IPv6 loopback cross-host to send the refresh cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('::1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/auth'
    })
  })
})
