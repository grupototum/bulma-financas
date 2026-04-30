# 🎯 PROMPT — Organização Google Drive Totum

> Para: TOT (outro Kimi Claw)
> De: Bulma
> Data: 2026-04-29
> Conta: totumpersonalizados@gmail.com
> Ferramenta: rclone (remote configurado como `totum`)

---

## ✅ O QUE JÁ FOI FEITO (NÃO repetir)

A estrutura base já está criada. Não precisa criar pastas novas na raiz.

```
📦 Meu Drive (Totum)
├── 📁 00_INBOX/                    ← ✅ Criado
├── 📁 02_ARQUIVO/                  ← ✅ Criado
│   ├── 📁 2024_CONCLUIDO/
│   ├── 📁 2025_CONCLUIDO/
│   └── 📁 2026_CONCLUIDO/
├── 📁 03_REFERENCIA/               ← ✅ Criado
│   ├── 📁 POPs/
│   ├── 📁 Manuais/
│   ├── 📁 Gabaritos/
│   ├── 📁 Estudos_de_Persona/
│   └── 📁 Materiais_de_Marketing/
├── 📁 04_PESSOAL/                  ← ✅ Criado
├── 📄 00_INDICE_MESTRE.md          ← ✅ Criado
└── 📁 [+21 pastas existentes — NÃO MOVER]
```

**~88 arquivos soltos da raiz já foram movidos para `00_INBOX/`** (feito por subagente anterior).

---

## 🚨 REGRAS DE OURO

1. **NUNCA mover, renomear ou deletar a pasta `Clientes/`**
2. **NUNCA deletar arquivo sem confirmar com o Rael**
3. **Se tiver dúvida** → move para `00_INBOX/` + Tag Amarela
4. Nomenclatura padrão: `YYYYMMDD_CATEGORIA_Descritivo`
   - Ex: `20260429_MKT_Campanha_Botox_Derma.docx`

---

## 🛠️ FERRAMENTA

Use **rclone** (já configurado):
```bash
# Listar estrutura
rclone lsjson totum: --max-depth 2

# Mover arquivo
rclone moveto "totum:ORIGEM" "totum:DESTINO"

# Renomear
rclone moveto "totum:PATH/ANTIGO" "totum:PATH/NOVO"
```

---

## 📋 PRÓXIMAS AÇÕES (Fazer agora)

### FASE 2 — Triagem e Higiene

**1. Verificar se ainda há arquivos soltos na raiz**
```bash
rclone lsf totum: --max-depth 1 --files-only
```
Se houver, mover para `00_INBOX/`.

**2. Dentro de `00_INBOX/`, identificar lixo eletrônico:**
- Arquivos `._*` (resource forks do macOS)
- Arquivos `.rar`, `.zip` antigos sem contexto
- Arquivos `Documento sem título.docx` (genéricos)
- Arquivos `Anotações` sem conteúdo útil
- **Ação:** Criar lista pro Rael aprovar deleção. NÃO deletar sozinho.

**3. Renomear arquivos genéricos dentro de `00_INBOX/`**
- Usar padrão: `YYYYMMDD_CATEGORIA_Descritivo`
- Categorias: `MKT` (marketing), `COM` (comercial), `FIN` (financeiro), `ADM` (administrativo), `REF` (referência), `BKP` (backup)

**4. Aplicar Tags de sinalização no Google Drive**
- 🟡 Amarela = Revisar antes de decidir
- 🟢 Verde = Já organizado
- 🔴 Vermelha = Deletar (confirmar)

---

### FASE 3 — Arquivo Cronológico

**1. Identificar projetos/documentos concluídos em pastas existentes**
- Ex: `Banners 2025/` → provavelmente tudo de 2025 já acabou → mover para `02_ARQUIVO/2025_CONCLUIDO/`
- Ex: `EBOOK TOTUM/` → projeto concluído em 2024 → mover para `02_ARQUIVO/2024_CONCLUIDO/`
- Ex: `IBI Telecom/` → projeto antigo → verificar data e mover

**2. Verificar datas de modificação**
- Projetos com última modificação > 6 meses → candidatos a arquivo
- **Ação:** Listar pro Rael confirmar antes de mover

---

### FASE 4 — Consolidação de Conhecimento

**1. Buscar POPs, Manuais, Gabaritos espalhados em pastas existentes**
- Procurar arquivos com "POP", "Manual", "Gabarito", "Procedimento", "Processo" no nome
- Ex: `Comercial/Escalável.docx` → pode ser um manual?
- Ex: `Guardião/` → pode conter POPs?

**2. Mover para `03_REFERENCIA/` nas subpastas corretas**
- Renomear com prefixo `YYYYMMDD_REF_`

---

### FASE 5 — Higiene Final

**1. Remover duplicatas**
- Ex: `Clientes/Documento sem título.docx` (aparece 2x)

**2. Limpar arquivos temporários**
- `temp/`, arquivos `.tmp`, `.bak`

**3. Atualizar `00_INDICE_MESTRE.md`**
- Refletir mudanças feitas

---

## 📞 CONTEXTO IMPORTANTE

- **Google Drive Desktop** está em modo virtual (sem cache local)
- **rclone remote:** `totum` (já configurado e autenticado)
- **Espaço usado:** 1.473 TiB de 7 TiB
- **Rael** = Israel, CEO da Totum, GMT-3
- **Bulma** = assistente pessoal dele (eu)

---

## ✅ DEFINIÇÃO DE PRONTO

- [ ] Raiz do Drive só tem as 4 pastas novas + pastas existentes + INDICE_MESTRE
- [ ] `00_INBOX/` triado (lixo identificado, genéricos renomeados)
- [ ] Projetos concluídos identificados para arquivo
- [ ] POPs/Manuais/Gabaritos centralizados em `03_REFERENCIA/`
- [ ] `00_INDICE_MESTRE.md` atualizado com estado final
- [ ] Relatório enviado ao Rael com o que foi feito

---

*Perguntas? Consulte o arquivo original do plano:*
`~/Documents/Bulma/Plano_Organizacao_Google_Drive.md`
