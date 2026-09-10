import type { Request } from 'express'

function isLoopbackHost(host: string): boolean {
  const normalizedHost = host.replace(/^\[|\]$/g, '').toLowerCase()

  return (
    normalizedHost === 'localhost' ||
    normalizedHost === '127.0.0.1' ||
    normalizedHost === '::1'
  )
}

function getCookieSecurity(req: Request) {
  const origin = req.headers.origin

  let originHost = ''

  if (typeof origin === 'string') {
    try {
      originHost = new URL(origin).hostname
    } catch {
      // Ignore malformed origins and retain the default cookie policy.
    }
  }

  const crossHostLoopback =
    isLoopbackHost(req.hostname) &&
    isLoopbackHost(originHost) &&
    req.hostname.toLowerCase() !== originHost.toLowerCase()
  const secure =
    req.secure ||
    req.protocol === 'https' ||
    process.env.NODE_ENV === 'production' ||
    crossHostLoopback

  return { secure, sameSite: secure ? 'none' : 'lax' } as const
}

export function getCookieOptions(req: Request) {
  const { secure, sameSite } = getCookieSecurity(req)

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000
  } as const
}

export function getClearCookieOptions(req: Request) {
  const { secure, sameSite } = getCookieSecurity(req)

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/auth',
    maxAge: 0
  } as const
}
