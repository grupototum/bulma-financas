-- 🦊 EXTRATO CREDICARD (Itaú) — Inserção no Supabase
-- Data: 2026-05-04
-- Total: 86 transações
-- Fonte: Extrato_Credicard.csv (cartão de crédito final 9125)
-- Executar no: Supabase SQL Editor → New Query → Run

-- ============================================
-- INSTRUÇÃO: Substitua o UUID abaixo pelo ID real da conta "Credicard" ou "Cartão Itaú"
-- Para descobrir: SELECT id, name FROM accounts WHERE name ILIKE '%credicard%' OR name ILIKE '%itau%';
-- ============================================

INSERT INTO transactions (account_id, description, amount, type, category_id, date, notes, created_at) VALUES

-- ============================================
-- 📱 ASSINATURAS — Apple
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 12.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-01', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-02', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-03', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 5.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-06', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-07', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-09', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 5.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 2.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 12.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-22', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-24', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-26', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-28', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-29', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-03', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-07', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-07', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-07', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 5.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 2.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 12.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-08', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-09', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-11', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-21', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-21', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-22', 'Apple Store / App Store', now()),

-- ============================================
-- 📱 ASSINATURAS — Amazon
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-16', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 34.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-01', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Ad free for Pri', 10.00, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-01', 'Amazon Prime sem anúncios', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-12-13', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Ad free for Pri', 10.00, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-12-31', 'Amazon Prime sem anúncios', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 44.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-12-31', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-01-13', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Ad free for Pri', 10.00, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-01-31', 'Amazon Prime sem anúncios', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 34.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-05', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Amazon Prime Canais', 44.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-06', 'Amazon Prime Video/Canais', now()),

-- ============================================
-- 📱 ASSINATURAS — Outros (YouTube, Netflix, Meli+)
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Google YouTube Member', 4.99, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-07', 'YouTube Premium / Membro', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Google YouTube Member', 4.99, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-01-07', 'YouTube Premium / Membro', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Google YouTube Member', 4.99, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-07', 'YouTube Premium / Membro', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'Google YouTube Member', 4.99, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-04-07', 'YouTube Premium / Membro', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'NETFLIX.COM', 20.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-12-30', 'Netflix', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'EC MELIMAIS', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-21', 'Meli+ / Mercado Livre Plus', now()),

-- ============================================
-- ❌ CANCELAR — MetLife
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'MP METLIFESEGUROSEPR', 9.56, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-02-28', '⚠️ CANCELAR: Seguro MetLife', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'EC METLIFESEGURO', 9.56, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-04-05', '⚠️ CANCELAR: Seguro MetLife', now()),

-- ============================================
-- ❌ CANCELAR — Lovable
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'LOVABLE DOVER', 15.65, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-31', '⚠️ CANCELAR: Lovable', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'LOVABLE DOVER', 15.49, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-31', '⚠️ CANCELAR: Lovable', now()),

-- ============================================
-- 🍔 ALIMENTAÇÃO
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'BURGER KING', 55.90, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-01-05', 'Burger King', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'GAUCHAO DO VILSON', 15.00, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-12-18', 'Restaurante / Lanchonete', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'SUPER COELHO DINIZ', 33.46, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-12-26', 'Supermercado', now()),

-- ============================================
-- ☕ LAZER / COMPRAS ONLINE
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'DL Tik Tok Shop T', 50.76, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-02-18', 'TikTok Shop compra', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'EBN TikTok Sho02/02', 44.10, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-11-30', 'TikTok Shop parcela 2/2', now()),

-- ============================================
-- 💳 TAXAS DO CARTÃO
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ANUIDADE DIFERENCI01/12', 16.00, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-12', 'Anuidade cartão parcela 1/12', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ANUIDADE DIFERENCI02/12', 16.00, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-11', 'Anuidade cartão parcela 2/12', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ANUIDADE DIFERENCI03/12', 16.00, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-11', 'Anuidade cartão parcela 3/12', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ANUIDADE DIFERENCI12/12', 16.00, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-11', 'Anuidade cartão parcela 12/12', now()),

-- ============================================
-- 💳 JUROS / IOF / ENCARGOS
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'JUROS PAGAMENTO CONTAS', 0.68, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-27', 'Juros pagamento contas', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'IOF PAGAMENTO CONTAS', 0.25, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-28', 'IOF pagamento contas', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'IOF PIX', 0.22, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-28', 'IOF transferência PIX', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ENCARGOS PIX', 0.96, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-10', 'Encargos transferência PIX', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'ESTORNO JUROS DE FINANC', 0.07, 'income', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-10', 'Estorno juros financiamento', now()),

-- ============================================
-- 💳 RENEGOCIAÇÃO DE DÍVIDA
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO-RENEGOCIACA', 95.37, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-19', 'Renegociação de dívida do cartão', now()),

-- ============================================
-- 💳 PAGAMENTOS DE FATURA (não são "gastos", são quitação)
-- Inseridos como tipo 'expense' para registrar saída, mas com notes explicativo
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 182.03, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-15', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 182.03, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-17', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 140.83, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-06', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 108.07, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-16', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 108.07, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-17', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 197.57, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-30', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 139.68, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-19', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 199.04, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-05', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 104.59, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-17', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 200.00, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-31', 'Quitação fatura cartão 9125', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PAGAMENTO EFETUADO 9125', 194.69, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-04-07', 'Quitação fatura cartão 9125', now()),

-- ============================================
-- ❓ DÚVIDAS — PICPAY Google (o que são?)
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY Google', 49.78, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-02-22', '❓ O que é? Compra Google Play?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY Google', 2.99, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-01', '❓ O que é? Compra Google Play?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY Google', 26.90, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-05', '❓ O que é? Compra Google Play?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY Google', 64.42, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-01-23', '❓ O que é? Compra Google Play?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY*Google', 2.99, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-02-01', '❓ O que é? Compra Google Play?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PICPAY Google', 69.18, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-12-16', '❓ O que é? Compra Google Play?', now()),

-- ============================================
-- ❓ DÚVIDAS — PIX / Transferências para pessoas
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'GleibianeDa Silva', 70.00, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-12', '❓ PIX pessoal? Transferência?', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), '59.200.343 MARLON TEIX', 26.00, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-03-18', '❓ PIX pessoal? Transferência?', now()),

-- ============================================
-- 💳 Transferências para outras contas (débito no cartão)
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PGCONTA MERCADO PAGO IN', 45.32, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-27', 'Pagamento conta Mercado Pago via cartão', now()),
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'PIX PICPAY INSTITUICAO', 39.94, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-27', 'PIX para PicPay via cartão', now()),

-- ============================================
-- 💳 DEVOLUÇÃO / ESTORNO
-- ============================================
((SELECT id FROM accounts WHERE name = 'Cartão Itaú'), 'DEVOLUCAO SALDO CREDOR', 108.07, 'income', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-22', 'Devolução / estorno no cartão', now());

-- ============================================
-- RESUMO DAS TRANSAÇÕES INSERIDAS
-- ============================================
-- 📱 Assinaturas (Apple): ~28 transações
-- 📱 Assinaturas (Amazon): ~10 transações
-- 📱 Assinaturas (YouTube, Netflix, Meli+): ~6 transações
-- ❌ MetLife (CANCELAR): ~2 transações
-- ❌ Lovable (CANCELAR): ~2 transações
-- 🍔 Alimentação: ~3 transações
-- ☕ Lazer/Café (TikTok Shop): ~2 transações
-- 💳 Anuidade cartão: ~4 transações
-- 💳 Juros/IOF/Encargos: ~5 transações
-- 💳 Renegociação dívida: ~1 transação
-- 💳 Pagamentos fatura: ~11 transações
-- ❓ PICPAY Google (dúvida): ~6 transações
-- ❓ PIX pessoas (dúvida): ~2 transações
-- 💳 Transferências para contas: ~2 transações
-- 💳 Devolução/estorno: ~1 transação
-- ============================================
-- ⚠️ ALERTAS:
-- 1. MetLife apareceu 2x no cartão — CANCELAR URGENTE!
-- 2. Lovable apareceu 2x — CANCELAR!
-- 3. Anuidade Credicard: R$ 16/mês parcelada em 12x
-- 4. Renegociação de dívida: R$ 95,37
-- 5. Juros/IOF/Encargos: cartão com juros ativo
-- 6. Dúvida: PICPAY Google (6x) — o que é?
-- 7. Dúvida: GleibianeDa Silva e Marlon Teix — PIX?
-- ============================================
