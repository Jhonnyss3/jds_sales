'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SESSION_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutos em milissegundos

export function useSessionTimeout() {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  useEffect(() => {
    const supabase = createClient()

    // Função para verificar e fazer logout se necessário
    const checkSession = async () => {
      const now = Date.now()
      const timeSinceLastActivity = now - lastActivityRef.current

      if (timeSinceLastActivity >= SESSION_TIMEOUT_MS) {
        // Sessão expirada, fazer logout
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
        return
      }

      // Verificar se a sessão ainda é válida
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        router.refresh()
        return
      }

      // Agendar próxima verificação
      const timeUntilTimeout = SESSION_TIMEOUT_MS - timeSinceLastActivity
      timeoutRef.current = setTimeout(checkSession, timeUntilTimeout)
    }

    // Atualizar última atividade em eventos do usuário
    const updateLastActivity = () => {
      lastActivityRef.current = Date.now()
    }

    // Eventos que indicam atividade do usuário
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach((event) => {
      document.addEventListener(event, updateLastActivity, { passive: true })
    })

    // Iniciar verificação
    checkSession()

    // Limpar ao desmontar
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        document.removeEventListener(event, updateLastActivity)
      })
    }
  }, [router])
}
