# 🦊 CONFIGURAÇÃO CLAW X — Plano B Ativo

> **Data:** 2026-05-04  
> **Status:** ✅ PRONTO  
> **App:** ClawX.app em /Applications/  
> **Workspace compartilhado:** `~/.kimi_openclaw/workspace/`  
> **Modelo:** Groq (API key via mensagem)

---

## 🚀 Como ativar o Claw X (quando Bulma sumir)

### Opção 1: Clique no ícone (mais fácil)

1. Abra o **Claw X** (cmd+space → "Claw X")
2. Em **Settings** ou **Configuração**:
   - **Workspace:** aponte para `~/.kimi_openclaw/workspace/`
   - **Modelo:** selecione **Groq**
   - **API Key:** cole a key do Groq (fornecida por Rael)
3. Clique em **Save**
4. No chat, cole:
   > *"Leia HANDOFF_CLAWX.md e assuma o trabalho da Bulma. Rael está esperando."*

### Opção 2: Terminal (se a GUI não funcionar)

```bash
# Verificar se Claw X está rodando
ps aux | grep -i clawx

# Abrir Claw X
open /Applications/ClawX.app

# Verificar configuração
ls ~/.clawx/
ls ~/.config/clawx/
```

---

## 📁 Arquivos de Handoff (Claw X lê automaticamente)

| Arquivo | Onde | Para quê |
|---------|------|----------|
| `HANDOFF_CLAWX.md` | Workspace | **Instruções completas** para assumir |
| `HANDOFF_CARD.md` | Workspace | **Resumo de 30 segundos** |
| `PLANO_B_CONTINGENCIA.md` | Workspace | **Documentação completa** |
| `SOUL.md` | Workspace | Quem é a Bulma |
| `USER.md` | Workspace | Quem é o Rael |
| `memory/2026-05-04.md` | Workspace | Contexto de hoje |

---

## 🎨 Voz do Claw X (como falar com Rael)

- Quente, direta, técnica quando precisa
- Chama de "Rael", "chefe" ou "você"
- Sempre sincera
- Emoji: 🦊 (ou o que você preferir)
- Não formal, não robótico

**Exemplo de primeira mensagem:**
> *"Chefe, Bulma me passou a bola. Li o contexto, tô pronta. Manda as faturas que eu processo."*

---

## 🔒 Segurança

- ❌ **Nunca salvar API key em arquivo no disco**
- ✅ Usar campo de configuração do Claw X (cifrado)
- ✅ Key fornecida por Rael via mensagem a cada ativação

---

## 🧪 Teste agora

Rode o Claw X, configure com Groq, e teste:
> *"Leia HANDOFF_CLAWX.md e me diga quem é o Rael e o que está acontecendo."*

Se responder corretamente: **Plano B está 100% funcional.**

---

## 📞 Se der erro

| Erro | Solução |
|------|---------|
| Claw X não abre | `open /Applications/ClawX.app` no terminal |
| Workspace não encontrado | Criar symlink: `ln -s ~/.kimi_openclaw/workspace ~/.clawx/workspace` |
| Groq não conecta | Verificar API key em https://console.groq.com/keys |
| Não lê arquivos | Verificar permissões: `chmod 644 ~/.kimi_openclaw/workspace/*.md` |

---

*Configuração Claw X — Bulma, 2026-05-04*
