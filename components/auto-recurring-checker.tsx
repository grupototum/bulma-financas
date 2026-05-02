"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";
import { toast } from "sonner";

export function AutoRecurringChecker() {
  useEffect(() => {
    const supabase = createClient();

    async function checkAndGenerate() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: recurringTxs } = await supabase
        .from("transactions")
        .select("id, description, amount, type, category_id, account_id, date, recurring_interval")
        .eq("user_id", user.id)
        .eq("is_recurring", true)
        .order("date", { ascending: false });

      if (!recurringTxs || recurringTxs.length === 0) return;

      const now = new Date();
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
      let generatedCount = 0;

      for (const tx of recurringTxs) {
        const interval = tx.recurring_interval;
        if (!interval) continue;

        // Buscar a última ocorrência dessa recorrência
        const { data: occurrences } = await supabase
          .from("transactions")
          .select("date")
          .eq("user_id", user.id)
          .eq("description", tx.description)
          .eq("amount", tx.amount)
          .eq("type", tx.type)
          .order("date", { ascending: false })
          .limit(1);

        const lastDate = occurrences && occurrences.length > 0 ? occurrences[0].date : tx.date;
        let nextDate = new Date(lastDate + "T00:00:00");
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        while (nextDate <= endDate) {
          // Avançar para próxima data
          switch (interval) {
            case "daily":
              nextDate.setDate(nextDate.getDate() + 1);
              break;
            case "weekly":
              nextDate.setDate(nextDate.getDate() + 7);
              break;
            case "monthly":
              nextDate.setMonth(nextDate.getMonth() + 1);
              break;
            case "yearly":
              nextDate.setFullYear(nextDate.getFullYear() + 1);
              break;
            default:
              nextDate.setMonth(nextDate.getMonth() + 1);
          }

          if (nextDate > endDate) break;

          const nextDateStr = nextDate.toISOString().split("T")[0];

          // Verificar se já existe
          const { data: existing } = await supabase
            .from("transactions")
            .select("id")
            .eq("user_id", user.id)
            .eq("description", tx.description)
            .eq("amount", tx.amount)
            .eq("date", nextDateStr)
            .maybeSingle();

          if (existing) continue;

          // Criar nova ocorrência
          const { error } = await supabase.from("transactions").insert({
            user_id: user.id,
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            category_id: tx.category_id,
            account_id: tx.account_id,
            date: nextDateStr,
            is_recurring: true,
            recurring_interval: interval,
          });

          if (!error) {
            generatedCount++;
          }
        }
      }

      if (generatedCount > 0) {
        toast.info(`Recorrências: ${generatedCount} transação(ões) geradas automaticamente`, {
          description: "Novas ocorrências foram criadas com base nas suas recorrências cadastradas.",
        });
      }
    }

    checkAndGenerate();
  }, []);

  return null;
}
