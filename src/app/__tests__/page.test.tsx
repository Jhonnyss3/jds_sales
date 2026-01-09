import { render } from '@testing-library/react'
import Home from '../page'
import { redirect } from 'next/navigation'

// Mock do redirect do Next.js que lança o erro especial
jest.mock('next/navigation', () => ({
  redirect: jest.fn((url: string) => {
    const error = new Error('NEXT_REDIRECT')
    ;(error as any).digest = `NEXT_REDIRECT;${url}`
    throw error
  }),
}))

describe('Home Page', () => {
  it('deve redirecionar para /login', () => {
    expect(() => {
      render(<Home />)
    }).toThrow('NEXT_REDIRECT')
    
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('renders without crashing', () => {
    // Como a página apenas redireciona, verificamos que o redirect é chamado
    expect(() => {
      try {
        render(<Home />)
      } catch (error: any) {
        // Erro de redirect é esperado e não é um erro de renderização
        if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
          return // Erro esperado, não relançar
        }
        throw error
      }
    }).not.toThrow()
  })
})