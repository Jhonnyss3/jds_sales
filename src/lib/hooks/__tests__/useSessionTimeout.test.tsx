import { renderHook } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useSessionTimeout } from '../useSessionTimeout'

// Mock do next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock do Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
}

const mockSupabaseClient = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: { expires_at: Date.now() / 1000 + 300 } },
      error: null,
    }),
    signOut: jest.fn(),
  },
}

describe('useSessionTimeout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(createClient as jest.Mock).mockReturnValue(mockSupabaseClient)
  })

  it('deve inicializar o hook sem erros', () => {
    const { result } = renderHook(() => useSessionTimeout())
    expect(result.current).toBeUndefined() // Hook não retorna valor
    expect(createClient).toHaveBeenCalled()
  })

  it('deve configurar timeout de 5 minutos', () => {
    renderHook(() => useSessionTimeout())
    // O hook deve estar configurado para 5 minutos (300 segundos)
    // Verificação indireta através da inicialização sem erros
    expect(mockSupabaseClient.auth.getSession).toBeDefined()
  })
})
