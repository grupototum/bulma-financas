# 🛡️ Prompt: VPS — Segurança, Monitoramento e Documentação

## Contexto

A VPS da Totum está rodando na Hostinger (Ubuntu, IP 187.127.4.140, hostname panel.grupototum.com). O Codex já executou um plano de correção com sucesso:

- Todos containers Docker healthy (evolution-api, nginx-totum, upixel-api, n8n, postgres-totum, redis-totum, ollama-totum)
- Portas sensíveis presas em 127.0.0.1 (3000, 47398, 5678, 6379, 5432, 11435)
- Backups automáticos diários (Postgres 03:17, volumes 03:47)
- Healthcheck a cada 5 minutos em /root/totum-ops/healthcheck.sh
- Rotação de logs Docker configurada (aplica no próximo restart)
- Regras iptables antigas limpas

**O Codex NÃO aplicou ainda (por segurança, para não trancar o Rael fora):**
- Desativar login root + senha no SSH

---

## 🎯 Objetivo

Implementar camadas de segurança e monitoramento na VPS, **sem risco de perder acesso remoto**.

---

## 📋 Tarefas

### 1. 🔐 Segurança SSH (FAZER PRIMEIRO, COM CUIDADO!)

**Passo A — Criar usuário administrativo:**
```bash
# Criar usuário 'totum' com sudo
useradd -m -s /bin/bash -G sudo totum
passwd totum  # definir senha forte
```

**Passo B — Gerar e instalar chave SSH:**
- Gerar par de chaves Ed25519
- Copiar chave pública para `~totum/.ssh/authorized_keys`
- Testar login com `ssh totum@187.127.4.140` ANTES de desativar root

**Passo C — Só DEPOIS do teste OK, endurecer SSH:**
Editar `/etc/ssh/sshd_config`:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
```

```bash
systemctl restart sshd
```

**⚠️ ATENÇÃO:** Antes de aplicar, abrir uma segunda sessão SSH para garantir que o novo usuário funciona. Se travar, a segunda sessão salva.

---

### 2. 🛡️ Fail2Ban — Proteção Brute-Force

```bash
apt update && apt install -y fail2ban
```

Criar `/etc/fail2ban/jail.local`:
```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log
```

```bash
systemctl enable fail2ban
systemctl restart fail2ban
fail2ban-client status
```

---

### 3. 🔥 UFW Firewall (simples e efetivo)

```bash
apt install -y ufw

# Default deny
ufw default deny incoming
ufw default allow outgoing

# Allow necessários
ufw allow 22/tcp     # SSH (mudar se alterar porta depois)
ufw allow 80/tcp     # nginx HTTP
ufw allow 443/tcp    # nginx HTTPS

# Explicitamente BLOQUEAR portas dos containers (redundância)
# 3000, 47398, 5678, 6379, 5432, 11435 já estão em 127.0.0.1 no Docker
# mas UFW adiciona camada extra de segurança

ufw enable
ufw status verbose
```

---

### 4. 📡 Alertas de Container (WhatsApp/Evolution API)

O healthcheck em `/root/totum-ops/healthcheck.sh` roda a cada 5 minutos. Precisa **notificar** quando um container ficar unhealthy.

**Opção A — Script de alerta:**
Criar `/root/totum-ops/alert.sh` que envia mensagem via Evolution API quando detecta container unhealthy.

**Evolution API já está rodando na VPS:**
- URL interna: `http://localhost:47398`
- Endpoint para enviar mensagem: `POST /message/sendText`
- Instância já configurada com WhatsApp

**Exemplo de payload:**
```json
{
  "number": "5511999999999",
  "text": "🚨 ALERTA VPS Totum\n\nContainer 'upixel-api' está UNHEALTHY.\nHora: 2026-05-02 15:30\nIP: 187.127.4.140"
}
```

**Opção B — UptimeRobot (gratuito, externo):**
- Cadastrar monitor HTTP para upixel.app, evolution.grupototum.com, n8n.grupototum.com
- Alerta por email/WhatsApp quando site cair

**Recomendação:** Implementar Opção A (alerta interno via Evolution) + Opção B (monitor externo como backup).

---

### 5. 🔒 SSL Auto-Renewal — Verificar

```bash
certbot renew --dry-run
```

Se funcionar, garantir que o cron de renovação está ativo:
```bash
systemctl status certbot.timer
# ou
ls /etc/cron.d/certbot
```

Se NÃO tiver certbot configurado, instalar e configurar para os domínios:
- upixel.app
- evolution.grupototum.com
- n8n.grupototum.com
- ollama.grupototum.com (quando subir)

---

### 6. 📝 Documentar Infra no GitHub

Criar arquivo `docs/vps-infra.md` no repo `grupototum/bulma-financas` com:

```markdown
# 🖥️ Infraestrutura VPS Totum

## Servidor
- **Host:** panel.grupototum.com
- **IP:** 187.127.4.140
- **Provider:** Hostinger
- **OS:** Ubuntu
- **Specs:** 16GB RAM, 193GB SSD

## Containers Docker
| Container | Porta (externa) | Status | Descrição |
|-----------|-----------------|--------|-----------|
| evolution-api | 47398→8080 | healthy | WhatsApp API |
| nginx-totum | 80, 443 | healthy | Reverse proxy |
| upixel-api | 3000→3000 | healthy | API da Totum |
| n8n | 5678→5678 | healthy | Automações |
| postgres-totum | 5432→5432 | healthy | Banco de dados |
| redis-totum | 6379→6379 | healthy | Cache/sessões |
| ollama-totum | 11435→11435 | running | LLM local |

## Backups
- Postgres: todo dia 03:17 → /root/backups/postgres/
- Volumes: todo dia 03:47 → /root/backups/volumes/
- Retenção: 7 dias

## Segurança
- SSH: key-only (Ed25519), root disabled
- Fail2Ban: ssh + nginx
- UFW: 22, 80, 443 apenas
- Portas internas Docker: 127.0.0.1 apenas

## Monitoramento
- Healthcheck: a cada 5 min via /root/totum-ops/healthcheck.sh
- Alertas: WhatsApp via Evolution API
```

---

## 🔧 Comando de Conexão

```bash
sshpass -p 'Totum@Ubuntu2026' ssh -o StrictHostKeyChecking=no root@187.127.4.140
```

Ou (após criar usuário com chave):
```bash
ssh totum@panel.grupototum.com
```

---

## ⚠️ Checklist de Segurança (validar após execução)

- [ ] Usuário `totum` criado com sudo
- [ ] Login via chave SSH testado e funcionando
- [ ] `PermitRootLogin no` aplicado
- [ ] `PasswordAuthentication no` aplicado
- [ ] Fail2Ban rodando (`systemctl status fail2ban`)
- [ ] UFW ativo (`ufw status`)
- [ ] Portas Docker não expostas externamente (`docker ps` verificar 127.0.0.1)
- [ ] Backups automáticos rodando (`crontab -l`)
- [ ] SSL renewal testado (`certbot renew --dry-run`)
- [ ] Documentação commitada no GitHub

---

## 📁 Arquivos Chave na VPS

| Arquivo | Descrição |
|---------|-----------|
| `/docker/compose/docker-compose.yml` | Stack Docker da Totum |
| `/docker/compose/nginx.conf` | Config nginx reverse proxy |
| `/root/totum-ops/healthcheck.sh` | Healthcheck a cada 5 min |
| `/root/totum-ops/alert.sh` | (criar) Alerta WhatsApp |
| `/etc/ssh/sshd_config` | Config SSH |
| `/etc/fail2ban/jail.local` | Config Fail2Ban |
| `/etc/docker/daemon.json` | Rotação de logs Docker |

---

## 🎯 Prioridade de Execução

1. **URGENTE:** Criar usuário + chave SSH + testar
2. **URGENTE:** Endurecer SSH (root off, password off)
3. **ALTA:** Fail2Ban + UFW
4. **MÉDIA:** Alertas WhatsApp via Evolution API
5. **MÉDIA:** Documentar no GitHub
6. **BAIXA:** Verificar SSL renewal

---

**Repo:** `https://github.com/grupototum/bulma-financas.git`  
**VPS:** `root@187.127.4.140` (senha: `Totum@Ubuntu2026`)  
**Evolution API:** `http://localhost:47398` (na VPS)  
**Bulma 🦊 | 2026-05-02**
