import { next } from '@vercel/functions'

const REALM = 'Maaden Benchmark'

function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header?.startsWith('Basic ')) return null
  try {
    const decoded = atob(header.slice(6))
    const i = decoded.indexOf(':')
    if (i < 0) return null
    return { user: decoded.slice(0, i), pass: decoded.slice(i + 1) }
  } catch {
    return null
  }
}

export const config = {
  matcher: '/:path*',
}

export default function middleware(request: Request) {
  const expectedUser = process.env.BASIC_AUTH_USER?.trim() ?? ''
  const expectedPass = process.env.BASIC_AUTH_PASS?.trim() ?? ''

  if (!expectedUser || !expectedPass) {
    return next()
  }

  const creds = parseBasicAuth(request.headers.get('authorization'))
  if (creds && creds.user === expectedUser && creds.pass === expectedPass) {
    return next()
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}"`,
      'Cache-Control': 'no-store',
    },
  })
}
