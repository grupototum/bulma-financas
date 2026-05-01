const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://fxpdqyxmzwudtundnofz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ4cGRxeXhtend1ZHR1bmRub2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0OTAxMzAsImV4cCI6MjA5MzA2NjEzMH0.xc7p1waGYUr25dJhd83I_t641ebNKgoZfntzMA8IlM8'
);

const userId = '7e500c64-cd09-4cc2-86b0-9a0e0736f98e';

async function insertSerasaDebts() {
  // 1. Criar categoria (ou buscar existente)
  let cat;
  const { data: existingCat, error: findError } = await supabase
    .from('categories')
    .select('*')
    .eq('name', '❌ Dívida/Protesto')
    .single();
  
  if (existingCat) {
    cat = existingCat;
    console.log('Categoria já existe:', cat.id);
  } else {
    const { data: newCat, error: catError } = await supabase
      .from('categories')
      .insert({ name: '❌ Dívida/Protesto', type: 'expense', color: '#EF4444', icon: 'alert-triangle' })
      .select()
      .single();
    
    if (catError) {
      console.error('Erro categoria:', catError);
      return;
    }
    cat = newCat;
    console.log('Categoria criada:', cat.id);
  }

  // 2. Buscar conta Itaú
  const { data: acc, error: accError } = await supabase
    .from('accounts')
    .select('id')
    .eq('name', 'Cartão Itaú')
    .single();
  
  if (accError || !acc) {
    console.error('Erro conta:', accError);
    return;
  }
  console.log('Conta Itaú:', acc.id);

  // 3. Inserir dívidas
  const debts = [
    { description: 'Dívida UNIMED Gov. Valadares (Serasa)', amount: 708.94, date: '2023-01-30', notes: 'Dívida negativada no Serasa - UNIMED - 30/01/2023' },
    { description: 'Dívida SKY Banda Larga (Serasa)', amount: 176.47, date: '2021-01-05', notes: 'Dívida negativada no Serasa - SKY - 05/01/2021. Negociável com 50% desconto (R$ 88,24)' },
    { description: 'Protesto Cartório 01 - Gov. Valadares (1)', amount: 213.62, date: '2022-11-22', notes: 'Protesto no Cartório 01 de Gov. Valadares - 22/11/2022' },
    { description: 'Protesto Cartório 01 - Gov. Valadares (2)', amount: 213.62, date: '2022-12-22', notes: 'Protesto no Cartório 01 de Gov. Valadares - 22/12/2022' },
    { description: 'Protesto Cartório 01 - Gov. Valadares (3)', amount: 213.62, date: '2023-02-22', notes: 'Protesto no Cartório 01 de Gov. Valadares - 22/02/2023' },
    { description: 'Protesto Cartório 01 - Gov. Valadares (4 - RECENTE)', amount: 1512.62, date: '2025-06-03', notes: 'Protesto no Cartório 01 de Gov. Valadares - 03/06/2025 - MAIOR E MAIS RECENTE' },
  ];

  for (const debt of debts) {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        description: debt.description,
        amount: debt.amount,
        type: 'expense',
        category_id: cat.id,
        account_id: acc.id,
        date: debt.date,
        notes: debt.notes
      })
      .select();
    
    if (error) {
      console.error(`Erro ${debt.description}:`, error);
    } else {
      console.log(`✅ Inserido: ${debt.description} - R$ ${debt.amount}`);
    }
  }
  
  console.log('\n🦊 Dívidas do Serasa inseridas com sucesso!');
}

insertSerasaDebts();
