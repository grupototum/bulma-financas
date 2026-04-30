# 🎯 PROMPT — TOT / Hermione: Organizar Cold Clients no Google Drive

> **Tarefa:** Organizar pasta "Cold clients/" por ano de última atividade
> **Drive:** totumpersonalizados@gmail.com
> **Ferramenta:** rclone (remote `totum:`)

---

## 📋 DESCRIÇÃO

A Totum tem uma pasta `Cold clients/` no Google Drive com clientes inativos. Precisamos organizar esses clientes em subpastas por **ano da última atividade** (última alteração de arquivo dentro da pasta do cliente).

**Regra:** Se o último arquivo editado dentro da pasta "Cliente X" foi em 24/03/2019, essa pasta vai para `Cold clients/2019/`

---

## 🔧 CONFIGURAÇÃO DO RCLONE

Se ainda não tiver o rclone configurado, crie o arquivo `~/.config/rclone/rclone.conf` com:

```ini
[totum]
type = drive
client_id = 716248034665-c0fomj1nl80h6d58074g0s0qag2h8m8o.apps.googleusercontent.com
client_secret = lJXEchc2H76LQqQPNtBjlSf4
scope = drive
token = {"access_token":"ya29.a0AQvPyIOeYgLocVqfBC9M4TQaWJa6jO7COxegASJ7U_3XnRrpfGgHNUQ5sjBPHLvF4ak0jGuczlzHmwmLfsTRN-FnQB9vyGyTazWpROEFQbkPDccCPT-D5Y0EeQAvXYBNcBdalRj3Bdf1sN08LwUC3yNNn8ibSRo_-Vk-dSXDJ_q69X3Z9IYG4mWnmSOrhmxQTy442pHKaCgYKAakSARESFQHGX2MilGkq38k9xtUPr8btRjSa7g0207","token_type":"Bearer","refresh_token":"1//0hlxKZAmDIs9OCgYIARAAGBESNwF-L9Ir20lAobrLTW5rFNAocwiWzc4fzoUO9C-w7xLVY0kvJqeMc5IGgqqRRbSuFdV6U1DM9-c","expiry":"2026-04-30T10:12:36.84635-03:00","expires_in":3599}
root_folder_id =
```

> ⚠️ **Token expira em ~1 hora.** Se der erro de autenticação, avise o Rael que precisa renovar.

---

## 🚀 PASSOS

### 1. Listar conteúdo atual
```bash
rclone lsf "totum:Cold clients/" --max-depth 1
```

### 2. Verificar datas de modificação
```bash
rclone lsjson "totum:Cold clients/" --max-depth 1
```

Para cada subpasta, verificar a data mais recente:
```bash
rclone lsjson "totum:Cold clients/NOME_DO_CLIENTE/" --max-depth 0
```

### 3. Criar pastas por ano
```bash
rclone mkdir "totum:Cold clients/2019/"
rclone mkdir "totum:Cold clients/2020/"
rclone mkdir "totum:Cold clients/2021/"
rclone mkdir "totum:Cold clients/2022/"
rclone mkdir "totum:Cold clients/2023/"
rclone mkdir "totum:Cold clients/2024/"
rclone mkdir "totum:Cold clients/2025/"
rclone mkdir "totum:Cold clients/2026/"
```

### 4. Mover clientes para pasta do ano correspondente
```bash
rclone moveto "totum:Cold clients/NOME_CLIENTE/" "totum:Cold clients/ANO/NOME_CLIENTE/"
```

---

## ⚠️ REGRAS

- **NÃO delete** nenhum arquivo ou pasta
- **NÃO renomeie** os clientes (só move de lugar)
- Se não conseguir determinar o ano de um cliente, deixe na raiz de `Cold clients/` e liste no relatório
- Se já houver subpastas por ano, mantenha e organize dentro delas
- Documente: quantos clientes em cada ano

---

## ✅ DEFINIÇÃO DE PRONTO

- [ ] Todos os clientes de "Cold clients/" organizados em subpastas por ano
- [ ] Relatório com quantidade de clientes por ano
- [ ] Clientes sem ano definido sinalizados e listados
- [ ] Nenhum arquivo ou cliente deletado

---

*Criado por: Bulma 🦊*
*Data: 2026-04-30*
*Para: TOT / Hermione*
