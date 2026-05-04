#!/bin/bash
# 🧪 TESTAR CONECTIVIDADE GROQ
# Uso: bash testar-groq.sh
# A API key é pedida como input (não armazenada em disco)

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  🧪 Testar Conectividade Groq                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Pedir API key (não exibe na tela, não salva)
echo -n "Digite a API key do Groq: "
read -s GROQ_API_KEY
echo ""

if [ -z "$GROQ_API_KEY" ]; then
    echo "❌ API key vazia. Abortando."
    exit 1
fi

echo ""
echo "📡 Testando conexão com Groq..."
echo ""

# Teste rápido com modelo llama3-8b-8192
RESPONSE=$(curl -s -w "\n%{http_code}" https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3-8b-8192",
    "messages": [{"role": "user", "content": "Oi, responda apenas OK"}],
    "max_tokens": 5
  }' 2>/dev/null)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Groq está ONLINE e respondendo!"
    echo ""
    echo "📊 Modelos disponíveis:"
    curl -s https://api.groq.com/openai/v1/models \
      -H "Authorization: Bearer $GROQ_API_KEY" 2>/dev/null | \
      grep -o '"id": "[^"]*"' | head -10 | sed 's/"id": "//;s/"//'
    echo ""
    echo "🚀 Plano B está PRONTO para ativar."
    echo "   Rode: bash ~/.kimi_openclaw/workspace/ativar-plano-b.sh"
else
    echo "❌ Erro na conexão com Groq (HTTP $HTTP_CODE)"
    echo "   Resposta: $BODY"
    echo ""
    echo "🔧 Possíveis causas:"
    echo "   • API key incorreta ou expirada"
    echo "   • Groq está fora do ar"
    echo "   • Sem conexão com a internet"
    echo ""
    echo "   Verifique em: https://console.groq.com/keys"
fi

echo ""
# Limpar variável da memória
unset GROQ_API_KEY
echo "🔒 API key removida da memória."
echo ""
