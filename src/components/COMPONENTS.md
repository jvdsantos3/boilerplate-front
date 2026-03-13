## Guia de arquitetura para `src/components`

Este documento define **regras e convenções** para a pasta `src/components` deste boilerplate.

O objetivo é manter os componentes **coerentes, reutilizáveis e fáceis de encontrar** à medida que o projeto cresce.

---

### 1. Princípios gerais

- **Separar UI de lógica de domínio**
  - `src/components` deve conter **componentes genéricos de interface** (UI, layout, formulários básicos).
  - Lógica de negócio, chamadas de API e regras de domínio ficam nas **rotas/páginas** (`src/pages/*`, usando file routing do TanStack Router), em módulos de domínio (ex.: `src/users/*`) ou em `src/lib/*` / hooks específicos.

- **Reutilizável por padrão**
  - Componentes aqui devem ser pensados para uso em **várias telas / features**.
  - Evite acoplar diretamente a um contexto de domínio (ex.: `OrderList` com chamadas de API embutidas).

- **Sem efeitos colaterais globais**
  - Nada em `src/components` deve:
    - Registrar listeners globais (window/document) sem encapsular em hooks.
    - Alterar `localStorage`, cookies ou fazer fetch diretamente (isso é papel de hooks/serviços).

---

### 2. Estrutura de pastas recomendada

Dentro de `src/components`, usamos uma estrutura em camadas:

- `src/components/ui/*`
  - Componentes de **design system**: botões, inputs, cards, modais, tabelas, etc.
  - Normalmente são wrappers ou extensões de bibliotecas (ex.: shadcn, Radix, tailwind).
  - Exemplos: `button.tsx`, `input.tsx`, `card.tsx`, `theme-toggle.tsx`.

- `src/components/layout/*`
  - Componentes de **layout e shell de aplicação**, focados em estruturar a página:
    - Headers, sidebars, footers, barras de navegação, grids de layout.
  - Não devem conter lógica de negócio, apenas composição de UI.
  - Exemplos: `app-header.tsx`, `app-shell.tsx`, `sidebar.tsx`.

- `src/components/feedback/*` (opcional)
  - Componentes genéricos de feedback: toasts, banners, alerts, skeletons.
  - Podem compor com bibliotecas (ex.: `sonner`, `lucide-react`), mas devem expor uma API consistente.

- `src/components/forms/*` (opcional)
  - Componentes de formulário genéricos (integrados com `react-hook-form`):
    - `form-field`, `form-label`, `controlled-input`, etc.

> **Regra:** se um componente só faz sentido em um domínio ou página específicos (ex.: `UserCard` com campos de usuário), ele provavelmente deve viver **junto da rota/página** correspondente (por exemplo, `src/pages/users/-components/UserCard.tsx` ou `src/users/components/UserCard.tsx`) e não em `src/components`.

---

### 3. Padrões para componentes de UI (`ui/*`)

- **API baseada em props, não em contexto de domínio**
  - Receber dados via props tipadas (ex.: `label`, `icon`, `variant`), nunca objetos de domínio completos (ex.: `user`, `order`).

- **Classes com `cn`**
  - Sempre que combinar Tailwind dinâmico, use o helper `cn` (`src/lib/utils.ts`) para manter classes limpas.

- **Sem acoplamento à árvore global**
  - UI não deve conhecer `react-router`, `react-query`, `next-themes` diretamente, exceto quando fizer sentido como parte do componente:
    - Exemplo válido: `ThemeToggle` usar `next-themes`.
    - Exemplo a evitar: `Button` decidir navegar sozinho usando router.

---

### 4. Providers e contextos globais

- **Providers globais não moram em `components`**
  - Providers como tema, query client, auth, etc. devem ficar em `src/providers/*`.
  - Exemplo atual: `src/providers/theme-provider.tsx`.
  - `src/components` pode consumir esses providers (via hooks), mas **não os declara**.

---

### 5. Nomeação e organização de arquivos

- **Nome de arquivo = nome do componente principal**
  - `button.tsx` → exporta `Button`.
  - `theme-toggle.tsx` → exporta `ThemeToggle`.

- **Exports**
  - Preferir **named exports** (`export function X`) em vez de `default` para facilitar refactors automáticos.

- **Co-location de tipos simples**
  - Tipos e pequenas helpers usados apenas por um componente podem ficar no mesmo arquivo.
  - Se tipos forem reutilizados em vários componentes, mova para `src/types` ou `src/lib`.

---

### 6. Quando criar um componente em `components` vs `pages`

Use esta checklist:

- **Vai ser usado em mais de uma página / rota?**
  - Sim → candidato a `src/components`.
  - Não → começa **próximo da rota** (por exemplo, em uma subpasta da própria página: `src/pages/dashboard/-components/`) e pode ser promovido depois se virar genérico.

- **Depende fortemente de um domínio (user/order/product)?**
  - Sim → fica em uma pasta específica desse domínio (ex.: `src/users/components`) ou em subpastas das páginas desse domínio (ex.: `src/pages/users/-components`).
  - Não, só lida com UI/composição → `src/components`.

- **Precisa chamar API ou acessar store de domínio diretamente?**
  - Sim → crie um componente de “container” próximo da rota/página (por exemplo, em `src/pages/<rota>/-components`) e use componentes de UI daqui por baixo.

---

### 7. Boas práticas adicionais

- **Acessibilidade**
  - Seguir regras do Biome (`a11y.useAltText`, `a11y.useKeyWithClickEvents`).
  - Usar rótulos (`aria-label`, `aria-labelledby`) em ícones e botões sem texto.

- **Performance**
  - Evitar definir componentes dentro de outros componentes.
  - Usar memoização (`React.memo`, `useMemo`, `useCallback`) apenas quando realmente necessário ou quando fizer sentido para listas grandes / componentes pesados.

- **Documentação mínima**
  - Para componentes reutilizáveis mais complexos, adicionar comentário curto no topo explicando:
    - Qual problema resolve
    - Como é esperado que seja usado (ex.: “usado em headers de página para…“).

---

Se tiver dúvidas se um componente deveria ir em `components` ou próximo de uma página/rota específica, prefira começar **mais próximo da página** (por exemplo, em `src/pages/<rota>/-components`). Promover para `src/components` depois é sempre mais fácil do que mover um componente genérico que já está acoplado ao domínio. 

