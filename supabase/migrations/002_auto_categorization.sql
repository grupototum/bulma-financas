ALTER TABLE transactions ADD COLUMN IF NOT EXISTS is_auto_categorized BOOLEAN DEFAULT FALSE;

-- Tabela de regras de categorização automática
CREATE TABLE IF NOT EXISTS auto_categorization_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    match_type VARCHAR(20) DEFAULT 'contains' CHECK (match_type IN ('contains', 'exact', 'starts_with', 'ends_with')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, keyword)
);

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_auto_cat_keyword ON auto_categorization_rules(keyword);
CREATE INDEX IF NOT EXISTS idx_auto_cat_user ON auto_categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_auto_cat_active ON auto_categorization_rules(is_active) WHERE is_active = TRUE;

-- Trigger: categorizar automaticamente ao inserir transação
CREATE OR REPLACE FUNCTION auto_categorize_transaction()
RETURNS TRIGGER AS $$
DECLARE
    matched_category UUID;
BEGIN
    -- Ignorar se já tem categoria definida (não for "Outros")
    IF NEW.category_id IS NOT NULL THEN
        -- Verificar se é "Outros" — se for, tenta categorizar
        DECLARE
            other_id UUID;
        BEGIN
            SELECT id INTO other_id FROM categories 
            WHERE user_id = NEW.user_id AND name = '❓ Outros' AND is_active = TRUE;
            
            IF NEW.category_id = other_id OR other_id IS NULL THEN
                -- Continua para tentar categorizar
                NULL;
            ELSE
                RETURN NEW;
            END IF;
        END;
    END IF;

    -- Procurar regra que combine com a descrição
    SELECT r.category_id INTO matched_category
    FROM auto_categorization_rules r
    WHERE r.user_id = NEW.user_id
      AND r.is_active = TRUE
      AND (
          (r.match_type = 'contains' AND NEW.description ILIKE '%' || r.keyword || '%') OR
          (r.match_type = 'exact' AND LOWER(NEW.description) = LOWER(r.keyword)) OR
          (r.match_type = 'starts_with' AND NEW.description ILIKE r.keyword || '%') OR
          (r.match_type = 'ends_with' AND NEW.description ILIKE '%' || r.keyword)
      )
    ORDER BY r.created_at DESC  -- Mais recente primeiro
    LIMIT 1;

    IF matched_category IS NOT NULL THEN
        NEW.category_id := matched_category;
        NEW.is_auto_categorized := TRUE;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar trigger ao inserir transações
DROP TRIGGER IF EXISTS trigger_auto_categorize ON transactions;
CREATE TRIGGER trigger_auto_categorize
    BEFORE INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION auto_categorize_transaction();

-- Enable RLS
ALTER TABLE auto_categorization_rules ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários veem só suas regras" ON auto_categorization_rules
    FOR ALL USING (user_id = auth.uid());

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_auto_cat_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_cat_updated ON auto_categorization_rules;
CREATE TRIGGER trigger_auto_cat_updated
    BEFORE UPDATE ON auto_categorization_rules
    FOR EACH ROW EXECUTE FUNCTION update_auto_cat_updated_at();
