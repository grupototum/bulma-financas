-- Bulma Finanças — Migration 008
-- Adiciona suporte a Fixo vs Variável

-- ============================================
-- ALTERAR TABELA CATEGORIES
-- ============================================
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS expense_type TEXT DEFAULT 'variable'
CHECK (expense_type IN ('fixed', 'variable'));

-- ============================================
-- ALTERAR TABELA TRANSACTIONS
-- ============================================
ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS is_fixed BOOLEAN DEFAULT FALSE;

-- Índice para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_transactions_is_fixed ON transactions(is_fixed);
CREATE INDEX IF NOT EXISTS idx_categories_expense_type ON categories(expense_type);

-- ============================================
-- ATUALIZAR CATEGORIAS EXISTENTES
-- ============================================
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%moradia%' OR name ILIKE '%aluguel%' OR name ILIKE '%condomínio%' OR name ILIKE '%iptu%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%assinatura%' OR name ILIKE '%netflix%' OR name ILIKE '%spotify%' OR name ILIKE '%plano%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%cartão%' OR name ILIKE '%crédito%' OR name ILIKE '%seguro%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%internet%' OR name ILIKE '%telefone%' OR name ILIKE '%luz%' OR name ILIKE '%água%' OR name ILIKE '%energia%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%mensalidade%' OR name ILIKE '%escola%' OR name ILIKE '%faculdade%' OR name ILIKE '%curso%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%transporte%' OR name ILIKE '%ônibus%' OR name ILIKE '%metrô%' OR name ILIKE '%passagem%';
UPDATE categories SET expense_type = 'fixed' WHERE name ILIKE '%empréstimo%' OR name ILIKE '%financiamento%' OR name ILIKE '%consórcio%';

-- Categorias de income são consideradas fixed por padrão (salário, aluguel recebido, etc.)
UPDATE categories SET expense_type = 'fixed' WHERE type = 'income';

-- Garantir que categorias não atualizadas sejam variable
UPDATE categories SET expense_type = 'variable' WHERE expense_type IS NULL;

-- ============================================
-- TRIGGER: Ao atualizar categoria, atualizar is_fixed das transações
-- ============================================
CREATE OR REPLACE FUNCTION update_transaction_is_fixed()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE transactions
    SET is_fixed = (NEW.expense_type = 'fixed')
    WHERE category_id = NEW.id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_transaction_is_fixed ON categories;
CREATE TRIGGER trigger_update_transaction_is_fixed
AFTER UPDATE OF expense_type ON categories
FOR EACH ROW
EXECUTE FUNCTION update_transaction_is_fixed();
