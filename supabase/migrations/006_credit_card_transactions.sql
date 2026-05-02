-- ============================================================
-- INSERT TRANSAÇÕES CARTÃO ITAÚ — Abril 2026
-- Cartão: Itaú Empresas final 0976
-- Data: 2026-05-02
-- Bulma Finanças — Supabase
-- ============================================================

-- Buscar IDs necessários
WITH acc AS (
  SELECT id as account_id FROM accounts WHERE name ILIKE '%Itaú%' LIMIT 1
),
cat_assinaturas AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Assinaturas%' OR name ILIKE '%Assinaturas%' LIMIT 1
),
cat_marketing AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Marketing%' OR name ILIKE '%Marketing%' LIMIT 1
),
cat_alimentacao AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Alimenta%' OR name ILIKE '%Alimenta%' LIMIT 1
),
cat_hospedagem AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Hospedagem%' OR name ILIKE '%Hospedagem%' LIMIT 1
),
cat_outros AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Outros%' OR name ILIKE '%Outros%' LIMIT 1
),
cat_telefonia AS (
  SELECT id as cat_id FROM categories WHERE emoji_name ILIKE '%Telefonia%' OR name ILIKE '%Telefonia%' LIMIT 1
)

INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, date, payment_method, created_at)
VALUES
  -- 📅 22 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Adobe - Creative Cloud',
    -330.00,
    'expense',
    '2026-04-22',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Moonshot AI (USD $38.41)',
    -38.41,
    'expense',
    '2026-04-22',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Misterhorse.com - Templates After Effects (USD $19.89)',
    -19.89,
    'expense',
    '2026-04-21',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Fontbase - Font Manager (USD $3.00)',
    -3.00,
    'expense',
    '2026-04-19',
    'credit_card',
    NOW()
  ),

  -- 📅 21 ABRIL (iFood)
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_alimentacao),
    'Maravilha\'s Lanches - iFood',
    -40.99,
    'expense',
    '2026-04-21',
    'credit_card',
    NOW()
  ),

  -- 📅 15 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_hospedagem),
    'Vercel Inc. - Hospedagem (USD $20.00)',
    -20.00,
    'expense',
    '2026-04-15',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_marketing),
    'Facebook Ads (USD $1.11)',
    -1.11,
    'expense',
    '2026-04-15',
    'credit_card',
    NOW()
  ),

  -- 📅 13 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_marketing),
    'Facebook Ads — Campanha grande (R$ 808,04)',
    -808.04,
    'expense',
    '2026-04-13',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_telefonia),
    'PG BR DID Telefonia',
    -23.90,
    'expense',
    '2026-04-13',
    'credit_card',
    NOW()
  ),

  -- 📅 10 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_outros),
    'Hubimobi Solucoes Imobiliarias',
    -104.10,
    'expense',
    '2026-04-10',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_marketing),
    'Facebook Ads (USD $1.20)',
    -1.20,
    'expense',
    '2026-04-10',
    'credit_card',
    NOW()
  ),

  -- 📅 09 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_marketing),
    'Reportei.com - Relatórios Marketing',
    -29.90,
    'expense',
    '2026-04-09',
    'credit_card',
    NOW()
  ),

  -- 📅 07 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'YouTube Premium (Google)',
    -6.99,
    'expense',
    '2026-04-07',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Lovable - No-code Builder (USD $25.06)',
    -25.06,
    'expense',
    '2026-04-07',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'CapCut Pro (ByteDance)',
    -65.90,
    'expense',
    '2026-04-07',
    'credit_card',
    NOW()
  ),

  -- 📅 06 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Pareto Tess AI',
    -99.95,
    'expense',
    '2026-04-06',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Lovable - No-code Builder (USD $14.64)',
    -14.64,
    'expense',
    '2026-04-06',
    'credit_card',
    NOW()
  ),

  -- 📅 05 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_hospedagem),
    'Hostinger - Hospedagem VPS/Website',
    -103.99,
    'expense',
    '2026-04-05',
    'credit_card',
    NOW()
  ),

  -- 📅 01 ABRIL
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_hospedagem),
    'Hostinger - Hospedagem',
    -56.08,
    'expense',
    '2026-04-01',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Google Workspace (totumper)',
    -98.00,
    'expense',
    '2026-04-01',
    'credit_card',
    NOW()
  ),

  -- 📅 30 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_hospedagem),
    'Hostinger - Combo/Upgrade',
    -129.99,
    'expense',
    '2026-03-30',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Google One - Armazenamento',
    -48.49,
    'expense',
    '2026-03-29',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Anthropic - Claude API (USD $5.00)',
    -5.00,
    'expense',
    '2026-03-29',
    'credit_card',
    NOW()
  ),

  -- 📅 26 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Claude.ai Subscription (USD $19.85)',
    -19.85,
    'expense',
    '2026-03-26',
    'credit_card',
    NOW()
  ),

  -- 📅 25 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Manus AI (USD $15.63)',
    -15.63,
    'expense',
    '2026-03-25',
    'credit_card',
    NOW()
  ),

  -- 📅 24 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Lovable - No-code Builder (USD $48.78)',
    -48.78,
    'expense',
    '2026-03-24',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_outros),
    'Cakto Pay - Compra',
    -67.99,
    'expense',
    '2026-03-24',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_hospedagem),
    'Namecheap - Domínio (USD $26.33)',
    -26.33,
    'expense',
    '2026-03-24',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Paddle.net - Ycsoft (USD $9.94)',
    -9.94,
    'expense',
    '2026-03-24',
    'credit_card',
    NOW()
  ),

  -- 📅 23 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_outros),
    'Plano Budget - Acesso/Controle',
    -49.90,
    'expense',
    '2026-03-23',
    'credit_card',
    NOW()
  ),

  -- 📅 22 MARÇO
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Moonshot AI (USD $38.42)',
    -38.42,
    'expense',
    '2026-03-22',
    'credit_card',
    NOW()
  ),
  (
    '7e500c64-cd09-4cc2-86b0-9a0e0736f98e',
    (SELECT account_id FROM acc),
    (SELECT cat_id FROM cat_assinaturas),
    'Adobe - Creative Cloud',
    -330.00,
    'expense',
    '2026-03-22',
    'credit_card',
    NOW()
  );
