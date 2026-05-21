# Montador Automático de Propostas Comerciais — RD Station

Sistema web interno para criação rápida e automatizada de propostas comerciais com padrão visual uniforme.

---

## 1. Como Instalar

```bash
# No diretório do projeto:
npm install

# Configurar banco de dados:
npx prisma db push

# (Opcional) Importar tabela de preços da planilha:
npm run import:pricing
```

O arquivo `.env.local` já vem configurado com `DATABASE_URL=file:./prisma/dev.db`.

---

## 2. Como Rodar

```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 3. Como Importar a Tabela de Preços

```bash
# 1. Coloque o arquivo Excel em /data/tabela-precos-2026.xlsx
# 2. Execute:
npm run import:pricing
# 3. Confira o arquivo gerado:
cat data/pricingCatalog.json | head -50
```

O catálogo gerado (`pricingCatalog.json`) é a fonte oficial de preços do sistema.

---

## 4. Como Usar — Criando uma Proposta

1. Acesse **http://localhost:3000**
2. Clique em **"+ Nova Proposta"**
3. Preencha cada etapa:
   - **Cliente** — dados do cliente e vendedor
   - **Diagnóstico** — objetivo, problemas e riscos
   - **Solução** — resumo da solução e entregas por produto
   - **Casos de Uso** — fluxos passo a passo com ROI esperado
   - **ROI** — cards de retorno sobre investimento
   - **Produtos** — seletor com preços da tabela + descontos comerciais
   - **Roadmap** — etapas de implementação (pré-preenchido)
   - **Próximos Passos** — ação imediata e responsáveis
4. Clique **"Finalizar e Salvar Proposta"**
5. Na tela da proposta, clique **"Preview"** para ver o HTML final
6. Clique **"Exportar HTML"** para baixar o arquivo pronto

---

## 5. Como Atualizar os Preços

1. Substitua o arquivo: `/data/tabela-precos-2026.xlsx`
2. Execute: `npm run import:pricing`
3. Valide o arquivo gerado: `data/pricingCatalog.json`

> **Importante:** O sistema nunca usa preços hardcoded. Todo preço vem do `pricingCatalog.json`.

---

## 6. Como Publicar para o Time

### Opção A — Rodar localmente (mais simples)
```bash
# Qualquer colega pode rodar na máquina local:
npm install && npm run dev
# Acessa em http://localhost:3000
```

### Opção B — Vercel (recomendado para time distribuído)
```bash
npm install -g vercel
vercel deploy
# Configure DATABASE_URL na Vercel como variável de ambiente
```

> **Nota:** Com Vercel, o SQLite (arquivo local) não persiste. Para produção, migre para Turso, PlanetScale ou outro banco de dados em nuvem.

### Opção C — Servidor interno
```bash
npm run build
npm start
# Use PM2 para manter o processo ativo:
pm2 start npm --name proposal-builder -- start
```

### Opção D — Docker (futuramente)
Um `Dockerfile` pode ser criado para facilitar o deploy em container.

---

## 7. Funcionalidades Implementadas

| Funcionalidade | Status |
|---|---|
| Importar tabela de preços (XLSX) | ✅ |
| Catálogo de produtos em JSON | ✅ |
| Formulário em etapas (8 blocos) | ✅ |
| Seletor de produtos com preços | ✅ |
| Regras comerciais (50% OFF, R$1, etc.) | ✅ |
| Cálculo automático em tempo real | ✅ |
| Resumo comercial (tabela + totais) | ✅ |
| Salvar proposta no SQLite | ✅ |
| Reabrir e editar proposta | ✅ |
| Preview em HTML | ✅ |
| Exportar HTML (para download) | ✅ |
| Copiar HTML para área de transferência | ✅ |
| Aviso de tarifas Meta (RD Conversas) | ✅ |
| Status da proposta (Rascunho/Enviada/etc.) | ✅ |
| Roadmap pré-preenchido | ✅ |
| Templates de casos de uso | ✅ |
| Templates de ROI qualitativo | ✅ |
| Exportar PDF | 🔄 (próxima versão) |
| Autenticação | 🔄 (próxima versão) |

---

## 8. Comandos Disponíveis

```bash
npm run dev              # Rodar em desenvolvimento
npm run build            # Build para produção
npm start                # Rodar build de produção
npm run import:pricing   # Importar tabela de preços
npx prisma db push       # Criar/atualizar banco de dados
npx prisma studio        # Interface visual do banco de dados
```

---

## 9. Estrutura do Projeto

```
proposal-builder/
├── app/
│   ├── api/
│   │   ├── proposals/route.ts         # CRUD de propostas
│   │   ├── proposals/[id]/route.ts    # Proposta individual
│   │   ├── export/html/route.ts       # Exportação HTML
│   │   └── static/[...path]/route.ts  # Arquivos estáticos (pricingCatalog)
│   ├── proposals/
│   │   ├── page.tsx                   # Lista de propostas
│   │   ├── new/page.tsx               # Nova proposta
│   │   └── [id]/
│   │       ├── page.tsx               # Editar proposta
│   │       └── preview/page.tsx       # Preview HTML
│   ├── page.tsx                       # Home
│   ├── layout.tsx                     # Layout global
│   └── globals.css                    # Estilos Tailwind
├── components/
│   ├── ProposalForm.tsx               # Formulário multi-etapas
│   ├── ClientInfoForm.tsx             # Dados do cliente
│   ├── DiagnosisForm.tsx              # Diagnóstico
│   ├── SolutionForm.tsx               # Solução proposta
│   ├── UseCasesForm.tsx               # Casos de uso
│   ├── RoiForm.tsx                    # ROI
│   ├── ProductSelector.tsx            # Seletor de produtos + descontos
│   ├── RoadmapForm.tsx                # Roadmap de implementação
│   ├── NextStepsForm.tsx              # Próximos passos
│   └── CommercialSummary.tsx          # Resumo comercial
├── lib/
│   ├── proposalSchema.ts              # Validações Zod
│   ├── calculations.ts                # Cálculos comerciais
│   ├── pricing.ts                     # Funções do catálogo de preços
│   ├── templateRenderer.ts            # Renderização Handlebars
│   ├── formatCurrency.ts              # Formatação BRL
│   └── db.ts                          # Cliente Prisma (singleton)
├── data/
│   ├── tabela-precos-2026.xlsx        # Tabela oficial de preços
│   └── pricingCatalog.json            # Catálogo normalizado
├── templates/
│   └── proposta.template.html         # Template Handlebars (opcional)
├── prisma/
│   ├── schema.prisma                  # Schema do banco
│   └── dev.db                         # SQLite local
└── scripts/
    └── importPricing.ts               # Script de importação
```

---

## 10. Melhorias Futuras

- [ ] Exportação em PDF (Playwright/Puppeteer)
- [ ] Template HTML customizável por projeto/cliente
- [ ] Histórico de versões por proposta
- [ ] Integração direta com RD Station CRM
- [ ] Autenticação SSO (Google/Microsoft)
- [ ] Dashboard com métricas de propostas
- [ ] Notificações de atualização de preços
- [ ] Suporte a múltiplas moedas (USD, EUR)
- [ ] Aprovação digital de propostas
- [ ] Anexos e imagens nas propostas

---

## 11. Checklist de Validação

Antes de usar em produção, valide:

- [ ] `npm run dev` roda sem erros
- [ ] `pricingCatalog.json` tem produtos carregados
- [ ] Consegue criar proposta com 3+ produtos
- [ ] Desconto 50% nos 3 primeiros meses calcula corretamente
- [ ] Preview HTML mostra valores formatados em R$
- [ ] Exportação HTML baixa arquivo com nome correto
- [ ] Proposta pode ser reaberta e editada
- [ ] Seleção de RD Conversas mostra aviso de tarifas Meta
- [ ] Status da proposta pode ser alterado

---

## Suporte

Para dúvidas ou problemas, entre em contato com o time que desenvolveu o sistema.
