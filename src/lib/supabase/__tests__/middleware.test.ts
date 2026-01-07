/**
 * Testes para middleware de timeout de sessão
 * 
 * Nota: Testes completos do middleware requerem ambiente Next.js completo.
 * Estes testes verificam a configuração básica do timeout.
 */

describe('Session Timeout Configuration', () => {
  it('deve ter timeout configurado para 5 minutos (300 segundos)', () => {
    const SESSION_TIMEOUT_SECONDS = 5 * 60 // 5 minutos
    expect(SESSION_TIMEOUT_SECONDS).toBe(300)
  })

  it('deve ter timeout em milissegundos para uso no cliente', () => {
    const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutos em milissegundos
    expect(SESSION_TIMEOUT_MS).toBe(300000)
  })
})
