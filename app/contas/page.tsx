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
  ArrowRightLeft,
  CreditCard,
  Wallet,
  PiggyBank,
  Landmark,
  Banknote,
  CircleDollarSign,
} from "lucide-react";

interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  color: string;
}

const accountTypeLabels: Record<string, string> = {
  checking: "Conta Corrente",
  savings: "Poupança",
  credit: "Cartão de Crédito",
  cash: "Dinheiro",
  investment: "Investimento",
  other: "Outro",
};

const accountTypeIcons: Record<string, React.ReactNode> = {
  checking: <Landmark className="h-5 w-5" />,
  savings: <PiggyBank className="h-5 w-5" />,
  credit: <CreditCard className="h-5 w-5" />,
  cash: <Banknote className="h-5 w-5" />,
  investment: <CircleDollarSign className="h-5 w-5" />,
  other: <Wallet className="h-5 w-5" />,
};

const accountTypeOptions = [
  { value: "checking", label: "Conta Corrente" },
  { value: "savings", label: "Poupança" },
  { value: "credit", label: "Cartão de Crédito" },
  { value: "cash", label: "Dinheiro" },
  { value: "investment", label: "Investimento" },
  { value: "other", label: "Outro" },
];

const colorOptions = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1",
];

export default function ContasPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  // Form conta
  const [name, setName] = useState("");
  const [type, setType] = useState("checking");
  const [color, setColor] = useState("#3B82F6");
  const [balance, setBalance] = useState("");
  const [saving, setSaving] = useState(false);

  // Form transferência
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDescription, setTransferDescription] = useState("");
  const [transferDate, setTransferDate] = useState(new Date().toISOString().split("T")[0]);

  const [confirmModal, setConfirmModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });

  useEffect(() => {
    const supabase = createClient();
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      setUser(user);

      const { data: accs } = await supabase
        .from("accounts")
        .select("id, name, type, balance, color")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("name");

      if (accs) setAccounts(accs);
      setLoading(false);
    }
    loadData();
  }, [router]);

  function resetForm() {
    setName("");
    setType("checking");
    setColor("#3B82F6");
    setBalance("");
    setEditingId(null);
  }

  function startEdit(acc: Account) {
    setEditingId(acc.id);
    setName(acc.name);
    setType(acc.type);
    setColor(acc.color);
    setBalance(acc.balance.toString());
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;

    setSaving(true);
    const supabase = createClient();
    const payload = {
      user_id: user.id,
      name,
      type,
      color,
      balance: balance ? parseFloat(balance) : 0,
    };

    if (editingId) {
      const { error } = await supabase.from("accounts").update(payload).eq("id", editingId).eq("user_id", user.id);
      if (error) toast.error("Erro ao atualizar conta: " + error.message);
      else { toast.success("Conta atualizada!"); resetForm(); setShowForm(false); }
    } else {
      const { error } = await supabase.from("accounts").insert(payload);
      if (error) toast.error("Erro ao criar conta: " + error.message);
      else { toast.success("Conta criada!"); resetForm(); setShowForm(false); }
    }

    const { data: accs } = await supabase
      .from("accounts")
      .select("id, name, type, balance, color")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .order("name");
    if (accs) setAccounts(accs);
    setSaving(false);
  }

  async function deleteAccount(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("accounts").update({ is_active: false }).eq("id", id).eq("user_id", user.id);
    if (error) { toast.error("Erro ao excluir: " + error.message); return; }
    setAccounts((prev) => prev.filter((a) => a.id !== id));
    toast.success("Conta excluída!");
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault();
    if (!fromAccountId || !toAccountId || !transferAmount || fromAccountId === toAccountId) {
      toast.error("Preencha todos os campos corretamente");
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount <= 0) { toast.error("O valor deve ser maior que zero"); return; }

    setSaving(true);
    const supabase = createClient();

    const { error: txError } = await supabase.from("transactions").insert([
      {
        user_id: user.id,
        description: transferDescription || "Transferência entre contas",
        amount,
        type: "expense",
        account_id: fromAccountId,
        date: transferDate,
      },
      {
        user_id: user.id,
        description: transferDescription || "Transferência entre contas",
        amount,
        type: "income",
        account_id: toAccountId,
        date: transferDate,
      },
    ]);

    if (txError) {
      toast.error("Erro ao registrar transferência: " + txError.message);
    } else {
      toast.success("Transferência registrada!");
      setFromAccountId("");
      setToAccountId("");
      setTransferAmount("");
      setTransferDescription("");
      setShowTransfer(false);
    }

    setSaving(false);
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
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Contas</h1>
          <div className="flex gap-3">
            <button
              onClick={() => { resetForm(); setShowTransfer(false); setShowForm(!showForm); }}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Cancelar" : "Nova Conta"}
            </button>
            <button
              onClick={() => { setShowForm(false); setShowTransfer(!showTransfer); }}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <ArrowRightLeft className="h-4 w-4" />
              Transferir
            </button>
          </div>
        </div>

        {/* Form Conta */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">{editingId ? "Editar Conta" : "Nova Conta"}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none">
                  {accountTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Saldo inicial (R$)</label>
                <input type="number" step="0.01" value={balance} onChange={(e) => setBalance(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700">Cor</label>
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

        {/* Form Transferência */}
        {showTransfer && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Transferência entre Contas</h2>
            <form onSubmit={handleTransfer} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">De</label>
                <select value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required>
                  <option value="">Selecione...</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Para</label>
                <select value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required>
                  <option value="">Selecione...</option>
                  {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Valor (R$)</label>
                <input type="number" step="0.01" min="0" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Data</label>
                <input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" required />
              </div>
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Descrição (opcional)</label>
                <input type="text" value={transferDescription} onChange={(e) => setTransferDescription(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none" placeholder="Ex: Transferência para reserva" />
              </div>
              <div className="sm:col-span-2 lg:col-span-4 flex gap-3">
                <button type="submit" disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? "Transferindo..." : "Confirmar Transferência"}
                </button>
                <button type="button" onClick={() => setShowTransfer(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Contas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.length === 0 ? (
            <div className="col-span-full rounded-xl bg-white p-8 text-center text-gray-400 shadow-sm">
              <Wallet className="mx-auto mb-3 h-10 w-10 text-gray-300" />
              <p>Nenhuma conta cadastrada ainda</p>
              <p className="mt-1 text-sm">Adicione suas contas bancárias e carteiras</p>
            </div>
          ) : (
            accounts.map((acc) => (
              <div key={acc.id} className="rounded-xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: acc.color + "20", color: acc.color }}>
                      {accountTypeIcons[acc.type] || <Wallet className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{acc.name}</p>
                      <p className="text-xs text-gray-500">{accountTypeLabels[acc.type] || acc.type}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(acc)} className="rounded p-1 text-gray-400 hover:bg-blue-100 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => setConfirmModal({ open: true, id: acc.id })} className="rounded p-1 text-gray-400 hover:bg-red-100 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Saldo</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(acc.balance)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.open}
        title="Excluir conta"
        message="Tem certeza que deseja excluir esta conta? As transações associadas não serão removidas."
        onConfirm={() => { deleteAccount(confirmModal.id); setConfirmModal({ open: false, id: "" }); }}
        onCancel={() => setConfirmModal({ open: false, id: "" })}
        confirmText="Excluir"
        variant="danger"
      />
    </ProtectedLayout>
  );
}
