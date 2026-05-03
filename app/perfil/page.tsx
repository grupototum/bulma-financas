"use client";

import { createClient } from "@/lib/supabase-browser";
import { ProtectedLayout } from "@/components/layout/protected-layout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Lock, Save } from "lucide-react";

export default function PerfilPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
      setLoading(false);
    }
    load();
  }, [router]);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (error) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } else {
      toast.success("Perfil atualizado com sucesso!");
    }
    setSaving(false);
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      toast.error("Erro ao alterar senha: " + error.message);
    } else {
      toast.success("Senha alterada com sucesso!");
      setNewPassword("");
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
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-bold text-mint-900 dark:text-mint-50">Meu Perfil</h1>
        <p className="text-mint-500 dark:text-mint-400">{user?.email}</p>

        {/* Dados do perfil */}
        <div className="mt-6 rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-mint-brand" />
            <h2 className="text-lg font-semibold">Dados pessoais</h2>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">
                Nome completo
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                placeholder="Seu nome"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-mint-900 px-4 py-2 text-sm font-medium text-white hover:bg-mint-800 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Salvando..." : "Salvar nome"}
            </button>
          </form>
        </div>

        {/* Alterar senha */}
        <div className="mt-6 rounded-2xl bg-white dark:bg-mint-800 p-6 shadow-mint">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-5 w-5 text-mint-brand" />
            <h2 className="text-lg font-semibold">Alterar senha</h2>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">
                Nova senha
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 px-3 py-2 focus:border-mint-brand focus:outline-none"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-full bg-mint-900 px-4 py-2 text-sm font-medium text-white hover:bg-mint-800 disabled:opacity-50"
            >
              <Lock className="h-4 w-4" />
              {saving ? "Alterando..." : "Alterar senha"}
            </button>
          </form>
        </div>
      </div>
    </ProtectedLayout>
  );
}
