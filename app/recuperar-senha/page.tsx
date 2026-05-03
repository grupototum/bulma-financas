"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/perfil`,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Enviamos um link de recuperação para seu email!");
    }

    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-mint-50 dark:bg-mint-900 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-mint-900 dark:text-mint-50">Recuperar senha</h1>
          <p className="mt-2 text-mint-600 dark:text-mint-400">
            Digite seu email para receber o link de redefinição
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-mint-700 dark:text-mint-300">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mint-400 dark:text-mint-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-mint-300 dark:border-mint-600 dark:bg-mint-800 dark:text-mint-100 py-2 pl-10 pr-4 focus:border-mint-brand focus:outline-none"
                required
              />
            </div>
          </div>

          {message && (
            <div className="rounded-lg bg-mint-brand-light dark:bg-mint-brand-deep/30 p-3 text-sm text-green-800 dark:text-green-300">
              {message}
            </div>
          )}
          {error && (
            <div className="rounded-lg bg-mint-error-light dark:bg-mint-error/30 p-3 text-sm text-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-mint-900 px-4 py-2 font-medium text-white hover:bg-mint-800 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Enviar link"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-mint-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
}
