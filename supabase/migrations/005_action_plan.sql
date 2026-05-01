-- ============================================
-- PLANO DE AÇÃO — Zerar Dívidas e Subir Score
-- ============================================

-- 1. Criar tabela de plano de ação
CREATE TABLE IF NOT EXISTS action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT CHECK (priority IN ('urgente', 'alta', 'media', 'baixa')),
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluido', 'cancelado')),
  category TEXT,
  estimated_cost NUMERIC(12,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- RLS
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuário vê seus planos" ON action_plans;
CREATE POLICY "Usuário vê seus planos" ON action_plans
  FOR ALL USING (user_id = auth.uid());

-- Índice
CREATE INDEX IF NOT EXISTS idx_action_plans_user_status ON action_plans(user_id, status);
CREATE INDEX IF NOT EXISTS idx_action_plans_due_date ON action_plans(user_id, due_date);

-- 2. Inserir plano de ação completo (90 dias)
DO $$
DECLARE
  v_user_id UUID := '7e500c64-cd09-4cc2-86b0-9a0e0736f98e';
BEGIN
  -- SEMANA 1 (Imediato)
  INSERT INTO action_plans (user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
  VALUES
    (v_user_id, '📞 Ligar Cartório 01 — Gov. Valadares', 'Pegar CNPJ dos credores dos 5 protestos. Endereço: Cartório de Protestos 01, Gov. Valadares.', '2026-05-02', 'urgente', 'pendente', 'protestos', 0, 'Levar CPF e anotar todos os CNPJs. Perguntar se protestos de 2022 já prescreveram (3 anos).'),
    (v_user_id, '📞 Negociar SKY — R$ 176,47', 'Ligar na SKY, pedir desconto de 50% para quitação à vista (R$ 88,24).', '2026-05-03', 'urgente', 'pendente', 'dividas', 88.24, 'Número do contrato: 1508551141. Se aceitarem, pagar imediatamente.'),
    (v_user_id, '📞 Negociar UNIMED — R$ 708,94', 'Ligar na UNIMED Gov. Valadares. Confirmar dívida, pedir desconto + parcelamento.', '2026-05-03', 'urgente', 'pendente', 'dividas', 500.00, 'É dívida de plano de saúde antigo. Tentar 30% desconto à vista = R$ 496,26.'),
    (v_user_id, '❌ Cancelar MetLife', 'Cancelar seguro MetLife no cartão. R$ 8,96–9,56/mês.', '2026-05-02', 'alta', 'pendente', 'assinaturas', 0, 'Ligar no número do cartão ou app do banco. Perguntar em qual cartão está.'),
    (v_user_id, '❌ Cancelar Loveble App', 'Cancelar assinatura Loveble. R$ 19,90/mês. Rael disse que não vai mais pagar.', '2026-05-02', 'alta', 'pendente', 'assinaturas', 0, 'Verificar se está na App Store ou direto no cartão.'),
    (v_user_id, '❌ Cancelar Serasa Premium', 'Cancelar assinatura Serasa Premium. R$ 23,90/mês.', '2026-05-02', 'media', 'pendente', 'assinaturas', 0, 'Já usamos o relatório. Não precisa mais pagar. Cancelar no app Serasa.');

  -- SEMANA 2
  INSERT INTO action_plans (user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
  VALUES
    (v_user_id, '💰 Pagar SKY (se negociado)', 'Quitar dívida SKY com desconto.', '2026-05-09', 'alta', 'pendente', 'dividas', 88.24, 'Guardar comprovante. Pedir carta de quitação.'),
    (v_user_id, '📞 Negociar Protestos (com CNPJ)', 'Com CNPJ em mãos, ligar nos credores dos protestos. Oferecer 40% desconto à vista.', '2026-05-09', 'urgente', 'pendente', 'protestos', 946.45, '4 protestos de R$ 213,62 = R$ 854,48. Tentar quitar por R$ 600. Protesto de R$ 1.512,62 → separado.'),
    (v_user_id, '💰 Pagar UNIMED (se negociado)', 'Quitar dívida UNIMED se conseguir bom desconto.', '2026-05-09', 'alta', 'pendente', 'dividas', 500.00, 'Se não der desconto, parcelar em 3x de R$ 236.'),
    (v_user_id, '📊 Atualizar Score Tracker', 'Consultar score no Serasa novamente. Anotar nova pontuação.', '2026-05-09', 'media', 'pendente', 'score', 0, 'Esperar subir um pouco após quitar SKY/UNIMED.');

  -- MÊS 2
  INSERT INTO action_plans (user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
  VALUES
    (v_user_id, '💰 Quitar 2 Protestos Antigos', 'Pagar 2 dos 4 protestos de R$ 213,62 (2022–2023).', '2026-05-30', 'alta', 'pendente', 'protestos', 427.24, 'Pedir cartas de anuência para retirada do Serasa.'),
    (v_user_id, '💰 Quitar Protesto R$ 1.512,62', 'Negociar e pagar o protesto mais recente e maior.', '2026-06-06', 'urgente', 'pendente', 'protestos', 1200.00, 'Tentar desconto de 20% = R$ 1.210,10. Prioridade máxima — é o mais recente.'),
    (v_user_id, '✅ Verificar Score no Serasa', 'Consultar score. Meta: chegar em 450+.', '2026-06-06', 'media', 'pendente', 'score', 0, 'Se não subiu, rever o que falta quitar.'),
    (v_user_id, '📋 Identificar Lançamentos Itaú', 'Descobrir o que são os 5 lançamentos não identificados do Itaú 01/2026.', '2026-05-30', 'alta', 'pendente', 'investigacao', 0, 'TED estornada R$ 4.000, TED R$ 2.294,18, 3 boletos 499+75+60. Verificar extratos antigos ou ir no banco.');

  -- MÊS 3
  INSERT INTO action_plans (user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
  VALUES
    (v_user_id, '💰 Quitar Protestos Restantes', 'Pagar últimos 2 protestos de R$ 213,62.', '2026-06-30', 'alta', 'pendente', 'protestos', 427.24, 'Todos protestos quitados! Score deve subir significativamente.'),
    (v_user_id, '📈 Meta Score: 500+', 'Score deve estar em 500 ou mais. Se não, rever estratégia.', '2026-07-01', 'media', 'pendente', 'score', 0, 'Meta de 90 dias. Se atingiu, pode simular financiamento.'),
    (v_user_id, '🏦 Cadastro Positivo', 'Confirmar que conta de luz, internet, telefone estão no cadastro positivo.', '2026-06-15', 'media', 'pendente', 'score', 0, 'Isso ajuda a subir score. Verificar no Serasa ou app do cadastro positivo.');

  -- LEMBRETES MENSAIS
  INSERT INTO action_plans (user_id, title, description, due_date, priority, status, category, estimated_cost, notes)
  VALUES
    (v_user_id, '🔄 Revisão Mensal — Orçamento', 'Revisar gastos no app. Manter 20% guardado.', '2026-05-31', 'media', 'pendente', 'orcamento', 0, 'Receita R$ 4.000. Meta guardar R$ 800.'),
    (v_user_id, '🔄 Revisão Mensal — Orçamento', 'Revisar gastos no app. Manter 20% guardado.', '2026-06-30', 'media', 'pendente', 'orcamento', 0, 'Receita R$ 4.000. Meta guardar R$ 800.'),
    (v_user_id, '🔄 Revisão Mensal — Assinaturas', 'Verificar se cancelou MetLife, Loveble, Serasa Premium. Checar novas cobranças.', '2026-05-15', 'media', 'pendente', 'assinaturas', 0, 'Economia esperada: R$ 52,76/mês.');

END $$;
