# Prompt: Incrementar Grana com Features do Totum-System + Gestão Fixo/Variável

> Para: Kimi Code
> Projeto: `~/Projects/bulma-financas/` (Next.js + Supabase + Vercel)
> Repo: `https://github.com/grupototum/bulma-financas`
> Data: 2026-05-03

---

## 🎯 Objetivo

Incrementar o Bulma Finanças (Grana) com:
1. **Design system** inspirado no totum-system (UI profissional)
2. **Dashboard executivo** com métricas e gráficos
3. **Layout profissional** (sidebar + header)
4. **Gestão inteligente de Fixo vs Variável** — NOVA FEATURE PRINCIPAL
5. **UX refinada** (toast, skeleton, exportação)

---

## 🏗️ Contexto do Projeto

### Stack atual
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- shadcn/ui (já instalado parcialmente)
- Recharts (já instalado)

### Banco de dados (Supabase)
Tabelas existentes:
- `transactions` — transações financeiras
- `categories` — categorias (com `color` e `icon`)
- `accounts` — contas bancárias
- `credit_scores` — histórico de score Serasa
- `action_plans` — plano de ação

### Schema da tabela `transactions`
```sql
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  category_id uuid REFERENCES categories(id),
  account_id uuid REFERENCES accounts(id),
  transaction_date date NOT NULL,
  notes text,
  is_recurring boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);
```

---

## 📦 FASE 1: Design System (UI Components)

### 1.1 Instalar dependências adicionais
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
```

### 1.2 Criar utilitários base
**`lib/utils.ts`** (ou atualizar existente):
```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}
```

### 1.3 Criar componentes UI essenciais

**`components/ui/button.tsx`** — Botão com variantes
```typescript
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
```

**`components/ui/card.tsx`** — Card com header/content/footer
```typescript
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border bg-white shadow-sm", className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
```

**`components/ui/badge.tsx`** — Badge com cores
```typescript
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-100 text-blue-800",
        success: "border-transparent bg-green-100 text-green-800",
        danger: "border-transparent bg-red-100 text-red-800",
        warning: "border-transparent bg-yellow-100 text-yellow-800",
        outline: "border-gray-300 text-gray-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
```

**`components/ui/skeleton.tsx`** — Loading placeholder
```typescript
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-gray-200", className)} {...props} />;
}
```

**`components/ui/toast.tsx`** — Toast notifications (usar Radix UI)

---

## 📦 FASE 2: Dashboard Executivo

### 2.1 Criar layout profissional

**`components/layout/sidebar.tsx`** — Sidebar de navegação
```typescript
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/transactions", label: "Transações", icon: "Receipt" },
  { href: "/fixed-expenses", label: "Fixos vs Variáveis", icon: "Repeat" },
  { href: "/reports", label: "Relatórios", icon: "BarChart3" },
  { href: "/plan", label: "Plano de Ação", icon: "Target" },
];
```

**`components/layout/header.tsx`** — Header com perfil

**`components/layout/app-shell.tsx`** — Shell combinando sidebar + header + content

### 2.2 Criar página Dashboard v2

**`app/dashboard/page.tsx`** (substituir ou criar v2)

Métricas principais (cards):
1. **Saldo total** — todas as contas
2. **Receita do mês** — income do mês atual
3. **Despesa do mês** — expense do mês atual
4. **Balanço** — receita - despesa
5. **Gastos fixos** — % da renda
6. **Gastos variáveis** — % da renda

Gráficos:
1. **Linha** — Evolução saldo últimos 6 meses
2. **Pizza** — Despesas por categoria (mês atual)
3. **Barra** — Fixo vs Variável (comparativo)
4. **Área** — Projeção de gastos fixos próximos meses

### 2.3 Hook de dados

**`hooks/use-dashboard-data.ts`**:
```typescript
export function useDashboardData(month: number, year: number) {
  // Buscar do Supabase:
  // - Total transactions do mês
  // - Breakdown por categoria
  // - Fixo vs Variável
  // - Tendência 6 meses
}
```

---

## 📦 FASE 3: Gestão Fixo vs Variável (FEATURE PRINCIPAL)

### 3.1 Alterar schema do banco

**Migration `008_fixed_variable.sql`:**
```sql
-- Adicionar coluna is_fixed na tabela transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_fixed boolean DEFAULT false;

-- Adicionar coluna expense_type na tabela categories
ALTER TABLE categories ADD COLUMN IF NOT EXISTS expense_type text DEFAULT 'variable' 
  CHECK (expense_type IN ('fixed', 'variable'));

-- Atualizar categorias existentes (exemplos)
UPDATE categories SET expense_type = 'fixed' WHERE name IN ('🏠 Moradia', '📱 Assinaturas', '💳 Cartão de Crédito');
UPDATE categories SET expense_type = 'variable' WHERE name IN ('🍔 Alimentação', '🚗 Transporte', '☕ Lazer/Café');

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_transactions_is_fixed ON transactions(is_fixed);
CREATE INDEX IF NOT EXISTS idx_categories_expense_type ON categories(expense_type);
```

### 3.2 Criar tabela de despesas fixas (para previsão)

**Migration `009_fixed_expenses_registry.sql`:**
```sql
-- Tabela para registrar despesas fixas conhecidas
CREATE TABLE IF NOT EXISTS fixed_expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL,
  amount numeric(12,2) NOT NULL,
  category_id uuid REFERENCES categories(id),
  account_id uuid REFERENCES accounts(id),
  due_day integer NOT NULL CHECK (due_day BETWEEN 1 AND 31),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id),
  UNIQUE(description, user_id)
);

-- RLS
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Usuários veem apenas seus gastos fixos"
  ON fixed_expenses FOR ALL
  USING (auth.uid() = user_id);

-- Índice
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_user ON fixed_expenses(user_id);
```

### 3.3 Criar página Fixos vs Variáveis

**`app/fixed-expenses/page.tsx`** — Nova página dedicada

Layout:
```
┌─────────────────────────────────────┐
│  Fixos vs Variáveis                  │
├─────────────────────────────────────┤
│  Cards:                              │
│  ┌──────────┐ ┌──────────┐          │
│  │ Fixo/mês │ │ Var/mês  │          │
│  │ R$ XXXX  │ │ R$ XXXX  │          │
│  │ XX% renda│ │ XX% renda│          │
│  └──────────┘ └──────────┘          │
├─────────────────────────────────────┤
│  Gráfico: Fixo vs Variável (6 meses) │
├─────────────────────────────────────┤
│  Lista de Despesas Fixas             │
│  ┌─────────────────────────────┐    │
│  │ [+] Nova despesa fixa       │    │
│  │ • Aluguel        R$ 800    │    │
│  │   Dia 10 | Conta Itaú      │    │
│  │ • Netflix        R$ 39,90  │    │
│  │   Dia 15 | Cartão Credicard│    │
│  └─────────────────────────────┘    │
├─────────────────────────────────────┤
│  Análise Inteligente               │
│  "Seus gastos fixos são 45% da      │
│   renda. Ideal é até 50%."         │
└─────────────────────────────────────┘
```

### 3.4 Componentes da página

**`components/fixed-expenses/fixed-expense-card.tsx`** — Card de cada despesa fixa
**`components/fixed-expenses/fixed-expense-form.tsx`** — Formulário para adicionar/editar
**`components/fixed-expenses/comparison-chart.tsx`** — Gráfico comparativo
**`components/fixed-expenses/analysis-panel.tsx`** — Painel de análise inteligente

### 3.5 Hook de análise

**`hooks/use-fixed-variable-analysis.ts`**:
```typescript
interface FixedVariableAnalysis {
  fixedTotal: number;
  variableTotal: number;
  fixedPercentage: number; // % da renda
  variablePercentage: number;
  recommendedFixedMax: number; // 50% da renda
  status: 'good' | 'warning' | 'danger'; // bom / atenção / crítico
  insights: string[]; // Mensagens inteligentes
}

export function useFixedVariableAnalysis(month: number, year: number): FixedVariableAnalysis {
  // Calcular:
  // 1. Soma de todas as transações is_fixed=true (expense)
  // 2. Soma de todas as transações is_fixed=false (expense)
  // 3. Receita total do mês
  // 4. Gerar insights:
  //    - "Você gastou R$ X a mais em variáveis este mês"
  //    - "Seus gastos fixos consomem XX% da renda"
  //    - "Meta: reduzir variáveis em R$ Y"
}
```

### 3.6 Análises inteligentes (insights)

Gerar mensagens contextuais:

```typescript
function generateInsights(data: FixedVariableData): string[] {
  const insights: string[] = [];
  
  // Regra 50/30/20
  if (data.fixedPercentage > 50) {
    insights.push(`⚠️ Seus gastos fixos consomem ${data.fixedPercentage}% da renda. O ideal é até 50%.`);
  } else if (data.fixedPercentage < 30) {
    insights.push(`✅ Ótimo! Gastos fixos em ${data.fixedPercentage}% — bem controlados.`);
  }
  
  // Comparação mês anterior
  if (data.variableChange > 0) {
    insights.push(`📈 Gastos variáveis aumentaram ${formatCurrency(data.variableChange)} vs mês passado.`);
  } else {
    insights.push(`📉 Gastos variáveis diminuíram ${formatCurrency(Math.abs(data.variableChange))}. Continue assim!`);
  }
  
  // Previsão
  const projectedFixed = data.fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  insights.push(`🔮 Próximo mês: ~${formatCurrency(projectedFixed)} em gastos fixos já programados.`);
  
  // Sugestão
  const availableForVariable = data.income * 0.3; // 30% para variáveis
  if (data.variableTotal > availableForVariable) {
    insights.push(`💡 Dica: você tem ${formatCurrency(availableForVariable)} para gastos variáveis este mês (regra 30%).`);
  }
  
  return insights;
}
```

---

## 📦 FASE 4: UX Refinada

### 4.1 Toast notifications

**`hooks/use-toast.ts`** — Hook global de toast

Uso:
```typescript
const { toast } = useToast();

toast({ title: "Transação salva!", description: "R$ 150,00 em 🍔 Alimentação" });
toast({ title: "Erro", description: "Não foi possível salvar", variant: "destructive" });
```

### 4.2 Skeleton loading

Substituir "Carregando..." por Skeleton em todas as páginas:

```typescript
// Antes
if (loading) return <div>Carregando...</div>;

// Depois
if (loading) return <DashboardSkeleton />;
```

### 4.3 Exportação CSV/PDF

**`lib/export.ts`**:
```typescript
export function exportToCSV(transactions: Transaction[]) {
  // Gerar CSV e fazer download
}

export function exportToPDF(reportData: ReportData) {
  // Usar biblioteca como jspdf ou react-pdf
}
```

---

## 📦 FASE 5: Atualizar Auto-Categorização

### 5.1 Atualizar `lib/auto-categorization.ts`

Adicionar campo `is_fixed` nas regras:

```typescript
const rules: CategorizationRule[] = [
  {
    keywords: ['aluguel', 'condomínio', 'iptu'],
    categoryId: 'moradia-id',
    isFixed: true,
  },
  {
    keywords: ['netflix', 'spotify', 'assinatura'],
    categoryId: 'assinaturas-id',
    isFixed: true,
  },
  {
    keywords: ['ifood', 'uber', 'restaurante'],
    categoryId: 'alimentacao-id',
    isFixed: false,
  },
  // ...
];
```

### 5.2 Atualizar script de aplicação

**`scripts/apply-auto-categorization.js`**:
```javascript
// Ao aplicar categoria, também setar is_fixed baseado na regra
const update = {
  category_id: rule.categoryId,
  is_fixed: rule.isFixed !== undefined ? rule.isFixed : category.expense_type === 'fixed',
};
```

---

## 🎨 Design Tokens (cores Grana)

Manter identidade visual:

```typescript
// tailwind.config.ts ou globals.css
const colors = {
  primary: {
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
    light: '#93BBFC',
  },
  expense: {
    fixed: '#8B5CF6',     // Roxo = fixo
    variable: '#F59E0B',  // Amarelo = variável
  },
  income: {
    fixed: '#10B981',     // Verde = receita fixa
    variable: '#34D399',  // Verde claro = receita variável
  },
  semantic: {
    danger: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
};
```

---

## 🧪 Testes

### Manual
1. Abrir `/fixed-expenses` — ver se carrega
2. Adicionar despesa fixa — ver se aparece
3. Ver gráfico Fixo vs Variável — dados corretos?
4. Ver insights — fazem sentido?
5. Testar responsivo — mobile ok?

### Build
```bash
npm run build
```

### Deploy
```bash
vercel --prod
```

---

## 📋 Checklist de entrega

- [ ] Components UI criados (Button, Card, Badge, Skeleton)
- [ ] Layout profissional (Sidebar + Header + Shell)
- [ ] Dashboard v2 com métricas e gráficos
- [ ] Migration 008 (is_fixed na transactions)
- [ ] Migration 009 (fixed_expenses registry)
- [ ] Página `/fixed-expenses` criada
- [ ] Hook `useFixedVariableAnalysis` funcional
- [ ] Análises inteligentes gerando insights
- [ ] Toast notifications implementadas
- [ ] Skeleton loading em todas as páginas
- [ ] Auto-categorização atualizada com is_fixed
- [ ] Build passando sem erros
- [ ] Deploy na Vercel

---

## 🚀 Comandos úteis

```bash
# Ir para o projeto
cd ~/Projects/bulma-financas

# Instalar dependências
npm install

# Rodar dev server
npm run dev

# Build
npm run build

# Deploy
vercel --prod
```

---

*Prompt criado por Bulma, 2026-05-03*
