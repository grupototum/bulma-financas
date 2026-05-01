import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Digite um email válido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export const transactionSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória"),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  type: z.enum(["expense", "income", "transfer"]),
  category_id: z.string().optional(),
  account_id: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  icon: z.string().max(2, "Ícone deve ter no máximo 2 caracteres"),
  color: z.string().min(1, "Cor é obrigatória"),
  budget_limit: z.coerce.number().positive("Orçamento deve ser maior que zero").optional().or(z.literal(0)),
  type: z.enum(["expense", "income", "both"]),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
