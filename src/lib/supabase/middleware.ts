import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/types'

// Timeout de sessão: 5 minutos
const SESSION_TIMEOUT_SECONDS = 5 * 60

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            // Configurar maxAge de 5 minutos para cookies de sessão
            const maxAge = options?.maxAge ?? SESSION_TIMEOUT_SECONDS
            supabaseResponse.cookies.set(name, value, {
              ...options,
              maxAge,
            })
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user, session },
  } = await supabase.auth.getUser()

  // Verificar se a sessão expirou (5 minutos)
  if (session) {
    const sessionAge = Date.now() / 1000 - (session.expires_at ?? 0)
    if (sessionAge >= SESSION_TIMEOUT_SECONDS) {
      // Sessão expirada, limpar cookies e redirecionar
      supabaseResponse.cookies.delete('sb-access-token')
      supabaseResponse.cookies.delete('sb-refresh-token')
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }

  // Rotas públicas que não requerem autenticação
  const publicRoutes = ['/', '/test', '/login', '/auth']
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith('/auth')
  )

  // Redirecionar para login se não for rota pública e não houver usuário
  if (
    !user &&
    !isPublicRoute
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse
}
