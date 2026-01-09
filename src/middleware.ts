// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
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
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // 1. DETECTA CONTEXTO (super admin ou loja)
  const isSuperAdminDomain = hostname.includes('localhost') || hostname.includes('seuapp.com')
  
  // 2. SE NÃO ESTÁ LOGADO
  if (!user) {
    // Permite acessar /login
    if (pathname === '/login') {
      return supabaseResponse
    }
    
    // Redireciona para login se tentar acessar área protegida
    if (pathname.startsWith('/super-admin') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    
    return supabaseResponse
  }

  // 3. SE ESTÁ LOGADO - busca role
  const { data: userData } = await supabase
    .from('users')
    .select('role, store_id')
    .eq('id', user.id)
    .single()

  if (!userData) {
    // Usuário sem dados, faz logout
    await supabase.auth.signOut()
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 4. LÓGICA DE REDIRECIONAMENTO PÓS-LOGIN
  if (pathname === '/login') {
    // Já logado, redireciona baseado em role
    if (userData.role === 'super_admin') {
      return NextResponse.redirect(new URL('/super-admin/lojas', request.url))
    } else {
      return NextResponse.redirect(new URL('/admin/produtos', request.url))
    }
  }

  // 5. PROTEÇÃO DE ROTAS
  
  // Super admin tentando acessar área de super admin
  if (pathname.startsWith('/super-admin')) {
    if (userData.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Admin de loja tentando acessar área admin
  if (pathname.startsWith('/admin')) {
    if (userData.role !== 'admin' && userData.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}