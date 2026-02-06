import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/supabase/user'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { createClient } from '@/lib/supabase/server'
import { LojasList } from '@/components/stores/LojasList'

export default async function LojasPage() {
  const user = await getUserWithRole()

  if (!user) {
    redirect('/login')
  }

  if (user.role !== 'super_admin') {
    redirect('/login')
  }

  const supabase = await createClient()
  
  const { data: lojas, error } = await supabase
    .from('stores')
    .select('id, name, created_at, updated_at')
    .order('created_at', { ascending: false })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={user.name || undefined} userRole={user.role} />
      
      <div className="flex-1 flex flex-col">
        <Header userEmail={user.email} userName={user.name || undefined} />
        
        <main className="flex-1 p-8">
          {error ? (
            <div className="p-8 text-center">
              <p className="font-roboto" style={{ color: '#ef4444' }}>
                Erro ao carregar lojas: {error.message}
              </p>
            </div>
          ) : (
            <LojasList lojas={lojas || []} />
          )}
        </main>
      </div>
    </div>
  )
}