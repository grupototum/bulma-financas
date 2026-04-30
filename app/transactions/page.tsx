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
} from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  date: string;
  category_id: string | null;
  account_id: string | null;
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
    if (!finalCategoryId && categories.length > 0 && !editingId) {
      const categoryMap = new Map<string, string>();
      categories.forEach((c) => categoryMap.set(c.name, c.id));
      const autoResult = autoCategorize(description, categoryMap);
      if (autoResult) finalCategoryId = autoResult.categoryId;
    }

    const payload = {
      user_id: user.id,
      description,
      amount: parseFloat(amount),
      type,
      category_id: finalCategoryId || null,
      account_id: accountId || null,
      date,
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
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancelar" : editingId ? "Editando..." : "Nova Transação"}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">
              {editingId ? "Editar Transação" : "Nova Transação"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Ex: IFOOD, Netflix, Combustível..."
                />
                {formErrors.description && <p className="mt-1 text-xs text-red-600">{formErrors.description}</p>}
                {autoCatSuggestion && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-blue-600">
                    <Wand2 className="h-3 w-3" />
                    Categoria sugerida: <span className="font-medium">{autoCatSuggestion}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                {formErrors.amount && <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as "expense" | "income")}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoria</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Conta</label>
                <select
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Selecione...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                {formErrors.date && <p className="mt-1 text-xs text-red-600">{formErrors.date}</p>}
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar Transação"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => { resetForm(); setShowForm(false); }}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Search & Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por descrição..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium ${
                showFilters ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Filter className="h-4 w-4" />
              Filtros
            </button>
          </div>

          {showFilters && (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500">Categoria</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Todas</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Tipo</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Todos</option>
                    <option value="expense">Despesa</option>
                    <option value="income">Receita</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500">Mês</label>
                  <input
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => { setFilterCategory(""); setFilterType(""); setFilterMonth(""); setSearchQuery(""); }}
                  className="flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <X className="h-3 w-3" /> Limpar filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort & Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {filteredTransactions.length} transação{filteredTransactions.length !== 1 ? "es" : ""}
          </p>
          <div className="flex gap-2">
            {(["date", "amount", "description"] as SortBy[]).map((field) => (
              <button
                key={field}
                onClick={() => toggleSort(field)}
                className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium ${
                  sortBy === field
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-300 text-gray-600 hover:bg-gray-50"
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
        <div className="rounded-xl bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {transactions.length === 0 ? "Nenhuma transação ainda" : "Nenhuma transação encontrada com os filtros atuais"}
              </div>
            ) : (
              filteredTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${t.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                      {t.type === "income" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.description}</p>
                      <p className="text-xs text-gray-500">
                        {t.category?.name || "Sem categoria"} {t.account?.name ? `• ${t.account.name}` : ""} • {new Date(t.date).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                    </p>
                    <button
                      onClick={() => startEdit(t)}
                      className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setConfirmModal({ open: true, id: t.id })}
                      className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
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
