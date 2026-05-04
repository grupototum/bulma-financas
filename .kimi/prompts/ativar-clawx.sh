#!/bin/bash
# 🦊 ATIVADOR CLAW X — Plano B
# Uso: bash ativar-clawx.sh
# Ou: duplo-clique no PLANO-B-ClawX.command

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🦊 ATIVANDO CLAW X — Plano B da Bulma                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar Claw X
if [ ! -d "/Applications/ClawX.app" ]; then
    echo "❌ Claw X não encontrado em /Applications/ClawX.app"
    echo "   Baixe em: https://claw-x.com/"
    exit 1
fi

echo "✅ Claw X encontrado"
echo ""

# Verificar workspace
if [ -L "$HOME/.clawx/workspace" ]; then
    echo "✅ Workspace compartilhado configurado"
    echo "   → ~/.clawx/workspace → ~/.kimi_openclaw/workspace/"
else
    echo "🔗 Criando symlink do workspace..."
    mkdir -p "$HOME/.clawx"
    ln -sf "$HOME/.kimi_openclaw/workspace" "$HOME/.clawx/workspace"
    echo "   ✅ Symlink criado"
fi
echo ""

# Verificar arquivos de handoff
HANDOFF="$HOME/.kimi_openclaw/workspace/HANDOFF_CLAWX.md"
if [ -f "$HANDOFF" ]; then
    echo "✅ Arquivo de handoff encontrado"
else
    echo "⚠️  Arquivo de handoff não encontrado"
fi
echo ""

# Abrir Claw X
echo "🚀 Abrindo Claw X..."
open /Applications/ClawX.app

echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📱 PASSOS NO CLAW X (faça manualmente):"
echo ""
echo "   1️⃣  Aguarde o Claw X abrir"
echo "   2️⃣  Vá em Settings / Configuração"
echo "   3️⃣  Modelo: selecione GROQ"
echo "   4️⃣  Cole a API key do Groq (Rael tem)"
echo "   5️⃣  Workspace: deve estar em ~/.clawx/workspace/"
echo "   6️⃣  Salve as configurações"
echo ""
echo "   💬 No chat do Claw X, cole:"
echo ""
echo "─────────────────────────────────────────────────────────────"
cat <<'MENSAGEM'
Leia HANDOFF_CLAWX.md no workspace e assuma o trabalho da Bulma.
Rael (Israel, CEO da Totum) está esperando. Prioridade: processar
prints de faturas e inserir transações no Supabase.
MENSAGEM
echo "─────────────────────────────────────────────────────────────"
echo ""
echo "   7️⃣  Cole os prints/faturas que Rael enviar"
echo "   8️⃣  O Claw X extrai dados e cria SQL"
echo "   9️⃣  Rael roda o SQL no Supabase SQL Editor"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "✅ Claw X configurado como Plano B"
echo "   Quando Bulma voltar, ela retoma automaticamente"
echo ""
echo "🦊 Rael nunca fica sem IA"
echo ""
