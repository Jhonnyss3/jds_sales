import { redirect } from 'next/navigation'
import { getUserWithRole } from '@/lib/supabase/user'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { SummaryCard } from '@/components/dashboard/SummaryCard'
import { createClient } from '@/lib/supabase/server'

export default async function SuperAdminDashboard() {
  try {
    const user = await getUserWithRole()

    if (!user) {
      console.log('Usuário não encontrado, redirecionando para login')
      redirect('/login')
    }

    console.log('Usuário encontrado:', { role: user.role, email: user.email })

    if (user.role !== 'super_admin') {
      console.log('Usuário não é super_admin, redirecionando')
      redirect('/login')
    }

    const supabase = await createClient()

    const { data: solicitacoes, error: solicitacoesError } = await supabase
      .from('orders')
      .select('id, status')
      .limit(100)

    if (solicitacoesError) {
      console.error('Erro ao buscar solicitações:', solicitacoesError)
    }

    const totalSolicitacoes = solicitacoes?.length || 0
    const pendentes = solicitacoes?.filter(s => s.status === 'pending' || s.status === 'pendente').length || 0
    const enviadas = solicitacoes?.filter(s => s.status === 'sent' || s.status === 'enviado').length || 0

    const { data: recentSolicitacoes, error: recentError } = await supabase
      .from('orders')
      .select('id, customer_id, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (recentError) {
      console.error('Erro ao buscar solicitações recentes:', recentError)
    }

    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar userName={user.name || undefined} userRole={user.role} />
        
        <div className="flex-1 flex flex-col">
          <Header userEmail={user.email} userName={user.name || undefined} />
          
          <main className="flex-1 p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-roboto mb-2" style={{ color: '#333745' }}>
                Dashboard
              </h1>
              <p className="font-roboto" style={{ color: '#333745', opacity: 0.7 }}>
                Bem-vindo ao painel administrativo
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard
                title="Total de Solicitações"
                value={totalSolicitacoes}
                subtitle="Todas"
                icon="D"
              />
              <SummaryCard
                title="Pendentes"
                value={pendentes}
                subtitle="Aguardando envio"
                icon="C"
              />
              <SummaryCard
                title="Enviadas"
                value={enviadas}
                subtitle="Este mês"
                icon="V"
              />
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border mb-8" style={{ borderColor: '#E8D7F1' }}>
              <h2 className="text-xl font-bold font-roboto mb-4" style={{ color: '#333745' }}>
                Bem-vindo ao Painel Administrativo da JDS Sales
              </h2>
              <p className="font-roboto mb-4" style={{ color: '#333745', opacity: 0.7 }}>
                Este é o seu painel de controle. Use o menu lateral para navegar entre as diferentes seções.
              </p>
              {pendentes > 0 && (
                <div className="p-4 rounded-lg font-roboto" style={{ backgroundColor: '#FFF3CD', border: '1px solid #FFC107' }}>
                  <p className="text-sm" style={{ color: '#856404' }}>
                    Você tem {pendentes} solicitação{pendentes > 1 ? 'ões' : ''} pendente{pendentes > 1 ? 's' : ''} para revisar.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border" style={{ borderColor: '#E8D7F1' }}>
              <h2 className="text-xl font-bold font-roboto mb-4" style={{ color: '#333745' }}>
                Solicitações Recentes
              </h2>
              <div className="space-y-4">
                {recentSolicitacoes && recentSolicitacoes.length > 0 ? (
                  recentSolicitacoes.map((solicitacao) => (
                    <div key={solicitacao.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: '#E8D7F1' }}>
                      <div>
                        <div className="font-medium font-roboto" style={{ color: '#333745' }}>
                          Solicitação #{solicitacao.id.slice(0, 8)}
                        </div>
                        <div className="text-sm font-roboto" style={{ color: '#333745', opacity: 0.6 }}>
                          {new Date(solicitacao.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-roboto ${
                          solicitacao.status === 'sent' || solicitacao.status === 'enviado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {solicitacao.status === 'sent' || solicitacao.status === 'enviado' ? 'Enviado' : 'Pendente'}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 font-roboto" style={{ color: '#333745', opacity: 0.6 }}>
                    Nenhuma solicitação recente
                  </p>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Erro no dashboard:', error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold font-roboto mb-4" style={{ color: '#333745' }}>
            Erro ao carregar dashboard
          </h1>
          <p className="font-roboto" style={{ color: '#333745' }}>
            {error instanceof Error ? error.message : 'Erro desconhecido'}
          </p>
        </div>
      </div>
    )
  }
}