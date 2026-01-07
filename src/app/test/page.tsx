import { createClient } from '@/lib/supabase/server'

export default async function TestPage() {
  const supabase = await createClient()
  
  // Testar conexão básica
  let connectionStatus = 'Desconhecido'
  let errorMessage: string | null = null
  let tablesInfo: { name: string; count: number }[] = []
  
  try {
    // Verificar se as variáveis de ambiente estão configuradas
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!hasUrl || !hasKey) {
      connectionStatus = 'Erro: Variáveis de ambiente não configuradas'
      errorMessage = `URL: ${hasUrl ? '✓' : '✗'}, Key: ${hasKey ? '✓' : '✗'}`
    } else {
      // Tentar fazer uma query simples para verificar conexão
      // Vamos tentar outras tabelas primeiro, evitando 'users' que pode ter problemas de RLS
      const testTables = ['stores', 'products', 'categories', 'customers', 'orders', 'order_items', 'users'] as const
      
      let connectionSuccess = false
      let lastError: string | null = null
      
      for (const table of testTables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .select('id')
            .limit(1)
          
          if (!error) {
            connectionStatus = 'Conectado com sucesso!'
            connectionSuccess = true
            break
          } else {
            lastError = `${table}: ${error.message}`
            // Continuar tentando outras tabelas
          }
        } catch (err) {
          lastError = `${table}: ${err instanceof Error ? err.message : 'Erro desconhecido'}`
        }
      }
      
      if (!connectionSuccess && lastError) {
        connectionStatus = 'Conexão OK, mas há problemas de permissão (RLS)'
        errorMessage = lastError
      }
      
      // Tentar contar registros em cada tabela
      const tables = ['stores', 'users', 'products', 'categories', 'customers', 'orders', 'order_items'] as const
      
      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
          
          if (!error) {
            tablesInfo.push({ name: table, count: count || 0 })
          }
        } catch (err) {
          // Ignorar erros de tabelas que podem não existir ainda
        }
      }
    }
  } catch (err) {
    connectionStatus = 'Erro ao conectar'
    errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
  }
  
  // Informações das variáveis de ambiente (sem expor valores sensíveis)
  const envInfo = {
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
    hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
  }
  
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-black dark:text-zinc-50">
            Teste de Conexão - Supabase
          </h1>
          
          {/* Status da Conexão */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
              Status da Conexão
            </h2>
            <div className={`p-4 rounded-lg ${
              connectionStatus.includes('sucesso') 
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                : connectionStatus.includes('Erro')
                ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200'
            }`}>
              <p className="font-medium">{connectionStatus}</p>
              {errorMessage && (
                <p className="mt-2 text-sm">{errorMessage}</p>
              )}
            </div>
          </div>
          
          {/* Informações das Variáveis de Ambiente */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
              Variáveis de Ambiente
            </h2>
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center gap-2">
                  <span className={envInfo.hasUrl ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {envInfo.hasUrl ? '✓' : '✗'}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    NEXT_PUBLIC_SUPABASE_URL: {envInfo.hasUrl ? `Configurado (${envInfo.urlLength} caracteres)` : 'Não configurado'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={envInfo.hasKey ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {envInfo.hasKey ? '✓' : '✗'}
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300">
                    NEXT_PUBLIC_SUPABASE_ANON_KEY: {envInfo.hasKey ? `Configurado (${envInfo.keyLength} caracteres)` : 'Não configurado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Informações das Tabelas */}
          {tablesInfo.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-black dark:text-zinc-50">
                Tabelas do Banco de Dados
              </h2>
              <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tablesInfo.map((table) => (
                    <div key={table.name} className="bg-white dark:bg-zinc-900 p-3 rounded">
                      <div className="font-medium text-black dark:text-zinc-50">{table.name}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">
                        {table.count} registro{table.count !== 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* Informações sobre RLS */}
          {errorMessage && errorMessage.includes('recursion') && (
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                ⚠️ Problema de Row Level Security (RLS)
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                O erro "infinite recursion detected in policy" indica que há uma política RLS na tabela que está causando recursão infinita.
              </p>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                Como resolver:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>Acesse o Dashboard do Supabase</li>
                <li>Vá em Authentication → Policies</li>
                <li>Encontre a política problemática na tabela mencionada</li>
                <li>Verifique se a política não está consultando a mesma tabela que está protegendo</li>
                <li>Corrija ou remova a política que causa recursão</li>
              </ol>
              <p className="text-xs mt-2 text-yellow-600 dark:text-yellow-400">
                <strong>Nota:</strong> A conexão com o Supabase está funcionando! O problema é apenas de permissões (RLS).
              </p>
            </div>
          )}
          
          {/* Instruções */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-black dark:text-zinc-50">
              Como configurar:
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Crie um arquivo <code className="bg-zinc-200 dark:bg-zinc-700 px-1 rounded">.env.local</code> na raiz do projeto</li>
              <li>Adicione suas credenciais do Supabase:
                <pre className="mt-2 p-2 bg-zinc-200 dark:bg-zinc-800 rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=sua_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui`}
                </pre>
              </li>
              <li>Reinicie o servidor de desenvolvimento</li>
            </ol>
          </div>
          
          {/* Link de volta */}
          <div className="mt-8">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
