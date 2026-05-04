#!/bin/bash
# 🦊 SYNC MULTIPLAS PASTAS — Google Drive → HD Externo (Totum HD)
# Sincroniza Clientes + 3 pastas adicionais do Google Drive para o HD externo
# Uso: bash sync-drive-to-hd-unificado.sh
# Ideal para rodar pela madrugada (delegado ao TOT)

# ============================================
# CONFIGURAÇÃO
# ============================================
REMOTE="totum"
HD_BASE="/Volumes/Totum HD"
LOG_FILE="/tmp/sync-drive-to-hd.log"
LOCK_FILE="/tmp/sync-drive-to-hd.lock"

# Pastas para sincronizar
# Formato: "caminho_no_drive|nome_na_pasta_hd"
SYNC_PAIRS=(
    "Clientes|Clientes"
    "1JTDYd_VnH-O3DoL_6mR3fzm2qtOEJfil|Pasta_1JTDYd"
    "1JWlpz1dLjIrzr-wuU-2qC-6XTkxTpdN-|Pasta_1JWlpz"
    "1j4hqqcMl3nH0Hh7q-PpXCWvoOeVuTBg2|Pasta_1j4hqq"
)

# ============================================
# FUNÇÃO DE SINCRONIZAÇÃO
# ============================================
sync_pasta() {
    local drive_path="$1"
    local hd_name="$2"
    local source="${REMOTE}:${drive_path}"
    local dest="${HD_BASE}/${hd_name}"
    
    echo ""
    echo "📁 Sincronizando: ${source}"
    echo "        → ${dest}"
    
    # Verificar se origem existe no Drive
    if ! rclone lsf "$source" --max-depth 0 > /dev/null 2>&1; then
        echo "   ⚠️  Origem não encontrada no Drive: ${drive_path}"
        echo "   Tentando descobrir nome real..."
        # Tentar listar raiz e identificar
        local real_name=$(rclone lsf "$REMOTE:" --max-depth 0 2>/dev/null | head -50 | grep -m1 "")
        if [ -n "$real_name" ]; then
            echo "   Pastas disponíveis: ${real_name}"
        fi
        return 1
    fi
    
    # Criar pasta no HD se não existir
    if [ ! -d "$dest" ]; then
        echo "   📁 Criando pasta no HD: ${dest}"
        mkdir -p "$dest"
    fi
    
    # rclone sync: unidirecional Drive → HD
    rclone sync "$source" "$dest" \
        --progress \
        --transfers 8 \
        --checkers 16 \
        --exclude ".DS_Store" \
        --exclude "*.tmp" \
        --exclude "desktop.ini" \
        --exclude "Thumbs.db" \
        --log-level INFO \
        2>&1
    
    local exit_code=${PIPESTATUS[0]}
    
    if [ $exit_code -eq 0 ]; then
        echo "   ✅ OK: ${hd_name}"
    else
        echo "   ❌ Erro ${exit_code}: ${hd_name}"
    fi
    
    return $exit_code
}

# ============================================
# EXECUÇÃO PRINCIPAL
# ============================================

# Verificar lock file
if [ -f "$LOCK_FILE" ]; then
    PID=$(cat "$LOCK_FILE" 2>/dev/null)
    if ps -p "$PID" > /dev/null 2>&1; then
        echo "⏳ Sync já em execução (PID: $PID). Abortando."
        exit 0
    else
        rm -f "$LOCK_FILE"
    fi
fi

echo $$ > "$LOCK_FILE"

# Verificar HD montado
if [ ! -d "$HD_BASE" ]; then
    echo "❌ HD externo '${HD_BASE}' não está montado!"
    rm -f "$LOCK_FILE"
    exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🦊 SYNC GOOGLE DRIVE → HD EXTERNO (Totum HD)           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "⏰ Início: $(date)"
echo "📂 HD Destino: ${HD_BASE}"
echo ""

# Listar pastas disponíveis no Drive primeiro
echo "📋 Pastas disponíveis no Drive:"
rclone lsf "$REMOTE:" --max-depth 0 2>/dev/null | head -30 || echo "   (não foi possível listar)"
echo ""

# Sincronizar cada pasta
TOTAL_OK=0
TOTAL_ERRO=0
TOTAL_SKIP=0

for pair in "${SYNC_PAIRS[@]}"; do
    IFS='|' read -r drive_path hd_name <<< "$pair"
    
    if sync_pasta "$drive_path" "$hd_name"; then
        ((TOTAL_OK++))
    else
        ((TOTAL_ERRO++))
    fi
done

# Resumo
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "📊 RESUMO:"
echo "   ✅ OK: ${TOTAL_OK}"
echo "   ❌ Erros: ${TOTAL_ERRO}"
echo "   ⏰ Fim: $(date)"
echo "   📝 Log: ${LOG_FILE}"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Remover lock
rm -f "$LOCK_FILE"

if [ $TOTAL_ERRO -gt 0 ]; then
    exit 1
else
    exit 0
fi
