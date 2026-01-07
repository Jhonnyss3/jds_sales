# Supabase Utilities

Utilitários para integração do Supabase com Next.js App Router.

## Estrutura

- **`client.ts`** - Cliente Supabase para Client Components
- **`server.ts`** - Cliente Supabase para Server Components e Server Actions
- **`middleware.ts`** - Função helper para middleware de autenticação
- **`index.ts`** - Exports centralizados

## Uso

### Client Components

```tsx
'use client'

import { createClient } from '@/lib/supabase/client'

export default function ClientComponent() {
  const supabase = createClient()
  
  // Usar o cliente Supabase
  const { data, error } = await supabase.from('tabela').select('*')
  
  return <div>...</div>
}
```

### Server Components

```tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function ServerComponent() {
  const supabase = await createServerClient()
  
  // Usar o cliente Supabase
  const { data, error } = await supabase.from('tabela').select('*')
  
  return <div>...</div>
}
```

### Server Actions

```tsx
'use server'

import { createServerClient } from '@/lib/supabase/server'

export async function minhaAction() {
  const supabase = await createServerClient()
  
  // Usar o cliente Supabase
  const { data, error } = await supabase.from('tabela').select('*')
  
  return data
}
```

### Middleware

O middleware já está configurado em `src/middleware.ts` e automaticamente:
- Atualiza a sessão do usuário
- Redireciona para `/login` se o usuário não estiver autenticado (exceto rotas públicas)

Para ajustar as rotas públicas, edite o arquivo `src/middleware.ts`.
