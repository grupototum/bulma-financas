use client";

import { createClient } from "@/lib/supabase-browser";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Calendar,
  Target,
  TrendingUp,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";

interface ActionPlan {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: "urgente" | "alta" | "media" | "baixa";
  status: "pendente" | "em_andamento" | "concluido" | "cancelado";
  category: string;
  estimated_cost: number;
  notes: string;
  created_at: string;
}

interface CreditScore {
  id: string;
  score: number;
  date: string;
  notes: string;
}

export default function PlanoPage() {
  const [user, setUser] = useState<any>(null);
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [scores, setScores] = useState<CreditScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);

      // Buscar planos de ação
      const { data: plansData } = await supabase
        .from("action_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("due_date", { ascending: true });

      if (plansData) setPlans(plansData as ActionPlan[]);

      // Buscar scores
      const { data: scoresData } = await supabase
        .from("credit_scores")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(10);

      if (scoresData) setScores(scoresData as CreditScore[]);

      setLoading(false);
    }

    loadData();
  }, [router]);

  async function toggleStatus(id: string, currentStatus: string) {
    const supabase = createClient();
    setUpdating(id);

    const newStatus = currentStatus === "concluido" ? "pendente" : "concluido";
    const { error } = await supabase
      .from("action_plans")
      .update({ status: newStatus, completed_at: newStatus === "concluido" ? new Date().toISOString() : null })
      .eq("id", id);

    if (!error) {
      setPlans((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: newStatus as any } : p
        )
      );
    }

    setUpdating(null);
  }

  // Calcula progresso
  const total = plans.length;
  const concluidos = plans.filter((p) => p.status === "concluido").length;
  const progresso = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  // Score atual
  const scoreAtual = scores[0]?.score || 350;
  const scoreMeta = 650;
  const scoreProgresso = Math.min((scoreAtual / scoreMeta) * 100, 100);

  // Tarefas urgentes (vencem em até 3 dias)
  const hoje = new Date();
  const tresDias = new Date();
  tresDias.setDate(hoje.getDate() + 3);

  const tarefasUrgentes = plans.filter(
    (p) =>
      p.status !== "concluido" &&
      p.status !== "cancelado" &&
      new Date(p.due_date) <= tresDias
  );

  // Tarefas atrasadas
  const tarefasAtrasadas = plans.filter(
    (p) =>
      p.status !== "concluido" &&
      p.status !== "cancelado" &&
      new Date(p.due_date) < hoje
  );

  // Agrupar por status
  const pendentes = plans.filter((p) => p.status === "pendente");
  const emAndamento = plans.filter((p) => p.status === "em_andamento");

  function getPriorityColor(priority: string) {
    switch (priority) {
      case "urgente": return "bg-red-100 text-red-700 border-red-200";
      case "alta": return "bg-orange-100 text-orange-700 border-orange-200";
      case "media": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "baixa": return "bg-gray-100 text-gray-700 border-gray-200";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function getPriorityLabel(priority: string) {
    switch (priority) {
      case "urgente": return "URGENTE";
      case "alta": return "ALTA";
      case "media": return "MÉDIA";
      case "baixa": return "BAIXA";
      default: return priority;
    }
  }

  function getCategoryIcon(category: string) {
    switch (category) {
      case "protestos": return <AlertTriangle className="h-4 w-4" />;
      case "dividas": return <AlertCircle className="h-4 w-4" />;
      case "assinaturas": return <Zap className="h-4 w-4" />;
      case "score": return <TrendingUp className="h-4 w-4" />;
      case "investigacao": return <Clock className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  }

  function getCategoryColor(category: string) {
    switch (category) {
      case "protestos": return "bg-red-50 text-red-600";
      case "dividas": return "bg-orange-50 text-orange-600";
      case "assinaturas": return "bg-purple-50 text-purple-600";
      case "score": return "bg-blue-50 text-blue-600";
      case "investigacao": return "bg-yellow-50 text-yellow-600";
      default: return "bg-gray-50 text-gray-600";
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Plano de Ação</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Cards de Resumo */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Progresso Plano */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Progresso do Plano</p>
                <p className="text-2xl font-bold text-blue-600">{progresso}%</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {concluidos} de {total} tarefas concluídas
            </p>
          </div>

          {/* Score */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-green-100 p-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Score Serasa</p>
                <p className={`text-2xl font-bold ${scoreAtual < 500 ? "text-red-600" : scoreAtual < 700 ? "text-yellow-600" : "text-green-600"}`}>
                  {scoreAtual}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${scoreAtual < 500 ? "bg-red-500" : scoreAtual < 700 ? "bg-yellow-500" : "bg-green-500"}`}
                style={{ width: `${scoreProgresso}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Meta: {scoreMeta} ({scoreMeta - scoreAtual} pontos para lá)
            </p>
          </div>

          {/* Tarefas Urgentes */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-red-100 p-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vencem em 3 dias</p>
                <p className="text-2xl font-bold text-red-600">{tarefasUrgentes.length}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {tarefasAtrasadas.length > 0 && (
                <span className="text-red-500 font-medium">{tarefasAtrasadas.length} atrasadas</span>
              )}
            </p>
          </div>

          {/* Próxima Meta */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="rounded-lg bg-purple-100 p-2">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Próxima Tarefa</p>
                <p className="text-lg font-bold text-gray-900">
                  {pendentes.length > 0
                    ? new Date(pendentes[0].due_date).toLocaleDateString("pt-BR")
                    : "Nenhuma"}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 truncate">
              {pendentes.length > 0 ? pendentes[0].title : "Todas concluídas!"}
            </p>
          </div>
        </div>

        {/* Alertas */}
        {tarefasAtrasadas.length > 0 && (
          <div className="mb-8 rounded-xl bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-red-800">
                ⚠️ Tarefas Atrasadas ({tarefasAtrasadas.length})
              </h3>
            </div>
            <div className="space-y-2">
              {tarefasAtrasadas.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm text-red-700 bg-white rounded-lg p-3">
                  <span>{t.title}</span>
                  <span className="text-red-500 font-medium">
                    Venceu em {new Date(t.due_date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tarefas Urgentes (próximos 3 dias) */}
        {tarefasUrgentes.filter((t) => !tarefasAtrasadas.find((a) => a.id === t.id)).length > 0 && (
          <div className="mb-8 rounded-xl bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <h3 className="font-semibold text-yellow-800">
                ⏰ Vencem em breve
              </h3>
            </div>
            <div className="space-y-2">
              {tarefasUrgentes
                .filter((t) => !tarefasAtrasadas.find((a) => a.id === t.id))
                .map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm text-yellow-700 bg-white rounded-lg p-3">
                    <span>{t.title}</span>
                    <span className="text-yellow-600 font-medium">
                      {new Date(t.due_date).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Lista de Tarefas */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Todas as Tarefas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Clique no círculo para marcar como concluída
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {plans.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                Nenhuma tarefa cadastrada
              </div>
            ) : (
              plans.map((plan) => {
                const isOverdue = new Date(plan.due_date) < hoje && plan.status !== "concluido";
                const isDueSoon = !isOverdue && new Date(plan.due_date) <= tresDias && plan.status !== "concluido";

                return (
                  <div
                    key={plan.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      plan.status === "concluido" ? "bg-gray-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleStatus(plan.id, plan.status)}
                        disabled={updating === plan.id}
                        className="mt-1 flex-shrink-0"
                      >
                        {plan.status === "concluido" ? (
                          <CheckCircle2 className="h-6 w-6 text-green-500" />
                        ) : (
                          <Circle className={`h-6 w-6 ${isOverdue ? "text-red-400" : isDueSoon ? "text-yellow-400" : "text-gray-300"} hover:text-blue-500`} />
                        )}
                      </button>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3
                            className={`font-medium ${
                              plan.status === "concluido"
                                ? "text-gray-500 line-through"
                                : "text-gray-900"
                            }`}
                          >
                            {plan.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                              plan.priority
                            )}`}
                          >
                            {getPriorityLabel(plan.priority)}
                          </span>
                          <span
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                              plan.category
                            )}`}
                          >
                            {getCategoryIcon(plan.category)}
                            {plan.category}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mt-1">{plan.description}</p>

                        {plan.notes && (
                          <p className="text-xs text-gray-400 mt-1">💡 {plan.notes}</p>
                        )}

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className={isOverdue ? "text-red-500 font-medium" : isDueSoon ? "text-yellow-600 font-medium" : ""}>
                              {isOverdue ? "⚠️ Atrasado: " : isDueSoon ? "⏰ " : ""}
                              {new Date(plan.due_date).toLocaleDateString("pt-BR")}
                            </span>
                          </span>
                          {plan.estimated_cost > 0 && (
                            <span className="flex items-center gap-1">
                              <span>💰 R$ {plan.estimated_cost.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Score Timeline */}
        {scores.length > 0 && (
          <div className="mt-8 rounded-xl bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Evolução do Score
            </h2>
            <div className="space-y-3">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-gray-500">
                    {new Date(s.date).toLocaleDateString("pt-BR")}
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          s.score < 500
                            ? "bg-red-500"
                            : s.score < 700
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${Math.min((s.score / 1000) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-12 text-sm font-bold text-gray-700">{s.score}</div>
                  {s.notes && <div className="text-xs text-gray-400">{s.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Link
            href="/dashboard"
            className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Dashboard</h3>
            <p className="text-sm text-gray-500">Ver finanças</p>
          </Link>

          <Link
            href="/transactions"
            className="rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <Zap className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-medium text-gray-900">Transações</h3>
            <p className="text-sm text-gray-500">Lançar gastos</p>
          </Link>

          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center text-white">
            <Target className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-medium">Score Meta</h3>
            <p className="text-sm text-blue-100">
              {scoreMeta - scoreAtual} pontos para {scoreMeta}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
