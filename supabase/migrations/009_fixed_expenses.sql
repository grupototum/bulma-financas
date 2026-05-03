-- Bulma Finanças — Migration 009
-- Tabela de registro de despesas fixas conhecidas

CREATE TABLE IF NOT EXISTS fixed_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    is_active BOOLEAN DEFAULT TRUE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(description, user_id)
);

-- RLS
ALTER TABLE fixed_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários veem apenas seus gastos fixos"
    ON fixed_expenses FOR ALL
    USING (auth.uid() = user_id);

-- Índices
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_user ON fixed_expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_fixed_expenses_active ON fixed_expenses(is_active);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_fixed_expenses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_fixed_expenses_updated_at ON fixed_expenses;
CREATE TRIGGER trigger_update_fixed_expenses_updated_at
BEFORE UPDATE ON fixed_expenses
FOR EACH ROW
EXECUTE FUNCTION update_fixed_expenses_updated_at();
