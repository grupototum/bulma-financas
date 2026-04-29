export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  currency: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string
  color: string
  budget_limit: number | null
  type: 'expense' | 'income' | 'both'
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment' | 'other'
  balance: number
  currency: string
  color: string
  is_active: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  account_id: string | null
  category_id: string | null
  description: string
  amount: number
  type: 'expense' | 'income' | 'transfer'
  date: string
  is_recurring: boolean
  recurring_interval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  notes: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  deadline: string | null
  color: string
  is_active: boolean
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  month: number
  year: number
  total_income: number
  total_expense: number
  savings_goal: number
  notes: string | null
  created_at: string
}

export interface BudgetCategory {
  id: string
  budget_id: string
  category_id: string
  planned_amount: number
  spent_amount: number
}

export type TransactionWithCategory = Transaction & {
  category?: Category | null
  account?: Account | null
}
