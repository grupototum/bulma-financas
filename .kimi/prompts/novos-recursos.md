# 🎯 PROMPT — Kimi Code: Novos Recursos no Bulma Finanças

> **Projeto:** Bulma Finanças v2
> **URL:** https://grana.pixelsystem.online
> **Repo:** https://github.com/grupototum/bulma-financas
> **Local:** ~/Projects/bulma-financas/
> **Stack:** Next.js 14.2.35 + Tailwind CSS + Supabase

---

## 🎯 OBJETIVO

Implantar novos recursos no sistema de finanças pessoais "Bulma Finanças" para que ele esteja **apresentável aos sócios da Totum**.

O app atual tem:
- ✅ Autenticação básica (login/cadastro com Supabase Auth)
- ✅ Dashboard com resumo mensal
- ✅ Lista de transações
- ✅ Categorias pré-definidas
- ✅ PWA configurado
- ✅ CSS funcionando

**Precisamos adicionar funcionalidades que tornem o app útil e profissional no dia a dia.**

---

## 🚀 RECURSOS PRIORITÁRIOS (Ordem de implementação)

### 1. Sistema de Usuário e Senha (Autenticação Completa)

**O que já existe:** Login/cadastro básico com Supabase Auth.

**O que falta:**
- [ ] **Recuperação de senha** — "Esqueci minha senha" com envio de email
- [ ] **Alteração de senha** — dentro do app, logado
- [ ] **Perfil do usuário** — nome, foto (opcional), email
- [ ] **Logout** — botão de sair funcional no menu
- [ ] **Proteção de rotas** — dashboard/transações só acessíveis logado

**Implementação:**
- Usar Supabase Auth (já configurado)
- Criar página `/recuperar-senha`
- Criar página `/perfil`
- Adicionar botão logout no header/menu
- Middleware ou HOC para proteger rotas privadas

---

### 2. CRUD Completo de Transações

**O que já existe:** Lista estática de transações do Supabase.

**O que falta:**
- [ ] **Adicionar transação** — formulário com:
  - Descrição
  - Valor (R$)
  - Data
  - Tipo (Receita/Despesa)
  - Categoria (dropdown com as existentes)
  - Conta (Itaú, PicPay, Mercado Pago)
  - Tags/observações
- [ ] **Editar transação** — ícone de editar na lista
- [ ] **Excluir transação** — ícone de lixeira com confirmação
- [ ] **Busca/Filtro** — buscar por descrição, filtrar por categoria, data, tipo
- [ ] **Ordenação** — por data, valor, categoria

**Página:** `/transactions` já existe, melhorar o conteúdo.

---

### 3. Gestão de Categorias

**O que já existe:** Categorias hardcoded (🚗 Transporte, 🍔 Alimentação, etc.)

**O que falta:**
- [ ] **CRUD de categorias** — página `/categories` já existe, adicionar:
  - Criar nova categoria (nome + ícone + cor)
  - Editar categoria existente
  - Excluir categoria (se não estiver em uso)
- [ ] **Ícones por categoria** — usar biblioteca de ícones (lucide-react já instalado)
- [ ] **Cores por categoria** — color picker simples

---

### 4. Dashboard Melhorado

**O que já existe:** Cards com saldo, receitas, despesas do mês atual.

**O que falta:**
- [ ] **Gráfico de pizza/donut** — distribuição de despesas por categoria
- [ ] **Gráfico de linha/barra** — evolução de receitas vs despesas nos últimos 6 meses
- [ ] **Últimas transações** — lista das 5 últimas transações no dashboard
- [ ] **Saldo por conta** — cards mostrando saldo de cada conta (Itaú, PicPay, etc.)
- [ ] **Filtro de período** — seletor de mês/ano no dashboard

**Biblioteca de gráficos sugerida:** `recharts` (leve, React-friendly)
```bash
npm install recharts
```

---

### 5. Sistema de Contas (Carteiras)

**O que já existe:** 3 contas criadas no Supabase (Itaú, PicPay, Mercado Pago)

**O que falta:**
- [ ] **Página de contas** — listar todas as contas com saldo
- [ ] **CRUD de contas** — adicionar/editar/excluir conta
  - Nome da conta
  - Tipo (Conta Corrente, Cartão de Crédito, Poupança, Investimento)
  - Cor/ícone
  - Saldo inicial
- [ ] **Transferência entre contas** — registrar movimentação de uma conta pra outra

---

### 6. Relatórios Básicos

**Nova página:** `/relatorios`

- [ ] **Relatório mensal** — resumo completo do mês (PDF/export)
- [ ] **Relatório por categoria** — total gasto em cada categoria no período
- [ ] **Relatório por conta** — movimentação de cada conta
- [ ] **Exportar CSV** — botão para download dos dados filtrados

---

### 7. UX/UI Polida

**Ajustes visuais para ficar profissional:**
- [ ] **Loading states** — skeletons ou spinners ao carregar dados
- [ ] **Empty states** — mensagens amigáveis quando não há dados
- [ ] **Toast notifications** — feedback ao adicionar/editar/excluir (usar `sonner` ou similar)
- [ ] **Confirmações** — modal "Tem certeza?" antes de excluir
- [ ] **Navegação melhorada** — sidebar ou menu hambúrguer funcional
- [ ] **Footer** — versão do app + link pro suporte

```bash
npm install sonner  # para toast notifications
```

---

## 📁 ESTRUTURA DO PROJETO ATUAL

```
~/Projects/bulma-financas/
├── app/
│   ├── page.tsx              (login)
│   ├── layout.tsx            (root layout)
│   ├── globals.css           (tailwind)
│   ├── dashboard/
│   │   └── page.tsx          (dashboard atual)
│   ├── transactions/
│   │   └── page.tsx          (lista de transações)
│   ├── categories/
│   │   └── page.tsx          (categorias atual)
│   ├── perfil/
│   │   └── page.tsx          (NOVO - perfil do usuário)
│   ├── recuperar-senha/
│   │   └── page.tsx          (NOVO - reset de senha)
│   ├── contas/
│   │   └── page.tsx          (NOVO - gestão de contas)
│   └── relatorios/
│       └── page.tsx          (NOVO - relatórios)
├── components/
│   ├── auth/
│   │   └── login-form.tsx
│   ├── ui/                   (NOVO - componentes reutilizáveis)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   ├── toast.tsx
│   │   └── loading.tsx
│   ├── charts/               (NOVO - gráficos)
│   │   ├── pie-chart.tsx
│   │   └── bar-chart.tsx
│   └── layout/               (NOVO - estrutura)
│       ├── sidebar.tsx
│       └── header.tsx
├── lib/
│   ├── supabase.ts
│   ├── supabase-browser.ts
│   └── utils.ts
└── public/
    └── ...
```

---

## 🔑 ACESSO E CREDENCIAIS

**Supabase:**
- URL: `https://fxpdqyxmzwudtundnofz.supabase.co`
- Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cGRxeXhtend1ZHR1bmRub2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTAxMzAsImV4cCI6MjA5MzA2NjEzMH0.xc7p1waGYUr25dJhd83I_t641ebNKgoZfntzMA8IlM8`

**Conta de teste:**
- Email: `israelassislemos@gmail.com`
- Senha: `120103@Rael`

---

## ⚠️ REGRAS

1. **NÃO deletar** arquivos existentes sem consultar
2. **NÃO alterar** a estrutura de pastas já existente (app/, components/, lib/)
3. **Manter** o PWA funcionando (manifest.json, ícones)
4. **Manter** o CSS/Tailwind funcionando (não quebrar postcss.config.js)
5. **Testar build local** antes de deployar: `npm run build`
6. **Commitar** a cada funcionalidade concluída
7. **Deployar** na Vercel ao final: `git push && npx vercel --yes --prod`
8. **Usar Supabase** para todas as operações de dados (não criar backend próprio)
9. **Tipagem forte** — usar TypeScript em tudo

---

## 💡 PRIORIDADE DE IMPLEMENTAÇÃO

**Fase 1 (MVP para sócios):**
1. Autenticação completa (recuperar senha, perfil, logout)
2. CRUD de transações (adicionar, editar, excluir)
3. Dashboard com gráficos básicos
4. Proteção de rotas

**Fase 2 (Polimento):**
5. CRUD de categorias
6. Sistema de contas
7. Relatórios
8. UX refinada (toasts, loading, empty states)

**Foco inicial:** Terminar a Fase 1 para apresentação.

---

## ✅ DEFINIÇÃO DE PRONTO (Fase 1)

- [ ] Usuário consegue criar conta, logar, recuperar senha, alterar perfil
- [ ] Usuário consegue adicionar/editar/excluir transações
- [ ] Dashboard mostra saldo, receitas, despesas + gráfico de categorias
- [ ] Rotas protegidas (não dá pra acessar dashboard sem login)
- [ ] App funciona em mobile (PWA)
- [ ] Deploy na Vercel: https://grana.pixelsystem.online

---

*Criado por: Bulma 🦊*
*Data: 2026-04-30*
*Para: Kimi Code / TOT*
