# Cashflow — Guia para Agentes de Código

> Sistema financeiro pessoal do Rael
> Stack: Next.js 14 + Supabase + Tailwind CSS + shadcn/ui
> Criado: 2026-04-29
> Idioma do projeto: Português (pt-BR)

---

## Visão Geral do Projeto

**Cashflow v2** é um aplicativo web de controle financeiro pessoal. A v1 era um PWA baseado em localStorage; a v2 migrou para uma arquitetura cliente-servidor com Supabase como backend, permitindo sincronização entre dispositivos, autenticação de usuários e relatórios persistidos em banco de dados.

A arquitetura geral:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│  Supabase   │────▶│  PostgreSQL │
│  (Vercel)   │     │   (Auth)    │     │   (RLS)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **Frontend:** Next.js 14 (App Router) + React 18 + TypeScript + Tailwind CSS
- **Backend/Banco:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Hospedagem:** Vercel (frontend), Supabase (dados)
- **Gráficos:** Recharts
- **Ícones:** Lucide React
- **Validação:** Zod

---

## Estrutura de Diretórios

```
bulma-financas/
├── app/                        # Next.js App Router
│   ├── page.tsx               # Tela de login (pública)
│   ├── layout.tsx             # Root layout (metadados PWA, fonte Inter)
│   ├── globals.css            # Tailwind directives + CSS variables (shadcn/ui)
│   ├── dashboard/             # Dashboard principal (protegido)
│   ├── transactions/          # CRUD de transações (protegido)
│   └── categories/            # CRUD de categorias (protegido)
├── components/
│   └── auth/
│       └── login-form.tsx     # Formulário de login/cadastro
├── lib/                        # Utilitários e clientes
│   ├── supabase.ts            # Cliente Supabase (server/legacy)
│   ├── supabase-browser.ts    # Cliente Supabase para browser (createBrowserClient)
│   ├── auto-categorization.ts # Regras de categorização automática (frontend)
│   └── utils.ts               # Helper `cn()` (clsx + tailwind-merge)
├── types/
│   ├── index.ts               # Tipos das entidades (Profile, Category, Account, etc.)
│   └── supabase.ts            # Tipos gerados do Supabase (atualmente `export type Database = any`)
├── supabase/
│   └── migrations/
│       ├── 001_schema.sql     # Schema completo do banco + RLS + triggers
│       └── 002_auto_categorization.sql  # Tabela e trigger de auto-categorização
├── scripts/
│   ├── apply-auto-categorization.js  # Script Node.js para aplicar categorização em massa
│   └── generate-icons.js      # Gera ícones PWA com sharp
├── public/                     # Assets estáticos
│   ├── manifest.json          # Config PWA
│   ├── favicon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── bulma-avatar.png
│   └── bulma-login.png
├── middleware.ts              # Proteção de rotas e redirecionamento de auth
├── next.config.js             # Config do Next.js (alias webpack @/)
├── tailwind.config.ts         # Config Tailwind com tema shadcn/ui
├── postcss.config.js          # PostCSS (tailwindcss + autoprefixer)
├── tsconfig.json              # TypeScript strict, paths @/*
└── package.json
```

---

## Comandos de Build e Execução

| Comando | Descrição |
|---------|-----------|
| `npm install` | Instala dependências |
| `npm run dev` | Inicia servidor de desenvolvimento (http://localhost:3000) |
| `npm run build` | Build de produção |
| `npm run start` | Inicia servidor de produção |
| `npm run lint` | Executa ESLint |
| `npm run db:types` | Gera tipos TypeScript do Supabase (requere PROJECT_ID) |

**Workflow de deploy:**
1. `npm run build` → verifica se builda localmente
2. `git push` → trigger deploy automático na Vercel
3. URL de produção: `https://grana.pixelsystem.online`

---

## Variáveis de Ambiente

Copiar `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Variáveis obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-ANONIMA
```

> **Nota:** O Supabase URL e Anon Key também aparecem hardcoded em `scripts/apply-auto-categorization.js`. Altere com cuidado.

---

## Organização do Código

### App Router

Todas as páginas em `app/` são **Client Components** (`"use client"`). O acesso ao banco é feito via `createClient()` do `@/lib/supabase-browser` diretamente nos componentes, usando hooks (`useEffect`, `useState`).

- **`page.tsx` (root):** Tela de login com `LoginForm`.
- **`dashboard/page.tsx`:** Cards de resumo (receitas/despesas/saldo), gráfico de pizza (Recharts) e últimas transações do mês.
- **`transactions/page.tsx`:** Lista completa de transações com formulário inline para adicionar nova. Suporta auto-categorização sugerida.
- **`categories/page.tsx`:** Grid de categorias com formulário para criar nova (nome, ícone, cor, orçamento, tipo).

### Autenticação e Middleware

- **`middleware.ts`:** Usa `@supabase/ssr` (`createServerClient`) para verificar sessão em cada request.
  - Rotas protegidas: `/dashboard`, `/transactions`, `/categories`
  - Redireciona não-autenticados para `/`
  - Redireciona autenticados de `/` para `/dashboard`
  - Matcher exclui rotas internas do Next.js (`api`, `_next/static`, etc.)

### Clientes Supabase

- **`lib/supabase-browser.ts`:** Exporta `createClient()` usando `createBrowserClient` do `@supabase/ssr`. **Use este em todas as páginas/components.**
- **`lib/supabase.ts`:** Cliente legado com `@supabase/supabase-js`. Mantido para compatibilidade, mas prefira `supabase-browser.ts`.

### Auto-categorização

Existe em duas camadas:

1. **Frontend (`lib/auto-categorization.ts`):** Regras hardcoded em TypeScript. Sugere categoria enquanto o usuário digita a descrição da transação.
2. **Banco de dados (`supabase/migrations/002_auto_categorization.sql`):** Tabela `auto_categorization_rules` e trigger `trigger_auto_categorize` que categoriza automaticamente no `BEFORE INSERT` da tabela `transactions`.

A tabela `auto_categorization_rules` permite que o usuário tenha regras personalizadas persistidas no banco, enquanto `lib/auto-categorization.ts` fornece uma experiência imediata no formulário.

### Banco de Dados

Tabelas principais (todas com RLS ativado):

| Tabela | Propósito |
|--------|-----------|
| `profiles` | Perfil do usuário (vinculado a `auth.users`) |
| `categories` | Categorias de despesa/receita |
| `accounts` | Contas bancárias/carteiras |
| `transactions` | Transações financeiras |
| `goals` | Metas de economia |
| `budgets` | Orçamentos mensais |
| `budget_categories` | Detalhamento do orçamento por categoria |
| `auto_categorization_rules` | Regras de categorização automática |

**Triggers importantes:**
- `on_auth_user_created` → cria `profile` automaticamente ao registrar usuário.
- `update_transactions_updated_at` → atualiza `updated_at` em `transactions`.
- `trigger_auto_categorize` → categoriza transação no insert se não tiver categoria.
- `trigger_auto_cat_updated` → atualiza `updated_at` em `auto_categorization_rules`.

**Índices de performance:**
- `idx_transactions_user_date` (user_id, date DESC)
- `idx_transactions_category`, `idx_transactions_account`
- `idx_categories_user`, `idx_accounts_user`, `idx_goals_user`
- `idx_budgets_user_month_year`

---

## Convenções de Código

- **Idioma:** Todo o código de UI, comentários e documentação está em **português brasileiro**.
- **Componentes:** Function components com arrow functions ou `export default function`. Todos os componentes de página usam `"use client"`.
- **Estilização:** Tailwind CSS utility-first. Não há CSS modules ou styled-components.
- **Cores:** O tema usa variáveis CSS no padrão shadcn/ui (ex: `bg-background`, `text-foreground`, `--primary: 221.2 83.2% 53.3%`).
- **Formatação de moeda:** Sempre `toLocaleString("pt-BR", { minimumFractionDigits: 2 })` ou `style: "currency", currency: "BRL"`.
- **Datas:** Formato ISO (`YYYY-MM-DD`) no banco; exibição via `toLocaleDateString("pt-BR")`.
- **Path alias:** `@/` mapeia para a raiz do projeto (configurado em `tsconfig.json` e `next.config.js`).

---

## Testes

**Não há suite de testes configurada.** O projeto não possui Jest, Vitest, Cypress, Playwright ou qualquer outra ferramenta de teste.

Estratégia de validação atual:
- Build local (`npm run build`) como smoke test.
- Lint (`npm run lint`) para checagem de código.
- Testes manuais no navegador após deploy na Vercel.

---

## Considerações de Segurança

- **RLS (Row Level Security):** Ativado em todas as tabelas. Cada usuário só acessa seus próprios dados via políticas `auth.uid() = user_id`.
- **Auth:** Via Supabase Auth (email/senha). A tela de login suporta cadastro com confirmação por email.
- **Sem tracking:** Zero Google Analytics, zero cookies de terceiros.
- **LGPD:** Dados armazenados na região São Paulo do Supabase.
- **⚠️ Atenção:** O script `scripts/apply-auto-categorization.js` contém credenciais hardcoded (email, senha e Supabase Anon Key). **Não commitar alterações que exponham novas credenciais.**
- **⚠️ Atenção:** O arquivo `types/supabase.ts` atualmente define `export type Database = any`, perdendo a tipagem do banco. Idealmente, deve ser regenerado com `npm run db:types` após configurar o PROJECT_ID correto.

---

## PWA / Assets

- `manifest.json` configura o app como PWA (`display: standalone`).
- Ícones gerados via `scripts/generate-icons.js` (requer `sharp`).
- Cores do tema: `theme_color: #3B82F6`, `background_color: #ffffff`.

---

## Migrations / Schema

Para aplicar o schema em um novo projeto Supabase:

```bash
npx supabase link --project-ref SEU-PROJECT-ID
npx supabase db push
```

Ou copie o conteúdo de `supabase/migrations/001_schema.sql` e `002_auto_categorization.sql` diretamente no SQL Editor do Supabase Dashboard.

---

## Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| next | ^14.2.0 | Framework |
| react | ^18.3.0 | UI library |
| typescript | 5.9.3 | Tipagem |
| tailwindcss | ^3.4.0 | Estilos |
| @supabase/supabase-js | ^2.43.0 | Cliente Supabase |
| @supabase/ssr | ^0.4.0 | SSR/Auth com cookies |
| recharts | ^2.12.0 | Gráficos |
| lucide-react | ^0.378.0 | Ícones |
| date-fns | ^3.6.0 | Manipulação de datas |
| zod | ^3.23.0 | Validação de schemas |
| class-variance-authority | ^0.7.0 | Variantes de componentes |
| tailwindcss-animate | ^1.0.7 | Animações Tailwind |

---

*Este arquivo é mantido para agentes de IA. Se a estrutura, stack ou deploy mudar, atualize este documento.*
