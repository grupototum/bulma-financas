"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Calendar, Save, Wallet, AlertTriangle } from "lucide-react";

interface Category {
  id: string;
  name: string;
  color: string;
  budget_limit: number | null;
}

interface BudgetCategory {
  id?: string;
  category_id: string;
  planned_amount: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: "expense" | "income";
  date: string;
  category_id: string | null;
}

interface Budget {
  id: string;
  month: number;
  year: number;
  total_income: number;
  total_expense: number;
  savings_goal: number;
  notes: string | null;
}

export default function OrcamentosPage() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [budgetCategories, setBudgetCategories] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const router = useRouter();

  // Form geral
  const [totalIncome, setTotalIncome] = useState("");
  const [totalExpense, setTotalExpense] = useState("");
  const [savingsGoal, setSavingsGoal] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const [{ data: cats }, { data: txs }] = await Promise.all([
        supabase.from("categories").select("id, name, color, budget_limit").eq("user_id", user.id).eq("is_active", true).eq("type", "expense").order("name"),
        supabase.from("transactions").select("id, amount, type, date, category_id").eq("user_id", user.id).order("date", { ascending: false }),
      ]);

      if (cats) setCategories(cats);
      if (txs) setTransactions(txs);
      setLoading(false);
    }
    loadData();
  }, [router]);

  // Carregar orçamento do período selecionado
  useEffect(() => {
    if (!user) return;
    const [year, month] = period.split("-").map(Number);

    const supabase = createClient();
    async function loadBudget() {
      const { data: b } = await supabase
        .from("budgets")
        .select("id, month, year, total_income, total_expense, savings_goal, notes")
        .eq("user_id", user.id)
        .eq("month", month)
        .eq("year", year)
        .single();

      if (b) {
        setBudget(b);
        setTotalIncome(b.total_income?.toString() || "");
        setTotalExpense(b.total_expense?.toString() || "");
        setSavingsGoal(b.savings_goal?.toString() || "");
        setNotes(b.notes || "");

        const { data: bcs } = await supabase
          .from("budget_categories")
          .select("category_id, planned_amount")
          .eq("budget_id", b.id);

        const map: Record<string, number> = {};
        bcs?.forEach((bc) => { map[bc.category_id] = bc.planned_amount; });
        setBudgetCategories(map);
      } else {
        setBudget(null);
        setTotalIncome("");
        setTotalExpense("");
        setSavingsGoal("");
        setNotes("");
        setBudgetCategories({});
      }
    }
    loadBudget();
  }, [user, period]);

  const spentByCategory = useMemo(() => {
    const [year, month] = period.split("-").map(Number);
    const start = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0);
    const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

    const map: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense" && t.date >= start && t.date <= end)
      .forEach((t) => {
        if (t.category_id) {
          map[t.category_id] = (map[t.category_id] || 0) + t.amount;
        }
      });
    return map;
  }, [transactions, period]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const supabase = createClient();
    const [year, month] = period.split("-").map(Number);

    let budgetId: string;

    if (budget?.id) {
      budgetId = budget.id;
      const { error } = await supabase
        .from("budgets")
        .update({
          total_income: totalIncome ? parseFloat(totalIncome) : 0,
          total_expense: totalExpense ? parseFloat(totalExpense) : 0,
          savings_goal: savingsGoal ? parseFloat(savingsGoal) : 0,
          notes: notes || null,
        })
        .eq("id", budgetId);

      if (error) {
        toast.error("Erro ao atualizar orçamento: " + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { data: newBudget, error: createError } = await supabase
        .from("budgets")
        .insert({
          user_id: user.id,
          month,
          year,
          total_income: totalIncome ? parseFloat(totalIncome) : 0,
          total_expense: totalExpense ? parseFloat(totalExpense) : 0,
          savings_goal: savingsGoal ? parseFloat(savingsGoal) : 0,
          notes: notes || null,
        })
        .select("id")
        .single();

      if (createError || !newBudget) {
        toast.error("Erro ao criar orçamento: " + (createError?.message || "resposta vazia"));
        setSaving(false);
        return;
      }
      budgetId = newBudget.id!;
      setBudget({ id: budgetId, month, year, total_income: parseFloat(totalIncome || "0"), total_expense: parseFloat(totalExpense || "0"), savings_goal: parseFloat(savingsGoal || "0"), notes: notes || null });
    }

    // Salvar budget_categories
    const rows = Object.entries(budgetCategories)
      .filter(([_, amount]) => amount > 0)
      .map(([category_id, planned_amount]) => ({
        budget_id: budgetId,
        category_id,
        planned_amount,
      }));

    if (rows.length > 0) {
      // Deletar existentes e inserir novos (upsert simplificado)
      await supabase.from("budget_categories").delete().eq("budget_id", budgetId);
      const { error: bcError } = await supabase.from("budget_categories").insert(rows);
      if (bcError) {
        toast.error("Erro ao salvar categorias: " + bcError.message);
        setSaving(false);
        return;
      }
    }

    toast.success("Orçamento salvo!");
    setSaving(false);
  }

  function setCategoryPlan(catId: string, value: string) {
    setBudgetCategories((prev) => ({
      ...prev,
      [catId]: value ? parseFloat(value) : 0,
    }));
  }

  const plannedTotal = Object.values(budgetCategories).reduce((s, v) => s + v, 0);
  const spentTotal = Object.values(spentByCategory).reduce((s, v) => s + v, 0);

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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orçamento Mensal</h1>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="month"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Resumo geral */}
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Receita planejada</p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalIncome}
              onChange={(e) => setTotalIncome(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-lg font-bold text-green-600 focus:border-blue-500 focus:outline-none"
              placeholder="R$ 0,00"
            />
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Despesa planejada</p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={totalExpense}
              onChange={(e) => setTotalExpense(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-lg font-bold text-red-600 focus:border-blue-500 focus:outline-none"
              placeholder="R$ 0,00"
            />
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Meta de economia</p>
            <input
              type="number"
              step="0.01"
              min="0"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 text-lg font-bold text-blue-600 focus:border-blue-500 focus:outline-none"
              placeholder="R$ 0,00"
            />
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
            <p className="text-sm text-gray-500 dark:text-gray-400">Economia estimada</p>
            <p className={`text-lg font-bold ${(parseFloat(totalIncome || "0") - parseFloat(totalExpense || "0") - parseFloat(savingsGoal || "0")) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(parseFloat(totalIncome || "0") - parseFloat(totalExpense || "0") - parseFloat(savingsGoal || "0"))}
            </p>
          </div>
        </div>

        {/* Orçamento por categoria */}
        <div className="mb-6 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-gray-900/20">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Por Categoria</h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Planejado: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(plannedTotal)}</span>
              {" "}•{" "}
              Gasto: <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(spentTotal)}</span>
            </div>
          </div>

          {categories.length === 0 ? (
            <div className="py-8 text-center text-gray-400 dark:text-gray-500">
              <Wallet className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p>Nenhuma categoria de despesa cadastrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => {
                const planned = budgetCategories[cat.id] || 0;
                const spent = spentByCategory[cat.id] || 0;
                const pct = planned > 0 ? Math.min(100, Math.round((spent / planned) * 100)) : 0;
                const overBudget = planned > 0 && spent > planned;
                const warnBudget = planned > 0 && spent >= planned * 0.8 && spent <= planned;

                return (
                  <div key={cat.id} className={`rounded-lg border p-4 ${warnBudget || overBudget ? "border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-900/10" : "border-gray-100 dark:border-gray-800"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="font-medium text-gray-900 dark:text-gray-100">{cat.name}</span>
                        {overBudget && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        {warnBudget && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Planejado</p>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={planned || ""}
                            onChange={(e) => setCategoryPlan(cat.id, e.target.value)}
                            className="w-24 rounded border border-gray-300 dark:border-gray-600 px-2 py-1 text-right text-sm focus:border-blue-500 focus:outline-none"
                            placeholder="0"
                          />
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 dark:text-gray-400">Gasto</p>
                          <p className={`text-sm font-semibold ${overBudget ? "text-red-600" : warnBudget ? "text-yellow-600" : "text-gray-700 dark:text-gray-300"}`}>
                            {formatCurrency(spent)}
                          </p>
                        </div>
                      </div>
                    </div>
                    {planned > 0 && (
                      <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: overBudget ? "#EF4444" : warnBudget ? "#F59E0B" : cat.color,
                            }}
                          />
                        </div>
                        <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">
                          {pct}% {overBudget ? "(ultrapassado)" : warnBudget ? "(quase no limite)" : "utilizado"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Notas e salvar */}
        <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-gray-900/20">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none"
              placeholder="Notas sobre o orçamento deste mês..."
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Salvando..." : budget ? "Atualizar Orçamento" : "Criar Orçamento"}
          </button>
        </div>
      </div>
    </ProtectedLayout>
  );
}
