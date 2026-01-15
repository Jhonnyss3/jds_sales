import { updateSession } from '@/lib/supabase/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getUserRole(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return null
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('role, store_id, active')
    .eq('id', user.id)
    .single()

  if (error || !userData || !userData.active) {
    return null
  }

  return {
    role: userData.role as 'super_admin' | 'admin' | 'user',
    store_id: userData.store_id as string | null,
  }
}

function getRedirectPath(role: 'super_admin' | 'admin' | 'user', storeId: string | null): string {
  if (role === 'super_admin') {
    return '/super-admin/dashboard'
  }
  
  if (role === 'admin' && storeId) {
    return `/admin/${storeId}/dashboard`
  }
  
  return '/dashboard'
}

export async function middleware(request: NextRequest) {
  const supabaseResponse = await updateSession(request)
  
  const pathname = request.nextUrl.pathname
  const publicRoutes = ['/', '/test', '/login', '/auth']
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/auth')
  )

  if (isPublicRoute) {
    return supabaseResponse
  }

  const userRole = await getUserRole(request)

  if (!userRole) {
    if (pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  if (pathname === '/login') {
    const redirectPath = getRedirectPath(userRole.role, userRole.store_id)
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  const { role, store_id } = userRole

  if (pathname.startsWith('/super-admin')) {
    if (role !== 'super_admin') {
      const redirectPath = getRedirectPath(role, store_id)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
  }

  if (pathname.startsWith('/admin')) {
    if (role !== 'admin' && role !== 'super_admin') {
      const redirectPath = getRedirectPath(role, store_id)
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }
    
    if (role === 'admin' && store_id) {
      const pathParts = pathname.split('/').filter(Boolean)
      if (pathParts[0] === 'admin' && pathParts[1] && pathParts[1] !== 'dashboard') {
        const pathStoreId = pathParts[1]
        if (pathStoreId !== store_id) {
          return NextResponse.redirect(new URL(`/admin/${store_id}/dashboard`, request.url))
        }
      }
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}