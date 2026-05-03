"use client";

import { createClient } from "@/lib/supabase-browser";
import { autoCategorize } from "@/lib/auto-categorization";
import { formatCurrency } from "@/lib/format";
import { transactionSchema } from "@/lib/schemas";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Wand2,
  Pencil,
  Search,
  ArrowUpDown,
  Filter,
  X,
  Repeat,
  Upload,
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  date: string;
  category_id: string | null;
  account_id: string | null;
  is_fixed: boolean;
  is_recurring: boolean;
  recurring_interval: string | null;
  category?: { name: string; color: string } | null;
  account?: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  color: string;
  type: string;
}

interface Account {
  id: string;
  name: string;
}

type SortBy = "date" | "amount" | "description";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Form state
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [saving, setSaving] = useState(false);
  const [autoCatSuggestion, setAutoCatSuggestion] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterType, setFilterType] = useState<"" | "expense" | "income">("");
  const [filterMonth, setFilterMonth] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    id: string;
  }>({ open: false, id: "" });

  // Import CSV
  const [showImport, setShowImport] = useState(false);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [csvSeparator, setCsvSeparator] = useState(";");
  const [colDate, setColDate] = useState(0);
  const [colDescription, setColDescription] = useState(1);
  const [colAmount, setColAmount] = useState(2);
  const [colType, setColType] = useState(-1);
  const [importAccountId, setImportAccountId] = useState("");
  const [importing, setImporting] = useState(false);

  // Auto-categorização
  useEffect(() => {
    if (!description || categories.length === 0) {
      setAutoCatSuggestion(null);
      return;
    }
    const categoryMap = new Map<string, string>();
    categories.forEach((c) => categoryMap.set(c.name, c.id));
    const result = autoCategorize(description, categoryMap);
    if (result) {
      setAutoCatSuggestion(result.categoryName);
      if (!categoryId && !editingId) {
        setCategoryId(result.categoryId);
      }
    } else {
      setAutoCatSuggestion(null);
    }
  }, [description, categories]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const [{ data: cats }, { data: accs }, { data: txs }] = await Promise.all([
        supabase.from("categories").select("id, name, color, type").eq("user_id", user.id).eq("is_active", true).order("sort_order"),
        supabase.from("accounts").select("id, name").eq("user_id", user.id).eq("is_active", true),
        supabase.from("transactions").select("*, category:categories(name, color), account:accounts(name)").eq("user_id", user.id).order("date", { ascending: false }).limit(100),
      ]);

      if (cats) setCategories(cats);
      if (accs) setAccounts(accs);
      if (txs) setTransactions(txs as Transaction[]);
      setLoading(false);
    }
    loadData();
  }, [router]);

  function resetForm() {
    setDescription("");
    setAmount("");
    setType("expense");
    setCategoryId("");
    setAccountId("");
    setDate(new Date().toISOString().split("T")[0]);
    setIsRecurring(false);
    setRecurringInterval("monthly");
    setAutoCatSuggestion(null);
    setFormErrors({});
    setEditingId(null);
  }

  function startEdit(tx: Transaction) {
    setEditingId(tx.id);
    setDescription(tx.description);
    setAmount(tx.amount.toString());
    setType(tx.type as "expense" | "income");
    setCategoryId(tx.category_id || "");
    setAccountId(tx.account_id || "");
    setDate(tx.date);
    setIsRecurring(tx.is_recurring);
    setRecurringInterval((tx.recurring_interval as any) || "monthly");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const result = transactionSchema.safeParse({
      description,
      amount: parseFloat(amount),
      type,
      category_id: categoryId || undefined,
      account_id: accountId || undefined,
      date,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    let finalCategoryId = categoryId;
    let finalIsFixed = false;
    if (!finalCategoryId && categories.length > 0 && !editingId) {
      const categoryMap = new Map<string, string>();
      categories.forEach((c) => categoryMap.set(c.name, c.id));
      const autoResult = autoCategorize(description, categoryMap);
      if (autoResult) {
        finalCategoryId = autoResult.categoryId;
        finalIsFixed = autoResult.isFixed;
      }
    }

    const payload = {
      user_id: user.id,
      description,
      amount: parseFloat(amount),
      type,
      category_id: finalCategoryId || null,
      account_id: accountId || null,
      date,
      is_fixed: finalIsFixed,
      is_recurring: isRecurring,
      recurring_interval: isRecurring ? recurringInterval : null,
    };

    if (editingId) {
      const { error } = await supabase.from("transactions").update(payload).eq("id", editingId).eq("user_id", user.id);
      if (error) {
        toast.error("Erro ao atualizar transação: " + error.message);
      } else {
        toast.success("Transação atualizada!");
        resetForm();
        setShowForm(false);
      }
    } else {
      const { error } = await supabase.from("transactions").insert(payload);
      if (error) {
        toast.error("Erro ao salvar transação: " + error.message);
      } else {
        toast.success("Transação adicionada!");
        resetForm();
        setShowForm(false);
      }
    }

    // Recarregar
    const { data: txs } = await supabase
      .from("transactions")
      .select("*, category:categories(name, color), account:accounts(name)")
      .eq("user_id", user.id)
      .order("date", { ascending: false })
      .limit(100);
    if (txs) setTransactions(txs as Transaction[]);
    setSaving(false);
  }

  function getNextDate(currentDate: string, interval: string): string {
    const d = new Date(currentDate);
    switch (interval) {
      case "daily": d.setDate(d.getDate() + 1); break;
      case "weekly": d.setDate(d.getDate() + 7); break;
      case "monthly": d.setMonth(d.getMonth() + 1); break;
      case "yearly": d.setFullYear(d.getFullYear() + 1); break;
    }
    return d.toISOString().split("T")[0];
  }

  function parseCSV(text: string): string[][] {
    const lines = text.trim().split(/\r?\n/);
    return lines.map((line) => line.split(csvSeparator));
  }

  function detectSeparator(text: string): string {
    const firstLine = text.split(/\r?\n/)[0] || "";
    const semicolons = (firstLine.match(/;/g) || []).length;
    const commas = (firstLine.match(/,/g) || []).length;
    return semicolons >= commas ? ";" : ",";
  }

  function parseDate(value: string): string {
    // Tenta formatos comuns: DD/MM/YYYY, YYYY-MM-DD, DD-MM-YYYY
    const trimmed = value.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parts = trimmed.split(/[\/\-]/);
    if (parts.length === 3) {
      const [d1, d2, d3] = parts.map((p) => parseInt(p, 10));
      if (d1 > 31) return `${d1}-${String(d2).padStart(2, "0")}-${String(d3).padStart(2, "0")}`;
      return `${d3}-${String(d2).padStart(2, "0")}-${String(d1).padStart(2, "0")}`;
    }
    return trimmed;
  }

  function parseAmount(value: string): number {
    const cleaned = value.replace(/R\$\s?/g, "").replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned) || 0;
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const sep = detectSeparator(text);
      setCsvSeparator(sep);
      const rows = parseCSV(text);
      setCsvPreview(rows.slice(0, 6));
      // Tenta detectar colunas automaticamente
      if (rows.length > 0) {
        const header = rows[0].map((h) => h.toLowerCase().trim());
        header.forEach((h, idx) => {
          if (h.includes("data") || h.includes("date")) setColDate(idx);
          if (h.includes("desc") || h.includes("hist") || h.includes("identif")) setColDescription(idx);
          if (h.includes("valor") || h.includes("amount") || h.includes("credit") || h.includes("debit")) setColAmount(idx);
          if (h.includes("tipo") || h.includes("type")) setColType(idx);
        });
      }
    };
    reader.readAsText(file);
  }

  async function handleImport() {
    if (csvPreview.length < 2) { toast.error("CSV vazio ou inválido"); return; }
    setImporting(true);
    const supabase = createClient();
    const rows = csvPreview.length > 6 ? csvPreview : parseCSV((document.getElementById("csv-text") as HTMLTextAreaElement)?.value || "");
    const dataRows = rows.slice(1);
    const toInsert = [];

    for (const row of dataRows) {
      if (row.length < 3) continue;
      const dateVal = parseDate(row[colDate] || "");
      const descVal = (row[colDescription] || "").trim();
      const amountVal = parseAmount(row[colAmount] || "0");
      if (!dateVal || !descVal || amountVal === 0) continue;

      let typeVal: "expense" | "income" = "expense";
      if (colType >= 0 && row[colType]) {
        const t = row[colType].toLowerCase();
        if (t.includes("receita") || t.includes("credito") || t.includes("credit") || t.includes("entrada")) typeVal = "income";
      } else if (amountVal < 0) {
        typeVal = "income";
      }

      // Auto-categorizar importação
      const categoryMap = new Map<string, string>();
      categories.forEach((c) => categoryMap.set(c.name, c.id));
      const autoResult = autoCategorize(descVal, categoryMap);

      toInsert.push({
        user_id: user.id,
        description: descVal,
        amount: Math.abs(amountVal),
        type: typeVal,
        date: dateVal,
        account_id: importAccountId || null,
        category_id: autoResult?.categoryId || null,
        is_fixed: autoResult?.isFixed || false,
      });
    }

    if (toInsert.length === 0) { toast.error("Nenhuma transação válida encontrada"); setImporting(false); return; }

    const { error } = await supabase.from("transactions").insert(toInsert);
    if (error) {
      toast.error("Erro ao importar: " + error.message);
    } else {
      toast.success(`${toInsert.length} transações importadas!`);
      setShowImport(false);
      setCsvPreview([]);
      // Recarregar
      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color), account:accounts(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(100);
      if (txs) setTransactions(txs as Transaction[]);
    }
    setImporting(false);
  }

  async function generateNextOccurrence(tx: Transaction) {
    if (!tx.is_recurring || !tx.recurring_interval) return;
    const nextDate = getNextDate(tx.date, tx.recurring_interval);
    const supabase = createClient();
    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      category_id: tx.category_id,
      account_id: tx.account_id,
      date: nextDate,
      is_fixed: tx.is_fixed || false,
      is_recurring: false,
      recurring_interval: null,
    });
    if (error) {
      toast.error("Erro ao gerar ocorrência: " + error.message);
    } else {
      toast.success("Próxima ocorrência gerada!");
      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color), account:accounts(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(100);
      if (txs) setTransactions(txs as Transaction[]);
    }
  }

  async function deleteTransaction(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
    if (error) {
      toast.error("Erro ao excluir: " + error.message);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    toast.success("Transação excluída!");
  }

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((t) => t.description.toLowerCase().includes(q));
    }
    if (filterCategory) {
      list = list.filter((t) => t.category_id === filterCategory);
    }
    if (filterType) {
      list = list.filter((t) => t.type === filterType);
    }
    if (filterMonth) {
      list = list.filter((t) => t.date.startsWith(filterMonth));
    }

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "date") cmp = a.date.localeCompare(b.date);
      else if (sortBy === "amount") cmp = a.amount - b.amount;
      else if (sortBy === "description") cmp = a.description.localeCompare(b.description);
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return list;
  }, [transactions, searchQuery, filterCategory, filterType, filterMonth, sortBy, sortOrder]);

  function toggleSort(field: SortBy) {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
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
          <h1 className="text-2xl font-bold text-mint-900 dark:text-mint-50">Transações</h1>
          <div className="flex gap-3">
            <button
              onClick={() => {
                resetForm();
                setShowImport(false);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 rounded-full bg-mint-900 px-4 py-2 text-sm font-medium text-white hover:bg-mint-800"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancelar" : editingId ? "Editando..." : "Nova Transação"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setShowImport(!showImport);
              }}
              className="flex items-center gap-2 rounded-lg border border-mint-300 dark:border-mint-600 px-4 py-2 text-sm font-medium text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
            >
              <Upload className="h-4 w-4" />
              {showImport ? "Cancelar" : "Importar CSV"}
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Editar Transação" : "Nova Transação"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                  placeholder="Ex: IFOOD, Netflix, Combustível..."
                />
                {formErrors.description && <p className="mt-1 text-xs text-mint-error">{formErrors.description}</p>}
                {autoCatSuggestion && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-mint-brand">
                    <Wand2 className="h-3 w-3" />
                    Categoria sugerida: <span className="font-medium">{autoCatSuggestion}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                />
                {formErrors.amount && <p className="mt-1 text-xs text-mint-error">{formErrors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "expense" | "income")}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Categoria</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Conta</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                />
                {formErrors.date && <p className="mt-1 text-xs text-mint-error">{formErrors.date}</p>}
              </div>
              <div className="flex items-center gap-3 sm:col-span-2 lg:col-span-3">
                <label className="flex items-center gap-2 text-sm text-mint-700 dark:text-mint-300">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="h-4 w-4 rounded border-mint-300 dark:border-mint-600 text-mint-brand focus:ring-mint-brand"
                  />
                  Transação recorrente
                </label>
                {isRecurring && (
                  <select
                    value={recurringInterval}
                    onChange={(e) => setRecurringInterval(e.target.value as any)}
                    className="rounded-lg border border-mint-300 dark:border-mint-600 px-3 py-1.5 text-sm focus:border-mint-brand focus:outline-none"
                  >
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-mint-900 px-4 py-2 font-medium text-white hover:bg-mint-800 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar Transação"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { resetForm(); setShowForm(false); }}
                    className="rounded-lg border border-mint-300 dark:border-mint-600 px-4 py-2 text-sm text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Import CSV */}
        {showImport && (
          <div className="mb-8 rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Importar Extrato CSV</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Arquivo CSV</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="mt-1 block w-full text-sm text-mint-500 dark:text-mint-400 file:mr-4 file:rounded-full file:border-0 file:bg-mint-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700"
                />
              </div>

              {csvPreview.length > 0 && (
                <>
                  <div className="overflow-x-auto rounded-lg border border-mint-200 dark:border-mint-800">
                    <table className="min-w-full text-sm">
                      <thead className="bg-mint-50 dark:bg-mint-950">
                        <tr>
                          {csvPreview[0].map((cell, i) => (
                            <th key={i} className="px-3 py-2 text-left text-xs font-medium text-mint-500 dark:text-mint-400">{cell}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {csvPreview.slice(1).map((row, ri) => (
                          <tr key={ri}>
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-2 text-mint-700 dark:text-mint-300">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                      <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Coluna Data</label>
                      <input type="number" min={0} value={colDate} onChange={(e) => setColDate(parseInt(e.target.value))} className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Coluna Descrição</label>
                      <input type="number" min={0} value={colDescription} onChange={(e) => setColDescription(parseInt(e.target.value))} className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Coluna Valor</label>
                      <input type="number" min={0} value={colAmount} onChange={(e) => setColAmount(parseInt(e.target.value))} className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Coluna Tipo (-1 = auto)</label>
                      <input type="number" min={-1} value={colType} onChange={(e) => setColType(parseInt(e.target.value))} className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">Conta padrão</label>
                    <select
                      value={importAccountId}
                      onChange={(e) => setImportAccountId(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                    >
                      <option value="">Nenhuma</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleImport}
                      disabled={importing}
                      className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {importing ? "Importando..." : "Importar Transações"}
                    </button>
                    <button
                      onClick={() => { setShowImport(false); setCsvPreview([]); }}
                      className="rounded-lg border border-mint-300 dark:border-mint-600 px-4 py-2 text-sm text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-400 dark:text-mint-500" />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 py-2 pl-10 pr-4 focus:border-mint-brand focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                showFilters ? "border-blue-500 bg-mint-brand-light text-mint-brand-deep" : "border-mint-300 dark:border-mint-600 text-mint-700 dark:text-mint-300 hover:bg-mint-100 dark:bg-mint-925"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="rounded-2xl bg-white dark:bg-mint-800 p-4 shadow-mint">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Categoria</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                  >
                    <option value="">Todas</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Tipo</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                  >
                    <option value="">Todos</option>
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-mint-500 dark:text-mint-400">Mês</label>
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 text-sm focus:border-mint-brand focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { setFilterCategory(""); setFilterType(""); setFilterMonth(""); setSearchQuery(""); }}
                  className="flex items-center gap-1 rounded-lg border border-mint-300 dark:border-mint-600 px-3 py-1.5 text-xs text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-mint-800 dark:bg-mint-950"
                >
                  <X className="h-3 w-3" /> Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort & Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-mint-500 dark:text-mint-400">
            {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? "es" : ""}
          </p>
          <div className="flex gap-2">
            {(["date", "amount", "description"] as SortBy[]).map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  sortBy === field
                    ? "border-blue-500 bg-mint-brand-light text-mint-brand-deep"
                    : "border-mint-300 dark:border-mint-600 text-mint-600 dark:text-mint-400 hover:bg-mint-50 dark:hover:bg-mint-800 dark:bg-mint-950"
                }`}
              >
                <ArrowUpDown className="h-3 w-3" />
                {field === "date" ? "Data" : field === "amount" ? "Valor" : "Descrição"}
                {sortBy === field && (sortOrder === "asc" ? " ↑" : " ↓")}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="rounded-2xl bg-white dark:bg-mint-800 shadow-mint">
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-mint-400 dark:text-mint-500">
                {transactions.length === 0 ? "Nenhuma transação ainda" : "Nenhuma transação encontrada com os filtros atuais"}
              </div>
            ) : (
              filteredTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-mint-50 dark:hover:bg-mint-800 dark:bg-mint-950">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${t.type === "income" ? "bg-mint-brand-light dark:bg-mint-brand-deep/30 text-mint-brand-deep" : "bg-mint-error-light dark:bg-mint-error/30 text-mint-error"}`}>
                      {t.type === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-mint-900 dark:text-mint-50">{t.description}</p>
                      <p className="text-xs text-mint-500 dark:text-mint-400">
                        {t.category?.name || "Sem categoria"} {t.account?.name ? `• ${t.account.name}` : ""} • {new Date(t.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-semibold ${t.type === "income" ? "text-mint-brand-deep" : "text-mint-error"}`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </p>
                    {t.is_recurring && (
                      <button
                        onClick={() => generateNextOccurrence(t)}
                        title="Gerar próxima ocorrência"
                        className="rounded p-1 text-purple-400 hover:bg-mint-soft-blue-light hover:text-mint-soft-blue"
                      >
                        <Repeat className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => startEdit(t)}
                      className="rounded p-1 text-mint-400 dark:text-mint-500 hover:bg-blue-100 dark:bg-mint-brand-deep/30 hover:text-mint-brand"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmModal({ open: true, id: t.id })}
                      className="rounded p-1 text-mint-400 dark:text-mint-500 hover:bg-mint-error-light dark:bg-mint-error/30 hover:text-mint-error"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Excluir transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        onConfirm={() => {
          deleteTransaction(confirmModal.id);
          setConfirmModal({ open: false, id: "" });
        }}
        onCancel={() => setConfirmModal({ open: false, id: "" })}
        confirmText="Excluir"
        variant="danger"
      />
    </ProtectedLayout>
  );
}
