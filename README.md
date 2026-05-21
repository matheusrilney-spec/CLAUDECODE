# Montador Automático de Propostas Comerciais

Sistema web para criação rápida e automatizada de propostas comerciais com padrão visual uniforme.

## 🚀 Início Rápido

### 1. Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd proposal-builder

# Instale as dependências
npm install

# Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate
```

### 2. Configuração do Banco de Dados

Crie um arquivo `.env` baseado em `.env.example`:

```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Importar Tabela de Preços

```bash
# Coloque o arquivo tabela-precos-2026.xlsx em /data
# Depois execute:
npm run import:pricing
```

### 4. Rodar o Sistema

```bash
npm run dev
```

Acesse `http://localhost:3000`

## 📋 Como Usar

### Criar Nova Proposta

1. Clique em "Nova Proposta" na página inicial
2. Preencha os dados do cliente
3. Adicione diagnóstico, solução e casos de uso
4. Selecione produtos e aplique descontos
5. Defina o roadmap e próximos passos
6. Pré-visualize e exporte em HTML

### Atualizar Preços

1. Substitua o arquivo em `/data/tabela-precos-2026.xlsx`
2. Execute: `npm run import:pricing`
3. Valide o arquivo `/data/pricingCatalog.json`

## 🏗️ Estrutura do Projeto

```
proposal-builder/
├── app/
│   ├── api/
│   │   ├── proposals/
│   │   ├── pricing/
│   │   └── export/
│   ├── proposals/
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ProposalForm.tsx
│   ├── ClientInfoForm.tsx
│   └── ...
├── lib/
│   ├── proposalSchema.ts
│   ├── calculations.ts
│   ├── pricing.ts
│   ├── templateRenderer.ts
│   └── formatCurrency.ts
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── importPricing.ts
├── data/
│   ├── tabela-precos-2026.xlsx
│   └── pricingCatalog.json
└── templates/
    └── proposta.template.html
```

## ⚙️ Funcionalidades

- ✅ Importação automática de tabela de preços
- ✅ Formulário dinâmico em etapas
- ✅ Cálculos automáticos de desconto e ROI
- ✅ Salvar propostas em banco de dados
- ✅ Exportar em HTML
- 🔄 Exportar em PDF (em desenvolvimento)
- 🔄 Templates customizados (em desenvolvimento)

## 📦 Stack Tecnológico

- **Framework**: Next.js 14 com TypeScript
- **Estilo**: Tailwind CSS
- **Formulários**: React Hook Form + Zod
- **Planilhas**: SheetJS (xlsx)
- **Banco de Dados**: SQLite com Prisma
- **Templates**: Handlebars

## 🔧 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start

# Importar tabela de preços
npm run import:pricing

# Gerenciar banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
```

## 📈 Melhorias Futuras

- [ ] Exportar para PDF com Playwright/Puppeteer
- [ ] Templates HTML customizáveis por cliente
- [ ] Histórico de versões de propostas
- [ ] Integração com CRM (RD Station)
- [ ] Assinatura digital de propostas
- [ ] Notificações de atualização de preços
- [ ] Dashboard com métricas de propostas
- [ ] Suporte multilíngue
- [ ] Autenticação por SSO

## 🚨 Validações Obrigatórias

- Cliente é obrigatório
- Pelo menos um produto deve ser selecionado
- Desconto não pode exceder 100%
- Preço final não pode ser negativo
- Se há preço promocional, deve haver período promocional definido
- RD Conversas mostra aviso de tarifas Meta

## 📊 Critérios de Aceite Finalizados

- ✅ Lê tabela 2026 e gera pricingCatalog.json
- ✅ Cria proposta com múltiplos produtos
- ✅ Aplica descontos (3 meses, onboarding)
- ✅ Calcula valores: mensal promo, padrão, anual
- ✅ Renderiza proposta em HTML
- ✅ Exporta HTML final
- ✅ Salva e reabre propostas
- ✅ Bloqueia erro quando preço não encontrado
- ✅ Roda sem erros com `npm run dev`

## 📝 Notas

- O sistema é otimizado para uso interno (vendedores)
- Prioridade é velocidade e facilidade de uso
- Manutenção simples de código e configurações
- Documentação em português para clareza

## 💬 Suporte

Para dúvidas ou problemas, consulte a documentação ou abra uma issue no repositório.
