// Cliente Supabase unificado
// Para uso em Client Components, use: import { createClient } from '@/lib/supabase/client'
// Para uso em Server Components, use: import { createClient } from '@/lib/supabase/server'

// Re-export dos clientes especializados
export { createClient } from './supabase/client'
export { createClient as createServerClient } from './supabase/server'
export { updateSession } from './supabase/middleware'
