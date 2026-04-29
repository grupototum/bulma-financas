# 💰 Bulma Finanças v2

> Sistema financeiro pessoal do Rael
> Stack: Next.js 14 + Supabase + Tailwind + shadcn/ui
> Criado: 2026-04-29

---

## 🎯 Por que v2?

A v1 (PWA localStorage) funciona, mas tem limites:
- ❌ Sem sincronização automática entre dispositivos
- ❌ Sem autenticação/login
- ❌ Sem relatórios avançados no servidor
- ❌ Dados presos no navegador

A v2 resolve tudo isso com Supabase como backend.

---

## 🏗️ Arquitetura

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│  Supabase   │────▶│  PostgreSQL │
│  (Vercel)   │     │   (Auth)    │     │   (RLS)     │
└─────────────┘     └─────────────┘     └─────────────┘
```

- **Frontend:** Next.js 14 (App Router) + Tailwind + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Hospedagem:** Vercel (gratuito)
- **Banco:** Supabase (gratuito — 500MB)

---

## 📊 Schema do Banco

### Entidades principais:

| Tabela | O que guarda |
|---|---|
| `profiles` | Dados do usuário (integra com Auth) |
| `categories` | Categorias de gasto/receita (com orçamento) |
| `accounts` | Contas/bancos/carteiras |
| `transactions` | Transações (gasto, receita, transferência) |
| `goals` | Metas de economia |
| `budgets` | Orçamentos mensais |
| `budget_categories` | Orçamento por categoria |

### Segurança:
- **RLS (Row Level Security):** cada usuário só vê seus próprios dados
- **Auth via Supabase:** login com email/senha ou Google
- **Zero dados compartilhados:** total isolamento entre usuários

---

## 🚀 Como rodar localmente

### 1. Instalar dependências
```bash
cd ~/Projects/bulma-financas
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
```

Preencher:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-ANONIMA
```

### 3. Criar projeto no Supabase
1. Vá em https://supabase.com
2. Faça login com `israelassislemos@gmail.com`
3. Crie novo projeto (nome: `bulma-financas`)
4. Copie URL e Anon Key do dashboard → `.env.local`

### 4. Rodar migrations
```bash
npx supabase link --project-ref SEU-PROJECT-ID
npx supabase db push
```

Ou copie o SQL de `supabase/migrations/001_schema.sql` no SQL Editor do Supabase.

### 5. Iniciar o app
```bash
npm run dev
# Abre em http://localhost:3000
```

---

## 📦 Deploy na Vercel

### 1. Criar conta na Vercel
https://vercel.com — faça login com `israelassislemos@gmail.com`

### 2. Conectar GitHub
```bash
# No projeto
git init
git add .
git commit -m "init: bulma finanças v2"
# Crie repo no GitHub (privado)
git remote add origin https://github.com/raellemos/bulma-financas.git
git push -u origin main
```

### 3. Deploy
- Vercel Dashboard → Import Project → selecione o repo
- Adicione as variáveis de ambiente do Supabase
- Deploy automático a cada push

---

## ⚠️ Regras do Tier Gratuito

| Serviço | Limite Gratuito | Estratégia |
|---|---|---|
| **Supabase DB** | 500MB | Monitorar uso, arquivar dados antigos se necessário |
| **Supabase Auth** | 50.000 usuários/mês | Só você → irrelevante |
| **Supabase Storage** | 1GB | Não usamos (sem upload de arquivos) |
| **Vercel** | 100GB bandwidth/mês | Site leve → sobra muito |
| **Vercel Build** | 6.000 minutos/mês | Builds rápidos → sobra |

**⚠️ Atenção:** Supabase gratuito "dorme" após 7 dias de inatividade. Solução:
- Use o app pelo menos 1x por semana, OU
- Configure um cron job pingando o banco (ex: UptimeRobot gratuito)

---

## 🎨 Telas/Módulos (MVP)

### Phase 1 — Essencial
- [ ] Login / Cadastro
- [ ] Dashboard (resumo do mês)
- [ ] Lista de transações
- [ ] Adicionar/editar transação
- [ ] Categorias com orçamento
- [ ] Gráfico de pizza (gastos por categoria)

### Phase 2 — Relatórios
- [ ] Gráfico de linha (evolução mensal)
- [ ] Cash flow mensal
- [ ] Comparativo mês a mês
- [ ] Metas de economia
- [ ] Alertas de orçamento (80% do limite)

### Phase 3 — Avançado
- [ ] Importar extratos (CSV/OFX)
- [ ] Recorrências automáticas
- [ ] Projeção de gastos
- [ ] Múltiplas contas
- [ ] Exportar relatórios PDF

---

## 🔒 Privacidade

- **RLS ativado:** nenhum usuário vê dados de outro
- **Sem tracking:** zero Google Analytics, zero cookies de terceiros
- **Backup:** exportar JSON a qualquer momento
- **LGPD:** dados armazenados no Brasil (Supabase tem região São Paulo)

---

## 📁 Estrutura do Projeto

```
bulma-financas/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Grupo: login/cadastro
│   ├── dashboard/         # Dashboard principal
│   ├── transactions/      # Transações
│   ├── categories/        # Categorias
│   ├── reports/           # Relatórios
│   ├── goals/             # Metas
│   └── layout.tsx         # Layout global
├── components/            # Componentes React
│   ├── ui/               # shadcn/ui components
│   ├── charts/           # Gráficos (Recharts)
│   └── forms/            # Formulários
├── lib/                   # Utilitários
│   ├── supabase.ts       # Cliente Supabase
│   ├── utils.ts          # Helpers
│   └── queries.ts        # Queries do banco
├── types/                 # TypeScript
│   ├── index.ts          # Tipos das entidades
│   └── supabase.ts       # Tipos gerados do Supabase
├── supabase/
│   └── migrations/
│       └── 001_schema.sql # Schema do banco
└── README.md
```

---

## 🦊 Próximos passos

1. Rael cria conta no Supabase com `israelassislemos@gmail.com`
2. Rael cria conta na Vercel com o mesmo email
3. Bulma configura o projeto Next.js
4. Bulma implementa Phase 1 (dashboard + transações)
5. Testar local → deploy na Vercel

---

*Criado por: Bulma 🦊*
*Para: Rael*
*Data: 2026-04-29*
