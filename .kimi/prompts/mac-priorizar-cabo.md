# 🌐 COMANDOS — Mac Priorizar Cabo Ethernet (em vez de WiFi 5G)

> Para: Rael executar no terminal do Mac
> Data: 2026-05-01
> Setup: Mac → Cube Multilaser (switch) → Cabo par trançado → Adaptador USB-C/Ethernet (dock Mokin)

---

## OPÇÃO 1 — Desativar WiFi (mais simples)

```bash
# Desativar WiFi (deixa só o cabo)
networksetup -setairportpower en0 off

# Verificar que só cabo está ativo
ifconfig | grep -E "^en|status"
```

Para reativar WiFi depois:
```bash
networksetup -setairportpower en0 on
```

---

## OPÇÃO 2 — Configurar Ordem de Serviço (mais elegante)

```bash
# Listar interfaces de rede
networksetup -listallnetworkservices

# A saída vai ser algo como:
# (1) Wi-Fi
# (2) Ethernet
# (3) Bluetooth PAN

# Definir ordem de prioridade (Ethernet primeiro, depois Wi-Fi)
networksetup -ordernetworkservices "Ethernet" "Wi-Fi"

# Se "Ethernet" não for o nome exato, use o nome que aparece no listallnetworkservices
# Exemplo alternativo:
# networksetup -ordernetworkservices "USB 10/100/1000 LAN" "Wi-Fi"
```

---

## OPÇÃO 3 — Usar "Locations" do macOS (recomendado para você)

O macOS permite criar "Locations" (perfis de rede):

### Criar Location "Cabo Prioritário":

```bash
# Via System Settings GUI (mais fácil):
# 1. System Settings → Network
# 2. Clique no menu de Locations (canto superior esquerdo)
# 3. Edit Locations → + → Nome: "Cabo Prioritario"
# 4. Arraste Ethernet pra cima de Wi-Fi
# 5. Apply
```

Ou via terminal:
```bash
# Criar location (se possível via networksetup)
networksetup -createnetworkservice "CaboPrioritario" "Ethernet"

# Definir ordem
networksetup -ordernetworkservices "CaboPrioritario" "Wi-Fi"
```

---

## 🔍 VERIFICAR QUAL INTERFACE É O CABO

```bash
# Listar todas as interfaces
ifconfig -a

# Procurar por interfaces com cabo conectado
# Normalmente o cabo ethernet aparece como:
# - en3, en4, en5, en6, en7, en8, en9, en10 (dependendo do dock)

# Verificar qual tem IP (está conectada)
ipconfig getifaddr en0  # WiFi
ipconfig getifaddr en1  # Pode ser segundo WiFi ou Ethernet
ipconfig getifaddr en3  # Pode ser o cabo do dock
# ... teste en4, en5, etc.

# Ou mais fácil:
ifconfig | grep -E "(en[0-9]|inet |status)"
```

---

## ✅ VERIFICAÇÃO FINAL

```bash
# Verificar rota padrão (gateway)
netstat -rn | grep default

# Verificar qual interface está sendo usada pro internet
curl -s ipinfo.io

# Teste de velocidade (opcional)
curl -s https://raw.githubusercontent.com/sivel/speedtest-cli/master/speedtest.py | python3 -
```

---

## 🎯 RESUMO RÁPIDO

**Se quiser só priorizar cabo agora:**
```bash
# Descobrir nome da interface ethernet
networksetup -listallnetworkservices

# Colocar ethernet em primeiro
networksetup -ordernetworkservices "Ethernet" "Wi-Fi"
# (ou substitua "Ethernet" pelo nome exato que aparecer)
```

**Se quiser desativar WiFi completamente:**
```bash
networksetup -setairportpower en0 off
```

---

## 🆘 EM CASO DE ERRO

**Se perder internet:**
```bash
# Reativar WiFi
networksetup -setairportpower en0 on

# Ou resetar ordem
networksetup -ordernetworkservices "Wi-Fi" "Ethernet"
```

**Se não souber o nome da interface:**
```bash
# Liste tudo
networksetup -listallnetworkservices

# Teste cada uma
for i in {0..10}; do
  echo "en$i: $(ipconfig getifaddr en$i 2>/dev/null || echo 'OFF')"
done
```

---

*Gerado por Bulma — 2026-05-01*
