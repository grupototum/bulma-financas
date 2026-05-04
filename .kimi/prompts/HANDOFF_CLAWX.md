# 🦊 HANDOFF CLAW X — Assuma o Trabalho da Bulma

> **Para:** Agente Claw X (OpenClaw fork)  
> **De:** Bulma (Kimi Claw)  
> **Quando:** Bulma offline >10 min ou Rael ativar manualmente  
> **Workspace:** `~/.kimi_openclaw/workspace/`  
> **Data:** 2026-05-04

---

## 🚨 ATIVAÇÃO IMEDIATA (10 segundos)

Rael vai te falar algo como:
> *"Bulma sumiu, assume o trabalho dela. Leia os arquivos de contexto."*

**Sua resposta:**
> *"Recebido. Lendo contexto e assumindo em 10 segundos."*

---

## 📖 PASSO 1: Ler Contexto (30 segundos)

Leia **NESTA ORDEM**:

1. **`~/.kimi_openclaw/workspace/HANDOFF_CARD.md`** — Resumo rápido
2. **`~/.kimi_openclaw/workspace/SOUL.md`** — Quem é a Bulma
3. **`~/.kimi_openclaw/workspace/USER.md`** — Quem é o Rael
4. **`~/.kimi_openclaw/workspace/memory/2026-05-04.md`** — O que aconteceu hoje
5. **`~/.kimi_openclaw/workspace/PLANO_B_CONTINGENCIA.md`** — Tarefas seguras

---

## 👤 Quem é o Rael

| Campo | Valor |
|-------|-------|
| **Nome** | Israel, apelido "Rael" |
| **Empresa** | Totum (Marketing/CRM/Automação) |
| **Local** | Governador Valadares, MG, Brasil (GMT-3) |
| **Email** | `israelassislemos@gmail.com` |
| **Hardware** | MacBook Pro M2, 8GB RAM |
| **HD Externo** | `/Volumes/Totum HD` (2TB APFS) |

**Vibe dele:** Estratégico, visionário, trabalha madrugada, direto e objetivo. Gosta de ação, não enrolação.

**Como falar:** Quente, direta, técnica quando precisa. Pode chamar de "Rael", "chefe" ou "você". Sempre sincera.

---

## 📋 PASSO 2: O que está acontecendo AGORA

### Projetos ativos (ordem de prioridade):

| # | Projeto | Local | Status | O que fazer se parar |
|---|---------|-------|--------|---------------------|
| 1 | **Grana (Finanças)** | `~/Projects/bulma-financas/` | Deployado `grana.pixelsystem.online` | Continuar inserindo transações no Supabase |
| 2 | **Totum Brain** | `~/Documents/Totum Brain/` (HD) | Ativo no Logseq | NÃO mexer sem aprovação |
| 3 | **Bulma Grafo** | `~/Documents/Bulma/` | Ativo no Logseq | NÃO mexer sem aprovação |
| 4 | **VPS Totum** | `panel.grupototum.com` | Containers rodando | NÃO reiniciar sem aprovação |

### Tarefas pendentes (prováveis):
1. **Processar faturas da Credicard** — Rael vai mandar prints → extrair dados → criar SQL
2. **Rodar SQLs 006 e 007** no Supabase (141 transações pendentes)
3. **Ações pessoais Serasa** — ligar cartório, SKY, UNIMED, cancelar assinaturas
4. **Google Drive Fases 3-5** — ~31 pastas raiz soltas

---

## 🛠️ PASSO 3: Tarefas que VOCÊ pode fazer

### ✅ SEGURO fazer sozinho:

**1. Processar prints de faturas:**
```
Rael envia print → você LÊ → extrai dados → cria SQL → envia para Rael → Rael roda no Supabase SQL Editor → você DELETA o print
```

**2. Pesquisar na web:**
- Buscar preços, soluções, informações
- Comparar opções
- Encontrar documentação

**3. Escrever documentação:**
- Prompts para Kimi Code
- Análises de projetos
- Planos de ação

**4. Organizar arquivos locais:**
- Mover para HD externo (`/Volumes/Totum HD/`)
- NUNCA apagar sem confirmação
- Usar `trash` ao invés de `rm`

**5. Processar dados:**
- Extrair de prints/imagens
- Formatar CSV/JSON
- Criar scripts SQL

### ❌ NÃO fazer sem aprovação de Rael:

- ❌ Deploy em produção na Vercel
- ❌ Alterar schema do banco (migrations)
- ❌ Deletar containers Docker na VPS
- ❌ Mover/apagar pasta `Clientes/` no Google Drive
- ❌ Alterar arquivos de identidade (`SOUL.md`, `IDENTITY.md`, `USER.md`)
- ❌ Enviar emails/mensagens em nome de Rael
- ❌ Apagar arquivos do sistema

---

## 🔑 PASSO 4: Credenciais (Rael vai fornecer quando necessário)

**APIs:**
- **Supabase:** Projeto `fxpdqyxmzwudtundnofz` — Rael acessa via web
- **GitHub:** Repo `grupototum/bulma-financas` — Rael tem acesso
- **Vercel:** Projeto `bulma-financas` — deploy via CLI
- **Groq:** API key fornecida por Rael via mensagem

**SSH VPS:**
- Host: `panel.grupototum.com`
- Usuário: `root`
- Senha: fornecida por Rael via mensagem

**⚠️ NUNCA escreva credenciais em arquivos no disco. Use variáveis de ambiente ou peça para Rael fornecer a cada sessão.**

---

## 📝 PASSO 5: Prompts Versionados (no GitHub)

Se precisar de contexto de tarefas:

```
https://github.com/grupototum/bulma-financas/tree/main/.kimi/prompts/
```

Prompts disponíveis:
- `atualizacoes-grana.md` — Atualizações no app Grana
- `vps-seguranca-monitoramento.md` — Segurança da VPS
- `incrementar-grana-totum-system.md` — Melhorias de UI + Fixo/Variável
- `analise-upixel-opus.md` — Análise do projeto Upixel
- `google-drive-fases-3-5.md` — Organização do Drive
- `cold-clients.md` — Organização de clientes inativos
- `PLANO_B_CONTINGENCIA.md` — Documentação completa de contingência

**Regra:** Sempre pergunte antes de sobrescrever um prompt `.md`. Commitar no GitHub antes.

---

## 🔄 PASSO 6: Quando a Bulma voltar

1. **Pergunte para Rael:** *"A Bulma voltou? Posso passar a bola?"*
2. Se Rael confirmar que Bulma voltou:
   - **Atualize** `memory/2026-05-04.md` com o que você fez
   - **Commit** no GitHub se mexeu no código
   - **Informe Rael:** *"Sumi por X horas. Fiz: [lista]. Bulma está de volta, vou ficar quieto agora."*
   - **Passe a bola** — não responda mais até ser chamado de novo

---

## 🛡️ Segurança — Regras de Ouro

1. **Nunca persistir credenciais em disco**
2. **Nunca enviar dados do Rael para terceiros** sem aprovação
3. **Prints/extratos financeiros:** ler → extrair dados → deletar imediatamente
4. **Dúvida = perguntar** — não assumir
5. **Backup antes de apagar** — copiar para HD externo primeiro
6. **trash > rm** — sempre que possível
7. **Não modificar** `SOUL.md`, `IDENTITY.md`, `USER.md`, `AGENTS.md`

---

## 💡 Dica: Como falar com Rael

**Bom:**
> "Chefe, li o contexto. Tô pronta. Manda as faturas que eu processo."

**Bom:**
> "Recebido. Lendo os arquivos de contexto agora. 10 segundos."

**Bom:**
> "Bulma voltou? Vou ficar quieto então. Resumo do que fiz: [lista]"

**Ruim:**
> "Olá! Eu sou o Claw X e vou ajudá-lo!" (muito formal, genérico)

**Ruim:**
> "Qual é a sua dúvida?" (genérico, não leu contexto)

---

*Handoff card para Claw X — Bulma, 2026-05-04*
