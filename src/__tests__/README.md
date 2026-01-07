# Testes - Jest + React Testing Library

Este projeto utiliza Jest e React Testing Library para testes automatizados.

## Configuração

- **Jest**: 30.1.3
- **React Testing Library**: 16.3.1
- **Jest DOM**: Para matchers adicionais do DOM

## Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (re-executa quando arquivos mudam)
npm run test:watch

# Executar testes com cobertura
npm run test:coverage
```

## Estrutura de Testes

Os testes devem ser colocados em:
- `__tests__/` - Pasta ao lado do arquivo testado
- `.test.tsx` ou `.test.ts` - Sufixo no nome do arquivo

Exemplo:
```
src/
  app/
    page.tsx
    __tests__/
      page.test.tsx
```

## Exemplo de Teste

```tsx
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Testando com Supabase

Para testar componentes que usam Supabase, você pode mockar o cliente:

```tsx
import { createClient } from '@/lib/supabase/client'

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        data: [],
        error: null
      }))
    }))
  }))
}))
```

## Matchers Disponíveis

Com `@testing-library/jest-dom`, você tem acesso a matchers como:
- `toBeInTheDocument()`
- `toHaveClass()`
- `toHaveTextContent()`
- `toBeVisible()`
- E muitos outros...

## Documentação

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
