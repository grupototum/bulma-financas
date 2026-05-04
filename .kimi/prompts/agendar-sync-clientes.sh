#!/bin/bash
# 🦊 AGENDAR SYNC CLIENTES — Roda pela madrugada
# Adiciona ao crontab para rodar automaticamente às 3h da manhã

SCRIPT_PATH="/Users/israellemos/.kimi_openclaw/workspace/sync-clientes-drive-to-hd.sh"

# Verificar se script existe
if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ Script não encontrado: $SCRIPT_PATH"
    exit 1
fi

chmod +x "$SCRIPT_PATH"

echo "🦊 Agendador: Sync Clientes (Google Drive → HD Externo)"
echo ""

# Verificar se já existe entrada no crontab
if crontab -l 2>/dev/null | grep -q "sync-clientes-drive-to-hd"; then
    echo "⚠️  Já existe agendamento para sync-clientes"
    echo ""
    echo "   Crontab atual:"
    crontab -l | grep sync-clientes
    echo ""
    echo -n "   Deseja recriar? (s/n): "
    read resposta
    if [ "$resposta" != "s" ] && [ "$resposta" != "S" ]; then
        echo "   Mantendo configuração atual."
        exit 0
    fi
fi

echo "   Frequência padrão: 3h da manhã (03:00)"
echo "   Quando Mac estiver ligado pela madrugada"
echo ""

# Comando do cron — roda às 3h da manhã todos os dias
# Se o Mac estiver dormindo, o cron não executa (limitação do macOS)
CRON_CMD="0 3 * * * /bin/bash $SCRIPT_PATH >> /tmp/sync-clientes-cron.log 2>&1"

# Adicionar ao crontab (removendo entrada anterior se existir)
(crontab -l 2>/dev/null | grep -v "sync-clientes-drive-to-hd"; echo "$CRON_CMD") | crontab -

echo ""
echo "✅ Agendado!"
echo ""
echo "   Frequência: Todos os dias às 03:00"
echo "   Script: $SCRIPT_PATH"
echo "   Log: /tmp/sync-clientes-cron.log"
echo ""
echo "📋 Crontab atual:"
crontab -l | grep sync-clientes

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "💡 IMPORTANTE:"
echo "   O Mac precisa estar ligado às 3h para o sync rodar."
echo "   Se estiver dormindo, o cron não executa."
echo ""
echo "   Alternativa: Rode manualmente com:"
echo "   bash $SCRIPT_PATH"
echo "═══════════════════════════════════════════════════════════"
echo ""
