# Infraestrutura VPS Totum

## Servidor

- **Host:** panel.grupototum.com
- **IP:** 187.127.4.140
- **Provider:** Hostinger
- **OS:** Ubuntu
- **Specs validados:** 4 vCPU, 16 GB RAM, 193 GB SSD

## Acesso Administrativo

- Usuário operacional: `totum`
- SSH: chave Ed25519 obrigatória
- Root via SSH: desativado
- Login por senha via SSH: desativado
- Arquivo local da chave: `~/.ssh/totum_vps_ed25519`

## Containers Docker

| Container | Porta local | Status validado | Descricao |
|-----------|-------------|-----------------|-----------|
| `evolution-api` | `127.0.0.1:47398 -> 8080` | healthy | WhatsApp API |
| `upixel-api` | `127.0.0.1:3000 -> 3000` | healthy | Upixel/Totum app |
| `n8n` | `127.0.0.1:5678 -> 5678` | healthy | Automacoes |
| `postgres-totum` | `127.0.0.1:5432 -> 5432` | healthy | Banco de dados |
| `redis-totum` | `127.0.0.1:6379 -> 6379` | healthy | Cache e sessoes |
| `ollama-totum` | `127.0.0.1:11435 -> 11435` | healthy | LLM local |

O Nginx principal roda como servico do host e publica `80` e `443`. As portas dos containers ficam presas em loopback e sao acessadas pelo reverse proxy local.

## Backups

- Postgres: todo dia `03:17` em `/root/totum-ops/backups/postgres/`
- Volumes essenciais: todo dia `03:47` em `/root/totum-ops/backups/volumes/`
- Volumes cobertos: `compose_n8n_data`, `compose_evolution_instances`, `compose_redis_data`
- Retencao configurada: 14 dias
- Scripts:
  - `/root/totum-ops/backup-postgres.sh`
  - `/root/totum-ops/backup-volumes.sh`

## Seguranca

- SSH key-only com Ed25519
- `PermitRootLogin no`
- `PasswordAuthentication no`
- `MaxAuthTries 3`
- `ClientAliveInterval 300`
- `ClientAliveCountMax 2`
- Fail2Ban ativo para `sshd` e `nginx-http-auth`
- UFW ativo com entrada liberada apenas para `22/tcp`, `80/tcp` e `443/tcp`
- Portas internas Docker bloqueadas explicitamente no UFW: `3000`, `47398`, `5678`, `6379`, `5432`, `11435`
- Rotacao de logs Docker configurada em `/etc/docker/daemon.json`

## Monitoramento

- Healthcheck: `/root/totum-ops/healthcheck.sh`
- Frequencia: a cada 5 minutos via cron
- Logs: `/root/totum-ops/logs/healthcheck.log`
- Alertas internos: `/root/totum-ops/alert.sh`
- Configuracao de alerta: `/root/totum-ops/alert.env`
- Canal de alerta: Evolution API local em `http://127.0.0.1:47398`
- Cooldown de alerta: 30 minutos por evento

## Validacao Rapida

```bash
ssh -i ~/.ssh/totum_vps_ed25519 totum@panel.grupototum.com
docker ps
ufw status verbose
fail2ban-client status
crontab -l
certbot renew --dry-run
```

## Arquivos Chave

| Arquivo | Descricao |
|---------|-----------|
| `/docker/compose/docker-compose.yml` | Stack Docker da Totum |
| `/docker/compose/docker-compose.override.yml` | Overrides de seguranca/healthcheck |
| `/docker/compose/nginx.conf` | Config do reverse proxy do stack |
| `/root/totum-ops/healthcheck.sh` | Healthcheck periodico |
| `/root/totum-ops/alert.sh` | Alerta via Evolution API |
| `/root/totum-ops/alert.env` | Segredos e destino do alerta |
| `/etc/ssh/sshd_config` | Config SSH endurecida |
| `/etc/fail2ban/jail.local` | Config Fail2Ban |
| `/etc/docker/daemon.json` | Rotacao de logs Docker |
