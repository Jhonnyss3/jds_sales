'use client'

import { useState, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = 'Por favor, informe seu email'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Por favor, informe um email válido'
    }

    if (!password.trim()) {
      newErrors.password = 'Por favor, informe sua senha'
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ general: 'Email ou senha incorretos. Por favor, verifique suas credenciais.' })
        } else if (error.message.includes('Email not confirmed')) {
          setErrors({ general: 'Por favor, confirme seu email antes de fazer login.' })
        } else {
          setErrors({ general: 'Erro ao fazer login. Tente novamente mais tarde.' })
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, name, active, role, store_id')
          .eq('id', data.user.id)
          .single()

        if (userError) {
          setErrors({ general: 'Erro ao buscar informações do usuário. Verifique as políticas RLS no Supabase.' })
          setIsLoading(false)
          return
        }

        if (!userData) {
          setErrors({ general: 'Usuário não encontrado na base de dados.' })
          setIsLoading(false)
          return
        }

        if (userData.active === false) {
          setErrors({ general: 'Sua conta está desativada. Entre em contato com o administrador.' })
          setIsLoading(false)
          return
        }

        const role = (userData.role as 'super_admin' | 'admin' | 'user') || 'user'
        const storeId = userData.store_id || null

        if (!role || role === 'user') {
          setErrors({ general: 'Usuário sem permissão de acesso. Entre em contato com o administrador.' })
          setIsLoading(false)
          return
        }

        if (role === 'super_admin') {
          router.push('/super-admin/dashboard')
          router.refresh()
          return
        } else if (role === 'admin' && storeId) {
          router.push(`/admin/${storeId}/dashboard`)
          router.refresh()
          return
        } else {
          setErrors({ general: 'Configuração de acesso incompleta. Entre em contato com o administrador.' })
          setIsLoading(false)
          return
        }
      }
    } catch (err) {
      setErrors({ general: 'Erro inesperado. Por favor, tente novamente.' })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#333745' }}>
      <div className="max-w-5xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row font-roboto">
          {/* Painel Esquerdo - Texto e Instruções */}
          <div className="w-full md:w-1/2 p-12 flex flex-col justify-center" style={{ backgroundColor: '#333745' }}>
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 font-roboto" style={{ color: '#E8D7F1' }}>
                JDS Tech
              </h1>
              <p className="text-xl mb-4 font-roboto" style={{ color: '#E8D7F1' }}>
                Bem-vindo de volta!
              </p>
              <p className="text-base mb-6 font-roboto" style={{ color: '#E8D7F1' }}>
                Acesse sua conta agora mesmo.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2 font-roboto" style={{ color: '#E8D7F1' }}>
                  Como usar:
                </h3>
                <ul className="space-y-2 text-sm font-roboto" style={{ color: '#E8D7F1' }}>
                  <li>• Preencha seu email e senha</li>
                  <li>• Clique em "Entrar" para acessar</li>
                </ul>
              </div>

              <div className="mt-6">
                <a
                  href="/test"
                  className="text-sm underline underline-offset-2 font-roboto transition-colors inline-block"
                  style={{ color: '#E8D7F1' }}
                >
                  Ver status do banco (página de teste)
                </a>
              </div>
            </div>
          </div>

          {/* Painel Direito - Formulário de Login */}
          <div className="w-full md:w-1/2 p-12 bg-white">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 font-roboto" style={{ color: '#333745' }}>
                Entrar
              </h2>
              <p className="text-sm font-roboto" style={{ color: '#333745' }}>
                Faça login para continuar
              </p>
            </div>

            {/* Mensagem de erro geral */}
            {errors.general && (
              <div className="mb-5 p-3 rounded-lg font-roboto" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p className="text-sm" style={{ color: '#ef4444' }}>{errors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 font-roboto" style={{ color: '#333745' }}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors({ ...errors, email: undefined })
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-roboto ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'focus:ring-[#D3BCCC] focus:border-transparent'
                  }`}
                  style={{
                    backgroundColor: '#E8D7F1',
                    borderColor: errors.email ? '#ef4444' : '#E8D7F1',
                    color: '#333745',
                  }}
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="mt-1 text-sm font-roboto" style={{ color: '#ef4444' }}>{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 font-roboto" style={{ color: '#333745' }}>
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors({ ...errors, password: undefined })
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all font-roboto ${
                    errors.password
                      ? 'border-red-400 focus:ring-red-400'
                      : 'focus:ring-[#D3BCCC] focus:border-transparent'
                  }`}
                  style={{
                    backgroundColor: '#E8D7F1',
                    borderColor: errors.password ? '#ef4444' : '#E8D7F1',
                    color: '#333745',
                  }}
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="mt-1 text-sm font-roboto" style={{ color: '#ef4444' }}>{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-lg font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-roboto flex items-center justify-center gap-2"
                style={{
                  backgroundColor: '#D3BCCC',
                  color: '#333745',
                }}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      style={{ color: '#333745' }}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Entrando...</span>
                  </>
                ) : (
                  'ENTRAR'
                )}
              </button>
            </form>

            <div className="mt-4 text-center">
              <a
                href="#"
                className="text-sm underline underline-offset-2 font-roboto transition-colors"
                style={{ color: '#333745' }}
              >
                Esqueci minha senha
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}