# mycash+ - Documentacao

## Progresso
- [x] PROMPT 0: Analise
- [x] PROMPT 1: Estrutura Base
- [x] PROMPT 2: Layout Desktop
- [x] PROMPT 3: Layout Mobile
- [x] PROMPT 4: Context Global
- [x] PROMPT 6: Header do Dashboard (feito antes do 5)
- [ ] PROMPT 5: Cards de Resumo Financeiro

---

## PROMPT 1: Estrutura Base
Status: ✅ | Data: 14/04/2026 | Build: ✅ (1 tentativa)

### Implementado
- Projeto React + TypeScript inicializado com Vite.
- Tailwind configurado via plugin oficial do Vite.
- Estrutura de pastas criada (`components`, `contexts`, `hooks`, `types`, `utils`, `constants`, `routes`).
- Rotas principais definidas para Dashboard, Cartoes, Transacoes, Perfil e Objetivos.
- Tipos fundamentais criados para `Transaction`, `Goal`, `CreditCard`, `BankAccount` e `FamilyMember`.

### Tokens
Semanticas: `--color-bg-default`, `--color-bg-surface`, `--color-bg-inverse`, `--color-text-primary`, `--color-border-default`, `--color-accent-primary`  
Primitivas: `--color-neutral-*`, `--color-brand-600`, `--space-0/2/4/6/8/12/16`

Conversoes:
- `#F9FAFB` -> `--color-neutral-100`
- `#E5E7EB` -> `--color-neutral-300`
- `#D7FE03` -> `--color-brand-600`
- `16px` -> `--space-16`

### Build
Tentativas: 1 | Erros: 0

---

## PROMPT 2: Sistema de Layout e Navegacao Desktop
Status: ✅ (revisado com Figma) | Data: 14/04/2026 | Build: ✅

### Referencias Figma
- [Dashboard / frame principal — node 42-3096](https://www.figma.com/design/6cR4IHgqeZryX55fuJPlvK/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community--Capgemini-Prot%C3%B3tipo?node-id=42-3096&t=OXZmdYsD7ibEEzB2-4)
- [Frame adicional — node 30-1517](https://www.figma.com/design/6cR4IHgqeZryX55fuJPlvK/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community--Capgemini-Prot%C3%B3tipo?node-id=30-1517&t=OXZmdYsD7ibEEzB2-4)

### Implementado
- Componente `Sidebar` com altura total do viewport, estados expandido e colapsado.
- Botao circular na borda direita alternando seta esquerda/direita.
- Transicao de largura da sidebar; area principal em flex com `min-w-0` para acompanhar sem overflow.
- Tooltips com atraso (~400ms) nos itens quando colapsada.
- **Revisao Figma (42-3096):** navegacao principal com **Home** + **Cartões**; item ativo com **fundo verde-limao** (`--color-nav-item-active-bg`), texto e icone **pretos** (`--color-nav-item-active-fg` / `--color-nav-item-active-icon`); cantos mais pill (`--radius-xl`); marca **Mycash+** no topo.
- Rotas `/transacoes`, `/perfil`, `/objetivos` no router; navegacao completa no menu mobile (`HeaderMobile` / Prompt 3).

### Tokens
Semanticas: `--color-bg-surface`, `--color-accent-primary`, `--color-nav-item-active-bg`, `--color-nav-item-active-fg`, `--color-nav-item-active-icon`, `--color-border-default`  
Primitivas: `--color-brand-600`, `--color-neutral-1000`, `--color-neutral-200`, `--color-text-secondary`, `--space-*`, `--radius-xl`  
Layout: `--sidebar-width-expanded`, `--sidebar-width-collapsed`, `--transition-sidebar-duration`, `--transition-sidebar-easing`, `--shadow-sidebar-toggle`, `--size-avatar-md`

Conversoes:
- Destaque ativo (lime no layout) -> `--color-nav-item-active-bg` apontando para `--color-brand-600`
- Texto ativo sobre lime -> `--color-nav-item-active-fg` = `--color-neutral-1000`

### Build
Tentativas: 1 | Erros: 0

---

## PROMPT 3: Sistema de Layout e Navegacao Mobile
Status: ✅ | Data: 14/04/2026 | Build: ✅ (1 tentativa)

### Implementado
- `HeaderMobile`: barra fixa no topo (`lg:hidden`), logo **Mycash+**, avatar abre menu (`aria-controls` / `aria-expanded`).
- Painel **Menu** (nao fullscreen): animacao slide de cima (~300ms), `max-height` ~70vh com scroll interno.
- Lista completa: Home, Cartoes, Transacoes, Perfil, Objetivos com icone + texto; rota ativa com fundo preto e texto branco.
- Botao **Sair** vermelho (`--color-feedback-danger`) no rodape do painel (placeholder ate autenticacao).
- Fechar: clique no overlay (`--color-overlay-scrim`), botao **X**, tecla **Escape**, ou navegacao apos `NavLink`.
- `body` com `overflow: hidden` enquanto o menu esta aberto.
- Breakpoint Tailwind `lg` (>=1024px): sidebar visivel, header mobile oculto — sem coexistencia.

### Tokens
Semanticas: `--color-bg-surface`, `--color-bg-inverse`, `--color-text-inverse`, `--color-text-secondary`, `--color-border-default`, `--color-feedback-danger`, `--color-overlay-scrim`  
Primitivas: `--color-neutral-*`, `--space-*`, `--radius-lg`, `--radius-md`, `--text-sm`, `--text-md`, `--text-lg`  
Layout: `--mobile-header-height`, `--size-avatar-md`, `--shadow-sidebar-toggle`

### Build
Tentativas: 1 | Erros: 0

---

## PROMPT 4: Context Global e Gerenciamento de Estado
Status: ✅ | Data: 14/04/2026 | Build: ✅ (1 tentativa)

### Implementado
- `FinanceProvider` em `src/contexts/FinanceContext.tsx` envolvendo rotas em `App.tsx`.
- Estado em memoria com `useState` apenas (sem `localStorage` / `sessionStorage`).
- Arrays: `transactions`, `goals`, `creditCards`, `bankAccounts`, `familyMembers` com CRUD basico cada.
- Filtros globais: `selectedMemberId`, `dateRange`, `transactionType`, `searchText` + setters.
- Funcoes derivadas: `getFilteredTransactions`, `calculateTotalBalance`, `calculateIncomeForPeriod`, `calculateExpensesForPeriod`, `calculateExpensesByCategory`, `calculateCategoryPercentage`, `calculateSavingsRate`.
- `useFinance()` como unico acesso ao contexto.
- Dados mock em `financeMockSeed.ts` (3 membros, 3 cartoes, 3 contas, 4 objetivos, 24 transacoes em ~4 meses).
- Utilitarios puros: `financeFilters.ts`, `financeMetrics.ts`.
- `Transaction` com campo opcional `dueDate` para despesas pendentes futuras.
- `DashboardPage` le contexto (resumo simples para validacao).

### Tokens
N/A (logica apenas; UI continua com tokens existentes no dashboard).

### Build
Tentativas: 1 | Erros: 0

---

## PROMPT 6: Header do Dashboard com Controles (antecipado)
Status: ✅ | Data: 14/04/2026 | Build: ✅ (2 tentativas)

### Referencia Figma
- [Header topbar — node 42-3099](https://www.figma.com/design/6cR4IHgqeZryX55fuJPlvK/Workshop---Do-figma-MCP-ao-Cursor-AI-v.3--Community--Capgemini-Prot%C3%B3tipo?node-id=42-3099&t=OXZmdYsD7ibEEzB2-4)

### Implementado
- `DashboardHeader` integrado na `DashboardPage`.
- Busca em tempo real ligada a `searchText` global (descrição + categoria).
- Botão de filtros com popover no desktop e modal fullscreen no mobile.
- Filtro de tipo (todos / receitas / despesas) atualiza contexto imediatamente.
- Seletor de período com dois `input[type=date]` + atalhos: este mês, mês passado, últimos 3 meses, este ano.
- Pilha de avatares de membros com toggle de seleção global (`selectedMemberId`) e indicador visual.
- Botão `+` de membro (placeholder) e CTA `+ Nova Transação` (placeholder visual).
- Overlay e travamento de scroll do `body` no modal mobile.

### Tokens
Semânticas: `--color-bg-surface`, `--color-bg-inverse`, `--color-text-inverse`, `--color-border-default`, `--color-overlay-scrim`  
Primitivas: `--color-neutral-*`, `--space-*`, `--radius-*`, `--text-*`

### Build
Tentativas: 2 | Erros: 0 (ajuste de tipo em `toggleMember`)
