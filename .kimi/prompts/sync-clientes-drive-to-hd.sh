#!/bin/bash
# 🦊 SYNC CLIENTES — Google Drive → HD Externo (Totum HD)
# Sincroniza a pasta "Clientes" do Google Drive para o HD externo
# Uso: bash sync-clientes-drive-to-hd.sh
# Ideal para rodar pela madrugada (3h da manhã)

# ============================================
# CONFIGURAÇÃO
# ============================================
REMOTE="totum"                           # rclone remote configurado
SOURCE="totum:Clientes"                  # Origem: pasta Clientes no Google Drive
DEST="/Volumes/Totum HD/Clientes"        # Destino: pasta Clientes no HD externo
LOG_FILE="/tmp/sync-clientes.log"        # Log de execução
LOCK_FILE="/tmp/sync-clientes.lock"     # Previne execução simultânea

# ============================================
# VERIFICAÇÕES INICIAIS
# ============================================

# Verificar se outra instância está rodando
if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE" 2>/dev/null)
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "⏳ Sync já em execução (PID: $PID). Abortando."
        exit 0
    else
        rm -f "$LOCK_FILE"
    fi
fi

# Criar lock file
echo $$ > "$LOCK_FILE"

# Verificar se HD externo está montado
if [ ! -d "/Volumes/Totum HD" ]; then
    echo "❌ HD externo 'Totum HD' não está montado!"
    echo "   Conecte o HD e tente novamente."
    rm -f "$LOCK_FILE"
    exit 1
fi

# Verificar se pasta de destino existe (criar se não)
if [ ! -d "$DEST" ]; then
    echo "📁 Criando pasta de destino: $DEST"
    mkdir -p "$DEST"
fi

# ============================================
# EXECUÇÃO DO SYNC
# ============================================
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🦊 SYNC CLIENTES — Google Drive → HD Externo            ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Início: $(date)"
echo "📥 Origem: ${SOURCE}"
echo "📤 Destino: ${DEST}"
echo ""

# rclone sync: Drive → HD (baixa arquivos novos/alterados, não deleta do HD)
rclone sync "$SOURCE" "$DEST" \
    --progress \
    --transfers 8 \
    --checkers 16 \
    --exclude ".DS_Store" \
    --exclude "*.tmp" \
    --exclude "desktop.ini" \
    --exclude "Thumbs.db" \
    --log-level INFO \
    2>&1 | tee "$LOG_FILE"

EXIT_CODE=${PIPESTATUS[0]}

# Resumo
echo ""
echo "═══════════════════════════════════════════════════════════"
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ SYNC CONCLUÍDO COM SUCESSO"
else
    echo "❌ SYNC FINALIZADO COM ERROS (código: $EXIT_CODE)"
fi
echo "   ⏰ Fim: $(date)"
echo "   📝 Log: ${LOG_FILE}"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Remover lock file
rm -f "$LOCK_FILE"

exit $EXIT_CODE
