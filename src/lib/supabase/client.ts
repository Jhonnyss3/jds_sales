import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types'

// Timeout de sessão: 5 minutos
const SESSION_TIMEOUT_SECONDS = 5 * 60

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return document.cookie.split('; ').map((cookie) => {
            const [name, ...rest] = cookie.split('=')
            return { name, value: rest.join('=') }
          })
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const maxAge = options?.maxAge ?? SESSION_TIMEOUT_SECONDS
            document.cookie = `${name}=${value}; max-age=${maxAge}; path=${options?.path || '/'}; ${
              options?.secure ? 'secure;' : ''
            } ${options?.sameSite ? `sameSite=${options.sameSite};` : ''}`
          })
        },
      },
    }
  )
}
