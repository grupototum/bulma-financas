"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Calendar, Tag, CreditCard, FileText, GitCompare, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

type Tab = "categorias" | "contas" | "comparativo" | "fluxo";

export default function RelatoriosPage() {
  const [user, setUser] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}-01`;
  });
  const [endDate, setEndDate] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const endDay = String(new Date(year, now.getMonth() + 1, 0).getDate()).padStart(2, "0");
    return `${year}-${month}-${endDay}`;
  });
  const [activeTab, setActiveTab] = useState<Tab>("categorias");
  const [comparePeriod, setComparePeriod] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
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
    return transactions.filter((t) => t.date >= startDate && t.date <= endDate);
  }, [transactions, startDate, endDate]);

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

  const compareFilteredTransactions = useMemo(() => {
    const [year, month] = comparePeriod.split("-").map(Number);
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    return transactions.filter((t) => t.date >= start && t.date <= end);
  }, [transactions, comparePeriod]);

  const compareTotalIncome = useMemo(() => compareFilteredTransactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [compareFilteredTransactions]);
  const compareTotalExpense = useMemo(() => compareFilteredTransactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [compareFilteredTransactions]);

  const compareCategoryReport = useMemo(() => {
    const map = new Map<string, CategoryReport>();
    compareFilteredTransactions.filter((t) => t.type === "expense").forEach((t) => {
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
  }, [compareFilteredTransactions]);

  interface CashFlowData {
    label: string;
    income: number;
    expense: number;
    balance: number;
    cumulative: number;
  }

  const cashFlowData = useMemo<CashFlowData[]>(() => {
    const cy = parseInt(startDate.split("-")[0], 10);
    const cm = parseInt(startDate.split("-")[1], 10);
    const data: CashFlowData[] = [];
    let cumulative = 0;

    for (let i = 11; i >= 0; i--) {
      const d = new Date(cy, cm - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const label = `${String(m).padStart(2, "0")}/${y}`;
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const endDate = new Date(y, m, 0);
      const end = `${y}-${String(m).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

      const monthTxs = transactions.filter((t) => t.date >= start && t.date <= end);
      const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      const balance = income - expense;
      cumulative += balance;

      data.push({ label, income, expense, balance, cumulative });
    }

    return data;
  }, [transactions, startDate, endDate]);

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
    link.download = `relatorio-${startDate}-a-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV exportado!");
  }

  function exportPDF() {
    const doc = new jsPDF();
    const year = parseInt(startDate.split("-")[0], 10);
    const month = parseInt(startDate.split("-")[1], 10);
    const monthLabel = `${String(month).padStart(2, "0")}/${year}`;

    // Título
    doc.setFontSize(18);
    doc.text("Relatório Cashflow", 14, 20);
    doc.setFontSize(12);
    doc.text(`Período: ${monthLabel}`, 14, 28);

    // Resumo
    doc.setFontSize(11);
    doc.setTextColor(34, 197, 94);
    doc.text(`Receitas: ${formatCurrency(totalIncome)}`, 14, 38);
    doc.setTextColor(239, 68, 68);
    doc.text(`Despesas: ${formatCurrency(totalExpense)}`, 80, 38);
    doc.setTextColor(0, 0, 0);
    doc.text(`Saldo: ${formatCurrency(totalIncome - totalExpense)}`, 146, 38);

    let startY = 48;

    if (activeTab === "categorias" && categoryReport.length > 0) {
      autoTable(doc, {
        startY,
        head: [["Categoria", "Transações", "Total"]],
        body: categoryReport.map((c) => [c.name, c.count.toString(), formatCurrency(c.total)]),
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });
      startY = (doc as any).lastAutoTable?.finalY || startY + 20;
    }

    if (activeTab === "contas" && accountReport.length > 0) {
      autoTable(doc, {
        startY,
        head: [["Conta", "Transações", "Receitas", "Despesas"]],
        body: accountReport.map((a) => [
          a.name,
          a.count.toString(),
          formatCurrency(a.income),
          formatCurrency(a.expense),
        ]),
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] },
      });
      startY = (doc as any).lastAutoTable?.finalY || startY + 20;
    }

    // Transações detalhadas
    if (filteredTransactions.length > 0) {
      autoTable(doc, {
        startY: startY + 4,
        head: [["Data", "Descrição", "Tipo", "Categoria", "Conta", "Valor"]],
        body: filteredTransactions.map((t) => [
          t.date,
          t.description,
          t.type === "income" ? "Receita" : "Despesa",
          t.category?.name || "",
          t.account?.name || "",
          formatCurrency(t.amount),
        ]),
        theme: "grid",
        headStyles: { fillColor: [75, 85, 99] },
        styles: { fontSize: 9 },
      });
    }

    doc.save(`relatorio-${startDate}-a-${endDate}.pdf`);
    toast.success("PDF exportado!");
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
          <h1 className="text-2xl font-bold text-mint-900 dark:text-mint-50">Relatórios</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-mint-500 dark:text-mint-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
              />
              <span className="text-sm text-mint-500 dark:text-mint-400">até</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
              />
            </div>
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-mint-300 dark:border-mint-600 px-4 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
            <button
              onClick={exportPDF}
              className="flex items-center gap-2 rounded-lg border border-red-300 dark:border-red-800 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/20"
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
            <p className="text-sm text-mint-500 dark:text-mint-400">Receitas</p>
            <p className="text-xl font-bold text-mint-brand-deep">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
            <p className="text-sm text-mint-500 dark:text-mint-400">Despesas</p>
            <p className="text-xl font-bold text-mint-error">{formatCurrency(totalExpense)}</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
            <p className="text-sm text-mint-500 dark:text-mint-400">Saldo</p>
            <p className={`text-xl font-bold ${totalIncome - totalExpense >= 0 ? "text-mint-brand" : "text-mint-error"}`}>
              {formatCurrency(totalIncome - totalExpense)}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-mint-200 dark:border-mint-800">
          <button
            onClick={() => setActiveTab("categorias")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "categorias"
                ? "border-blue-600 text-mint-brand"
                : "border-transparent text-mint-500 hover:text-mint-700 dark:text-mint-300 dark:hover:text-gray-100"
            }`}
          >
            <Tag className="h-4 w-4" />
            Por Categoria
          </button>
          <button
            onClick={() => setActiveTab("contas")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "contas"
                ? "border-blue-600 text-mint-brand"
                : "border-transparent text-mint-500 hover:text-mint-700 dark:text-mint-300 dark:hover:text-gray-100"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Por Conta
          </button>
          <button
            onClick={() => setActiveTab("comparativo")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "comparativo"
                ? "border-blue-600 text-mint-brand"
                : "border-transparent text-mint-500 hover:text-mint-700 dark:text-mint-300 dark:hover:text-gray-100"
            }`}
          >
            <GitCompare className="h-4 w-4" />
            Comparativo
          </button>
          <button
            onClick={() => setActiveTab("fluxo")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === "fluxo"
                ? "border-blue-600 text-mint-brand"
                : "border-transparent text-mint-500 hover:text-mint-700 dark:text-mint-300 dark:hover:text-gray-100"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Fluxo de Caixa
          </button>
        </div>

        {/* Conteúdo */}
        {activeTab === "categorias" && (
          <div className="rounded-2xl bg-white dark:bg-mint-800 shadow-mint">
            {categoryReport.length === 0 ? (
              <div className="p-8 text-center text-mint-400 dark:text-mint-500">
                <Tag className="mx-auto mb-3 h-10 w-10 text-mint-300 dark:text-gray-600" />
                <p>Nenhuma despesa no período selecionado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {categoryReport.map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                      <div>
                        <p className="font-medium text-mint-900 dark:text-mint-50">{cat.name}</p>
                        <p className="text-xs text-mint-500 dark:text-mint-400">{cat.count} transação{cat.count !== 1 ? "es" : ""}</p>
                      </div>
                    </div>
                    <p className="font-semibold text-mint-error">{formatCurrency(cat.total)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "contas" && (
          <div className="rounded-2xl bg-white dark:bg-mint-800 shadow-mint">
            {accountReport.length === 0 ? (
              <div className="p-8 text-center text-mint-400 dark:text-mint-500">
                <CreditCard className="mx-auto mb-3 h-10 w-10 text-mint-300 dark:text-gray-600" />
                <p>Nenhuma transação no período selecionado</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {accountReport.map((acc) => (
                  <div key={acc.name} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium text-mint-900 dark:text-mint-50">{acc.name}</p>
                      <p className="text-xs text-mint-500 dark:text-mint-400">{acc.count} transação{acc.count !== 1 ? "es" : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-mint-brand-deep">+{formatCurrency(acc.income)}</p>
                      <p className="text-sm font-semibold text-mint-error">-{formatCurrency(acc.expense)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {activeTab === "comparativo" && (
          <div className="space-y-6">
            {/* Seletor do mês de comparação */}
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-mint-500 dark:text-mint-400" />
              <span className="text-sm text-mint-600 dark:text-mint-300">Comparar com:</span>
              <input
                type="month"
                value={comparePeriod}
                onChange={(e) => setComparePeriod(e.target.value)}
                className="rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
              />
            </div>

            {/* Cards comparativos */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
                <p className="text-xs text-mint-500 dark:text-mint-400 mb-2">Receitas</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-mint-brand-deep">{formatCurrency(totalIncome)}</p>
                    <p className="text-xs text-gray-400">{startDate.slice(0, 7)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-mint-700 dark:text-mint-300">{formatCurrency(compareTotalIncome)}</p>
                    <p className="text-xs text-gray-400">{comparePeriod}</p>
                  </div>
                </div>
                <p className={`mt-2 text-xs font-medium ${compareTotalIncome > 0 ? ((totalIncome - compareTotalIncome) / compareTotalIncome >= 0 ? "text-mint-brand-deep" : "text-mint-error") : "text-gray-500"}`}>
                  {compareTotalIncome > 0 ? `${((totalIncome - compareTotalIncome) / compareTotalIncome * 100).toFixed(1)}%` : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
                <p className="text-xs text-mint-500 dark:text-mint-400 mb-2">Despesas</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-mint-error">{formatCurrency(totalExpense)}</p>
                    <p className="text-xs text-gray-400">{startDate.slice(0, 7)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-mint-700 dark:text-mint-300">{formatCurrency(compareTotalExpense)}</p>
                    <p className="text-xs text-gray-400">{comparePeriod}</p>
                  </div>
                </div>
                <p className={`mt-2 text-xs font-medium ${compareTotalExpense > 0 ? ((totalExpense - compareTotalExpense) / compareTotalExpense >= 0 ? "text-mint-error" : "text-mint-brand-deep") : "text-gray-500"}`}>
                  {compareTotalExpense > 0 ? `${((totalExpense - compareTotalExpense) / compareTotalExpense * 100).toFixed(1)}%` : "—"}
                </p>
              </div>
              <div className="rounded-2xl bg-white dark:bg-mint-800 p-5 shadow-mint">
                <p className="text-xs text-mint-500 dark:text-mint-400 mb-2">Saldo</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-lg font-bold text-mint-brand">{formatCurrency(totalIncome - totalExpense)}</p>
                    <p className="text-xs text-gray-400">{startDate.slice(0, 7)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-mint-700 dark:text-mint-300">{formatCurrency(compareTotalIncome - compareTotalExpense)}</p>
                    <p className="text-xs text-gray-400">{comparePeriod}</p>
                  </div>
                </div>
                <p className={`mt-2 text-xs font-medium ${(compareTotalIncome - compareTotalExpense) !== 0 ? ((totalIncome - totalExpense) - (compareTotalIncome - compareTotalExpense)) / (compareTotalIncome - compareTotalExpense) >= 0 ? "text-mint-brand-deep" : "text-mint-error" : "text-gray-500"}`}>
                  {(compareTotalIncome - compareTotalExpense) !== 0 ? `${(((totalIncome - totalExpense) - (compareTotalIncome - compareTotalExpense)) / (compareTotalIncome - compareTotalExpense) * 100).toFixed(1)}%` : "—"}
                </p>
              </div>
            </div>

            {/* Top categorias comparativo */}
            <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
              <h3 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Top categorias</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-medium text-mint-500 dark:text-mint-400">{startDate.slice(0, 7)}</p>
                  {categoryReport.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-mint-700 dark:text-mint-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-mint-error">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
                  {categoryReport.length === 0 && <p className="text-sm text-gray-400">Nenhuma despesa</p>}
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-mint-500 dark:text-mint-400">{comparePeriod}</p>
                  {compareCategoryReport.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-sm text-mint-700 dark:text-mint-300">{cat.name}</span>
                      </div>
                      <span className="text-sm font-medium text-mint-error">{formatCurrency(cat.total)}</span>
                    </div>
                  ))}
                  {compareCategoryReport.length === 0 && <p className="text-sm text-gray-400">Nenhuma despesa</p>}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === "fluxo" && (
          <div className="space-y-6">
            {/* Gráfico de fluxo de caixa */}
            <div className="rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
              <h3 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Saldo acumulado (últimos 12 meses)</h3>
              {cashFlowData.some((d) => d.income > 0 || d.expense > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={cashFlowData}>
                    <defs>
                      <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Area type="monotone" dataKey="cumulative" name="Saldo acumulado" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCumulative)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-mint-500 dark:text-mint-400 py-12">Nenhum dado disponível</p>
              )}
            </div>

            {/* Tabela de fluxo de caixa */}
            <div className="rounded-2xl bg-white dark:bg-mint-800 shadow-mint overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-mint-50 dark:bg-mint-800/50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-mint-500 dark:text-mint-400">Mês</th>
                      <th className="px-4 py-3 text-right font-medium text-mint-500 dark:text-mint-400">Receitas</th>
                      <th className="px-4 py-3 text-right font-medium text-mint-500 dark:text-mint-400">Despesas</th>
                      <th className="px-4 py-3 text-right font-medium text-mint-500 dark:text-mint-400">Saldo do mês</th>
                      <th className="px-4 py-3 text-right font-medium text-mint-500 dark:text-mint-400">Saldo acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {cashFlowData.map((row) => (
                      <tr key={row.label} className="hover:bg-mint-50 dark:hover:bg-mint-800/30">
                        <td className="px-4 py-3 font-medium text-mint-900 dark:text-mint-50">{row.label}</td>
                        <td className="px-4 py-3 text-right text-mint-brand-deep">{formatCurrency(row.income)}</td>
                        <td className="px-4 py-3 text-right text-mint-error">{formatCurrency(row.expense)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${row.balance >= 0 ? "text-mint-brand-deep" : "text-mint-error"}`}>{formatCurrency(row.balance)}</td>
                        <td className={`px-4 py-3 text-right font-medium ${row.cumulative >= 0 ? "text-mint-brand" : "text-mint-error"}`}>{formatCurrency(row.cumulative)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {cashFlowData.length === 0 && (
                <p className="p-8 text-center text-mint-400 dark:text-mint-500">Nenhum dado disponível</p>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
