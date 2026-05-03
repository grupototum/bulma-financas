"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Calendar,
  CreditCard,
  Target,
  PiggyBank,
  BarChart3,
  Activity,
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  category_id?: string | null;
  category?: { name: string; color: string } | null;
  account_id?: string | null;
}

interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
}

interface MonthlyData {
  label: string;
  income: number;
  expense: number;
}

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
}

interface BudgetSummary {
  planned: number;
  spent: number;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary>({ planned: 0, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"bar" | "line">("bar");
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const { data: accs } = await supabase
        .from("accounts")
        .select("id, name, type, balance, color")
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (accs) setAccounts(accs);

      const { data: gs } = await supabase
        .from("goals")
        .select("id, name, target_amount, current_amount, deadline, color")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("deadline", { ascending: true })
        .limit(3);
      if (gs) setGoals(gs);

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 11);
      startDate.setDate(1);

      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color)")
        .eq("user_id", user.id)
        .gte("date", startDate.toISOString().split("T")[0])
        .order("date", { ascending: false });

      if (txs) {
        setTransactions(txs as Transaction[]);
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  useEffect(() => {
    async function calculate() {
      if (transactions.length === 0) return;

      const [year, month] = period.split("-").map(Number);
      const startOfMonth = `${year}-${String(month).padStart(2, "0")}-01`;
      const endOfMonthDate = new Date(year, month, 0);
      const endOfMonth = `${year}-${String(month).padStart(2, "0")}-${String(endOfMonthDate.getDate()).padStart(2, "0")}`;

      const monthTxs = transactions.filter((t) => t.date >= startOfMonth && t.date <= endOfMonth);

      const income = monthTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
      setSummary({ income, expense, balance: income - expense });

      const categoryMap = new Map<string, { value: number; color: string }>();
      monthTxs.filter((t) => t.type === "expense").forEach((t) => {
        const catName = t.category?.name || "Sem categoria";
        const catColor = t.category?.color || "#9CA3AF";
        const existing = categoryMap.get(catName);
        if (existing) existing.value += t.amount;
        else categoryMap.set(catName, { value: t.amount, color: catColor });
      });
      setCategoryData(
        Array.from(categoryMap.entries()).map(([name, { value, color }]) => ({ name, value, color }))
      );

      const supabase = createClient();
      const { data: budget } = await supabase
        .from("budgets")
        .select("id")
        .eq("user_id", user.id)
        .eq("month", month)
        .eq("year", year)
        .single();

      if (budget) {
        const { data: bcs } = await supabase
          .from("budget_categories")
          .select("category_id, planned_amount")
          .eq("budget_id", budget.id);
        const planned = bcs?.reduce((s, bc) => s + (bc.planned_amount || 0), 0) || 0;
        const spent = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
        setBudgetSummary({ planned, spent });

        // Alertas de orçamento (80% do limite)
        const spentByCategory = new Map<string, number>();
        monthTxs.filter((t) => t.type === "expense").forEach((t) => {
          if (t.category_id) {
            spentByCategory.set(t.category_id, (spentByCategory.get(t.category_id) || 0) + t.amount);
          }
        });

        const warnings: string[] = [];
        bcs?.forEach((bc) => {
          if (bc.planned_amount && bc.planned_amount > 0) {
            const spentCat = spentByCategory.get(bc.category_id) || 0;
            const pct = spentCat / bc.planned_amount;
            if (pct >= 0.8 && pct <= 1) {
              warnings.push(`${Math.round(pct * 100)}% do orçamento utilizado`);
            } else if (pct > 1) {
              warnings.push(`${Math.round(pct * 100)}% do orçamento — limite ultrapassado!`);
            }
          }
        });

        if (warnings.length > 0) {
          toast.warning(`Orçamento: ${warnings.length} categoria(s) no limite`, {
            description: warnings.slice(0, 3).join(" • "),
          });
        }
      } else {
        setBudgetSummary({ planned: 0, spent: monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0) });
      }

      const months: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(year, month - 1 - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth() + 1;
        const label = `${String(m).padStart(2, "0")}/${y}`;
        const mStart = `${y}-${String(m).padStart(2, "0")}-01`;
        const mEndDate = new Date(y, m, 0);
        const mEnd = `${y}-${String(m).padStart(2, "0")}-${String(mEndDate.getDate()).padStart(2, "0")}`;

        const mTxs = transactions.filter((t) => t.date >= mStart && t.date <= mEnd);
        const mIncome = mTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        const mExpense = mTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
        months.push({ label, income: mIncome, expense: mExpense });
      }
      setMonthlyData(months);
    }

    calculate();
  }, [transactions, period, user]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <ProtectedLayout userEmail={user?.email}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-mint-900 dark:text-mint-50">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-mint-500 dark:text-mint-400" />
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Cards resumo */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mint-500 dark:text-mint-400">Saldo</p>
                <p className="mt-1 text-2xl font-bold text-mint-900 dark:text-mint-50">{formatCurrency(summary.balance)}</p>
              </div>
              <div className="rounded-lg bg-blue-100 dark:bg-mint-brand-deep/30 p-3">
                <Wallet className="h-6 w-6 text-mint-brand dark:text-mint-brand" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mint-500 dark:text-mint-400">Receitas</p>
                <p className="mt-1 text-2xl font-bold text-mint-brand-deep">{formatCurrency(summary.income)}</p>
              </div>
              <div className="rounded-lg bg-mint-brand-light dark:bg-mint-brand-deep/30 p-3">
                <TrendingUp className="h-6 w-6 text-mint-brand-deep" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mint-500 dark:text-mint-400">Despesas</p>
                <p className="mt-1 text-2xl font-bold text-mint-error">{formatCurrency(summary.expense)}</p>
              </div>
              <div className="rounded-lg bg-mint-error-light dark:bg-mint-error/30 p-3">
                <TrendingDown className="h-6 w-6 text-mint-error" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-mint-500 dark:text-mint-400">Economia</p>
                <p className="mt-1 text-2xl font-bold text-mint-900 dark:text-mint-50">
                  {summary.income > 0 ? `${((1 - summary.expense / summary.income) * 100).toFixed(1)}%` : "0%"}
                </p>
              </div>
              <div className="rounded-lg bg-mint-soft-blue-light dark:bg-mint-soft-blue/30 p-3">
                <PiggyBank className="h-6 w-6 text-mint-soft-blue" />
              </div>
            </div>
          </div>
        </div>

        {/* Gráficos */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <h2 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Despesas por categoria</h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-mint-500 dark:text-mint-400 py-12">Nenhuma despesa no período</p>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-mint-900 dark:text-mint-50">Evolução mensal</h2>
              <div className="flex rounded-lg border border-mint-200 dark:border-mint-700 overflow-hidden">
                <button
                  onClick={() => setChartType("bar")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium ${chartType === "bar" ? "bg-mint-900 text-white" : "bg-white dark:bg-mint-800 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-mint-800"}`}
                >
                  <BarChart3 className="h-3 w-3" />
                  Barras
                </button>
                <button
                  onClick={() => setChartType("line")}
                  className={`flex items-center gap-1 px-3 py-1 text-xs font-medium ${chartType === "line" ? "bg-mint-900 text-white" : "bg-white dark:bg-mint-800 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-mint-800"}`}
                >
                  <Activity className="h-3 w-3" />
                  Linhas
                </button>
              </div>
            </div>
            {monthlyData.some((d) => d.income > 0 || d.expense > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                {chartType === "bar" ? (
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="income" name="Receitas" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Line type="monotone" dataKey="income" name="Receitas" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="expense" name="Despesas" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-mint-500 dark:text-mint-400 py-12">Nenhum dado disponível</p>
            )}
          </div>
        </div>

        {/* Metas e Contas */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-mint-900 dark:text-mint-50">Metas</h2>
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            {goals.length > 0 ? (
              <div className="space-y-4">
                {goals.slice(0, 3).map((g) => (
                  <div key={g.id}>
                    <div className="flex justify-between text-sm">
                      <span className="text-mint-700 dark:text-mint-300">{g.name}</span>
                      <span className="text-mint-500 dark:text-mint-400">{((g.current_amount / g.target_amount) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full rounded-full bg-mint-200 dark:bg-mint-800">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${Math.min((g.current_amount / g.target_amount) * 100, 100)}%`,
                          backgroundColor: g.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-mint-500 dark:text-mint-400">Nenhuma meta ativa</p>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-mint-900 dark:text-mint-50">Contas</h2>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
            {accounts.length > 0 ? (
              <div className="space-y-3">
                {accounts.map((acc) => (
                  <div key={acc.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: acc.color }} />
                      <span className="text-sm text-mint-700 dark:text-mint-300">{acc.name}</span>
                    </div>
                    <span className="text-sm font-medium text-mint-900 dark:text-mint-50">{formatCurrency(acc.balance)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-mint-500 dark:text-mint-400">Nenhuma conta cadastrada</p>
            )}
          </div>
        </div>

        {/* Últimas transações */}
        <div className="mt-6 rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
          <h2 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Últimas transações</h2>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${t.type === "income" ? "bg-mint-brand-light dark:bg-mint-brand-deep/30 text-mint-brand-deep" : "bg-mint-error-light dark:bg-mint-error/30 text-mint-error"}`}>
                      {t.type === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-mint-900 dark:text-mint-50">{t.description}</p>
                      <p className="text-xs text-mint-500 dark:text-mint-400">{t.category?.name || "Sem categoria"} • {new Date(t.date).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${t.type === "income" ? "text-mint-brand-deep" : "text-mint-error"}`}>
                    {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-mint-500 dark:text-mint-400 py-4">Nenhuma transação</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
