# mycash+ - Documentacao

## Progresso
- [x] PROMPT 0: Analise
- [x] PROMPT 1: Estrutura Base
- [x] PROMPT 2: Layout Desktop
- [ ] PROMPT 3: Layout Mobile

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
- Rotas `/transacoes`, `/perfil`, `/objetivos` seguem no router; listagem completa prevista no menu mobile (Prompt 3).

### Tokens
Semanticas: `--color-bg-surface`, `--color-accent-primary`, `--color-nav-item-active-bg`, `--color-nav-item-active-fg`, `--color-nav-item-active-icon`, `--color-border-default`  
Primitivas: `--color-brand-600`, `--color-neutral-1000`, `--color-neutral-200`, `--color-text-secondary`, `--space-*`, `--radius-xl`  
Layout: `--sidebar-width-expanded`, `--sidebar-width-collapsed`, `--transition-sidebar-duration`, `--transition-sidebar-easing`, `--shadow-sidebar-toggle`, `--size-avatar-md`

Conversoes:
- Destaque ativo (lime no layout) -> `--color-nav-item-active-bg` apontando para `--color-brand-600`
- Texto ativo sobre lime -> `--color-nav-item-active-fg` = `--color-neutral-1000`

### Build
Tentativas: 1 | Erros: 0
