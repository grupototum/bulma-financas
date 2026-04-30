"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { categorySchema } from "@/lib/schemas";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Pencil } from "lucide-react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💰");
  const [color, setColor] = useState("#3B82F6");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [type, setType] = useState<"expense" | "income" | "both">("expense");
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

  const colorOptions = [
    "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
    "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
  ];

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
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

  function resetForm() {
    setName("");
    setIcon("💰");
    setColor("#3B82F6");
    setBudgetLimit("");
    setType("expense");
    setFormErrors({});
    setEditingId(null);
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setBudgetLimit(cat.budget_limit ? cat.budget_limit.toString() : "");
    setType(cat.type as "expense" | "income" | "both");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
        errors[issue.path[0] as string] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_id: user.id,
      name,
      icon,
      color,
      budget_limit: budgetLimit ? parseFloat(budgetLimit) : null,
      type,
    };

    if (editingId) {
      const { error } = await supabase.from("categories").update(payload).eq("id", editingId).eq("user_id", user.id);
      if (error) {
        toast.error("Erro ao atualizar categoria: " + error.message);
      } else {
        toast.success("Categoria atualizada!");
        resetForm();
        setShowForm(false);
      }
    } else {
      const { error } = await supabase.from("categories").insert(payload);
      if (error) {
        toast.error("Erro ao salvar categoria: " + error.message);
      } else {
        toast.success("Categoria adicionada!");
        resetForm();
        setShowForm(false);
      }
    }

    const { data: cats } = await supabase
      .from("categories")
      .select("id, name, icon, color, budget_limit, type, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("sort_order");
    if (cats) setCategories(cats);
    setSaving(false);
  }

  async function deleteCategory(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("categories").update({ is_active: false }).eq("id", id).eq("user_id", user.id);
    if (error) {
      toast.error("Erro ao excluir: " + error.message);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Categoria excluída!");
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
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categorias</h1>
          <button
            onClick={() => { resetForm(); setShowForm(!showForm); }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancelar" : "Nova"}
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm dark:shadow-gray-900/20">
            <h2 className="mb-4 text-lg font-semibold">{editingId ? "Editar Categoria" : "Nova Categoria"}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
                {formErrors.name && <p className="mt-1 text-xs text-red-600">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ícone</label>
                <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" maxLength={2} />
                {formErrors.icon && <p className="mt-1 text-xs text-red-600">{formErrors.icon}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Orçamento (R$)</label>
                <input type="number" step="0.01" min="0" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
                {formErrors.budget_limit && <p className="mt-1 text-xs text-red-600">{formErrors.budget_limit}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value as any)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  <option value="expense">Despesa</option>
                  <option value="income">Receita</option>
                  <option value="both">Ambos</option>
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cor</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {colorOptions.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)} className={`h-8 w-8 rounded-full border-2 ${color === c ? "border-gray-900" : "border-transparent"}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Salvando..." : editingId ? "Atualizar" : "Salvar"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancelar</button>
                )}
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm dark:shadow-gray-900/20">Nenhuma categoria ainda</div>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="rounded-xl bg-white p-5 shadow-sm dark:shadow-gray-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: c.color + "20", color: c.color }}>
                      {c.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{c.name}</p>
                      <p className="text-xs capitalize text-gray-500 dark:text-gray-400">{c.type === "expense" ? "Despesa" : c.type === "income" ? "Receita" : "Ambos"}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(c)} className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: c.id })} className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                {c.budget_limit && (
                  <div className="mt-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Orçamento</span>
                      <span className="font-medium">{formatCurrency(c.budget_limit)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Excluir categoria"
        message="Tem certeza? Todas as transações desta categoria ficarão sem categoria."
        onConfirm={() => { deleteCategory(confirmModal.id); setConfirmModal({ open: false, id: "" }); }}
        onCancel={() => setConfirmModal({ open: false, id: "" })}
        confirmText="Excluir"
        variant="danger"
      />
    </ProtectedLayout>
  );
}
