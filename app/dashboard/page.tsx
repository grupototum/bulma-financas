"use client";

import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PlusCircle, ArrowLeftRight, TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  category?: { name: string; color: string } | null;
}

interface CategorySummary {
  name: string;
  value: number;
  color: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [categoryData, setCategoryData] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);

      // Buscar transações do mês atual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color)")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString().split("T")[0])
        .order("date", { ascending: false })
        .limit(10);

      if (txs) {
        setTransactions(txs as Transaction[]);

        // Calcular resumo
        const income = txs
          .filter((t) => t.type === "income")
          .reduce((sum, t) => sum + t.amount, 0);
        const expense = txs
          .filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + t.amount, 0);
        setSummary({ income, expense, balance: income - expense });

        // Agrupar por categoria (apenas despesas)
        const categoryMap = new Map<string, { value: number; color: string }>();
        txs
          .filter((t) => t.type === "expense")
          .forEach((t) => {
            const catName = t.category?.name || "Sem categoria";
            const catColor = t.category?.color || "#9CA3AF";
            const existing = categoryMap.get(catName);
            if (existing) {
              existing.value += t.amount;
            } else {
              categoryMap.set(catName, { value: t.amount, color: catColor });
            }
          });

        setCategoryData(
          Array.from(categoryMap.entries()).map(([name, { value, color }]) => ({
            name,
            value,
            color,
          }))
        );
      }

      setLoading(false);
    }

    loadData();
  }, [router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bulma Finanças</h1>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/plano"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              📋 Plano de Ação
            </Link>
            <Link
              href="/transactions"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Nova Transação
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Cards de Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receitas (mês)</p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {summary.income.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-red-100 p-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Despesas (mês)</p>
                <p className="text-2xl font-bold text-red-600">
                  R$ {summary.expense.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Wallet className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saldo (mês)</p>
                <p
                  className={`text-2xl font-bold ${
                    summary.balance >= 0 ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  R$ {summary.balance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico + Transações */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Gráfico de Pizza */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Gastos por Categoria
            </h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-gray-400">
                Nenhuma despesa este mês
              </div>
            )}
            {/* Legenda */}
            <div className="mt-4 flex flex-wrap gap-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-gray-600">
                    {cat.name} ({" "}
                    {cat.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                    )
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Últimas Transações */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Últimas Transações
              </h2>
              <Link
                href="/transactions"
                className="text-sm text-blue-600 hover:underline"
              >
                Ver todas
              </Link>
            </div>

            <div className="space-y-3">
              {transactions.length === 0 ? (
                <p className="text-gray-400">Nenhuma transação este mês</p>
              ) : (
                transactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg p-2 ${
                          t.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {t.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{t.description}</p>
                        <p className="text-xs text-gray-500">
                          {t.category?.name || "Sem categoria"} •{" "}
                          {new Date(t.date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}R${" "}
                      {t.amount.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
