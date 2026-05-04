# 🦊 Cashflow

> Sistema financeiro pessoal do Israel (Rael). Organiza receitas, despesas, cartões, metas e plano de ação de dívidas — tudo em um dashboard limpo e responsivo.

![Next.js](https://img.shields.io/badge/Next.js-14.2.35-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)

---

## 🚀 Deploy

| Ambiente | URL |
|----------|-----|
| **Produção** | [`https://grana.pixelsystem.online`](https://grana.pixelsystem.online) |
| **Vercel** | [`https://bulma-financas.vercel.app`](https://bulma-financas.vercel.app) |

---

## 📸 Screenshots

*Login com imagem da Bulma* → *Dashboard com gráficos e filtros* → *Plano de ação para dívidas*

---

## 🛠 Stack Tecnológica

| Camada | Tecnologia |
|--------|------------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Estilização** | TailwindCSS 3.4, shadcn/ui, Radix UI |
| **Backend/API** | Supabase (PostgreSQL + Auth + Realtime) |
| **Auth** | Supabase Auth (email/senha + JWT) |
| **Deploy** | Vercel (Serverless) |
| **Banco** | PostgreSQL 15 (Supabase) |

---

## 📁 Estrutura do Projeto

```
bulma-financas/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Tela de login
│   ├── layout.tsx                # Root layout (meta tags, PWA, favicon)
│   ├── globals.css               # Tailwind + variáveis CSS
│   ├── dashboard/                # Dashboard principal (filtros, gráficos)
│   ├── transactions/             # CRUD de transações
│   ├── categories/               # Gestão de categorias
│   ├── contas/                   # Gestão de contas/bancos
│   ├── orcamentos/               # Orçamentos mensais
│   ├── metas/                    # Metas financeiras
│   ├── relatorios/               # Relatórios e análises
│   ├── plano/                    # Plano de ação (score, dívidas)
│   ├── perfil/                   # Perfil do usuário
│   └── recuperar-senha/          # Reset de senha
├── components/                   # Componentes reutilizáveis (shadcn/ui)
│   └── ui/                       # Botões, inputs, modais, tabelas
├── lib/                          # Utilitários
│   ├── supabase-browser.ts       # Client Supabase (client-side)
│   ├── supabase-server.ts        # Client Supabase (server-side)
│   ├── auto-categorization.ts    # Regras de categorização automática (60+)
│   ├── schemas.ts                # Validação Zod dos formulários
│   ├── format.ts                 # Formatação de moeda, data, números
│   └── utils.ts                  # Funções utilitárias (cn, etc.)
├── public/                       # Assets estáticos
│   ├── favicon.png               # Ícone da Bulma (🤑)
│   ├── icon-192.png              # Ícone PWA (192×192)
│   ├── icon-512.png              # Ícone PWA (512×512)
│   ├── manifest.json             # Manifesto PWA
│   ├── bulma-avatar.png          # Avatar da Bulma
│   └── bulma-login.png           # Imagem da tela de login
├── supabase/
│   └── migrations/               # SQLs do banco de dados
│       ├── 001_schema.sql        # Schema inicial (7 tabelas + RLS + triggers)
│       ├── 002_auto_categorization.sql  # Função PL/pgSQL de auto-categorização
│       ├── 003_serasa_debts.sql  # Dívidas Serasa (UNIMED, SKY, protestos)
│       ├── 004_credit_score_tracker.sql  # Rastreamento de score Serasa
│       ├── 005_action_plan.sql   # Plano de ação com datas e status
│       ├── 006_credit_card_transactions.sql  # Extrato cartão Itaú (32 transações)
│       └── 007_extrato_unificado.sql  # Extrato unificado Credicard+MP (109 transações)
├── .kimi/
│   └── prompts/                  # Prompts versionados para Codex/Claude/TOT
│       ├── atualizacoes-grana.md
│       ├── vps-seguranca-monitoramento.md
│       ├── analise-upixel-opus.md
│       ├── google-drive-fases-3-5.md
│       ├── pc-dedicado-windows-setup.md
│       ├── mac-priorizar-cabo.md
│       ├── cold-clients.md
│       ├── google-drive.md
│       └── novos-recursos.md
├── next.config.js               # Configuração Next.js (webpack alias, etc.)
├── postcss.config.js            # PostCSS + Tailwind + autoprefixer
├── tailwind.config.ts           # Configuração TailwindCSS
├── tsconfig.json                # Configuração TypeScript
├── package.json                 # Dependências
└── .env.local                   # Variáveis de ambiente (não versionado!)
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas principais

| Tabela | Descrição |
|--------|-----------|
| `transactions` | Receitas e despesas (data, valor, categoria, conta, descrição) |
| `categories` | Categorias financeiras com emoji e cor |
| `accounts` | Contas bancárias e cartões (Itaú, PicPay, Mercado Pago) |
| `budgets` | Orçamentos mensais por categoria |
| `goals` | Metas financeiras (ex: score 600, quitar dívidas) |
| `credit_scores` | Histórico de score Serasa |
| `action_plans` | Plano de ação com datas e status |

### Migrations

| # | Arquivo | Transações/Registros | Descrição |
|---|---------|----------------------|-----------|
| 001 | `001_schema.sql` | 12 categorias + 3 contas | Schema inicial + RLS + triggers + indexes |
| 002 | `002_auto_categorization.sql` | — | Função PL/pgSQL para auto-categorização |
| 003 | `003_serasa_debts.sql` | 6 transações | Dívidas negativadas (UNIMED, SKY) + protestos |
| 004 | `004_credit_score_tracker.sql` | 1 registro | Score inicial: 350 (Serasa) |
| 005 | `005_action_plan.sql` | 17 ações | Plano de quitação de dívidas e subir score |
| 006 | `006_credit_card_transactions.sql` | 32 transações | Extrato cartão Itaú Empresas (mar/abr 2026) |
| 007 | `007_extrato_unificado.sql` | 109 transações | Extrato unificado Credicard + Mercado Pago |

**Total no banco após execução: ~178 transações**

---

## ⚙️ Variáveis de Ambiente

Crie `.env.local` na raiz:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://fxpdqyxmzwudtundnofz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cGRxeXhtend1ZHR1bmRub2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTAxMzAsImV4cCI6MjA5MzA2NjEzMH0.xc7p1waGYUr25dJhd83I_t641ebNKgoZfntzMA8IlM8

# Opcional: chave de serviço (server-side only, nunca expor no frontend)
# SUPABASE_SERVICE_ROLE_KEY=sb_...
```

> ⚠️ **NUNCA** commitar `.env.local`! Já está no `.gitignore`.

---

## 🖥️ Rodando Localmente

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação

```bash
# 1. Clone o repo
git clone https://github.com/grupototum/bulma-financas.git
cd bulma-financas

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais do Supabase

# 4. Rode o banco (Supabase)
# Acesse https://fxpdqyxmzwudtundnofz.supabase.co → SQL Editor
# Execute os migrations em ordem: 001 → 007

# 5. Inicie o servidor dev
npm run dev
```

Abra [`http://localhost:3000`](http://localhost:3000)

---

## 📱 PWA (Progressive Web App)

O app funciona como PWA:
- `manifest.json` configurado
- Ícones 192×192 e 512×512
- Tema azul (#3B82F6)
- Modo standalone (sem barra do navegador)
- iOS: splash screen e status bar configurados

**Para instalar no celular:**
- iOS: Safari → Compartilhar → "Adicionar à Tela de Início"
- Android: Chrome → Menu → "Adicionar à tela inicial"

---

## 🤖 Categorização Automática

O app possui **60+ regras de palavras-chave** para sugerir categoria automaticamente:

| Categoria | Palavras-chave |
|-----------|----------------|
| 🍔 Alimentação | ifood, uber eats, rappi, restaurante, lanche, mercado, supermercado |
| 🚗 Transporte | uber, 99, gasolina, posto, estacionamento, pedágio |
| 📱 Assinaturas | netflix, spotify, adobe, youtube, apple, google, amazon prime, vercel, hostinger |
| 📢 Marketing | facebook ads, google ads, meta ads, instagram ads, reportei |
| 🌐 Hospedagem | hostinger, vercel, namecheap, godaddy, digitalocean |
| 🏠 Moradia | aluguel, condomínio, luz, água, gás, internet |
| 💳 Cartão de Crédito | pagamento fatura, pagamento cartão |
| 🔄 Transferências | ted, doc, pix, transferência |
| 💰 Receitas | recebimento, salário, rendimento, pix recebido |

Regras em: `lib/auto-categorization.ts`
Função PL/pgSQL: `002_auto_categorization.sql`

---

## 🎯 Funcionalidades

### ✅ Prontas
- [x] Autenticação (login/signup com Supabase Auth)
- [x] Dashboard com filtros por mês/ano
- [x] CRUD de transações
- [x] Gestão de categorias (emoji + cor)
- [x] Gestão de contas (bancos + cartões)
- [x] Categorização automática por palavras-chave
- [x] Resumo mensal (receitas × despesas)
- [x] Plano de ação para dívidas (score + ações)
- [x] Rastreamento de score Serasa
- [x] PWA instalável

### 🚧 Em desenvolvimento / Futuro
- [ ] Importação de extratos (OFX/CSV)
- [ ] Gráficos interativos (Recharts)
- [ ] Orçamentos mensais com alertas
- [ ] Metas financeiras com progresso
- [ ] Relatórios avançados (tendências, projeções)
- [ ] Múltiplos cartões de crédito com gestão de faturas
- [ ] Alertas de vencimento de contas
- [ ] Integração com Open Finance (quando possível)

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Servidor local (localhost:3000)
npm run build        # Build de produção
npm run start        # Iniciar build de produção

# Lint/Type check
npm run lint         # ESLint
npx tsc --noEmit     # TypeScript check (sem emitir)

# Supabase
supabase login       # Login na CLI
supabase db diff     # Ver diferenças do schema
supabase gen types    # Gerar tipos TypeScript das tabelas
```

---

## 📦 Dependências Principais

| Pacote | Versão | Uso |
|--------|--------|-----|
| `next` | 14.2.35 | Framework React |
| `react` | 18.3.1 | UI library |
| `typescript` | 5.4.5 | Type safety |
| `tailwindcss` | 3.4.4 | Estilização |
| `@supabase/supabase-js` | 2.43.1 | Cliente Supabase |
| `zod` | 3.23.8 | Validação de schemas |
| `lucide-react` | 0.378.0 | Ícones |
| `date-fns` | 3.6.0 | Manipulação de datas |
| `react-hook-form` | 7.51.4 | Formulários |
| `@hookform/resolvers` | 3.3.4 | Integração Zod + React Hook Form |
| `tailwindcss-animate` | 1.0.7 | Animações Tailwind |
| `autoprefixer` | 10.5.0 | Prefixos CSS |

---

## 🦊 Bulma — A Assistente

> *"Quente e íntima. Técnica quando precisa, leve quando dá. Resolve problema, não enrola."*

Bulma é a IA pessoal do Israel (Rael). Este app é um dos projetos do ecossistema Bulma.

**Ecossistema:**
- `portal.grupototum.com` → Site principal
- `grana.grupototum.com` → **Este app** (finanças)
- `work.grupototum.com` → Produtividade
- `brain.grupototum.com` → Conhecimento (integra Alexandria)
- `painel.grupototum.com` → Monitoramento de infra

---

## 🤝 Como Contribuir

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/nova-feature`
3. Commit suas mudanças: `git commit -m 'feat: descrição'`
4. Push para a branch: `git push origin feat/nova-feature`
5. Abra um Pull Request

---

## 📝 Licença

Projeto pessoal de Israel Lemos. Uso privado.

---

**Criado em:** Abril 2026  
**Última atualização:** Maio 2026  
**Maintainer:** Bulma 🦊 + Kimi Code + Claude

---

## 🔗 Links Relacionados

| Recurso | URL |
|---------|-----|
| Supabase Dashboard | [https://fxpdqyxmzwudtundnofz.supabase.co](https://fxpdqyxmzwudtundnofz.supabase.co) |
| Vercel Dashboard | [https://vercel.com/grupo-totum/bulma-financas](https://vercel.com/grupo-totum/bulma-financas) |
| Repositório | [https://github.com/grupototum/bulma-financas](https://github.com/grupototum/bulma-financas) |
| Totum (empresa) | [https://grupototum.com](https://grupototum.com) |
| Pixel System | [https://pixelsystem.online](https://pixelsystem.online) |

---

> 💙 *"Quero ter conforto, mas não luxo."* — Rael
