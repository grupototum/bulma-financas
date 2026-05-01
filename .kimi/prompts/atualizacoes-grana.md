# 🎯 PROMPT — Atualizações do Grana (Bulma Finanças)

> Para: Kimi Code / Claude Code / Subagente de desenvolvimento
> De: Bulma
> Data: 2026-05-01
> Projeto: https://github.com/grupototum/bulma-financas
> Deploy: https://grana.pixelsystem.online

---

## 📁 ESTRUTURA DO PROJETO

```
~/Projects/bulma-financas/
├── app/
│   ├── page.tsx              ← Tela de login (🦊 Bulma + auth)
│   ├── dashboard/
│   │   └── page.tsx          ← Dashboard principal (filtros, gráficos, resumo)
│   ├── plano/
│   │   └── page.tsx          ← Plano de Ação (score tracker, tarefas)
│   ├── transacoes/
│   │   └── page.tsx          ← CRUD de transações
│   ├── categorias/
│   │   └── page.tsx          ← Gestão de categorias
│   ├── contas/
│   │   └── page.tsx          ← Gestão de contas bancárias
│   ├── relatorios/
│   │   └── page.tsx          ← Relatórios analíticos
│   ├── metas/
│   │   └── page.tsx          ← Metas financeiras
│   ├── orcamentos/
│   │   └── page.tsx          ← Orçamentos mensais
│   └── perfil/
│       └── page.tsx          ← Perfil do usuário
├── components/
│   ├── layout/
│   │   └── protected-layout.tsx  ← Layout com sidebar + header
│   └── ui/                   ← Componentes shadcn/ui
├── lib/
│   ├── supabase-browser.ts   ← Client Supabase (anon key)
│   └── auto-categorization.ts ← Regras de categorização automática
├── public/
│   ├── manifest.json         ← PWA manifest
│   ├── favicon.png           ← 🤑 Favicon emoji
│   ├── bulma-avatar.png    ← Avatar da Bulma
│   └── bulma-login.png     ← Imagem da tela de login
├── supabase/
│   └── migrations/           ← SQL das tabelas
├── next.config.js            ← Webpack alias @/ → raiz
├── postcss.config.js         ← Tailwind + Autoprefixer
└── tsconfig.json             ← baseUrl: ".", moduleResolution: "node"
```

---

## 🔧 TECNOLOGIA

| Stack | Versão |
|---|---|
| Next.js | 14.2.35 (App Router) |
| React | 18.3.1 |
| Tailwind CSS | 3.4.1 |
| shadcn/ui | latest |
| recharts | ^2.15.3 |
| lucide-react | ^0.503.0 |
| Supabase | @supabase/ssr (client-side) |
| Auth | Supabase Auth (email/senha) |

---

## 🎯 NOVAS FUNCIONALIDADES A IMPLEMENTAR

### 1. Dashboard Melhorado
- [ ] **Gráfico de evolução patrimonial** (linha do tempo)
- [ ] **Gráfico de donut** — distribuição por categoria no mês
- [ ] **Cards de resumo** — entradas, saídas, saldo, maior gasto
- [ ] **Filtro de período** — seletor de mês/ano com navegação
- [ ] **Transações recentes** — lista das últimas 10 no dashboard

### 2. Gestão de Transações (CRUD)
- [ ] **Listar** transações com paginação e filtros (data, categoria, conta, tipo)
- [ ] **Criar** nova transação (form com validação)
- [ ] **Editar** transação existente
- [ ] **Deletar** com confirmação
- [ ] **Importar CSV** — upload de extratos bancários
- [ ] **Categorização automática** — usar `lib/auto-categorization.ts`

### 3. Relatórios
- [ ] **Relatório mensal** — PDF ou view com tudo do mês
- [ ] **Comparativo mês a mês** — gráfico de barras lado a lado
- [ ] **Análise por categoria** — ranking de gastos
- [ ] **Tendências** — previsão de gastos (simples, média móvel)

### 4. Metas Financeiras
- [ ] **Criar meta** — valor, prazo, descrição
- [ ] **Barra de progresso** — % atingida
- [ ] **Aviso** — quando próximo do prazo

### 5. Orçamentos
- [ ] **Definir orçamento mensal** por categoria
- [ ] **Alerta** — quando gasto ultrapassa 80% do orçamento
- [ ] **Visual** — progress bar colorida

### 6. Exportação
- [ ] **Exportar transações** como CSV
- [ ] **Exportar relatório** como PDF (usar biblioteca jsPDF ou html2canvas)

### 7. UX/UI
- [ ] **Dark mode toggle** — já existe classe `dark` no Tailwind
- [ ] **Toast notifications** — sonner já instalado
- [ ] **Loading states** — skeletons
- [ ] **Empty states** — ilustrações/mensagens quando não há dados

---

## 📊 SCHEMA SUPABASE (tabelas existentes)

```sql
-- Tabelas criadas:
categories       (id, name, color, icon, type, user_id)
accounts         (id, name, type, balance, currency, user_id)
transactions     (id, amount, type, category_id, account_id, date, description, status, user_id)
credit_scores    (id, user_id, score, date, source, notes)
action_plans     (id, user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
```

---

## 🔐 AUTENTICAÇÃO

- Auth via Supabase (`@supabase/ssr`)
- Usuário logado: `israelassislemos@gmail.com`
- User ID: `7e500c64-cd09-4cc2-86b0-9a0e0736f98e`
- RLS ativado — queries precisam de `user_id`

---

## 🎨 DESIGN

- Cores primárias: Azul `#3B82F6`, background escuro `#0F172A`
- Fonte: Inter (Next.js default)
- Ícones: Lucide React
- Componentes: shadcn/ui (Button, Card, Input, Select, Table, Dialog, etc.)

---

## ⚠️ ATENÇÃO — Problemas conhecidos

1. **Path alias `@/`** — Requer configuração manual no `next.config.js`:
```javascript
config.resolve.alias['@'] = path.resolve(__dirname);
```

2. **PostCSS** — `postcss.config.js` é obrigatório com Tailwind + Autoprefixer

3. **Build** — `npm run build` deve passar localmente antes do deploy

4. **Deploy** — Vercel auto-deploya no push pra `main`

---

## 🚀 COMO COMEÇAR

```bash
cd ~/Projects/bulma-financas

# Instalar dependências
npm install

# Build local (DEVE passar)
npm run build

# Se build passar, commita e pusha
git add .
git commit -m "feat: [descricao da funcionalidade]"
git push

# Vercel auto-deploya
```

---

## 🦺 REGRAS DE CÓDIGO

1. **Nunca commitar** `.env.local`, `node_modules/`, ou dados sensíveis
2. **Usar TypeScript** — tipar todas as props e funções
3. **Usar `use client`** apenas quando necessário (interatividade)
4. **Server Components** por padrão (Next.js App Router)
5. **Supabase queries** com `.eq('user_id', userId)` para RLS
6. **Error handling** — try/catch em todas as queries
7. **Loading states** — skeletons ou spinners enquanto carrega

---

## 📞 CONTATO

Se precisar de mais contexto, pergunte ao Rael ou consulte:
- Repo: `https://github.com/grupototum/bulma-financas`
- App live: `https://grana.pixelsystem.online`
- Supabase Dashboard: `https://fxpdqyxmzwudtundnofz.supabase.co`

---

*Criado por Bulma — 2026-05-01*
