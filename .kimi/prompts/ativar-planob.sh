#!/bin/bash
# 🦊 ATIVADOR PLANO B — Script Python (funciona 100%)
# Uso: bash ativar-planob.sh
# Requisito: Python 3 (já vem no Mac)

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🦊 ATIVANDO PLANO B — Script Python                    ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Verificar Python
if ! command -v python3 > /dev/null 2>&1; then
    echo "❌ Python 3 não encontrado. Instale com: brew install python"
    exit 1
fi

echo "✅ Python 3 encontrado"
echo ""

# Pedir API key (não salva em disco, usa variável de ambiente)
echo "🔑 API Key do Groq:"
echo "   (não aparece na tela por segurança)"
echo -n "   Digite: "
read -s GROQ_KEY
echo ""

if [ -z "$GROQ_KEY" ]; then
    echo "❌ Key vazia. Abortando."
    exit 1
fi

echo "✅ Key recebida"
echo ""

# Exportar e rodar
export GROQ_API_KEY="$GROQ_KEY"

echo "🚀 Iniciando Plano B..."
echo ""
echo "   💬 Pronto! Fale comigo (digite 'sair' para encerrar)"
echo ""

python3 ~/.kimi_openclaw/workspace/planob.py

# Limpar key da memória
unset GROQ_API_KEY
echo ""
echo "🔒 API key removida da memória"
echo ""
