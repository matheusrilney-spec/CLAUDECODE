import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';

interface PricingItem {
  id: string;
  productFamily: string;
  productCode: string;
  plan: string;
  currency: string;
  billingType: 'monthly' | 'yearly' | 'one-time' | 'consumption' | 'addon';
  metric: string;
  tier?: number;
  price: number;
  priceTable: string;
  sourceSheet: string;
  sourceRef: string;
}

const dataDir = path.join(process.cwd(), 'data');
const inputFile = path.join(dataDir, 'tabela-precos-2026.xlsx');
const outputFile = path.join(dataDir, 'pricingCatalog.json');

function normalizePricing(): void {
  console.log('📊 Iniciando importação de tabela de preços...');
  console.log(`📁 Lendo arquivo: ${inputFile}`);

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Arquivo não encontrado: ${inputFile}`);
    console.error('⚠️  Criando arquivo de exemplo...');
    createSamplePricing();
    return;
  }

  try {
    const workbook = XLSX.readFile(inputFile);
    const sheetNames = workbook.SheetNames;
    console.log(`✅ Arquivo carregado. Abas encontradas: ${sheetNames.join(', ')}`);

    const catalog: PricingItem[] = [];
    let itemId = 0;

    sheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      console.log(`\n📄 Processando aba: ${sheetName}`);
      console.log(`   Linhas encontradas: ${data.length}`);

      // Parse sample data structure
      data.forEach((row: any, rowIndex: number) => {
        if (!row.productFamily || !row.productCode) return;

        const item: PricingItem = {
          id: `pricing-${++itemId}`,
          productFamily: row.productFamily || '',
          productCode: row.productCode || '',
          plan: row.plan || '',
          currency: row.currency || 'BRL',
          billingType: row.billingType || 'monthly',
          metric: row.metric || '',
          tier: row.tier ? parseInt(row.tier) : undefined,
          price: parseFloat(row.price) || 0,
          priceTable: '2026',
          sourceSheet: sheetName,
          sourceRef: `Linha ${rowIndex + 2}`,
        };

        catalog.push(item);
      });
    });

    // Write catalog
    fs.writeFileSync(outputFile, JSON.stringify(catalog, null, 2));
    console.log(`\n✅ Catálogo de preços gerado com sucesso!`);
    console.log(`📊 Total de itens: ${catalog.length}`);
    console.log(`💾 Arquivo salvo em: ${outputFile}`);
  } catch (error) {
    console.error('❌ Erro ao processar arquivo:', error);
    createSamplePricing();
  }
}

function createSamplePricing(): void {
  console.log('\n📋 Criando arquivo de exemplo de preços...');
  
  const sampleCatalog: PricingItem[] = [
    {
      id: 'rdsm-entry-3000-brl-2026',
      productFamily: 'RD Station Marketing',
      productCode: 'RDSM',
      plan: 'Entry',
      currency: 'BRL',
      billingType: 'monthly',
      metric: 'leads',
      tier: 3000,
      price: 297,
      priceTable: '2026',
      sourceSheet: 'BRL RDSM',
      sourceRef: 'A2',
    },
    {
      id: 'rdsm-pro-5000-brl-2026',
      productFamily: 'RD Station Marketing',
      productCode: 'RDSM',
      plan: 'Pro',
      currency: 'BRL',
      billingType: 'monthly',
      metric: 'leads',
      tier: 5000,
      price: 1121,
      priceTable: '2026',
      sourceSheet: 'BRL RDSM Premium',
      sourceRef: 'A3',
    },
    {
      id: 'rdcrm-standard-brl-2026',
      productFamily: 'RD Station CRM',
      productCode: 'RDCRM',
      plan: 'Standard',
      currency: 'BRL',
      billingType: 'monthly',
      metric: 'usuarios',
      price: 890,
      priceTable: '2026',
      sourceSheet: 'BRL RDCRM',
      sourceRef: 'A4',
    },
    {
      id: 'rdconv-starter-brl-2026',
      productFamily: 'RD Conversas',
      productCode: 'RDCONV',
      plan: 'Starter',
      currency: 'BRL',
      billingType: 'monthly',
      metric: 'atendimentos',
      price: 206,
      priceTable: '2026',
      sourceSheet: 'BRL RD Conversas',
      sourceRef: 'A5',
    },
    {
      id: 'rdconv-pro-brl-2026',
      productFamily: 'RD Conversas',
      productCode: 'RDCONV',
      plan: 'Pro',
      currency: 'BRL',
      billingType: 'monthly',
      metric: 'atendimentos',
      price: 1030,
      priceTable: '2026',
      sourceSheet: 'BRL RD Conversas',
      sourceRef: 'A6',
    },
  ];

  fs.writeFileSync(outputFile, JSON.stringify(sampleCatalog, null, 2));
  console.log(`✅ Arquivo de exemplo criado: ${outputFile}`);
  console.log('⚠️  Substitua este arquivo pela sua tabela de preços oficial!');
}

normalizePricing();
