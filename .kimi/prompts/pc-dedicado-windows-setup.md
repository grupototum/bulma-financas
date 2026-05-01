# 🖥️ COMANDOS — PC Dedicado Windows (Docker + Vaultwarden + Acesso Remoto)

> Para: Rael executar no terminal do PC dedicado Windows
> Data: 2026-05-01
> PC: DESKTOP-THBF2H3, Windows 10, i5-2400, 8GB RAM

---

## PASSO 1 — Instalar Docker Desktop no Windows

Abra o PowerShell **como Administrador** e cole:

```powershell
# Baixar Docker Desktop
Invoke-WebRequest -Uri "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe" -OutFile "$env:TEMP\DockerInstaller.exe"

# Instalar silenciosamente
& "$env:TEMP\DockerInstaller.exe" install --quiet --accept-license

# Verificar se instalou
docker --version
```

Ou baixe manualmente: https://www.docker.com/products/docker-desktop

---

## PASSO 2 — Configurar Docker (WSL2 ou Hyper-V)

Docker Desktop vai pedir para ativar WSL2. Aceite.

Se der erro no WSL2, use Hyper-V:
```powershell
# No PowerShell Admin
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
# Reiniciar o PC depois
```

---

## PASSO 3 — Instalar Vaultwarden (Bitwarden Self-Hosted)

```powershell
# Criar pasta para dados do Vaultwarden
New-Item -ItemType Directory -Force -Path "C:\Docker\Vaultwarden\data"

# Rodar Vaultwarden
docker run -d `
  --name vaultwarden `
  -v C:\Docker\Vaultwarden\data:/data/ `
  -p 80:80 `
  --restart unless-stopped `
  vaultwarden/server:latest

# Verificar se rodou
docker ps
```

**Acessar:** Abra o navegador no PC → `http://localhost`

---

## PASSO 4 — Backup Automático do Vault

```powershell
# Criar script de backup
$backupScript = @"
docker exec vaultwarden sqlite3 /data/db.sqlite3 ".backup '/data/backup.db'"
Copy-Item C:\Docker\Vaultwarden\data\backup.db D:\VaultBackup\backup_%date%.db
"@

$backupScript | Out-File -FilePath "C:\Docker\Vaultwarden\backup.ps1" -Encoding UTF8

# Agendar backup diário (10h da manhã)
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-File C:\Docker\Vaultwarden\backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At "10:00"
Register-ScheduledTask -TaskName "VaultwardenBackup" -Action $action -Trigger $trigger -RunLevel Highest
```

---

## PASSO 5 — Instalar RustDesk (Acesso Remoto)

```powershell
# Baixar RustDesk
Invoke-WebRequest -Uri "https://github.com/rustdesk/rustdesk/releases/download/1.3.9/rustdesk-1.3.9-x86_64.exe" -OutFile "$env:TEMP\rustdesk.exe"

# Instalar silenciosamente
& "$env:TEMP\rustdesk.exe" --silent-install

# Verificar
rustdesk --version
```

Ou baixe em: https://rustdesk.com/

---

## PASSO 6 — Configurar RustDesk como Serviço (Windows)

```powershell
# RustDesk já instala como serviço. Verificar:
Get-Service | Where-Object {$_.Name -like "*rustdesk*"}

# Pegar ID e senha (para acessar remotamente)
rustdesk --id
```

Anote o **ID** e a **Senha** — você vai precisar pra conectar do Mac.

---

## PASSO 7 — Acesso Remoto do Mac para o PC

No **Mac**, instale RustDesk:
```bash
# Baixar
brew install --cask rustdesk

# Ou manual: https://rustdesk.com/
```

Conecte usando o **ID** do PC:
- Abra RustDesk no Mac
- Digite o ID do PC
- Digite a senha
- ✅ Conectado!

---

## 📋 CHECKLIST DE VERIFICAÇÃO

- [ ] Docker Desktop instalado e rodando
- [ ] Vaultwarden acessível em `http://localhost`
- [ ] RustDesk instalado e rodando como serviço
- [ ] ID e senha do RustDesk anotados
- [ ] Mac consegue conectar no PC via RustDesk
- [ ] Backup automático configurado

---

## 🆘 EM CASO DE ERRO

**Docker não inicia:**
- Verifique se WSL2 ou Hyper-V está ativado
- Painel de Controle → Programas → Ativar recursos do Windows

**Vaultwarden não acessível:**
```powershell
docker logs vaultwarden
docker restart vaultwarden
```

**RustDesk não conecta:**
- Verifique firewall do Windows (libere porta 21115-21119)
- Ou use relay público do RustDesk

---

*Gerado por Bulma — 2026-05-01*
