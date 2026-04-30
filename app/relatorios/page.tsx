"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Calendar, Tag, CreditCard } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  category?: { name: string; color: string } | null;
  account?: { name: string } | null;
  account_id?: string | null;
}

interface CategoryReport {
  name: string;
  color: string;
  total: number;
  count: number;
}

interface AccountReport {
  name: string;
  income: number;
  expense: number;
  count: number;
}

type Tab = "categorias" | "contas";

export default function RelatoriosPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [activeTab, setActiveTab] = useState<Tab>("categorias");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color), account:accounts(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (txs) setTransactions(txs as Transaction[]);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const filteredTransactions = useMemo(() => {
    const [year, month] = period.split("-").map(Number);
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    return transactions.filter((t) => t.date >= start && t.date <= end);
  }, [transactions, period]);

  const categoryReport = useMemo<CategoryReport[]>(() => {
    const map = new Map<string, CategoryReport>();
    filteredTransactions.filter((t) => t.type === "expense").forEach((t) => {
      const name = t.category?.name || "Sem categoria";
      const color = t.category?.color || "#9CA3AF";
      const existing = map.get(name);
      if (existing) {
        existing.total += t.amount;
        existing.count += 1;
      } else {
        map.set(name, { name, color, total: t.amount, count: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [filteredTransactions]);

  const accountReport = useMemo<AccountReport[]>(() => {
    const map = new Map<string, AccountReport>();
    filteredTransactions.forEach((t) => {
      const name = t.account?.name || "Sem conta";
      const existing = map.get(name);
      if (existing) {
        if (t.type === "income") existing.income += t.amount;
        else existing.expense += t.amount;
        existing.count += 1;
      } else {
        map.set(name, {
          name,
          income: t.type === "income" ? t.amount : 0,
          expense: t.type === "expense" ? t.amount : 0,
          count: 1,
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.income + b.expense - (a.income + a.expense));
  }, [filteredTransactions]);

  const totalIncome = useMemo(() => filteredTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [filteredTransactions]);
  const totalExpense = useMemo(() => filteredTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [filteredTransactions]);

  function exportCSV() {
    const headers = ["Data", "Descrição", "Tipo", "Categoria", "Conta", "Valor"];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.description,
      t.type === "income" ? "Receita" : "Despesa",
      t.category?.name || "",
      t.account?.name || "",
      t.amount.toString().replace(".", ","),
    ]);
    const csv = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio-${period}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  }

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
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Relatórios</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Receitas</p>
            <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Despesas</p>
            <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Saldo</p>
            <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("categorias")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "categorias"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            }`}
          >
            <Tag className="h-4 w-4" />
            Por Categoria
          </button>
          <button
            onClick={() => setActiveTab("contas")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "contas"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Por Conta
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === "categorias" ? (
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20">
            {categoryReport.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                <Tag className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p>Nenhuma despesa no período selecionado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {categoryReport.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{cat.count} transação{cat.count !== 1 ? "es" : ""}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-red-600">{formatCurrency(cat.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/20">
            {accountReport.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                <CreditCard className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                <p>Nenhuma transação no período selecionado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {accountReport.map((acc) => (
                  <div key={acc.name} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{acc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{acc.count} transação{acc.count !== 1 ? "es" : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">+{formatCurrency(acc.income)}</p>
                      <p className="text-sm font-semibold text-red-600">-{formatCurrency(acc.expense)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
