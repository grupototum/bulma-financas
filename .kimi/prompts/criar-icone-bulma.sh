#!/bin/bash
# 🦊 CRIAR ÍCONE BULMA — Gera ícone com emoji/fox para o app Plano B
# Uso: bash criar-icone-bulma.sh

echo "🦊 Criando ícone da Bulma para o app..."
echo ""

# Verificar ferramentas
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg não encontrado. Instale com: brew install ffmpeg"
    exit 1
fi

if ! command -v sips &> /dev/null; then
    echo "❌ sips não encontrado. É built-in do macOS, algo está errado."
    exit 1
fi

if ! command -v iconutil &> /dev/null; then
    echo "❌ iconutil não encontrado. É built-in do macOS."
    exit 1
fi

APP_PATH="/Users/israellemos/Desktop/🦊 Bulma Plano B.app"
ICONSET_DIR="/tmp/BulmaIcon.iconset"
OUTPUT_ICNS="/tmp/BulmaIcon.icns"

# Criar fundo azul Bulma com emoji 🦊
echo "🎨 Gerando imagem base..."

# Criar fundo azul 1024x1024
ffmpeg -y -f lavfi -i color=c=#3B82F6:s=1024x1024 \
    -vf "format=rgba" \
    -frames:v 1 /tmp/bg-blue.png 2>/dev/null

# Criar círculo branco no centro (como badge do emoji)
ffmpeg -y -f lavfi -i color=c=#FFFFFF:s=800x800 \
    -vf "format=rgba,geq='if(lt(hypot(X-400,Y-400),380),255,0)'" \
    -frames:v 1 /tmp/circle-white.png 2>/dev/null

# Combinar fundo + círculo
ffmpeg -y -i /tmp/bg-blue.png -i /tmp/circle-white.png \
    -filter_complex "[0:v][1:v]overlay=(W-w)/2:(H-h)/2:format=auto" \
    -frames:v 1 /tmp/badge-bg.png 2>/dev/null

echo "✅ Badge criado"

# Como não conseguimos renderizar emoji com ffmpeg facilmente,
# vamos usar o próprio macOS para colocar o emoji no ícone
# Criando um ícone limpo que o usuário pode customizar depois

# Criar iconset
rm -rf "$ICONSET_DIR"
mkdir -p "$ICONSET_DIR"

echo "📐 Gerando tamanhos..."

# Gerar todos os tamanhos necessários
sips -z 16 16 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_16x16.png" >/dev/null 2>&1
sips -z 32 32 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_16x16@2x.png" >/dev/null 2>&1
sips -z 32 32 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_32x32.png" >/dev/null 2>&1
sips -z 64 64 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_32x32@2x.png" >/dev/null 2>&1
sips -z 128 128 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_128x128.png" >/dev/null 2>&1
sips -z 256 256 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_128x128@2x.png" >/dev/null 2>&1
sips -z 256 256 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_256x256.png" >/dev/null 2>&1
sips -z 512 512 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_256x256@2x.png" >/dev/null 2>&1
sips -z 512 512 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_512x512.png" >/dev/null 2>&1
sips -z 1024 1024 /tmp/badge-bg.png --out "$ICONSET_DIR/icon_512x512@2x.png" >/dev/null 2>&1

# Converter para ICNS
echo "🔄 Convertendo para ICNS..."
iconutil -c icns "$ICONSET_DIR" -o "$OUTPUT_ICNS" 2>/dev/null

if [ ! -f "$OUTPUT_ICNS" ]; then
    echo "❌ Falha ao criar ICNS"
    exit 1
fi

echo "✅ ICNS criado: $OUTPUT_ICNS"

# Copiar para o app
mkdir -p "$APP_PATH/Contents/Resources"
cp "$OUTPUT_ICNS" "$APP_PATH/Contents/Resources/AppIcon.icns"

# Atualizar Info.plist para referenciar o ícone
cat > "$APP_PATH/Contents/Info.plist" <<'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>plano-b</string>
    <key>CFBundleIdentifier</key>
    <string>com.rael.bulma-planob</string>
    <key>CFBundleName</key>
    <string>🦊 Bulma Plano B</string>
    <key>CFBundleDisplayName</key>
    <string>🦊 Bulma Plano B</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
</dict>
</plist>
EOF

# Limpar cache de ícones do Finder
echo "🔄 Atualizando ícone no Finder..."
touch "$APP_PATH"
rm -rf /tmp/BulmaIcon.iconset
rm -f /tmp/bg-blue.png /tmp/circle-white.png /tmp/badge-bg.png

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✅ ÍCONE CRIADO!                                        ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📱 Agora para deixar PERFEITO com a 🦊:"
echo ""
echo "   OPÇÃO 1 — Emoji no ícone (recomendado):"
echo "   1. Abra 'Preview' (Visualização) no Mac"
echo "   2. Pressione Cmd+Shift+T para abrir a barra de emojis"
echo "   3. Digite 🦊 e deixe grande"
echo "   4. Capture tela (Cmd+Shift+4) da área do emoji"
echo "   5. Clique direito no app → 'Obter Informações' (Get Info)"
echo "   6. Arraste a captura para o ícone no topo da janela"
echo ""
echo "   OPÇÃO 2 — Baixar imagem fox:"
echo "   1. Google 'fox icon png transparent'"
echo "   2. Baixe uma imagem 512x512"
echo "   3. Clique direito no app → 'Obter Informações'"
echo "   4. Arraste a imagem para o ícone"
echo ""
echo "   💡 O ícone azul já está aplicado! Só falta a 🦊 por cima."
echo ""
echo "🦊 App: $APP_PATH"
echo ""
