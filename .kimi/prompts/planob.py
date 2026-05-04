#!/usr/bin/env python3
"""
🦊 PLANOB.PY — Assistente de contingência quando Bulma sai do ar
Uso: python3 planob.py
Roda no terminal, conversa com Groq, lê contexto do workspace.
"""

import os
import sys
import json
import urllib.request
import urllib.error

# Configuração
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
MODEL = "llama-3.1-8b-instant"
WORKSPACE = os.path.expanduser("~/.kimi_openclaw/workspace")

SYSTEM_PROMPT = """Você é o Plano B da Bulma (assistente pessoal do Rael).
Leia os arquivos de contexto no workspace e assuma o trabalho.
Fale como a Bulma: quente, direta, técnica quando precisa.
Chame o usuário de "Rael" ou "chefe".
"""

def read_file(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
    except:
        return ""

def load_context():
    context = ""
    files = [
        "HANDOFF_CLAWX.md",
        "HANDOFF_CARD.md", 
        "PLANO_B_CONTINGENCIA.md",
        "SOUL.md",
        "USER.md"
    ]
    for f in files:
        content = read_file(os.path.join(WORKSPACE, f))
        if content:
            context += f"\n\n=== {f} ===\n{content[:3000]}"
    return context

def chat_with_groq(messages):
    if not GROQ_API_KEY:
        return "❌ Erro: GROQ_API_KEY não definida. Rode: export GROQ_API_KEY=sua_key"
    
    data = json.dumps({
        "model": MODEL,
        "messages": messages,
        "max_tokens": 2000,
        "temperature": 0.7
    }).encode('utf-8')
    
    req = urllib.request.Request(
        "https://api.groq.com/openai/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        }
    )
    
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
            return result['choices'][0]['message']['content']
    except urllib.error.HTTPError as e:
        return f"❌ Erro HTTP {e.code}: {e.read().decode()[:200]}"
    except Exception as e:
        return f"❌ Erro: {str(e)}"

def main():
    print("="*60)
    print("🦊 PLANO B — Assistente de Contingência")
    print("="*60)
    print()
    
    if not GROQ_API_KEY:
        print("⚠️  GROQ_API_KEY não definida!")
        print("   Rode primeiro: export GROQ_API_KEY=sua_key_aqui")
        print()
        key = input("Ou digite a key agora: ").strip()
        if key:
            os.environ["GROQ_API_KEY"] = key
        else:
            return
    
    print("📖 Carregando contexto do workspace...")
    context = load_context()
    print(f"   ✅ {len(context)} caracteres de contexto carregados")
    print()
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + context},
    ]
    
    print("💬 Pronto! Fale comigo (ou 'sair' para encerrar)")
    print()
    
    while True:
        user_input = input("Rael: ").strip()
        if user_input.lower() in ['sair', 'exit', 'quit']:
            print("🦊 Até mais, chefe!")
            break
        
        if not user_input:
            continue
        
        messages.append({"role": "user", "content": user_input})
        
        print("🤔 Pensando...")
        response = chat_with_groq(messages)
        
        messages.append({"role": "assistant", "content": response})
        
        print(f"🦊 Bulma-B: {response}")
        print()

if __name__ == "__main__":
    main()
