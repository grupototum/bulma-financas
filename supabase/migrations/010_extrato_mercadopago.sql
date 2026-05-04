-- 🦊 EXTRATO MERCADO PAGO — Inserção no Supabase
-- Data: 2026-05-04
-- Total: 54 transações
-- Fonte: Extrato_MercadoPago.csv (conta corrente/cartão MP)
-- Executar no: Supabase SQL Editor → New Query → Run

-- ============================================
-- INSTRUÇÃO: Substitua o UUID abaixo pelo ID real da conta "Mercado Pago"
-- Para descobrir: SELECT id, name FROM accounts WHERE name ILIKE '%mercado%';
-- ============================================

INSERT INTO transactions (account_id, description, amount, type, category_id, date, notes, created_at) VALUES

-- 📱 ASSINATURAS
-- Apple (várias compras/assinaturas)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-12', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-13', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 12.00, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-13', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 12.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-13', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-15', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 29.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-15', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 12.00, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-17', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-17', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-17', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 12.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-19', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 2.50, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-22', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 2.50, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-22', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 2.50, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 59.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-06', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 6.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-07', 'Apple Store / App Store', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'APPLECOMBILL', 2.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-09', 'Apple Store / App Store', now()),

-- Amazon Prime
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Amazon Prime Canais', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-03-13', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Amazon Prime Canais', 44.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Amazon Prime Video/Canais', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'AMAZON PRIME BR (1/3)', 55.60, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Amazon Prime BR parcelado', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'AMAZON PRIME BR (2/3)', 55.60, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-27', 'Amazon Prime BR parcelado', now()),

-- Mercado Pago MeliMais
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'MP MELIMAIS', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-02-20', 'Assinatura Meli+ / MeliMais', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'MP MELIMAIS', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-01-21', 'Assinatura Meli+ / MeliMais', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'MP MELIMAIS', 19.90, 'expense', (SELECT id FROM categories WHERE name = '📱 Assinaturas'), '2026-12-22', 'Assinatura Meli+ / MeliMais', now()),

-- Seguro Fatura Protegida
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Seguro Fatura Protegida', 3.89, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-09', 'Seguro proteção de fatura MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Seguro Fatura Protegida', 3.89, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-04-09', 'Seguro proteção de fatura MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Seguro Fatura Protegida', 3.89, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-09', 'Seguro proteção de fatura MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Seguro Fatura Protegida', 3.89, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-09', 'Seguro proteção de fatura MP', now()),

-- EC MetLife (⚠️ CANCELAR!)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'EC METLIFESEGUROSEPREVIDE', 9.56, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-12-29', '⚠️ CANCELAR: Seguro MetLife', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'EC METLIFESEGUROSEPREVIDE', 9.56, 'expense', (SELECT id FROM categories WHERE name = '❓ Outros'), '2026-01-28', '⚠️ CANCELAR: Seguro MetLife', now()),

-- 🛍️ COMPRAS / PARCELAS
-- Temu (parcelas)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom INDOBEST E (1/6)', 39.17, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 1/6', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom SPRINTA CO (1/6)', 30.50, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 1/6', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom INDOBEST E (2/6)', 39.13, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 2/6', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom SPRINTA CO (2/6)', 30.48, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 2/6', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom INDOBEST E (3/6)', 39.13, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 3/6', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'DL Temucom SPRINTA CO (3/6)', 30.48, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-01-28', 'Temu parcela 3/6', now()),

-- Mercado Livre
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'MERCADOLIVRE 2PRODUTOS (2/3)', 23.86, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-11-16', 'ML parcela 2/3', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'MERCADOLIVRE 2PRODUTOS (3/3)', 23.86, 'expense', (SELECT id FROM categories WHERE name = '☕ Lazer/Café'), '2026-11-16', 'ML parcela 3/3', now()),

-- 🍔 ALIMENTAÇÃO (iFood)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IFD 62058827 FERNANDO', 21.62, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-02-26', 'iFood delivery', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IFD iFood', 5.00, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-02-10', 'iFood delivery', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IFD VIEIRA GOURMET ALI', 32.98, 'expense', (SELECT id FROM categories WHERE name = '🍔 Alimentação'), '2026-03-08', 'iFood delivery', now()),

-- 💳 JUROS / IOF / MULTA (Cartão)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Juros do rotativo', 0.11, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-04-13', 'Juros rotativo MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IOF do rotativo', 0.02, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-04-13', 'IOF rotativo MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Juros do rotativo', 0.05, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-13', 'Juros rotativo MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IOF do rotativo', 0.50, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-13', 'IOF rotativo MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Juros do rotativo', 2.60, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-13', 'Juros rotativo MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Multa por atraso', 1.15, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-13', 'Multa atraso fatura MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Juros de mora', 0.12, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-13', 'Juros mora MP', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'IOF do rotativo', 0.26, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-13', 'IOF rotativo MP', now()),

-- 💳 PAGAMENTO DE FATURA (transferência/quitação)
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de dezembro/2025', -52.67, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-12-16', 'Quitação fatura dez/2025', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Débito para pagar a fatura', -11.89, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-25', 'Débito automático fatura', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de janeiro/2026', -45.32, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-01-27', 'Quitação fatura jan/2026', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de fevereiro/2026', -126.88, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-10', 'Quitação fatura fev/2026', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de fevereiro/2026', -9.13, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-27', 'Quitação fatura fev/2026', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de fevereiro/2026', -207.83, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-02-27', 'Quitação fatura fev/2026', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de março/2026', -109.90, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-06', 'Quitação fatura mar/2026', now()),
((SELECT id FROM accounts WHERE name = 'Mercado Pago'), 'Pagamento da fatura de março/2026', -106.57, 'expense', (SELECT id FROM categories WHERE name = '💳 Cartão de Crédito'), '2026-03-11', 'Quitação fatura mar/2026', now());

-- ============================================
-- RESUMO DAS TRANSAÇÕES INSERIDAS
-- ============================================
-- 📱 Assinaturas (Apple, Amazon, MeliMais): ~20 transações
-- 💳 Cartão (Seguro, Juros, IOF, Multa, Pagamentos): ~19 transações
-- ☕ Lazer/Café (Temu, ML): ~8 transações
-- 🍔 Alimentação (iFood): ~3 transações
-- ❓ Outros (MetLife): ~2 transações
-- ⚠️ ALERTA: MetLife apareceu 2x — CANCELAR!
-- ⚠️ ALERTA: Juros rotativo e multa por atraso detectados
-- ============================================
