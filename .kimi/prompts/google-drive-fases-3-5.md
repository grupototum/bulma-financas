# 🎯 PROMPT — Google Drive Fases 3-5 (Delegar ao TOT)

> Para: TOT / Hermione / Outro Kimi Claw
> De: Bulma
> Data: 2026-05-01
> Conta: totumpersonalizados@gmail.com
> Ferramenta: rclone (`totum`)

---

## ✅ O QUE JÁ FOI FEITO (NÃO repetir)

Fase 1 ✅ — Estrutura base criada:
- `00_INBOX/`, `02_ARQUIVO/`, `03_REFERENCIA/`, `04_PESSOAL/`
- Subpastas de ano (2024/2025/2026_CONCLUIDO)
- Subpastas de referência (POPs, Manuais, Gabaritos, etc.)
- `00_INDICE_MESTRE.md`

Fase 2 ✅ — Triagem inicial:
- ~54 arquivos soltos renomeados com padrão `YYYYMMDD_CATEGORIA_Descritivo`
- 2 pastas de projeto (`Agosto/`, `Julho/`) movidas para `02_ARQUIVO/2024_CONCLUIDO/`
- `00_INBOX/` está 100% triado (zero arquivos com nome genérico)

---

## 🚨 REGRAS DE OURO

1. **NUNCA mover, renomear ou deletar:**
   - `Clientes/`
   - `💻 Plataforma Totum/`
   - `🦾 Agentes Totum/`

2. **NUNCA deletar arquivo sem confirmar com o Rael**

3. **Se tiver dúvida sobre importância** → move para `00_INBOX/` + Tag Amarela

4. **Nomenclatura:** `YYYYMMDD_CATEGORIA_Descritivo`
   - Categorias: `MKT`, `COM`, `FIN`, `ADM`, `REF`, `BKP`, `LEG`

---

## 🛠️ ACESSO RCLONE

### Configuração local:
- Config path: `~/.config/rclone/rclone.conf`
- Remote: `totum`

### Token OAuth (renova automaticamente):
O rclone cuida do refresh sozinho. Mas se precisar do token manualmente:

**Access Token (válido até ~1h — renova com `rclone about totum:`):**
```
ya29.a0AQvPyIPC8mS8dWXx1OGW5Xab_Buz6YeygRYWOye5SUX-0fD22mzEKAqSTRHBVhYCigqUec8w6VvcL0KCyWmFCMTjGOKypQnVGx1tzup_osk3WQHx3mA_h4vKi6i35zzMx6ugXJY0yYEflJCqO9CapjT2MambGVFewjw3xpGQN21Q7wKJEtD2n5Hsc-_FWufzs3HFdezeaCgYKAU8SARESFQHGX2MikhHmbljMcohEFOfjP45OMA0207
```

**Refresh Token (permanente até revogação):**
```
1//0hlxKZAmDIs9OCgYIARAAGBESNwF-L9Ir20lAobrLTW5rFNAocwiWzc4fzoUO9C-w7xLVY0kvJqeMc5IGgqqRRbSuFdV6U1DM9-c
```

> ⚠️ **O access_token do Google dura 1 hora.** Para renovar: rode `rclone about totum:` que o rclone atualiza automaticamente.

---

## 📋 FASES 3-5 — O QUE FAZER AGORA

### FASE 3 — Arquivar Projetos Concluídos

**Objetivo:** Mover pastas de projetos já finalizados para `02_ARQUIVO/`

**Passos:**
1. Listar pastas soltas na raiz (exceto as protegidas e as 4 novas):
```bash
rclone lsf totum: --max-depth 1 --dirs-only
```

2. Para cada pasta, verificar data da última modificação:
```bash
rclone lsjson totum:"NOME_DA_PASTA" --max-depth 1 | jq -r '.[].ModTime' | sort | tail -1
```

3. Se última modificação > 6 meses → candidato a arquivo
4. Identificar o ano da última atividade
5. Mover para `02_ARQUIVO/YYYY_CONCLUIDO/NOME_DA_PASTA/`

**Pastas prováveis para arquivo:**
- `Banners 2025/` (se projeto acabou)
- `EBOOK TOTUM/` (projeto concluído)
- Pastas de campanhas antigas
- Pastas de eventos passados

**Atenção:** Verificar se há arquivos com modificação recente dentro da pasta. Se sim, NÃO mover — marcar com Tag Amarela.

---

### FASE 4 — Consolidação de Conhecimento

**Objetivo:** Centralizar POPs, Manuais, Gabaritos espalhados

**Passos:**
1. Buscar em todas as pastas existentes:
```bash
# Procurar arquivos com palavras-chave
rclone lsjson totum: --max-depth 3 --include "*POP*" --include "*Manual*" --include "*Gabarito*" --include "*Procedimento*" --include "*Processo*"
```

2. Para cada arquivo encontrado:
   - Renomear: `YYYYMMDD_REF_Descritivo`
   - Mover para `03_REFERENCIA/POPs/`, `Manuais/`, ou `Gabaritos/`

3. Verificar `Comercial/`, `Guardião/`, `Tráfego/` — podem conter documentação

---

### FASE 5 — Higiene Final

**Objetivo:** Limpar duplicatas, temporários, e atualizar índice

**Passos:**
1. **Remover duplicatas** — arquivos com mesmo nome em pastas diferentes
2. **Limpar lixo:**
   - `._*` (resource forks do macOS)
   - `*.tmp`, `*.bak`
   - Pastas `temp/` ou `tmp/`
3. **Verificar `Clientes/` — pode ter lixo espalhado**
   - Cuidado: NÃO MOVER a pasta, só organizar dentro dela
4. **Atualizar `00_INDICE_MESTRE.md`** com estado final

---

## 📊 RELATÓRIO FINAL ESPERADO

Envie ao Rael:

```
📁 Google Drive — Fases 3-5 Concluídas

✅ Arquivados: X pastas → 02_ARQUIVO/
✅ Referências: Y arquivos → 03_REFERENCIA/
✅ Deletados: Z arquivos (com aprovação)
✅ Pendências: W itens com Tag Amarela

📋 Lista detalhada:
1. ...
2. ...
```

---

## 🆘 EM CASO DE ERRO

**Token expirou:**
```bash
rclone about totum:
```
Isso força o refresh automático.

**rclone não funciona:**
Verifique se o remote existe:
```bash
rclone listremotes
```

Se `totum:` não aparecer, o TOT precisa da config completa. Consulte Bulma.

---

*Plano original:* `~/Documents/Bulma/Plano_Organizacao_Google_Drive.md`
