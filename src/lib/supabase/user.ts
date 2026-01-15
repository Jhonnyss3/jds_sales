import { createClient } from './server'
import type { Database } from '@/lib/types'

export type UserRole = 'super_admin' | 'admin' | 'user'

export interface UserWithRole {
  id: string
  email: string
  name: string
  role: UserRole
  store_id: string | null
  active: boolean
}

export async function getUserWithRole(): Promise<UserWithRole | null> {
  try {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('Erro ao buscar usuário auth:', authError)
      return null
    }

    if (!user) {
      console.log('Usuário auth não encontrado')
      return null
    }

    const { data: userData, error } = await supabase
      .from('users')
      .select('id, email, name, role, store_id, active')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }

    if (!userData) {
      console.log('Dados do usuário não encontrados na tabela users')
      return null
    }

    if (!userData.active) {
      console.log('Usuário está inativo')
      return null
    }

    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: (userData.role as UserRole) || 'user',
      store_id: userData.store_id,
      active: userData.active,
    }
  } catch (err) {
    console.error('Erro em getUserWithRole:', err)
    return null
  }
}

export function getRedirectPath(role: UserRole, storeId: string | null): string {
  if (role === 'super_admin') {
    return '/super-admin/dashboard'
  }

  if (role === 'admin' && storeId) {
    return `/admin/${storeId}/dashboard`
  }

  return '/dashboard'
}