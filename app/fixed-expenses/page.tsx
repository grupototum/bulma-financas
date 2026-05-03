"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Repeat,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
} from "lucide-react";

interface FixedExpense {
  id: string;
  description: string;
  amount: number;
  category_id: string | null;
  account_id: string | null;
  due_day: number;
  is_active: boolean;
  notes: string | null;
  category?: { name: string; color: string } | null;
  account?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Account {
  id: string;
  name: string;
}

interface MonthlyData {
  label: string;
  fixed: number;
  variable: number;
  income: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  is_fixed: boolean;
}

export default function FixedExpensesPage() {
  const [user, setUser] = useState<any>(null);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [catId, setCatId] = useState("");
  const [accId, setAccId] = useState("");
  const [dueDay, setDueDay] = useState("1");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const [{ data: cats }, { data: accs }, { data: txs }, { data: fixeds }] = await Promise.all([
        supabase.from("categories").select("id, name, color").eq("user_id", user.id).eq("is_active", true).order("name"),
        supabase.from("accounts").select("id, name").eq("user_id", user.id).eq("is_active", true).order("name"),
        supabase.from("transactions").select("id, amount, type, date, is_fixed").eq("user_id", user.id).order("date", { ascending: false }),
        supabase.from("fixed_expenses").select("*, category:categories(name, color), account:accounts(name)").eq("user_id", user.id).eq("is_active", true).order("due_day"),
      ]);

      if (cats) setCategories(cats);
      if (accs) setAccounts(accs);
      if (txs) setTransactions(txs);
      if (fixeds) setFixedExpenses(fixeds as FixedExpense[]);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const monthlyData = useMemo<MonthlyData[]>(() => {
    const [cy, cm] = period.split("-").map(Number);
    const data: MonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(cy, cm - 1 - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const label = `${String(m).padStart(2, "0")}/${y}`;
      const start = `${y}-${String(m).padStart(2, "0")}-01`;
      const endDate = new Date(y, m, 0);
      const end = `${y}-${String(m).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

      const monthTxs = transactions.filter((t) => t.date >= start && t.date <= end);
      const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const fixed = monthTxs.filter((t) => t.type === "expense" && t.is_fixed).reduce((s, t) => s + t.amount, 0);
      const variable = monthTxs.filter((t) => t.type === "expense" && !t.is_fixed).reduce((s, t) => s + t.amount, 0);

      data.push({ label, fixed, variable, income });
    }
    return data;
  }, [transactions, period]);

  const currentMonthData = useMemo(() => {
    const [cy, cm] = period.split("-").map(Number);
    const start = `${cy}-${String(cm).padStart(2, "0")}-01`;
    const endDate = new Date(cy, cm, 0);
    const end = `${cy}-${String(cm).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;
    const monthTxs = transactions.filter((t) => t.date >= start && t.date <= end);
    const income = monthTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const fixed = monthTxs.filter((t) => t.type === "expense" && t.is_fixed).reduce((s, t) => s + t.amount, 0);
    const variable = monthTxs.filter((t) => t.type === "expense" && !t.is_fixed).reduce((s, t) => s + t.amount, 0);
    return { income, fixed, variable };
  }, [transactions, period]);

  const insights = useMemo(() => {
    const { income, fixed, variable } = currentMonthData;
    const fixedPct = income > 0 ? (fixed / income) * 100 : 0;
    const variablePct = income > 0 ? (variable / income) * 100 : 0;
    const totalExpense = fixed + variable;
    const balance = income - totalExpense;
    const list: { text: string; type: "good" | "warning" | "danger" | "info" }[] = [];

    if (fixedPct > 50) {
      list.push({ text: `⚠️ Seus gastos fixos consomem ${fixedPct.toFixed(1)}% da renda. O ideal é até 50%.`, type: "warning" });
    } else if (fixedPct < 30) {
      list.push({ text: `✅ Ótimo! Gastos fixos em ${fixedPct.toFixed(1)}% — bem controlados.`, type: "good" });
    } else {
      list.push({ text: `📊 Gastos fixos em ${fixedPct.toFixed(1)}% — dentro da faixa saudável.`, type: "info" });
    }

    const projectedFixed = fixedExpenses.reduce((sum, fe) => sum + fe.amount, 0);
    list.push({ text: `🔮 Próximo mês: ~${formatCurrency(projectedFixed)} em gastos fixos já programados.`, type: "info" });

    if (variable > income * 0.3) {
      list.push({ text: `💡 Dica: gastos variáveis estão em ${variablePct.toFixed(1)}%. Tente manter abaixo de 30%.`, type: "warning" });
    }

    if (balance < 0) {
      list.push({ text: `🚨 Atenção: déficit de ${formatCurrency(Math.abs(balance))} este mês.`, type: "danger" });
    } else if (balance > 0) {
      list.push({ text: `💰 Sobrando ${formatCurrency(balance)} este mês.`, type: "good" });
    }

    return list;
  }, [currentMonthData, fixedExpenses]);

  const status = useMemo(() => {
    const fixedPct = currentMonthData.income > 0 ? (currentMonthData.fixed / currentMonthData.income) * 100 : 0;
    if (fixedPct > 50) return { label: "Crítico", color: "bg-mint-error text-white", icon: AlertTriangle };
    if (fixedPct > 40) return { label: "Atenção", color: "bg-mint-amber text-white", icon: AlertTriangle };
    return { label: "Saudável", color: "bg-mint-brand-deep text-white", icon: CheckCircle2 };
  }, [currentMonthData]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!desc || !amount) return;
    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_id: user.id,
      description: desc,
      amount: parseFloat(amount),
      category_id: catId || null,
      account_id: accId || null,
      due_day: parseInt(dueDay) || 1,
      notes: notes || null,
    };

    if (editingId) {
      const { error } = await supabase.from("fixed_expenses").update(payload).eq("id", editingId).eq("user_id", user.id);
      if (error) toast.error("Erro ao atualizar: " + error.message);
      else toast.success("Despesa fixa atualizada!");
    } else {
      const { error } = await supabase.from("fixed_expenses").insert(payload);
      if (error) toast.error("Erro ao salvar: " + error.message);
      else toast.success("Despesa fixa adicionada!");
    }

    setSaving(false);
    resetForm();
    const { data: fixeds } = await supabase.from("fixed_expenses").select("*, category:categories(name, color), account:accounts(name)").eq("user_id", user.id).eq("is_active", true).order("due_day");
    if (fixeds) setFixedExpenses(fixeds as FixedExpense[]);
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("fixed_expenses").delete().eq("id", id).eq("user_id", user.id);
    if (error) toast.error("Erro ao excluir: " + error.message);
    else {
      toast.success("Despesa fixa excluída!");
      setFixedExpenses((prev) => prev.filter((f) => f.id !== id));
    }
  }

  function startEdit(fe: FixedExpense) {
    setEditingId(fe.id);
    setDesc(fe.description);
    setAmount(fe.amount.toString());
    setCatId(fe.category_id || "");
    setAccId(fe.account_id || "");
    setDueDay(fe.due_day.toString());
    setNotes(fe.notes || "");
    setShowForm(true);
  }

  function resetForm() {
    setEditingId(null);
    setDesc("");
    setAmount("");
    setCatId("");
    setAccId("");
    setDueDay("1");
    setNotes("");
    setShowForm(false);
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  const StatusIcon = status.icon;

  return (
    <ProtectedLayout userEmail={user?.email}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-mint-900 dark:text-mint-50">Fixos vs Variáveis</h1>
            <p className="text-sm text-mint-500 dark:text-mint-400">Análise inteligente dos seus gastos</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-mint-500 dark:text-mint-400" />
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-925 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-full bg-mint-900 px-4 py-2 text-sm font-medium text-white hover:bg-mint-800 shadow-mint-button"
            >
              {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showForm ? "Cancelar" : "Nova despesa fixa"}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ${status.color}`}>
            <StatusIcon className="h-4 w-4" />
            {status.label}
          </span>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
            <p className="text-sm text-mint-500 dark:text-mint-400">Gastos Fixos</p>
            <p className="mt-1 text-2xl font-bold text-mint-900 dark:text-mint-50">{formatCurrency(currentMonthData.fixed)}</p>
            <p className="mt-1 text-xs text-mint-500">
              {currentMonthData.income > 0 ? ((currentMonthData.fixed / currentMonthData.income) * 100).toFixed(1) : 0}% da renda
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
            <p className="text-sm text-mint-500 dark:text-mint-400">Gastos Variáveis</p>
            <p className="mt-1 text-2xl font-bold text-mint-900 dark:text-mint-50">{formatCurrency(currentMonthData.variable)}</p>
            <p className="mt-1 text-xs text-mint-500">
              {currentMonthData.income > 0 ? ((currentMonthData.variable / currentMonthData.income) * 100).toFixed(1) : 0}% da renda
            </p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
            <p className="text-sm text-mint-500 dark:text-mint-400">Receita do Mês</p>
            <p className="mt-1 text-2xl font-bold text-mint-brand-deep">{formatCurrency(currentMonthData.income)}</p>
            <p className="mt-1 text-xs text-mint-500">Base de cálculo</p>
          </div>
          <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
            <p className="text-sm text-mint-500 dark:text-mint-400">Sobra/Déficit</p>
            <p className={`mt-1 text-2xl font-bold ${currentMonthData.income - currentMonthData.fixed - currentMonthData.variable >= 0 ? "text-mint-brand-deep" : "text-mint-error"}`}>
              {formatCurrency(currentMonthData.income - currentMonthData.fixed - currentMonthData.variable)}
            </p>
            <p className="mt-1 text-xs text-mint-500">Após todos os gastos</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
          <h2 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Evolução Fixo vs Variável</h2>
          {monthlyData.some((d) => d.fixed > 0 || d.variable > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="fixed" name="Fixo" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="variable" name="Variável" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-mint-500 dark:text-mint-400 py-12">Nenhum dado disponível</p>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-mint-brand" />
              <h2 className="text-lg font-semibold text-mint-900 dark:text-mint-50">Análise Inteligente</h2>
            </div>
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={`rounded-lg border p-3 text-sm ${
                    insight.type === "good"
                      ? "border-mint-brand-light bg-mint-brand-light/30 text-mint-brand-deep"
                      : insight.type === "warning"
                      ? "border-mint-amber-light bg-mint-amber-light/30 text-mint-amber"
                      : insight.type === "danger"
                      ? "border-mint-error-light bg-mint-error-light/30 text-mint-error"
                      : "border-mint-100 dark:border-mint-800 bg-mint-50 dark:bg-mint-900 text-mint-700 dark:text-mint-300"
                  }`}
                >
                  {insight.text}
                </div>
              ))}
            </div>
          </div>

          {showForm && (
            <div className="rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
              <h2 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">
                {editingId ? "Editar" : "Nova"} Despesa Fixa
              </h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Descrição</label>
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="mt-1 w-full rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Valor</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="mt-1 w-full rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Dia do vencimento</label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={dueDay}
                      onChange={(e) => setDueDay(e.target.value)}
                      className="mt-1 w-full rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Categoria</label>
                    <select
                      value={catId}
                      onChange={(e) => setCatId(e.target.value)}
                      className="mt-1 w-full rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                    >
                      <option value="">Selecione</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Conta</label>
                    <select
                      value={accId}
                      onChange={(e) => setAccId(e.target.value)}
                      className="mt-1 w-full rounded-full border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                    >
                      <option value="">Selecione</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Observações</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded-2xl border border-mint-200 dark:border-mint-700 dark:bg-mint-900 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 rounded-full bg-mint-900 px-4 py-2 text-sm font-medium text-white hover:bg-mint-800 disabled:opacity-50 shadow-mint-button"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-full border border-mint-200 dark:border-mint-700 px-4 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:hover:bg-mint-800"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl bg-white dark:bg-mint-925 p-6 shadow-mint dark:shadow-mint-dark border border-mint-100 dark:border-mint-800">
          <h2 className="mb-4 text-lg font-semibold text-mint-900 dark:text-mint-50">Despesas Fixas Cadastradas</h2>
          {fixedExpenses.length === 0 ? (
            <div className="py-8 text-center text-mint-400 dark:text-mint-500">
              <Repeat className="mx-auto mb-3 h-10 w-10 text-mint-300 dark:text-mint-700" />
              <p>Nenhuma despesa fixa cadastrada</p>
            </div>
          ) : (
            <div className="space-y-3">
              {fixedExpenses.map((fe) => (
                <div key={fe.id} className="flex items-center justify-between rounded-xl border border-mint-100 dark:border-mint-800 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mint-brand-light text-mint-brand-deep">
                      <Repeat className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-mint-900 dark:text-mint-100">{fe.description}</p>
                      <p className="text-xs text-mint-500 dark:text-mint-400">
                        Dia {fe.due_day} • {fe.category?.name || "Sem categoria"} • {fe.account?.name || "Sem conta"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold text-mint-900 dark:text-mint-50">{formatCurrency(fe.amount)}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(fe)}
                        className="rounded-md p-2 text-mint-500 hover:bg-mint-100 dark:hover:bg-mint-800"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(fe.id)}
                        className="rounded-md p-2 text-mint-error hover:bg-mint-error-light"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}
