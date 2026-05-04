# 🦊 TAREFA PARA TOT — Sync Clientes: Google Drive → HD Externo

> **Data:** 2026-05-04  
> **Solicitante:** Rael (Israel, CEO Totum)  
> **Executor:** TOT (subagente OpenClaw)  
> **Horário:** Pela madrugada (3h da manhã ou quando TOT estiver online)  
> **Prioridade:** MÉDIA — não é urgente, pode rodar de madrugada

---

## 🎯 Objetivo

Sincronizar a pasta **"Clientes"** do Google Drive (`totumpersonalizados@gmail.com`) para o **HD Externo "Totum HD"** (`/Volumes/Totum HD/Clientes`).

Isso mantém um **backup local atualizado** da pasta de clientes da Totum.

---

## 📁 Caminhos

| O quê | Caminho |
|-------|---------|
| **Origem** (Google Drive) | `totum:Clientes` (rclone remote) |
| **Destino** (HD Externo) | `/Volumes/Totum HD/Clientes` |
| **Script** | `~/.kimi_openclaw/workspace/sync-clientes-drive-to-hd.sh` |
| **Log** | `/tmp/sync-clientes.log` |
| **Lock file** | `/tmp/sync-clientes.lock` |

---

## 🚀 Comando para executar

```bash
bash ~/.kimi_openclaw/workspace/sync-clientes-drive-to-hd.sh
```

---

## ✅ Pré-condições (verificar antes)

1. **HD externo montado:**
   ```bash
   ls -la "/Volumes/Totum HD/"
   ```
   Se não aparecer, o HD não está conectado. Abortar.

2. **rclone configurado:**
   ```bash
   rclone lsf totum:Clientes --max-depth 0
   ```
   Se não listar, o remote não está OK. Abortar.

3. **Lock file não existir:**
   ```bash
   ls /tmp/sync-clientes.lock 2>/dev/null
   ```
   Se existir, outro sync está rodando. Esperar.

---

## 📊 O que o script faz

1. Verifica se HD externo está montado
2. Cria pasta `/Volumes/Totum HD/Clientes` se não existir
3. Roda `rclone sync totum:Clientes /Volumes/Totum HD/Clientes`
   - Baixa arquivos novos do Drive para o HD
   - Atualiza arquivos modificados
   - **NÃO deleta** arquivos do HD (sync unidirecional)
4. Gera log em `/tmp/sync-clientes.log`
5. Remove lock file ao terminar

---

## ⏰ Quando executar

- **Ideal:** 3h da manhã (quando ninguém usa o Mac)
- **Alternativa:** Qualquer horário de madrugada que o TOT estiver online
- **Evitar:** Horário comercial (Rael pode estar usando o Mac)

---

## 🛡️ Segurança

- **Nunca deletar** a pasta Clientes no HD
- **Nunca sobrescrever** arquivos mais novos no HD com versões mais antigas do Drive
- Se houver erro, **logar e reportar** ao Rael
- O script tem lock file para evitar execução simultânea

---

## 📋 Resumo para TOT

> **Rael quer:** Sincronizar pasta Clientes do Google Drive pro HD externo.  
> **Como:** Rode `bash ~/.kimi_openclaw/workspace/sync-clientes-drive-to-hd.sh` de madrugada.  
> **Quando:** 3h da manhã ou quando TOT estiver online e Mac ligado.  
> **Resultado:** Backup local atualizado da pasta Clientes.

---

## 🦊 Bulma (criadora do script)

Script criado em 2026-05-04 por Bulma (Kimi Claw).  
Se tiver dúvidas, consulte Bulma ou Rael.

