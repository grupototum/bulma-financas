# 🎯 PROMPT — Kimi Code: Corrigir CSS do Bulma Finanças

> **Projeto:** Bulma Finanças v2
> **URL:** https://grana.pixelsystem.online
> **Repo:** https://github.com/grupototum/bulma-financas
> **Local:** ~/Projects/bulma-financas/
> **Stack:** Next.js 14.2.35 + Tailwind CSS + Supabase

---

## ✅ SOLUÇÃO ENCONTRADA (2026-04-30)

**O problema era:** Falta do arquivo `postcss.config.js`

**Solução aplicada:**
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

**Resultado:** CSS compilando corretamente (14.8KB), site renderizando com todos os estilos Tailwind.

**Deploy:** https://grana.pixelsystem.online ✅ FUNCIONANDO

---

## 📋 NOTA PARA KIMI CODE

Este prompt é apenas **referência histórica**. O CSS já foi corrigido e está funcionando.

Se precisar trabalhar no app no futuro, use este arquivo como contexto da estrutura do projeto.

O app **builda com sucesso**, mas o **CSS não aparece visualmente no navegador**:

- Build passa sem erro (`next build` completo)
- HTML gerado contém `link rel="stylesheet"` apontando pro CSS compilado
- Classes Tailwind aparecem no HTML (ex: `bg-gradient-to-br from-blue-50`)
- Mas o site renderiza como **HTML cru** (sem estilos aplicados)

---

## 🔧 O QUE JÁ FOI TENTADO

### Arquivos de configuração atuais:

**next.config.js** (CommonJS):
```javascript
/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    return config;
  },
};
module.exports = nextConfig;
```

**tsconfig.json**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "moduleResolution": "node"
  }
}
```

**tailwind.config.ts**:
```typescript
import type { Config } from "tailwindcss";
const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: { colors: { /* ... */ } } },
  plugins: [require("tailwindcss-animate")],
};
export default config;
```

**globals.css**:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Mudanças já feitas:
1. ✅ `next.config.mjs` → `next.config.js` (CommonJS)
2. ✅ Webpack alias manual para `@/`
3. ✅ `baseUrl` no tsconfig
4. ✅ `moduleResolution: node`
5. ✅ `postcss.config.mjs` criado depois removido (Next.js 14 tem PostCSS integrado)
6. ✅ Build passa localmente
7. ✅ Deploy funciona na Vercel

---

## 🎯 DIAGNÓSTICOS POSSÍVEIS

1. **PostCSS não processando Tailwind** — falta config do PostCSS ou Tailwind não está nos `node_modules`
2. **CSS não sendo importado** — `globals.css` pode não estar carregando no layout
3. **Tailwind config com content path errado** — pode estar apontando pra diretórios que não existem
4. **Problema com CSS no Next.js** — `css` pode estar desabilitado no build
5. **Vercel build diferente do local** — pode estar usando output static/export

---

## 📁 ESTRUTURA DO PROJETO

```
~/Projects/bulma-financas/
├── app/
│   ├── page.tsx          (tela de login)
│   ├── layout.tsx        (root layout com metadata)
│   ├── globals.css       (@tailwind directives)
│   ├── dashboard/
│   ├── transactions/
│   └── categories/
├── components/
│   └── auth/
│       └── login-form.tsx
├── lib/
│   ├── supabase-browser.ts
│   ├── supabase.ts
│   ├── auto-categorization.ts
│   └── utils.ts
├── public/
│   ├── bulma-avatar.png
│   ├── bulma-login.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── favicon.png
│   └── manifest.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🚨 ERROS NO CONSOLE DO NAVEGADOR

**NÃO são do app:**
- TensorFlow.js warnings → são de extensão do Chrome (ClickUp)
- `content.js:360` → extensão do Chrome
- `inject_main.js:1` → extensão do Chrome

**ERRO REAL:**
- `"Resource size is not correct - typo in the Manifest?"` para `icon-192.png` → ícone já foi corrigido (gerado com dimensões exatas 192×192 via ffmpeg), pode ser cache do navegador

---

## ✅ DEFINIÇÃO DE PRONTO

- [ ] CSS carrega visualmente no navegador (gradientes, cores, fontes, espaçamentos)
- [ ] Tela de login mostra fundo azul com gradiente
- [ ] Avatar da Bulma aparece arredondado com sombra
- [ ] Botões azuis com hover funcionando
- [ ] Nenhum erro de CSS no console do navegador
- [ ] Deploy na Vercel funcionando: https://grana.pixelsystem.online

---

## 🔑 ACESSO

Repo local: `~/Projects/bulma-financas/`
Deploy: https://grana.pixelsystem.online
GitHub: https://github.com/grupototum/bulma-financas

Para fazer deploy: `cd ~/Projects/bulma-financas && git push && npx vercel --yes --prod`

---

## ⚠️ REGRAS

1. **NÃO deletar** arquivos sem consultar
2. **NÃO mudar** a estrutura de pastas
3. **NÃO alterar** a lógica do app (Supabase, transações, etc.)
4. Focar **APENAS** no problema de CSS/estilo
5. Testar build local antes de deployar: `npm run build`
6. Se precisar instalar dependências, use `npm install` (não yarn)

---

## 💡 DICAS

- O CSS compilado fica em `.next/static/css/` após o build
- O Next.js 14 já tem PostCSS integrado — talvez não precise de `postcss.config.*`
- Verifique se `tailwindcss` e `postcss` estão em `node_modules/`
- O arquivo `globals.css` PRECISA ser importado no `layout.tsx` ou `page.tsx`

---

*Criado por: Bulma 🦊*
*Data: 2026-04-29/30*
*Para: Kimi Code / TOT*
