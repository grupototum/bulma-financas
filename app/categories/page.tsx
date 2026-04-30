"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { categorySchema } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, LogOut } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  budget_limit: number | null;
  type: string;
  is_active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💰");
  const [color, setColor] = useState("#3B82F6");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [type, setType] = useState<"expense" | "income" | "both">("expense");
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const colorOptions = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ];

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);

      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, icon, color, budget_limit, type, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("sort_order");

      if (cats) setCategories(cats);
      setLoading(false);
    }

    loadData();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrors({});

    const result = categorySchema.safeParse({
      name,
      icon,
      color,
      budget_limit: budgetLimit ? parseFloat(budgetLimit) : undefined,
      type,
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { error } = await supabase.from("categories").insert({
      user_id: user.id,
      name,
      icon,
      color,
      budget_limit: budgetLimit ? parseFloat(budgetLimit) : null,
      type,
    });

    if (!error) {
      setName("");
      setBudgetLimit("");
      setShowForm(false);
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, icon, color, budget_limit, type, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("sort_order");
      if (cats) setCategories(cats);
    } else {
      alert("Erro ao salvar categoria: " + error.message);
    }

    setSaving(false);
  }

  async function deleteCategory(id: string) {
    if (
      !confirm(
        "Tem certeza? Todas as transações desta categoria ficarão sem categoria."
      )
    )
      return;
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) {
      alert("Erro ao excluir categoria: " + error.message);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    } finally {
      router.push("/");
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Categorias</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancelar" : "Nova"}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Nova Categoria</h2>
            <form
              onSubmit={handleSubmit}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.name}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ícone
                </label>
                <input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                  maxLength={2}
                />
                {formErrors.icon && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.icon}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Orçamento (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                />
                {formErrors.budget_limit && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.budget_limit}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo
                </label>
                <select
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as "expense" | "income" | "both")
                  }
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                >
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="both">Ambos</option>
                </select>
                {formErrors.type && (
                  <p className="mt-1 text-xs text-red-600">{formErrors.type}</p>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700">
                  Cor
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-8 w-8 rounded-full border-2 ${
                        color === c ? "border-gray-900" : "border-transparent"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                {formErrors.color && (
                  <p className="mt-1 text-xs text-red-600">
                    {formErrors.color}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50 sm:w-auto"
                >
                  {saving ? "Salvando..." : "Salvar Categoria"}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">
              Nenhuma categoria ainda
            </div>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
                      style={{
                        backgroundColor: c.color + "20",
                        color: c.color,
                      }}
                    >
                      {c.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-xs capitalize text-gray-500">
                        {c.type === "expense"
                          ? "Despesa"
                          : c.type === "income"
                            ? "Receita"
                            : "Ambos"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCategory(c.id)}
                    className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {c.budget_limit && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Orçamento</span>
                      <span className="font-medium">
                        {formatCurrency(c.budget_limit)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
