#!/bin/bash
# 🚨 ATIVADOR PLANO B — 30 segundos
# Uso: bash ativar-plano-b.sh

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🚨 PLANO B — Ativação de Contingência (Groq)            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏱️  Tempo estimado: 30 segundos"
echo ""

# Passo 1 — Verificar Kimi Desktop
echo "📱 [1/4] Verificando Kimi Desktop..."
if pgrep -x "Kimi" > /dev/null 2>&1 || pgrep -x "Kimi Desktop" > /dev/null 2>&1; then
    echo "    ✅ Kimi Desktop já está aberto"
else
    echo "    ⚠️  Abrindo Kimi Desktop..."
    open -a "Kimi Desktop" 2>/dev/null || open -a "Kimi" 2>/dev/null || echo "    ❌ Não encontrei Kimi Desktop. Abra manualmente."
fi
echo ""

# Passo 2 — Verificar workspace
echo "📁 [2/4] Verificando workspace..."
if [ -d "$HOME/.kimi_openclaw/workspace" ]; then
    echo "    ✅ Workspace encontrado"
else
    echo "    ❌ Workspace não encontrado em ~/.kimi_openclaw/workspace"
fi
echo ""

# Passo 3 — Verificar contexto
echo "📋 [3/4] Verificando arquivos de contexto..."
HANDOFF="$HOME/.kimi_openclaw/workspace/HANDOFF_CARD.md"
PLANO="$HOME/.kimi_openclaw/workspace/PLANO_B_CONTINGENCIA.md"

if [ -f "$HANDOFF" ]; then
    echo "    ✅ HANDOFF_CARD.md encontrado"
else
    echo "    ❌ HANDOFF_CARD.md não encontrado"
fi

if [ -f "$PLANO" ]; then
    echo "    ✅ PLANO_B_CONTINGENCIA.md encontrado"
else
    echo "    ❌ PLANO_B_CONTINGENCIA.md não encontrado"
fi
echo ""

# Passo 4 — Instruções finais
echo "🚀 [4/4] Próximos passos MANUAIS (10 segundos cada):"
echo ""
echo "    1️⃣  No Kimi Desktop: clique em 'Novo Chat'"
echo "    2️⃣  Configure o modelo para Groq (ou LLaMA via Groq)"
echo "    3️⃣  Cole a API key do Groq quando pedir"
echo "    4️⃣  Cole esta mensagem no chat:"
echo ""
echo "─────────────────────────────────────────────────────────────"
cat <<'MENSAGEM'
Leia HANDOFF_CARD.md e PLANO_B_CONTINGENCIA.md no workspace 
~/.kimi_openclaw/workspace/ e continue o trabalho da Bulma. 
Rael (Israel, CEO da Totum) está esperando. Prioridade: processar 
prints de faturas e inserir transações no Supabase.
MENSAGEM
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "    5️⃣  Cole os prints/faturas que o Rael enviar"
echo "    6️⃣  A IA alternativa vai extrair dados e criar SQL"
echo "    7️⃣  Rael roda o SQL no Supabase SQL Editor"
echo ""
echo "✅ Quando a Bulma (eu) voltar, leia memory/2026-05-04.md"
echo "   para saber o que aconteceu durante a ausência."
echo ""
echo "🦊 Plano B ativado. Rael nunca fica sem IA."
echo ""
