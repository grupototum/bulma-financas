"use client";

import { createClient } from "@/lib/supabase-browser";
import { formatCurrency } from "@/lib/format";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  Target,
  TrendingUp,
  Calendar,
  PiggyBank,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  color: string;
}

const colorOptions = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export default function MetasPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const router = useRouter();

  // Form
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [color, setColor] = useState("#8B5CF6");
  const [saving, setSaving] = useState(false);
  const [depositValue, setDepositValue] = useState("");

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const { data: gs } = await supabase
        .from("goals")
        .select("id, name, target_amount, current_amount, deadline, color")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (gs) setGoals(gs);
      setLoading(false);
    }
    loadData();
  }, [router]);

  function resetForm() {
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline("");
    setColor("#8B5CF6");
    setEditingId(null);
  }

  function startEdit(g: Goal) {
    setEditingId(g.id);
    setName(g.name);
    setTargetAmount(g.target_amount.toString());
    setCurrentAmount(g.current_amount.toString());
    setDeadline(g.deadline || "");
    setColor(g.color);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !targetAmount) return;

    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_id: user.id,
      name,
      target_amount: parseFloat(targetAmount),
      current_amount: currentAmount ? parseFloat(currentAmount) : 0,
      deadline: deadline || null,
      color,
    };

    if (editingId) {
      const { error } = await supabase.from("goals").update(payload).eq("id", editingId).eq("user_id", user.id);
      if (error) toast.error("Erro ao atualizar meta: " + error.message);
      else { toast.success("Meta atualizada!"); resetForm(); setShowForm(false); }
    } else {
      const { error } = await supabase.from("goals").insert(payload);
      if (error) toast.error("Erro ao criar meta: " + error.message);
      else { toast.success("Meta criada!"); resetForm(); setShowForm(false); }
    }

    const { data: gs } = await supabase
      .from("goals")
      .select("id, name, target_amount, current_amount, deadline, color")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (gs) setGoals(gs);
    setSaving(false);
  }

  async function deleteGoal(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("goals").update({ is_active: false }).eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Erro ao excluir: " + error.message); return; }
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.success("Meta excluída!");
  }

  async function handleDeposit(e: React.FormEvent) {
    e.preventDefault();
    if (!depositGoalId || !depositValue) return;
    const value = parseFloat(depositValue);
    if (value <= 0) { toast.error("Valor deve ser maior que zero"); return; }

    const supabase = createClient();
    const goal = goals.find((g) => g.id === depositGoalId);
    if (!goal) return;

    const newAmount = goal.current_amount + value;
    const { error } = await supabase.from("goals").update({ current_amount: newAmount }).eq("id", depositGoalId).eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao aportar: " + error.message);
    } else {
      toast.success(`Aporte de ${formatCurrency(value)} registrado!`);
      setDepositValue("");
      setShowDeposit(false);
      setDepositGoalId(null);
    }

    const { data: gs } = await supabase
      .from("goals")
      .select("id, name, target_amount, current_amount, deadline, color")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (gs) setGoals(gs);
  }

  function progressPct(current: number, target: number) {
    if (target <= 0) return 0;
    return Math.min(100, Math.round((current / target) * 100));
  }

  function daysUntil(deadline: string | null) {
    if (!deadline) return null;
    const diff = new Date(deadline).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Metas de Economia</h1>
          <button
            onClick={() => { resetForm(); setShowDeposit(false); setShowForm(!showForm); }}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Cancelar" : "Nova Meta"}
          </button>
        </div>

        {/* Form Meta */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-gray-900/20">
            <h2 className="mb-4 text-lg font-semibold">{editingId ? "Editar Meta" : "Nova Meta"}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor alvo (R$)</label>
                <input type="number" step="0.01" min="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor atual (R$)</label>
                <input type="number" step="0.01" min="0" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Prazo (opcional)</label>
                <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none" />
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
                  <button type="button" onClick={() => { resetForm(); setShowForm(false); }} className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800">Cancelar</button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Form Aporte */}
        {showDeposit && depositGoalId && (
          <div className="mb-8 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm dark:shadow-gray-900/20">
            <h2 className="mb-4 text-lg font-semibold">Aportar na Meta</h2>
            <form onSubmit={handleDeposit} className="flex items-end gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor do aporte (R$)</label>
                <input type="number" step="0.01" min="0" value={depositValue} onChange={(e) => setDepositValue(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <button type="submit" className="rounded-lg bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-700">
                <TrendingUp className="mr-1 inline h-4 w-4" />
                Aportar
              </button>
              <button type="button" onClick={() => { setShowDeposit(false); setDepositGoalId(null); }} className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:bg-gray-800">Cancelar</button>
            </form>
          </div>
        )}

        {/* Lista de Metas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white dark:bg-gray-800 p-8 text-center text-gray-400 dark:text-gray-500 shadow-sm dark:shadow-gray-900/20">
              <Target className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
              <p>Nenhuma meta cadastrada</p>
              <p className="mt-1 text-sm">Crie metas para acompanhar sua economia</p>
            </div>
          ) : (
            goals.map((g) => {
              const pct = progressPct(g.current_amount, g.target_amount);
              const days = daysUntil(g.deadline);
              return (
                <div key={g.id} className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm dark:shadow-gray-900/20">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: g.color + "20", color: g.color }}>
                        <PiggyBank className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{g.name}</p>
                        {days !== null && (
                          <p className={`text-xs ${days < 0 ? "text-red-500" : days < 30 ? "text-orange-500" : "text-gray-500 dark:text-gray-400"}`}>
                            {days < 0 ? `Atrasada ${Math.abs(days)} dias` : days === 0 ? "Vence hoje" : `${days} dias restantes`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setDepositGoalId(g.id); setShowDeposit(true); setShowForm(false); }} className="rounded p-1 text-gray-400 dark:text-gray-500 hover:bg-green-100 dark:bg-green-900/30 hover:text-green-600" title="Aportar">
                        <TrendingUp className="h-4 w-4" />
                      </button>
                      <button onClick={() => startEdit(g)} className="rounded p-1 text-gray-400 dark:text-gray-500 hover:bg-blue-100 dark:bg-blue-900/30 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => setConfirmModal({ open: true, id: g.id })} className="rounded p-1 text-gray-400 dark:text-gray-500 hover:bg-red-100 dark:bg-red-900/30 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">{formatCurrency(g.current_amount)}</span>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{formatCurrency(g.target_amount)}</span>
                    </div>
                    <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                    </div>
                    <p className="mt-1 text-right text-xs text-gray-500 dark:text-gray-400">{pct}% concluído</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Excluir meta"
        message="Tem certeza que deseja excluir esta meta?"
        onConfirm={() => { deleteGoal(confirmModal.id); setConfirmModal({ open: false, id: "" }); }}
        onCancel={() => setConfirmModal({ open: false, id: "" })}
        confirmText="Excluir"
        variant="danger"
      />
    </ProtectedLayout>
  );
}
