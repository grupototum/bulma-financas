# 🎯 PROMPT — Análise de Infraestrutura uPixel (Para Claude Opus)

> Para: Claude Opus (análise profunda)
> De: Bulma (assistente do Rael)
> Data: 2026-05-01
> Objetivo: Garantir que o uPixel NUNCA pare

---

## 🔴 CONTEXTO CRÍTICO

**O uPixel CRM NÃO PODE PARAR.** É o produto principal da empresa. Qualquer downtime = perda de receita.

---

## 📊 INFRAESTRUTURA ATUAL (VPS Hostinger)

### Servidor
- **IP:** 187.127.4.140
- **Hostname:** panel.grupototum.com
- **OS:** Ubuntu (kernel Linux)
- **CPU:** Núcleos suficientes (load average: 0.28, muito tranquilo)
- **RAM:** 16GB total, 2.1GB usados (13GB disponíveis)
- **Disco:** 193GB SSD, 57GB usados (137GB livres — 70% livre)
- **Swap:** 4GB, zero usado
- **Uptime:** 6 dias, 23h

### Docker Containers Rodando
```
NAMES            STATUS                          PORTS
nginx-totum      Up 3 days (healthy)             80, 443
evolution-api    Up 3 days (healthy)             47398→8080
n8n              Up 7 days (healthy)             5678
postgres-totum   Up 7 days (healthy)             5432
redis-totum      Up 3 days (healthy)             6379
upixel-api       Up 3 days (unhealthy)           3000→3000
apps-totum       Up 3 days (unhealthy)           3001→3001
totum-system     Up X seconds (health: starting) 3004→3004
ollama-totum     Up 7 days (unhealthy)           11435→11435
```

### Docker Compose Principal
Arquivo: `/docker/compose/docker-compose.yml`

**Banco de dados:**
- PostgreSQL 15 (postgres-totum)
- Databases criadas: evolution, n8n, upixel_crm, apps_totum, totum_system
- Usuário: postgres / Senha: postgres123456
- Porta: 5432 (exposta)

**Redis:**
- Redis 7 (redis-totum)
- Porta: 6379
- Persistência: appendonly yes

**uPixel API:**
- Imagem: node:20-alpine
- Porta: 3000
- Volume: `/docker/upixel:/app`
- Database URL: `postgresql://postgres:postgres123456@postgres:5432/upixel_crm`
- Redis URL: `redis://redis:6379`
- CMD: `npm ci --include=dev && npm run build && npm run preview -- --host 0.0.0.0 --port 3000`
- Healthcheck: wget → http://localhost:3000/

**Nginx (proxy reverso):**
- Portas: 80, 443
- Volumes: nginx.conf, /var/www/upixelcrm/dist

**n8n:**
- Porta: 5678
- Database: PostgreSQL (n8n)
- Host: n8n.grupototum.com

---

## 🔍 PROBLEMAS IDENTIFICADOS PELO BULMA

### 1. upixel-api — Status "unhealthy"
- **Causa:** Healthcheck tenta conectar ANTES do build Vite terminar (demora 5–10 min)
- **Logs:** `wget: can't connect to remote host: Connection refused` na porta 3000
- **Impacto:** Docker pode restartar o container desnecessariamente

### 2. apps-totum — Status "unhealthy" (MESMO PROBLEMA)
- Porta 3001, mesmo padrão de build demorado
- **Nota:** apps-totum está sendo movido pro Vercel. Pode ser apagado.

### 3. ollama-totum — Status "unhealthy"
- **Causa:** Healthcheck usa `wget`, mas imagem ollama NÃO TEM wget instalado
- **Logs:** Ollama funciona normalmente na porta 11435, só o healthcheck quebrado

### 4. totum-system — Status "Restarting" (antes do fix)
- **Causa:** Erro de casing `agents.tsx` vs `Agents.tsx` (Linux case-sensitive)
- **Fix parcial:** Bulma removeu arquivo duplicado
- **Problema restante:** Build falha com 15+ erros TypeScript (`Module '../types' has no exported member 'Agente'`)
- **Código incompleto:** `src/types/index.ts` está quase vazio (25 bytes)

---

## ❓ O QUE O OPUS PRECISA FAZER

### PRIORIDADE 1 — uPixel Nunca Para
1. **Analisar se a arquitetura atual é suficiente** pra uptime 99.9%
2. **Recomendar melhorias de resiliência:**
   - Healthcheck apropriado pro upixel (esperar build terminar)
   - Restart policy mais inteligente
   - Backup automático do banco upixel_crm
   - Monitoramento de uptime
3. **Recomendar separação de serviços críticos:**
   - uPixel deveria ter recursos dedicados (CPU/RAM reservados)?
   - Deveria estar em container separado com recursos garantidos?
4. **Plano de disaster recovery:**
   - Se a VPS cair, como recuperar uPixel rapidamente?
   - Backup de dados: frequência, destino, restauração
   - Ponto de restauração aceitável (RPO/RTO)

### PRIORIDADE 2 — Healthchecks
1. Corrigir healthcheck do upixel (usar `start_period` ou `interval` maior)
2. Corrigir healthcheck do ollama (instalar wget ou usar curl)
3. Remover apps-totum (se confirmado que está no Vercel)

### PRIORIDADE 3 — Segurança
1. PostgreSQL exposto na porta 5432 — isso é seguro?
2. Senha do postgres: `postgres123456` — precisa mudar?
3. n8n exposto na 5678 — precisa de firewall/autenticação?
4. evolution-api porta 47398 — segurança?

### PRIORIDADE 4 — Performance
1. uPixel builda a cada restart (npm ci + build + preview) — isso é eficiente?
2. Deveria usar imagem pré-buildada (multi-stage Dockerfile)?
3. O volume `/docker/upixel` é montado direto — correto?
4. Redis é usado corretamente pro cache?

### PRIORIDADE 5 — totum-system
1. O projeto tem código TypeScript quebrado
2. Precisa de desenvolvimento pra funcionar
3. Deve ser delegado ao TOT/Kimi Code

---

## 📋 RELATÓRIO ESPERADO

Envie ao Rael:

```
📊 ANÁLISE uPixel — Resiliência Máxima

✅ Status atual: ...
⚠️ Riscos identificados: ...
🔧 Recomendações: ...
📋 Plano de ação: ...
💰 Custos (se houver): ...
```

Inclua:
- Lista de riscos (criticidade alta/média/baixa)
- Recomendações imediatas (o que fazer AGORA)
- Recomendações de médio prazo
- Plano de backup/restore
- Arquitetura sugerida (diagrama textual)

---

## 🦊 CONTATO

Se precisar de mais dados, peça ao Rael que execute no terminal da VPS:
```bash
# Status completo
docker ps -a
docker stats --no-stream
df -h
free -h
systemctl status docker

# Logs
docker logs upixel-api --tail 100
docker logs nginx-totum --tail 50
docker logs postgres-totum --tail 50

# Rede
docker network inspect totum
ss -tlnp | grep -E '3000|5432|5678|80|443'

# Configurações
cat /docker/compose/docker-compose.yml
cat /docker/compose/nginx.conf
```

---

*Registrado por Bulma — 2026-05-01*
