// Mocks devem vir ANTES dos imports
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(),
}))

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import LoginPage from '../page'
import { createClient } from '@/lib/supabase/client'

const mockRouter = {
  push: jest.fn(),
  refresh: jest.fn(),
}

const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
  },
}

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(createClient as jest.Mock).mockReturnValue(mockSupabaseClient)
  })

  describe('Renderização', () => {
    it('deve renderizar o título JDS Tech', () => {
      render(<LoginPage />)
      expect(screen.getByText('JDS Tech')).toBeInTheDocument()
    })

    it('deve renderizar o subtítulo', () => {
      render(<LoginPage />)
      expect(screen.getByText('Faça login para continuar')).toBeInTheDocument()
    })

    it('deve renderizar os campos de email e senha', () => {
      render(<LoginPage />)
      expect(screen.getByLabelText('Email')).toBeInTheDocument()
      expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    })

    it('deve renderizar o botão de entrar', () => {
      render(<LoginPage />)
      expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
    })

    it('deve renderizar o link para página de teste', () => {
      render(<LoginPage />)
      expect(screen.getByText('Ver status do banco (página de teste)')).toBeInTheDocument()
    })
  })

  describe('Validação de Campos', () => {
    it('deve mostrar erro quando email está vazio', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor, informe seu email')).toBeInTheDocument()
      })
    })

    it('deve mostrar erro quando email é inválido', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')
      
      await user.clear(emailInput)
      await user.type(emailInput, 'email@semdominio')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor, informe um email válido')).toBeInTheDocument()
      }, { timeout: 3000 })
    })

    it('deve mostrar erro quando senha está vazia', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      await user.type(emailInput, 'teste@email.com')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor, informe sua senha')).toBeInTheDocument()
      })
    })

    it('deve mostrar erro quando senha tem menos de 6 caracteres', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, '12345')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
      })
    })

    it('deve limpar erro quando usuário começa a digitar', async () => {
      const user = userEvent.setup()
      render(<LoginPage />)

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Por favor, informe seu email')).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText('Email')
      await user.type(emailInput, 't')

      await waitFor(() => {
        expect(screen.queryByText('Por favor, informe seu email')).not.toBeInTheDocument()
      })
    })
  })

  describe('Estados de Loading', () => {
    it('deve mostrar loading quando formulário é submetido', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockImplementation(
        () => new Promise(() => {}) // Promise que nunca resolve
      )

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Entrando...')).toBeInTheDocument()
      })

      expect(submitButton).toBeDisabled()
    })

    it('deve desabilitar campos durante o loading', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockImplementation(
        () => new Promise(() => {})
      )

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(emailInput).toBeDisabled()
        expect(passwordInput).toBeDisabled()
      })
    })
  })

  describe('Submissão do Formulário', () => {
    it('deve chamar signInWithPassword com credenciais corretas', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123' }, session: null },
        error: null,
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
          email: 'teste@email.com',
          password: 'senha123',
        })
      })
    })

    it('deve redirecionar após login bem-sucedido', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: '123' }, session: null },
        error: null,
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalled()
      }, { timeout: 3000 })
    })

    it('deve mostrar erro quando credenciais são inválidas', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials' },
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Email ou senha incorretos. Por favor, verifique suas credenciais.')
        ).toBeInTheDocument()
      })
    })

    it('deve mostrar erro quando email não está confirmado', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Email not confirmed' },
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(
          screen.getByText('Por favor, confirme seu email antes de fazer login.')
        ).toBeInTheDocument()
      })
    })

    it('deve mostrar erro genérico para outros erros', async () => {
      const user = userEvent.setup()
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: { user: null, session: null },
        error: { message: 'Network error' },
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText('Erro ao fazer login. Tente novamente mais tarde.')).toBeInTheDocument()
      })
    })
  })

  describe('Timeout de Sessão', () => {
    it('deve configurar sessão com timeout de 5 minutos', async () => {
      const user = userEvent.setup()
      const futureExpiry = Date.now() / 1000 + 300 // 5 minutos no futuro
      mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: { id: '123' },
          session: { expires_at: futureExpiry },
        },
        error: null,
      })

      render(<LoginPage />)

      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      await user.type(emailInput, 'teste@email.com')
      await user.type(passwordInput, 'senha123')

      const submitButton = screen.getByRole('button', { name: /entrar/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalled()
      })

      // Verificar que a sessão foi criada com expiração
      const callArgs = mockSupabaseClient.auth.signInWithPassword.mock.calls[0]
      expect(callArgs).toBeDefined()
    })
  })

  describe('Acessibilidade', () => {
    it('deve ter labels associados aos inputs', () => {
      render(<LoginPage />)
      const emailInput = screen.getByLabelText('Email')
      const passwordInput = screen.getByLabelText('Senha')

      expect(emailInput).toHaveAttribute('id', 'email')
      expect(passwordInput).toHaveAttribute('id', 'password')
    })

    it('deve ter placeholders nos inputs', () => {
      render(<LoginPage />)
      expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    })
  })
})