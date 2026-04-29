"use client";

import { createClient } from "@/lib/supabase-browser";
import { autoCategorize } from "@/lib/auto-categorization";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, TrendingUp, TrendingDown, Wand2 } from "lucide-react";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "expense" | "income" | "transfer";
  date: string;
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

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  // Auto-categorização quando digita descrição
  useEffect(() => {
    if (!description || categories.length === 0) {
      setAutoCatSuggestion(null);
      return;
    }
    const categoryMap = new Map<string, string>();
    categories.forEach(c => categoryMap.set(c.name, c.id));
    const result = autoCategorize(description, categoryMap);
    if (result) {
      setAutoCatSuggestion(result.categoryName);
      // Se categoria ainda não foi selecionada manualmente, auto-seleciona
      if (!categoryId) {
        setCategoryId(result.categoryId);
      }
    } else {
      setAutoCatSuggestion(null);
    }
  }, [description, categories]);

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      // Buscar categorias
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, color, type")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("sort_order");
      if (cats) setCategories(cats);

      // Buscar contas
      const { data: accs } = await supabase
        .from("accounts")
        .select("id, name")
        .eq("user_id", user.id)
        .eq("is_active", true);
      if (accs) setAccounts(accs);

      // Buscar transações
      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color), account:accounts(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(100);
      if (txs) setTransactions(txs as Transaction[]);

      setLoading(false);
    }

    loadData();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !description) return;

    setSaving(true);
    const supabase = createClient();

    // Auto-categorizar se não selecionou categoria
    let finalCategoryId = categoryId;
    if (!finalCategoryId && categories.length > 0) {
      const categoryMap = new Map<string, string>();
      categories.forEach(c => categoryMap.set(c.name, c.id));
      const result = autoCategorize(description, categoryMap);
      if (result) {
        finalCategoryId = result.categoryId;
      }
    }

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      description,
      amount: parseFloat(amount),
      type,
      category_id: finalCategoryId || null,
      account_id: accountId || null,
      date,
    });

    if (!error) {
      setDescription("");
      setAmount("");
      setCategoryId("");
      setAccountId("");
      setShowForm(false);
      // Recarregar
      const { data: txs } = await supabase
        .from("transactions")
        .select("*, category:categories(name, color), account:accounts(name)")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(100);
      if (txs) setTransactions(txs as Transaction[]);
    }

    setSaving(false);
  }

  async function deleteTransaction(id: string) {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const supabase = createClient();
    await supabase.from("transactions").delete().eq("id", id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
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
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Transações</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancelar" : "Nova"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Nova Transação</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Descrição</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  required
                  placeholder="Ex: IFOOD, Netflix, Combustível..."
                />
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
                  required
                />
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
                  required
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  {saving ? "Salvando..." : "Salvar Transação"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="divide-y divide-gray-100">
            {transactions.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Nenhuma transação ainda
              </div>
            ) : (
              transactions.map((t) => (
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
                      {t.type === "income" ? "+" : "-"}R$ {t.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <button
                      onClick={() => deleteTransaction(t.id)}
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
      </main>
    </div>
  );
}
