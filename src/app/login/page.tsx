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
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setErrors({ general: 'Erro inesperado. Por favor, tente novamente.' })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-black">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 font-roboto">
          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              JDS Tech
            </h1>
            <p className="text-blue-100 text-sm">
              Faça login para continuar
            </p>
          </div>

          {/* Mensagem de erro geral */}
          {errors.general && (
            <div className="mb-5 p-3 bg-red-500/20 border border-red-400/50 rounded-lg">
              <p className="text-red-200 text-sm font-roboto">{errors.general}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 transition-all font-roboto ${
                  errors.email
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-white/20 focus:ring-blue-400 focus:border-transparent'
                }`}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-300 font-roboto">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
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
                className={`w-full px-4 py-3 border rounded-lg bg-white/10 backdrop-blur-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 transition-all font-roboto ${
                  errors.password
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-white/20 focus:ring-blue-400 focus:border-transparent'
                }`}
                placeholder="••••••••"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-300 font-roboto">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-white/90 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] font-roboto flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
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
                'Entrar'
              )}
            </button>
          </form>

          {/* Link para página de teste */}
          <div className="mt-6 text-center">
            <a
              href="/test"
              className="text-sm text-blue-500 hover:text-blue-400 transition-colors underline underline-offset-2 font-roboto"
            >
              Ver status do banco (página de teste)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
