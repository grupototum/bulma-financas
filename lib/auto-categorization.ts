// Regras de categorização automática baseada nas 51 transações existentes
// Mapeia palavras-chave para IDs de categorias

export interface AutoCategorizationRule {
  keyword: string;
  matchType: 'contains' | 'exact' | 'starts_with' | 'ends_with';
  categoryName: string;
  isFixed?: boolean;
}

// Regras treinadas com base nos dados reais do Rael
export const defaultRules: AutoCategorizationRule[] = [
  // 🍔 Alimentação
  { keyword: 'IFOOD', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'HAMBURGUER', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'PADARIA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'GUANABARA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'LANCHONETE', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'RESTAURANTE', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'PIZZARIA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'SUSHI', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'CHURRASCARIA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'PADARIA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'CAFETERIA', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'CAFE', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'MERCADO', matchType: 'contains', categoryName: '🍔 Alimentação' },
  { keyword: 'SUPERMERCADO', matchType: 'contains', categoryName: '🍔 Alimentação' },
  
  // 📱 Assinaturas / Streaming / Apps (FIXO)
  { keyword: 'PICPAY MAIS', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'ASSINATURA', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'NETFLIX', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'SPOTIFY', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'YOUTUBE', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'GOOGLE PLAY', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'GOOGLE ONE', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'APPLE', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'AMAZON PRIME', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'DISNEY', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'HBO', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'PARAMOUNT', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'GLOBOPLAY', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'CANVA', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'ADOBE', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'NOTION', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'N8N', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'MAKE', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  { keyword: 'ZAPIER', matchType: 'contains', categoryName: '📱 Assinaturas', isFixed: true },
  
  // 💳 Cartão de Crédito (FIXO)
  { keyword: 'FATURA CARTAO', matchType: 'contains', categoryName: '💳 Cartão de Crédito', isFixed: true },
  { keyword: 'FATURA PICPAY', matchType: 'contains', categoryName: '💳 Cartão de Crédito', isFixed: true },
  { keyword: 'PAG DEBITO', matchType: 'contains', categoryName: '💳 Cartão de Crédito', isFixed: true },
  { keyword: 'PAG CARTAO', matchType: 'contains', categoryName: '💳 Cartão de Crédito', isFixed: true },
  
  // 🔄 Transferências
  { keyword: 'PIX TRANSFERENCIA', matchType: 'contains', categoryName: '🔄 Transferências' },
  { keyword: 'TED TRANSFERENCIA', matchType: 'contains', categoryName: '🔄 Transferências' },
  { keyword: 'DOC TRANSFERENCIA', matchType: 'contains', categoryName: '🔄 Transferências' },
  { keyword: 'PIX ENVIADO', matchType: 'contains', categoryName: '🔄 Transferências' },
  { keyword: 'PIX RECEBIDO', matchType: 'contains', categoryName: '💰 Receitas' },
  { keyword: 'COFRINHO', matchType: 'contains', categoryName: '❓ Outros' },
  { keyword: 'GUARDADO', matchType: 'contains', categoryName: '❓ Outros' },
  
  // 💰 Receitas (FIXO — receitas regulares)
  { keyword: 'CRED PIX', matchType: 'contains', categoryName: '💰 Receitas', isFixed: true },
  { keyword: 'RECEBIMENTO', matchType: 'contains', categoryName: '💰 Receitas', isFixed: true },
  { keyword: 'RENDIMENTO', matchType: 'contains', categoryName: '💵 Rendimentos', isFixed: true },
  { keyword: 'SALARIO', matchType: 'contains', categoryName: '💰 Receitas', isFixed: true },
  { keyword: 'PROLABORE', matchType: 'contains', categoryName: '💰 Receitas', isFixed: true },
  { keyword: 'DIVIDENDO', matchType: 'contains', categoryName: '💵 Rendimentos', isFixed: true },
  { keyword: 'JUROS', matchType: 'contains', categoryName: '💵 Rendimentos', isFixed: true },
  
  // 📢 Marketing
  { keyword: 'MARKETING', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'MKT', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'ADS', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'FACEBOOK ADS', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'GOOGLE ADS', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'META ADS', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'TRAFEGO', matchType: 'contains', categoryName: '📢 Marketing' },
  { keyword: 'CAMPAIGN', matchType: 'contains', categoryName: '📢 Marketing' },
  
  // 📄 Boletos/Contas (FIXO)
  { keyword: 'BOLETO', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'COBRANCA', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'CONTA DE LUZ', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'CEMIG', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'COPASA', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'INTERNET', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'TELEFONE', matchType: 'contains', categoryName: '📄 Boletos/Contas', isFixed: true },
  { keyword: 'ALUGUEL', matchType: 'contains', categoryName: '🏠 Moradia', isFixed: true },
  { keyword: 'CONDOMINIO', matchType: 'contains', categoryName: '🏠 Moradia', isFixed: true },
  { keyword: 'IPTU', matchType: 'contains', categoryName: '🏠 Moradia', isFixed: true },
  
  // 🚗 Transporte
  { keyword: 'IPVA', matchType: 'contains', categoryName: '🚗 Transporte', isFixed: true },
  { keyword: 'DPVAT', matchType: 'contains', categoryName: '🚗 Transporte', isFixed: true },
  { keyword: 'SEGURO VEICULO', matchType: 'contains', categoryName: '🚗 Transporte', isFixed: true },
  { keyword: 'POSTO', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'COMBUSTIVEL', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'GASOLINA', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'ETANOL', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'DIESEL', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'PARKING', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'ESTACIONAMENTO', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'PEDAGIO', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'UBER', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: '99', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'MOTO', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'OFICINA', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'MECANICA', matchType: 'contains', categoryName: '🚗 Transporte' },
  { keyword: 'AUTO PECAS', matchType: 'contains', categoryName: '🚗 Transporte' },
  
  // ☕ Lazer
  { keyword: 'CINEMA', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'THEATRO', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'SHOW', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'EVENTO', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'BAR', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'BOATE', matchType: 'contains', categoryName: '☕ Lazer/Café' },
  { keyword: 'BALADA', matchType: 'contains', categoryName: '☕ Lazer/Café' },
];

// Função que categoriza uma transação baseada na descrição
export function autoCategorize(
  description: string,
  categoryMap: Map<string, string> // nome da categoria -> category_id
): { categoryId: string; categoryName: string; isFixed: boolean } | null {
  const upperDesc = description.toUpperCase();

  for (const rule of defaultRules) {
    let matches = false;
    const upperKeyword = rule.keyword.toUpperCase();

    switch (rule.matchType) {
      case 'contains':
        matches = upperDesc.includes(upperKeyword);
        break;
      case 'exact':
        matches = upperDesc === upperKeyword;
        break;
      case 'starts_with':
        matches = upperDesc.startsWith(upperKeyword);
        break;
      case 'ends_with':
        matches = upperDesc.endsWith(upperKeyword);
        break;
    }

    if (matches) {
      const categoryId = categoryMap.get(rule.categoryName);
      if (categoryId) return { categoryId, categoryName: rule.categoryName, isFixed: rule.isFixed ?? false };
    }
  }

  return null;
}
