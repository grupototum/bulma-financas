-- INSERIR DÍVIDAS DO SERASA NO SISTEMA BULMA FINANÇAS
-- Cole isso no SQL Editor do Supabase e execute

-- 1. Criar categoria de Dívida/Protesto
INSERT INTO categories (id, name, type, color, icon) VALUES 
  (gen_random_uuid(), '❌ Dívida/Protesto', 'expense', '#EF4444', 'alert-triangle')
ON CONFLICT DO NOTHING;

-- 2. Buscar IDs necessários
DO $$
DECLARE
  v_user_id UUID := '7e500c64-cd09-4cc2-86b0-9a0e0736f98e';
  v_cat_id UUID;
  v_acc_id UUID;
BEGIN
  -- Buscar categoria
  SELECT id INTO v_cat_id FROM categories WHERE name = '❌ Dívida/Protesto' LIMIT 1;
  
  -- Buscar conta Itaú
  SELECT id INTO v_acc_id FROM accounts WHERE name = 'Cartão Itaú' LIMIT 1;
  
  -- 3. Inserir dívidas negativadas
  INSERT INTO transactions (id, user_id, description, amount, type, category_id, account_id, date, notes)
  VALUES
    (gen_random_uuid(), v_user_id, 'Dívida UNIMED Gov. Valadares (Serasa)', 708.94, 'expense', v_cat_id, v_acc_id, '2023-01-30', 'Dívida negativada no Serasa - UNIMED - 30/01/2023'),
    (gen_random_uuid(), v_user_id, 'Dívida SKY Banda Larga (Serasa)', 176.47, 'expense', v_cat_id, v_acc_id, '2021-01-05', 'Dívida negativada no Serasa - SKY - 05/01/2021. Negociável com 50% desconto (R$ 88,24)'),
    (gen_random_uuid(), v_user_id, 'Protesto Cartório 01 - Gov. Valadares (1)', 213.62, 'expense', v_cat_id, v_acc_id, '2022-11-22', 'Protesto no Cartório 01 de Gov. Valadares - 22/11/2022'),
    (gen_random_uuid(), v_user_id, 'Protesto Cartório 01 - Gov. Valadares (2)', 213.62, 'expense', v_cat_id, v_acc_id, '2022-12-22', 'Protesto no Cartório 01 de Gov. Valadares - 22/12/2022'),
    (gen_random_uuid(), v_user_id, 'Protesto Cartório 01 - Gov. Valadares (3)', 213.62, 'expense', v_cat_id, v_acc_id, '2023-02-22', 'Protesto no Cartório 01 de Gov. Valadares - 22/02/2023'),
    (gen_random_uuid(), v_user_id, 'Protesto Cartório 01 - Gov. Valadares (4 - RECENTE)', 1512.62, 'expense', v_cat_id, v_acc_id, '2025-06-03', 'Protesto no Cartório 01 de Gov. Valadares - 03/06/2025 - MAIOR E MAIS RECENTE');
  
  RAISE NOTICE '🦊 Dívidas do Serasa inseridas com sucesso!';
END $$;
