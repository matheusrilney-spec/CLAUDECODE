# 🚀 GUIA COMPLETO: Montador de Propostas MVP

## 📋 Resumo Executivo

Você agora possui uma aplicação web completa para criar propostas comerciais automaticamente. O sistema integra:

- ✅ **Next.js 14** com TypeScript para máxima confiabilidade
- ✅ **Banco SQLite** para persistência de dados
- ✅ **Formulários em etapas** para melhor UX
- ✅ **Cálculos automáticos** de preço e descontos
- ✅ **Exportação em HTML** pronta para enviar ao cliente
- ✅ **Validações robustas** com Zod

---

## 🛠️ COMO INSTALAR E RODAR

### 1️⃣ Pré-requisitos

- **Node.js** 18.17+ (verificar com `node --version`)
- **npm** ou **pnpm** instalado
- **Git** para clonar o repositório

### 2️⃣ Instalação Passo a Passo

```bash
# Clone o repositório
git clone https://github.com/matheusrilney-spec/CLAUDECODE.git
cd CLAUDECODE

# Instale as dependências
npm install

# Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate

# Gere o catálogo de preços (IMPORTANTE)
npm run import:pricing
```

### 3️⃣ Rodando o Sistema

```bash
npm run dev
```

Acesse: **http://localhost:3000**

Você verá:
- 🏠 **Página inicial** com botão "Nova Proposta"
- 📊 **Lista de propostas** salvas
- ➕ **Formulário em etapas** para criar nova proposta

---

## 📊 COMO USAR O SISTEMA

### Criar uma Nova Proposta

1. Clique em **"Nova Proposta"**
2. Preencha **8 etapas**:
   - **Dados do Cliente**: Empresa, contato, vendedor
   - **Diagnóstico**: Problemas e impactos
   - **Solução**: Produtos envolvidos e entregas
   - **Casos de Uso**: Fluxos de implementação
   - **ROI**: Retorno sobre investimento
   - **Proposta Comercial**: Seleção de produtos e descontos
   - **Roadmap**: Cronograma de implementação
   - **Próximos Passos**: Ações imediatas

3. **Pré-visualize** a proposta
4. **Exporte em HTML** para enviar ao cliente

### Descontos Comerciais

O sistema suporta:
- **50% OFF nos 3 primeiros meses** → Valor mensal reduzido, retorna ao normal depois
- **Desconto percentual** → Digite 20 para 20% OFF
- **Desconto em reais** → Desconto fixo no valor
- **Período promocional** → Quantos meses com desconto

**Exemplo**:
- RD Marketing Pro: R$ 1.121/mês
- Com 50% OFF nos 3 primeiros meses:
  - Meses 1-3: R$ 560,50/mês = R$ 1.681,50
  - Mês 4 em diante: R$ 1.121/mês
  - Economia total: R$ 1.681,50

---

## 💰 COMO ATUALIZAR TABELA DE PREÇOS

### Passo 1: Preparar a Planilha

O arquivo `data/tabela-precos-2026.xlsx` deve ter a seguinte estrutura:

| productFamily | productCode | plan | metric | price | billingType | currency |
|---|---|---|---|---|---|---|
| RD Station Marketing | RDSM | Entry | leads | 297 | monthly | BRL |
| RD Station Marketing | RDSM | Pro | leads | 1121 | monthly | BRL |
| RD Station CRM | RDCRM | Standard | usuarios | 890 | monthly | BRL |
| RD Conversas | RDCONV | Starter | atendimentos | 206 | monthly | BRL |

**Colunas obrigatórias**:
- `productFamily`: Ex: "RD Station Marketing"
- `productCode`: Ex: "RDSM", "RDCRM", "RDCONV"
- `plan`: Ex: "Entry", "Pro", "Standard"
- `metric`: Ex: "leads", "usuarios", "atendimentos"
- `price`: Valor numérico em BRL
- `billingType`: "monthly", "yearly", ou "one-time"
- `currency`: "BRL" ou outro código

### Passo 2: Importar

```bash
# Coloque o arquivo em /data/tabela-precos-2026.xlsx
# Depois execute:
npm run import:pricing
```

**Resultado**: Arquivo `data/pricingCatalog.json` atualizado automaticamente

### Passo 3: Validar

Abra `data/pricingCatalog.json` e confirme que os produtos aparecem:

```json
[
  {
    "id": "rdsm-entry-3000-brl-2026",
    "productFamily": "RD Station Marketing",
    "productCode": "RDSM",
    "plan": "Entry",
    "price": 297,
    ...
  }
]
```

✅ Se aparecer, está funcionando!

---

## 👥 COMO SEUS COLEGAS PODEM USAR

### Opção 1: Rodar Localmente (Mais Simples)

```bash
# Na máquina do vendedor
git clone <repo>
cd CLAUDECODE
npm install
npm run dev

# Abre no navegador: http://localhost:3000
```

**Vantagens**: Sem dependência de servidor, funciona offline
**Desvantagens**: Cada pessoa precisa rodar localmente

### Opção 2: Publicar em Vercel (Recomendado)

1. Crie conta em [Vercel.com](https://vercel.com)
2. Conecte seu repositório GitHub
3. Deploy automático: `npm run build && npm start`
4. Compartilhe o link com o time

**Vantagens**: Centralizado, sem instalação local, sempre atualizado
**Desvantagens**: Requer internet

```bash
# Para fazer deploy:
# 1. Faça push para main
# 2. Vercel detecta automaticamente e faz deploy
# 3. Compartilhe o link com colegas
```

### Opção 3: Publicar em Servidor Interno (Futuro)

Se sua empresa tiver servidor interno:

```bash
npm run build
npm start

# Acesso: http://seu-servidor-interno:3000
```

---

## 🎯 FLUXO TÍPICO DE USO

```
1. Vendedor acessa http://localhost:3000
   ↓
2. Clica em "Nova Proposta"
   ↓
3. Preenche dados do cliente (2 min)
   ↓
4. Descreve problema e solução (10 min)
   ↓
5. Seleciona produtos da tabela de preços
   ↓
6. Aplica descontos comerciais
   ↓
7. Pré-visualiza a proposta
   ↓
8. Clica "Exportar HTML"
   ↓
9. Arquivo `proposta-[cliente]-[data].html` é baixado
   ↓
10. Vendedor envia ao cliente por e-mail
```

**Tempo total**: 20-30 minutos (vs. 2-3 horas fazendo manualmente)

---

## 🔧 ARQUITETURA DO PROJETO

```
CLAUDECODE/
├── app/
│   ├── page.tsx                    # Página inicial
│   ├── layout.tsx                  # Layout principal
│   ├── globals.css                 # Estilos globais
│   ├── proposals/
│   │   ├── page.tsx                # Lista de propostas
│   │   ├── new/page.tsx            # Criar nova proposta
│   │   └── [id]/page.tsx           # Editar proposta
│   └── api/
│       ├── proposals/route.ts      # CRUD de propostas
│       ├── proposals/[id]/route.ts # Operações específicas
│       ├── pricing/import/route.ts # Importar preços
│       └── export/html/route.ts    # Exportar HTML
├── components/
│   ├── ProposalForm.tsx            # Formulário principal (8 etapas)
│   ├── ClientInfoForm.tsx          # Dados do cliente
│   ├── DiagnosisForm.tsx           # Diagnóstico
│   ├── SolutionForm.tsx            # Solução
│   └── ProductSelector.tsx         # Seleção de produtos
├── lib/
│   ├── proposalSchema.ts           # Validações Zod
│   ├── calculations.ts             # Cálculos de preço
│   ├── pricing.ts                  # Gestão de catálogo
│   ├── templateRenderer.ts         # Renderização de templates
│   └── formatCurrency.ts           # Formatação de valores
├── prisma/
│   ├── schema.prisma               # Modelo do banco de dados
│   └── dev.db                      # Banco SQLite (criado automaticamente)
├── scripts/
│   └── importPricing.ts            # Script para importar preços
├── data/
│   ├── tabela-precos-2026.xlsx     # Tabela de preços (você coloca aqui)
│   └── pricingCatalog.json         # Catálogo gerado automaticamente
├── templates/
│   └── proposta-base.html          # Template base com variáveis
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 📈 MELHORIAS FUTURAS

### Fase 2 (Próximas Semanas)
- [ ] Exportar PDF com Playwright/Puppeteer
- [ ] Carregar template HTML personalizado por cliente
- [ ] Dashboard com métricas de propostas (taxa de conversão, valor médio)
- [ ] Integração com Google Drive para salvar backup
- [ ] Histórico de versões de cada proposta

### Fase 3 (1-2 Meses)
- [ ] Integração com CRM (buscar dados do cliente automaticamente)
- [ ] Assinatura digital de propostas
- [ ] Envio automático de e-mail com HTML embedded
- [ ] Suporte multilíngue (EN, ES)
- [ ] Autenticação por SSO (Google, Microsoft)

### Fase 4 (3+ Meses)
- [ ] Mobile app para criar propostas em qualquer lugar
- [ ] IA para sugerir produtos baseado no diagnóstico
- [ ] Análise de concorrência de preços
- [ ] Integração com formulários de landing pages

---

## ⚠️ VALIDAÇÕES IMPLEMENTADAS

O sistema bloqueia:

✗ Proposta sem cliente
✗ Proposta sem nenhum produto selecionado
✗ Desconto maior que 100%
✗ Preço final negativo
✗ Período promocional vazio quando houver preço promocional
✗ Produto não encontrado no catálogo de preços

**Mensagens de erro claras** guiam o vendedor para corrigir.

---

## 🗄️ BANCO DE DADOS

### Tabelas

#### `Proposal`
```sql
- id: String (único)
- companyName: String
- contactName: String
- segment: String (opcional)
- website: String (opcional)
- sellerName: String
- sellerEmail: String
- proposalDate: DateTime
- validUntil: DateTime
- proposalType: String
- status: String (Rascunho, Enviada, Aprovada, Perdida)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `ProposalContent`
```sql
- id: String (único)
- proposalId: String (foreign key)
- objectives: String
- problems: String (JSON)
- solution: String (JSON)
- useCases: String (JSON)
- roi: String (JSON)
- roadmap: String (JSON)
- nextSteps: String (JSON)
- createdAt: DateTime
- updatedAt: DateTime
```

#### `ProposalLineItem`
```sql
- id: String (único)
- proposalId: String (foreign key)
- productId: String
- productName: String
- plan: String
- metric: String
- quantity: Float
- tablePrice: Float
- discountPercent: Float
- discountAmount: Float
- promotionalPrice: Float (opcional)
- promotionalMonths: Int
- standardPriceAfterPromo: Float (opcional)
- billingType: String
- notes: String (opcional)
```

---

## 🧪 TESTES E VALIDAÇÃO

### Teste 1: Criar Proposta com 3 Produtos

```
1. Acesse http://localhost:3000
2. Clique "Nova Proposta"
3. Preencha Dados do Cliente
4. Preencha Diagnóstico
5. Selecione 3 produtos:
   - RD Station Marketing Pro (R$ 1.121)
   - RD Station CRM (R$ 890)
   - RD Conversas (R$ 206)
6. Aplique 50% OFF nos 3 primeiros meses em cada um
7. Clique "Pré-visualizar"
✅ ESPERADO: Proposta renderizada corretamente
```

### Teste 2: Exportar HTML

```
1. Na pré-visualização, clique "Exportar HTML"
2. Arquivo é baixado com nome: proposta-[cliente]-2026-05-21.html
3. Abra o arquivo no navegador
✅ ESPERADO: Proposta completa com CSS e dados
```

### Teste 3: Atualizar Preços

```
1. Modifique data/tabela-precos-2026.xlsx
2. Execute: npm run import:pricing
3. Verifique data/pricingCatalog.json
✅ ESPERADO: Novo catálogo com preços atualizados
```

---

## 📞 TROUBLESHOOTING

### Erro: "Module not found"
```bash
# Solução:
npm install
npm run prisma:generate
```

### Erro: "Database locked"
```bash
# Solução: Feche outras abas da aplicação
# Ou delete o arquivo: prisma/dev.db
rm prisma/dev.db
npm run prisma:migrate
```

### Erro: "Preço não encontrado"
```bash
# Solução: Verifique se tabela de preços foi importada
npm run import:pricing
# Verifique data/pricingCatalog.json
```

### Erro: "Porto 3000 já está em uso"
```bash
# Solução: Use outra porta
PORT=3001 npm run dev
# Acesse: http://localhost:3001
```

---

## 📚 REFERÊNCIAS

- **Next.js 14**: https://nextjs.org/docs
- **Prisma ORM**: https://www.prisma.io/docs
- **React Hook Form**: https://react-hook-form.com
- **Zod Validation**: https://zod.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Handlebars Templates**: https://handlebarsjs.com

---

## ✅ CHECKLIST DE VALIDAÇÃO FINAL

Antes de usar em produção, confirme:

- [ ] Sistema roda com `npm run dev` sem erros
- [ ] Primeira proposta criada com sucesso
- [ ] Descontos aplicados corretamente
- [ ] HTML exportado pode ser aberto no navegador
- [ ] Propostas são salvas no banco de dados
- [ ] Propostas podem ser reabertas e editadas
- [ ] Tabela de preços atualizada com `npm run import:pricing`
- [ ] Cálculos estão corretos (verificar nos valores finais)
- [ ] Validações bloqueiam dados inválidos
- [ ] Interface é intuitiva para vendedores

---

## 🎉 PARABÉNS!

Você possui uma **aplicação web profissional** para criar propostas comerciais. O sistema é:

✅ **Rápido**: Cria propostas em 20-30 minutos
✅ **Confiável**: Validações robustas e banco de dados
✅ **Escalável**: Pronto para crescer
✅ **Manutenível**: Código limpo e documentado
✅ **Customizável**: Fácil adicionar features

---

**Versão**: 0.1.0 MVP
**Data**: 21 de Maio de 2026
**Status**: ✅ Pronto para uso
