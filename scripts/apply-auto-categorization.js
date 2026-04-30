require("dotenv").config({ path: ".env.local" });

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const scriptEmail = process.env.SUPABASE_SCRIPT_EMAIL;
const scriptPassword = process.env.SUPABASE_SCRIPT_PASSWORD;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Erro: NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem estar definidos em .env.local");
  process.exit(1);
}

if (!scriptEmail || !scriptPassword) {
  console.error("Erro: SUPABASE_SCRIPT_EMAIL e SUPABASE_SCRIPT_PASSWORD devem estar definidos em .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Regras de categorização automática
const rules = [
  // 🍔 Alimentação
  { keyword: "IFOOD", category: "🍔 Alimentação" },
  { keyword: "HAMBURGUER", category: "🍔 Alimentação" },
  { keyword: "PADARIA", category: "🍔 Alimentação" },
  { keyword: "GUANABARA", category: "🍔 Alimentação" },
  { keyword: "LANCHONETE", category: "🍔 Alimentação" },
  { keyword: "RESTAURANTE", category: "🍔 Alimentação" },
  { keyword: "PIZZARIA", category: "🍔 Alimentação" },
  { keyword: "SUSHI", category: "🍔 Alimentação" },
  { keyword: "CHURRASCARIA", category: "🍔 Alimentação" },
  { keyword: "CAFETERIA", category: "🍔 Alimentação" },
  { keyword: "CAFE", category: "🍔 Alimentação" },
  { keyword: "MERCADO", category: "🍔 Alimentação" },
  { keyword: "SUPERMERCADO", category: "🍔 Alimentação" },

  // 📱 Assinaturas
  { keyword: "PICPAY MAIS", category: "📱 Assinaturas" },
  { keyword: "ASSINATURA", category: "📱 Assinaturas" },
  { keyword: "NETFLIX", category: "📱 Assinaturas" },
  { keyword: "SPOTIFY", category: "📱 Assinaturas" },
  { keyword: "YOUTUBE", category: "📱 Assinaturas" },
  { keyword: "GOOGLE PLAY", category: "📱 Assinaturas" },
  { keyword: "GOOGLE ONE", category: "📱 Assinaturas" },
  { keyword: "APPLE", category: "📱 Assinaturas" },
  { keyword: "AMAZON PRIME", category: "📱 Assinaturas" },
  { keyword: "DISNEY", category: "📱 Assinaturas" },
  { keyword: "HBO", category: "📱 Assinaturas" },
  { keyword: "PARAMOUNT", category: "📱 Assinaturas" },
  { keyword: "GLOBOPLAY", category: "📱 Assinaturas" },
  { keyword: "CANVA", category: "📱 Assinaturas" },
  { keyword: "ADOBE", category: "📱 Assinaturas" },
  { keyword: "NOTION", category: "📱 Assinaturas" },
  { keyword: "N8N", category: "📱 Assinaturas" },
  { keyword: "MAKE", category: "📱 Assinaturas" },
  { keyword: "ZAPIER", category: "📱 Assinaturas" },

  // 💳 Cartão de Crédito
  { keyword: "FATURA CARTAO", category: "💳 Cartão de Crédito" },
  { keyword: "FATURA PICPAY", category: "💳 Cartão de Crédito" },
  { keyword: "PAG DEBITO", category: "💳 Cartão de Crédito" },
  { keyword: "PAG CARTAO", category: "💳 Cartão de Crédito" },

  // 🔄 Transferências
  { keyword: "PIX TRANSFERENCIA", category: "🔄 Transferências" },
  { keyword: "TED TRANSFERENCIA", category: "🔄 Transferências" },
  { keyword: "DOC TRANSFERENCIA", category: "🔄 Transferências" },
  { keyword: "PIX ENVIADO", category: "🔄 Transferências" },
  { keyword: "COFRINHO", category: "❓ Outros" },
  { keyword: "GUARDADO", category: "❓ Outros" },

  // 💰 Receitas
  { keyword: "CRED PIX", category: "💰 Receitas" },
  { keyword: "RECEBIMENTO", category: "💰 Receitas" },
  { keyword: "RENDIMENTO", category: "💵 Rendimentos" },
  { keyword: "SALARIO", category: "💰 Receitas" },
  { keyword: "PROLABORE", category: "💰 Receitas" },
  { keyword: "DIVIDENDO", category: "💵 Rendimentos" },
  { keyword: "JUROS", category: "💵 Rendimentos" },

  // 📢 Marketing
  { keyword: "MARKETING", category: "📢 Marketing" },
  { keyword: "MKT", category: "📢 Marketing" },
  { keyword: "ADS", category: "📢 Marketing" },
  { keyword: "FACEBOOK ADS", category: "📢 Marketing" },
  { keyword: "GOOGLE ADS", category: "📢 Marketing" },
  { keyword: "META ADS", category: "📢 Marketing" },
  { keyword: "TRAFEGO", category: "📢 Marketing" },
  { keyword: "CAMPAIGN", category: "📢 Marketing" },

  // 📄 Boletos/Contas
  { keyword: "BOLETO", category: "📄 Boletos/Contas" },
  { keyword: "COBRANCA", category: "📄 Boletos/Contas" },
  { keyword: "CONTA DE LUZ", category: "📄 Boletos/Contas" },
  { keyword: "CEMIG", category: "📄 Boletos/Contas" },
  { keyword: "COPASA", category: "📄 Boletos/Contas" },
  { keyword: "INTERNET", category: "📄 Boletos/Contas" },
  { keyword: "TELEFONE", category: "📄 Boletos/Contas" },
  { keyword: "ALUGUEL", category: "🏠 Moradia" },
  { keyword: "CONDOMINIO", category: "🏠 Moradia" },
  { keyword: "IPTU", category: "🏠 Moradia" },

  // 🚗 Transporte
  { keyword: "IPVA", category: "🚗 Transporte" },
  { keyword: "DPVAT", category: "🚗 Transporte" },
  { keyword: "SEGURO VEICULO", category: "🚗 Transporte" },
  { keyword: "POSTO", category: "🚗 Transporte" },
  { keyword: "COMBUSTIVEL", category: "🚗 Transporte" },
  { keyword: "GASOLINA", category: "🚗 Transporte" },
  { keyword: "ETANOL", category: "🚗 Transporte" },
  { keyword: "DIESEL", category: "🚗 Transporte" },
  { keyword: "PARKING", category: "🚗 Transporte" },
  { keyword: "ESTACIONAMENTO", category: "🚗 Transporte" },
  { keyword: "PEDAGIO", category: "🚗 Transporte" },
  { keyword: "UBER", category: "🚗 Transporte" },
  { keyword: "MOTO", category: "🚗 Transporte" },
  { keyword: "OFICINA", category: "🚗 Transporte" },
  { keyword: "MECANICA", category: "🚗 Transporte" },
  { keyword: "AUTO PECAS", category: "🚗 Transporte" },

  // ☕ Lazer
  { keyword: "CINEMA", category: "☕ Lazer/Café" },
  { keyword: "THEATRO", category: "☕ Lazer/Café" },
  { keyword: "SHOW", category: "☕ Lazer/Café" },
  { keyword: "EVENTO", category: "☕ Lazer/Café" },
  { keyword: "BAR", category: "☕ Lazer/Café" },
  { keyword: "BOATE", category: "☕ Lazer/Café" },
  { keyword: "BALADA", category: "☕ Lazer/Café" },
];

function autoCategorize(description, categoryMap) {
  const upperDesc = description.toUpperCase();

  for (const rule of rules) {
    if (upperDesc.includes(rule.keyword)) {
      const categoryId = categoryMap.get(rule.category);
      if (categoryId) {
        return { categoryId, categoryName: rule.category };
      }
    }
  }

  return null;
}

async function applyAutoCategorization() {
  const { data: { user } } = await supabase.auth.signInWithPassword({
    email: scriptEmail,
    password: scriptPassword,
  });

  if (!user) {
    console.error("Login falhou");
    return;
  }
  console.log("User ID:", user.id);

  // Buscar todas as categorias
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("id, name")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (catError) {
    console.error("Erro categorias:", catError);
    return;
  }

  const categoryMap = new Map();
  categories.forEach((c) => categoryMap.set(c.name, c.id));
  console.log("Categorias carregadas:", categoryMap.size);

  // Buscar todas as transações sem categoria definida ou com "Outros"
  const othersId = categoryMap.get("❓ Outros");

  const { data: transactions, error: txError } = await supabase
    .from("transactions")
    .select("id, description, category_id")
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  if (txError) {
    console.error("Erro transações:", txError);
    return;
  }

  console.log("Total de transações:", transactions.length);

  let updated = 0;
  let unchanged = 0;

  for (const tx of transactions) {
    // Só categoriza se não tiver categoria ou for "Outros"
    if (tx.category_id && tx.category_id !== othersId) {
      unchanged++;
      continue;
    }

    const result = autoCategorize(tx.description, categoryMap);

    if (result) {
      const { error } = await supabase
        .from("transactions")
        .update({ category_id: result.categoryId })
        .eq("id", tx.id);

      if (error) {
        console.error("Erro ao atualizar:", tx.description, error.message);
      } else {
        console.log(`✅ "${tx.description}" → ${result.categoryName}`);
        updated++;
      }
    } else {
      unchanged++;
    }
  }

  console.log("\n=== RESUMO ===");
  console.log("Transações categorizadas automaticamente:", updated);
  console.log("Transações inalteradas:", unchanged);
  console.log("Total:", updated + unchanged);
}

applyAutoCategorization();
