export default function LoginPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6 text-center text-black dark:text-zinc-50">
            Login
          </h1>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
            Página de login em desenvolvimento
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="seu@email.com"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                placeholder="••••••••"
                disabled
              />
            </div>
            <button
              className="w-full py-2 px-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Entrar
            </button>
          </div>
          <div className="mt-6 text-center">
            <a
              href="/test"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Ver status do banco (página de teste)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
