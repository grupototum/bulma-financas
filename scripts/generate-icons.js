const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function generateIcons() {
  const inputPath = path.join(__dirname, 'public', 'bulma-avatar.png');
  const output192 = path.join(__dirname, 'public', 'icon-192.png');
  const output512 = path.join(__dirname, 'public', 'icon-512.png');
  const faviconPath = path.join(__dirname, 'public', 'favicon.ico');

  // Verificar se sharp está instalado
  try {
    require.resolve('sharp');
  } catch {
    console.log('sharp não instalado. Instalando...');
    // Não podemos instalar em runtime, vamos avisar
    console.log('Por favor rode: npm install sharp');
    process.exit(1);
  }

  // Criar ícone 192x192
  await sharp(inputPath)
    .resize(192, 192, { fit: 'cover', position: 'center' })
    .png()
    .toFile(output192);
  console.log('✅ icon-192.png criado');

  // Criar ícone 512x512
  await sharp(inputPath)
    .resize(512, 512, { fit: 'cover', position: 'center' })
    .png()
    .toFile(output512);
  console.log('✅ icon-512.png criado');

  // Criar favicon 32x32
  await sharp(inputPath)
    .resize(32, 32, { fit: 'cover', position: 'center' })
    .png()
    .toFile(path.join(__dirname, 'public', 'favicon.png'));
  console.log('✅ favicon.png criado');

  console.log('\n🦊 Ícones gerados com sucesso!');
}

generateIcons().catch(console.error);
