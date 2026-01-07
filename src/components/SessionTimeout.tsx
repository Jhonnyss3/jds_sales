'use client'

import { useSessionTimeout } from '@/lib/hooks/useSessionTimeout'

export function SessionTimeout() {
  useSessionTimeout()
  return null // Componente invisível que apenas monitora a sessão
}
