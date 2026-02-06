'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createStore(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: 'Usuário não autenticado' }
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (userError || !userData || userData.role !== 'super_admin') {
    return { error: 'Sem permissão para criar lojas' }
  }

  const name = formData.get('name') as string

  if (!name || name.trim() === '') {
    return { error: 'Nome da loja é obrigatório' }
  }

  const { data: store, error } = await supabase
    .from('stores')
    .insert({
      name: name.trim(),
    })
    .select()
    .single()

  if (error) {
    return { error: `Erro ao criar loja: ${error.message}` }
  }

  revalidatePath('/super-admin/lojas')
  return { success: true, store }
}