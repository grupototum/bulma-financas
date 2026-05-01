-- Criar tabela de Score Tracker
CREATE TABLE IF NOT EXISTS credit_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 1000),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT, -- 'serasa', 'boa_vista', 'manual'
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE credit_scores ENABLE ROW LEVEL SECURITY;

-- Política: usuário só vê seus próprios scores
CREATE POLICY "Usuário vê seus scores" ON credit_scores
  FOR ALL
  USING (user_id = auth.uid());

-- Índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_credit_scores_user_date ON credit_scores(user_id, date DESC);

-- Inserir score atual do Rael (350)
INSERT INTO credit_scores (user_id, score, date, source, notes)
VALUES (
  '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
  350,
  '2026-04-30',
  'manual',
  'Score inicial - Abril/2026. Meta: sair do vermelho.'
);
