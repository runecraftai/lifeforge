import type { Request } from 'express'
import { afterEach, describe, expect, it, vi } from 'vitest'

// @ts-expect-error Vitest must resolve the TypeScript source over the ignored JS build artifact.
import { getClearCookieOptions, getCookieOptions } from '../constants/cookie.ts'

function request(
  hostname: string,
  origin?: string,
  protocol: 'http' | 'https' = 'http'
): Request {
  return {
    hostname,
    protocol,
    secure: protocol === 'https',
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
      path: '/'
    })
  })

  it('allows a different loopback host to send the refresh cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('127.0.0.1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/'
    })
  })

  it('uses the same policy when clearing a cross-host loopback cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getClearCookieOptions(request('127.0.0.1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/',
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
      path: '/'
    })
  })

  it('keeps Lax for same loopback host with a different port', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('localhost', 'http://localhost:5173'))
    ).toMatchObject({
      secure: false,
      sameSite: 'lax',
      path: '/'
    })
  })

  it('allows IPv6 loopback cross-host to send the refresh cookie', () => {
    vi.stubEnv('NODE_ENV', 'development')

    expect(
      getCookieOptions(request('::1', 'http://localhost:5173'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/'
    })
  })

  it('does not mark plain HTTP production cookies as secure', () => {
    vi.stubEnv('NODE_ENV', 'production')

    expect(getCookieOptions(request('localhost'))).toMatchObject({
      secure: false,
      sameSite: 'lax',
      path: '/'
    })
  })

  it('marks cookies secure when the trusted proxy reports HTTPS', () => {
    vi.stubEnv('NODE_ENV', 'production')

    expect(
      getCookieOptions(request('localhost', 'https://localhost:5173', 'https'))
    ).toMatchObject({
      secure: true,
      sameSite: 'none',
      path: '/'
    })
  })
})
