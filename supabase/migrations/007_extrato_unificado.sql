-- ============================================================
-- INSERT TRANSAÇÕES EXTRATO UNIFICADO — Credicard + Mercado Pago
-- Período: Nov/2025 → Abr/2026
-- Data: 2026-05-02
-- Bulma Finanças — Supabase
-- ============================================================

-- Buscar IDs necessários
WITH acc_credicard AS (
  SELECT id FROM accounts WHERE name ILIKE '%Credicard%' OR name ILIKE '%Itaú%' LIMIT 1
),
acc_mp AS (
  SELECT id FROM accounts WHERE name ILIKE '%Mercado Pago%' LIMIT 1
),
cat_cartao AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Cartão%' OR name ILIKE '%Cartão%' LIMIT 1
),
cat_assinaturas AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Assinaturas%' OR name ILIKE '%Assinaturas%' LIMIT 1
),
cat_alimentacao AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Alimenta%' OR name ILIKE '%Alimenta%' LIMIT 1
),
cat_marketing AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Marketing%' OR name ILIKE '%Marketing%' LIMIT 1
),
cat_seguro AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Seguro%' OR name ILIKE '%Seguro%' LIMIT 1
),
cat_juros AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Juros%' OR name ILIKE '%Juros%' OR emoji_name ILIKE '%IOF%' OR name ILIKE '%IOF%' LIMIT 1
),
cat_compras AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Compras%' OR name ILIKE '%Compras%' OR emoji_name ILIKE '%Shopping%' OR name ILIKE '%Shopping%' LIMIT 1
),
cat_devolucao AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Devolu%' OR name ILIKE '%Devolu%' OR emoji_name ILIKE '%Estorno%' OR name ILIKE '%Estorno%' LIMIT 1
),
cat_outros AS (
  SELECT id FROM categories WHERE emoji_name ILIKE '%Outros%' OR name ILIKE '%Outros%' LIMIT 1
)

INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, date, payment_method, notes, created_at)
VALUES
  -- ==================== CREDICARD ====================

  -- PAGAMENTOS DE FATURA (cartão)
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -182.03, 'expense', '2026-02-15', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -182.03, 'expense', '2026-02-17', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -140.83, 'expense', '2026-03-06', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -108.07, 'expense', '2025-12-16', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -108.07, 'expense', '2025-12-17', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -197.57, 'expense', '2025-12-30', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -139.68, 'expense', '2026-01-19', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -199.04, 'expense', '2026-02-05', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -104.59, 'expense', '2026-03-17', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -200.00, 'expense', '2026-03-31', 'credit_card', 'Pagamento efetuado fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_cartao), 'Pagamento Fatura Credicard 9125', -194.69, 'expense', '2026-04-07', 'credit_card', 'Pagamento efetuado fatura', NOW()),

  -- ANUIDADE DIFERENCIADA
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'Anuidade Diferenciada Credicard 02/12', -16.00, 'expense', '2025-02-11', 'credit_card', 'Anuidade cartão', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'Anuidade Diferenciada Credicard 12/12', -16.00, 'expense', '2025-12-11', 'credit_card', 'Anuidade cartão', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'Anuidade Diferenciada Credicard 01/12', -16.00, 'expense', '2026-01-12', 'credit_card', 'Anuidade cartão', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'Anuidade Diferenciada Credicard 03/12', -16.00, 'expense', '2026-03-11', 'credit_card', 'Anuidade cartão', NOW()),

  -- APPLE (iCloud, Apple One, apps)
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -12.90, 'expense', '2026-02-27', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-01', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-02', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-03', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -5.90, 'expense', '2026-03-06', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -59.90, 'expense', '2026-03-07', 'credit_card', 'Apple One Familiar', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-09', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -59.90, 'expense', '2026-02-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -5.90, 'expense', '2026-02-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -2.90, 'expense', '2026-02-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -12.90, 'expense', '2026-03-22', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-24', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-26', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-28', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-29', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-04-03', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-04-07', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -59.90, 'expense', '2026-04-07', 'credit_card', 'Apple One Familiar', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -59.90, 'expense', '2026-04-07', 'credit_card', 'Apple One Familiar', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-04-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -5.90, 'expense', '2026-04-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -2.90, 'expense', '2026-04-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -12.90, 'expense', '2026-04-08', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-04-09', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-11', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-21', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-21', 'credit_card', 'Apple assinatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-22', 'credit_card', 'Apple assinatura', NOW()),

  -- AMAZON
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -19.90, 'expense', '2025-02-12', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Ad-free for Prime', -10.00, 'expense', '2026-01-01', 'credit_card', 'Amazon Music/sem anúncios', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -34.90, 'expense', '2026-03-01', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -19.90, 'expense', '2025-12-13', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Ad-free for Prime', -10.00, 'expense', '2025-12-31', 'credit_card', 'Amazon Music/sem anúncios', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -44.90, 'expense', '2025-12-31', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -34.90, 'expense', '2026-02-05', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -44.90, 'expense', '2026-02-06', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Prime Canais', -19.90, 'expense', '2026-01-13', 'credit_card', 'Prime Video/Canais', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Amazon Ad-free for Prime', -10.00, 'expense', '2026-01-31', 'credit_card', 'Amazon Music/sem anúncios', NOW()),

  -- GOOGLE / YOUTUBE
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Google YouTube Membership', -4.99, 'expense', '2026-02-07', 'credit_card', 'YouTube Premium/Music', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Google YouTube Membership', -4.99, 'expense', '2026-03-07', 'credit_card', 'YouTube Premium/Music', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Google YouTube Membership', -4.99, 'expense', '2026-04-07', 'credit_card', 'YouTube Premium/Music', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -49.78, 'expense', '2025-12-22', 'credit_card', 'Compra Google via PicPay', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -2.99, 'expense', '2026-01-01', 'credit_card', 'Compra Google via PicPay', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -26.90, 'expense', '2026-03-05', 'credit_card', 'Compra Google via PicPay', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -2.99, 'expense', '2026-02-01', 'credit_card', 'Compra Google via PicPay', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -26.90, 'expense', '2026-02-05', 'credit_card', 'Compra Google via PicPay', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'PICPAY Google', -64.42, 'expense', '2026-01-23', 'credit_card', 'Compra Google via PicPay', NOW()),

  -- NETFLIX
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Netflix.com', -20.90, 'expense', '2025-12-30', 'credit_card', 'Netflix assinatura', NOW()),

  -- TIKTOK
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_marketing), 'TikTok Shop T', -50.76, 'expense', '2026-02-18', 'credit_card', 'Compra TikTok Shop', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_marketing), 'TikTok Shop 02/02', -44.10, 'expense', '2025-11-30', 'credit_card', 'Compra TikTok Shop', NOW()),

  -- SEGURO / METLIFE
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_seguro), 'MetLife Seguros e Previdência', -9.56, 'expense', '2026-02-28', 'credit_card', 'Seguro fatura/parcela', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_seguro), 'MetLife Seguros e Previdência', -9.56, 'expense', '2025-12-29', 'credit_card', 'Seguro fatura/parcela', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_seguro), 'EC MetLife Seguro', -9.56, 'expense', '2026-04-05', 'credit_card', 'Seguro fatura/parcela', NOW()),

  -- COMPRAS VARIADAS
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_alimentacao), 'Gauchão do Vilson', -15.00, 'expense', '2025-12-18', 'credit_card', 'Restaurante/lanchonete', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_compras), 'Super Coelho Diniz', -33.46, 'expense', '2025-12-26', 'credit_card', 'Supermercado/compras', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_alimentacao), 'Burger King', -55.90, 'expense', '2026-01-05', 'credit_card', 'Fast food', NOW()),

  -- DEVOLUÇÃO / ESTORNO
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_devolucao), 'Devolução Saldo Credor', 108.07, 'income', '2025-12-22', 'credit_card', 'Estorno/devolução fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_devolucao), 'Estorno Juros de Financiamento', 0.07, 'income', '2026-01-10', 'credit_card', 'Estorno juros', NOW()),

  -- RENEGOCIAÇÃO / ENCARGOS
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_juros), 'Pagamento Renegociação', -95.37, 'expense', '2026-02-19', 'credit_card', 'Pagamento acordo/renegociação', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_juros), 'Juros Pagamento Contas', -0.68, 'expense', '2026-01-27', 'credit_card', 'Juros fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_juros), 'IOF Pagamento Contas', -0.25, 'expense', '2026-01-28', 'credit_card', 'IOF fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_juros), 'IOF PIX', -0.22, 'expense', '2026-01-28', 'credit_card', 'IOF PIX', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_juros), 'Encargos PIX', -0.96, 'expense', '2026-02-10', 'credit_card', 'Encargos/IOF PIX', NOW()),

  -- PAGAMENTOS VIA PIX/PICPAY NO CREDICARD
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'PG Conta Mercado Pago IN', -45.32, 'expense', '2026-01-27', 'credit_card', 'Pagamento Mercado Pago via cartão', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'PIX PicPay Instituição', -39.94, 'expense', '2026-01-27', 'credit_card', 'PIX via PicPay no cartão', NOW()),

  -- OUTROS
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'Gleibiane Da Silva', -70.00, 'expense', '2026-03-12', 'credit_card', 'Transferência/pagamento pessoa', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), '59.200.343 Marlon Teix', -26.00, 'expense', '2026-03-18', 'credit_card', 'Pagamento/CNPJ', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_outros), 'EC Meli+ (Mercado Livre)', -19.90, 'expense', '2026-03-21', 'credit_card', 'Assinatura Mercado Livre', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Lovable Dover', -15.65, 'expense', '2026-03-31', 'credit_card', 'Lovable no-code', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_credicard), (SELECT id FROM cat_assinaturas), 'Lovable Dover', -15.49, 'expense', '2026-03-31', 'credit_card', 'Lovable no-code', NOW()),

  -- ==================== MERCADO PAGO ====================

  -- PAGAMENTO FATURA
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_cartao), 'Pagamento Fatura Dezembro/2025', -52.67, 'expense', '2025-12-16', 'credit_card', 'Pagamento fatura Mercado Pago', NOW()),

  -- SEGURO FATURA PROTEGIDA
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_seguro), 'Seguro Fatura Protegida', -3.89, 'expense', '2026-01-09', 'credit_card', 'Seguro fatura', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_seguro), 'Seguro Fatura Protegida', -3.89, 'expense', '2026-04-09', 'credit_card', 'Seguro fatura', NOW()),

  -- JUROS/IOF ROTATIVO
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_juros), 'Juros do Rotativo', -0.11, 'expense', '2026-04-13', 'credit_card', 'Juros fatura rotativo', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_juros), 'IOF do Rotativo', -0.02, 'expense', '2026-04-13', 'credit_card', 'IOF rotativo', NOW()),

  -- PARCELAS / COMPRAS
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_compras), 'MercadoLivre 2 Produtos (2/3)', -23.86, 'expense', '2025-11-16', 'credit_card', 'Parcela 2 de 3', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_compras), 'Temu.com INDOBEST E (3/6)', -39.13, 'expense', '2026-01-28', 'credit_card', 'Parcela 3 de 6', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_compras), 'Temu.com SPRINTA CO (3/6)', -30.48, 'expense', '2026-01-28', 'credit_card', 'Parcela 3 de 6', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_assinaturas), 'Amazon Prime BR (2/3)', -55.60, 'expense', '2026-02-27', 'credit_card', 'Parcela 2 de 3', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_assinaturas), 'Apple.com/bill', -6.90, 'expense', '2026-03-12', 'credit_card', 'Apple assinatura', NOW()),

  -- OUTROS MERCADO PAGO
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_assinaturas), 'Meli+ (Mercado Livre Plus)', -19.90, 'expense', '2025-12-22', 'credit_card', 'Assinatura Mercado Livre', NOW()),
  ('7e500c64-cd09-4cc2-86b0-9a0e0736f98e', (SELECT id FROM acc_mp), (SELECT id FROM cat_seguro), 'MetLife Seguros e Previdência', -9.56, 'expense', '2025-12-29', 'credit_card', 'Seguro fatura/parcela', NOW());
