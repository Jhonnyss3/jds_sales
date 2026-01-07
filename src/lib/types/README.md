# Types - Estrutura de Tipos TypeScript

Este diretório contém todos os tipos TypeScript utilizados no projeto, seguindo as melhores práticas do Supabase.

## Estrutura

- **`database.types.ts`** - Tipos gerados do schema do banco de dados Supabase
- **`index.ts`** - Exports centralizados e tipos auxiliares

## Como Gerar Tipos do Banco de Dados

### Opção 1: Usando a CLI do Supabase (Recomendado)

```bash
# Instalar a CLI do Supabase (se ainda não tiver)
npm install -g supabase

# Gerar tipos do projeto remoto
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.types.ts

# Ou gerar tipos do projeto local
supabase gen types typescript --local > src/lib/types/database.types.ts
```

### Opção 2: Usando npx

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/types/database.types.ts
```

### Opção 3: Via Dashboard do Supabase

1. Acesse o Dashboard do Supabase
2. Vá em Settings → API
3. Role até "TypeScript types"
4. Copie os tipos e cole em `database.types.ts`

## Uso

### Importar tipos específicos

```tsx
import type { Store, User, Product } from '@/lib/types'
```

### Importar tipos para inserção/atualização

```tsx
import type { StoreInsert, StoreUpdate } from '@/lib/types'

// Criar uma nova loja
const newStore: StoreInsert = {
  name: 'Minha Loja',
  owner_id: 'user-id',
  description: 'Descrição da loja'
}

// Atualizar uma loja
const storeUpdate: StoreUpdate = {
  name: 'Novo Nome',
  description: 'Nova descrição'
}
```

### Usar tipos com o cliente Supabase

```tsx
import { createClient } from '@/lib/supabase/client'
import type { Database, Store } from '@/lib/types'

const supabase = createClient<Database>()

// Buscar lojas com tipagem completa
const { data, error } = await supabase
  .from('stores')
  .select('*')
  .returns<Store[]>()
```

## Tipos Auxiliares

### ApiResponse
```tsx
import type { ApiResponse } from '@/lib/types'

const response: ApiResponse<Store> = {
  data: store,
  error: null
}
```

### PaginatedResponse
```tsx
import type { PaginatedResponse } from '@/lib/types'

const products: PaginatedResponse<Product> = {
  data: [...],
  total: 100,
  page: 1,
  limit: 10,
  totalPages: 10
}
```

## Atualizando Tipos

Sempre que o schema do banco de dados for alterado, regenere os tipos usando um dos métodos acima para manter a sincronização entre o banco e o código TypeScript.
