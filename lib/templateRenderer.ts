import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { formatCurrency } from './formatCurrency';

Handlebars.registerHelper('formatBRL', (value: number) => formatCurrency(value));
Handlebars.registerHelper('ifCond', function (
  this: unknown,
  v1: unknown,
  operator: string,
  v2: unknown,
  options: Handlebars.HelperOptions
) {
  switch (operator) {
    case '==': return v1 == v2 ? options.fn(this) : options.inverse(this);
    case '===': return v1 === v2 ? options.fn(this) : options.inverse(this);
    case '>': return (v1 as number) > (v2 as number) ? options.fn(this) : options.inverse(this);
    case '>=': return (v1 as number) >= (v2 as number) ? options.fn(this) : options.inverse(this);
    default: return options.inverse(this);
  }
});
Handlebars.registerHelper('json', (value: unknown) => JSON.stringify(value));
Handlebars.registerHelper('inc', (value: number) => value + 1);

export function renderProposalTemplate(context: Record<string, unknown>): string {
  const templatePath = path.join(process.cwd(), 'templates', 'proposta.template.html');

  let templateSource: string;
  if (fs.existsSync(templatePath)) {
    templateSource = fs.readFileSync(templatePath, 'utf-8');
  } else {
    templateSource = getInlineTemplate();
  }

  const template = Handlebars.compile(templateSource);
  return template(context);
}

export function renderTemplate(template: string, context: Record<string, unknown>): string {
  const compiled = Handlebars.compile(template);
  return compiled(context);
}

export function createDefaultTemplate(): string {
  return getInlineTemplate();
}

function getInlineTemplate(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proposta — {{companyName}}</title>
<style>
:root{--ocean:#0D3B4F;--teal:#3AADA8;--sand:#F5F0E8;--white:#fff;--text-dark:#0D1F2A;--red:#C52B47}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',sans-serif;background:var(--sand);color:var(--text-dark);font-size:15px;line-height:1.65}
.container{max-width:1100px;margin:0 auto}
section{padding:60px 40px}
.hero{background:var(--ocean);color:#fff;padding:80px 40px;text-align:center}
.hero h1{font-size:42px;margin-bottom:16px;font-weight:300}
.hero .subtitle{font-size:18px;opacity:.8;max-width:600px;margin:0 auto 24px}
.meta{display:grid;grid-template-columns:repeat(2,1fr);gap:16px;margin-top:24px;font-size:13px;max-width:500px;margin-left:auto;margin-right:auto}
.meta-label{opacity:.6;margin-bottom:4px}
h2{font-size:28px;color:var(--ocean);border-bottom:2px solid var(--teal);padding-bottom:12px;margin-bottom:24px}
.card{background:#fff;border-left:4px solid var(--teal);padding:24px;margin-bottom:16px;border-radius:8px}
.card h3{color:var(--ocean);margin-bottom:8px;font-size:17px}
.badge{display:inline-block;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-critico{background:#fee2e2;color:#991b1b}
.badge-atencao{background:#fef3c7;color:#92400e}
.badge-oportunidade{background:#d1fae5;color:#065f46}
.steps{list-style:none;counter-reset:step}
.steps li{counter-increment:step;display:flex;gap:12px;margin-bottom:12px;align-items:flex-start}
.steps li::before{content:counter(step);background:var(--teal);color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;margin-top:2px}
table{width:100%;border-collapse:collapse;margin:24px 0;background:#fff;border-radius:8px;overflow:hidden}
table th{background:var(--ocean);color:#fff;padding:12px 16px;text-align:left;font-size:13px}
table td{border-bottom:1px solid #e5e7eb;padding:12px 16px;font-size:14px}
table tr:last-child td{border-bottom:none}
.total-row td{font-weight:700;background:#f0fffe;color:var(--ocean)}
.highlight{background:#ecfdf5;border:1px solid var(--teal);padding:20px;border-radius:8px;margin:16px 0}
.warning{background:#fffbeb;border:1px solid #f59e0b;padding:16px;border-radius:8px;margin:16px 0;font-size:13px}
.cta{background:var(--teal);color:#fff;padding:32px;text-align:center;border-radius:12px;margin:24px 0}
.cta h3{font-size:22px;margin-bottom:8px}
.footer{background:var(--ocean);color:#fff;padding:40px;text-align:center;font-size:13px;margin-top:60px}
.roadmap-steps{display:flex;flex-direction:column;gap:16px}
.roadmap-item{display:flex;gap:16px;align-items:flex-start}
.roadmap-num{background:var(--ocean);color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0}
.tag{display:inline-block;background:#e0f2fe;color:#0369a1;border-radius:4px;padding:2px 8px;font-size:12px;margin:2px}
</style>
</head>
<body>

<div class="hero">
  <div class="container">
    <h1>Proposta Comercial</h1>
    <p class="subtitle">{{#if proposalTitle}}{{proposalTitle}}{{else}}Solução Completa para {{companyName}}{{/if}}</p>
    <div class="meta">
      <div><div class="meta-label">Cliente</div><strong>{{companyName}}</strong></div>
      <div><div class="meta-label">Contato</div><strong>{{contactName}}</strong></div>
      <div><div class="meta-label">Consultor</div><strong>{{sellerName}}</strong></div>
      <div><div class="meta-label">Data</div><strong>{{proposalDate}}</strong></div>
      <div><div class="meta-label">Válida até</div><strong>{{validUntil}}</strong></div>
      {{#if proposalType}}<div><div class="meta-label">Tipo</div><strong>{{proposalType}}</strong></div>{{/if}}
    </div>
  </div>
</div>

{{#if diagnosis}}
<section>
  <div class="container">
    <h2>Diagnóstico</h2>
    {{#if diagnosis.objectives}}
    <div class="card">
      <h3>Objetivo Principal</h3>
      <p>{{diagnosis.objectives}}</p>
    </div>
    {{/if}}
    {{#if diagnosis.impact}}
    <div class="card">
      <h3>Impacto Identificado</h3>
      <p>{{diagnosis.impact}}</p>
    </div>
    {{/if}}
    {{#each diagnosis.problems}}
    <div class="card">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
        <h3>{{this.title}}</h3>
        {{#ifCond this.severity '==' 'Crítico'}}<span class="badge badge-critico">Crítico</span>{{/ifCond}}
        {{#ifCond this.severity '==' 'Atenção'}}<span class="badge badge-atencao">Atenção</span>{{/ifCond}}
        {{#ifCond this.severity '==' 'Oportunidade'}}<span class="badge badge-oportunidade">Oportunidade</span>{{/ifCond}}
      </div>
      <p>{{this.description}}</p>
    </div>
    {{/each}}
    {{#if diagnosis.risks}}
    <div class="warning">
      <strong>⚠️ Riscos de não agir:</strong> {{diagnosis.risks}}
    </div>
    {{/if}}
  </div>
</section>
{{/if}}

{{#if solution}}
<section style="background:#fff">
  <div class="container">
    <h2>Solução Proposta</h2>
    {{#if solution.summary}}
    <p style="font-size:16px;line-height:1.8;margin-bottom:24px">{{solution.summary}}</p>
    {{/if}}
    {{#if solution.productsInvolved}}
    <div style="margin-bottom:24px">
      <strong>Produtos envolvidos:</strong>
      <div style="margin-top:8px">
        {{#each solution.productsInvolved}}<span class="tag">{{this}}</span>{{/each}}
      </div>
    </div>
    {{/if}}
    {{#if solution.connection}}
    <div class="card">
      <h3>Como os produtos se integram</h3>
      <p>{{solution.connection}}</p>
    </div>
    {{/if}}
    {{#each solution.deliveries}}
    <div class="card">
      <h3>{{this.productName}}</h3>
      <ul style="list-style:disc;margin-left:20px;margin-top:8px">
        {{#each this.deliveries}}<li>{{this}}</li>{{/each}}
      </ul>
    </div>
    {{/each}}
  </div>
</section>
{{/if}}

{{#if useCases}}
<section>
  <div class="container">
    <h2>Casos de Uso</h2>
    {{#each useCases}}
    <div class="card">
      <h3>{{this.title}}</h3>
      {{#if this.subtitle}}<p style="color:#6b7280;margin-bottom:12px">{{this.subtitle}}</p>{{/if}}
      {{#if this.products}}
      <div style="margin-bottom:12px">
        {{#each this.products}}<span class="tag">{{this}}</span>{{/each}}
      </div>
      {{/if}}
      {{#if this.steps}}
      <ul class="steps">
        {{#each this.steps}}<li>{{this}}</li>{{/each}}
      </ul>
      {{/if}}
      {{#if this.roi}}
      <div class="highlight" style="margin-top:16px">
        <strong>Ganho esperado:</strong> {{this.roi}}
      </div>
      {{/if}}
    </div>
    {{/each}}
  </div>
</section>
{{/if}}

{{#if roi}}
<section style="background:#fff">
  <div class="container">
    <h2>Retorno sobre o Investimento</h2>
    {{#each roi.cards}}
    <div class="card">
      <h3>{{this.title}}</h3>
      <p style="margin-bottom:12px">{{this.description}}</p>
      {{#if this.metricBefore}}
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:12px">
        <div style="background:#fef2f2;padding:12px;border-radius:6px;text-align:center">
          <div style="font-size:12px;color:#6b7280;margin-bottom:4px">Antes</div>
          <div style="font-size:20px;font-weight:700;color:#dc2626">{{this.metricBefore}}</div>
        </div>
        <div style="background:#f0fffe;padding:12px;border-radius:6px;text-align:center">
          <div style="font-size:12px;color:#6b7280;margin-bottom:4px">Depois</div>
          <div style="font-size:20px;font-weight:700;color:#0D3B4F">{{this.metricAfter}}</div>
        </div>
      </div>
      {{/if}}
      {{#if this.notes}}<p style="font-size:13px;color:#6b7280;margin-top:8px"><em>{{this.notes}}</em></p>{{/if}}
    </div>
    {{/each}}
    {{#if roi.summary}}<div class="highlight"><p>{{roi.summary}}</p></div>{{/if}}
  </div>
</section>
{{/if}}

{{#if lineItems}}
<section>
  <div class="container">
    <h2>Proposta Comercial</h2>

    {{#if hasRdConversas}}
    <div class="warning">
      <strong>ℹ️ Sobre tarifas de mensageria (Meta):</strong> Os valores de RD Conversas não incluem as tarifas de mensagens cobradas diretamente pela Meta (WhatsApp Business API). Essas tarifas variam conforme o tipo e volume de mensagens. Consulte a tabela de tarifas Meta vigente.
    </div>
    {{/if}}

    <table>
      <thead>
        <tr>
          <th>Produto / Serviço</th>
          <th>Plano</th>
          <th>Tipo</th>
          <th>Valor Tabela</th>
          <th>Desconto</th>
          <th>Valor Promocional</th>
          <th>Valor Padrão</th>
        </tr>
      </thead>
      <tbody>
        {{#each lineItems}}
        <tr>
          <td><strong>{{this.productName}}</strong>{{#if this.metric}} <span style="font-size:12px;color:#6b7280">({{this.quantity}} {{this.metric}})</span>{{/if}}</td>
          <td>{{this.plan}}</td>
          <td>
            {{#ifCond this.billingType '==' 'one-time'}}<span class="badge" style="background:#e0f2fe;color:#0369a1">Implementação</span>{{/ifCond}}
            {{#ifCond this.billingType '==' 'monthly'}}<span class="badge" style="background:#d1fae5;color:#065f46">Recorrente</span>{{/ifCond}}
            {{#ifCond this.billingType '==' 'addon'}}<span class="badge" style="background:#ede9fe;color:#5b21b6">Addon</span>{{/ifCond}}
            {{#ifCond this.billingType '==' 'consumption'}}<span class="badge" style="background:#fef3c7;color:#92400e">Consumo</span>{{/ifCond}}
          </td>
          <td>{{this.tablePriceFmt}}</td>
          <td>{{#if this.discountPercent}}{{this.discountPercent}}%{{else}}—{{/if}}</td>
          <td><strong style="color:var(--teal)">{{this.promoFmt}}</strong>{{#if this.promotionalMonths}} <span style="font-size:12px;color:#6b7280">({{this.promotionalMonths}} meses)</span>{{/if}}</td>
          <td>{{this.standardFmt}}</td>
        </tr>
        {{/each}}
      </tbody>
    </table>

    <div class="highlight">
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px">
        {{#if summary.totalMonthlyPromo}}
        <div style="text-align:center">
          <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Mensalidade Promocional</div>
          <div style="font-size:24px;font-weight:700;color:var(--teal)">{{summary.totalMonthlyPromoFmt}}</div>
        </div>
        {{/if}}
        {{#if summary.totalMonthlyStandard}}
        <div style="text-align:center">
          <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Mensalidade Padrão</div>
          <div style="font-size:24px;font-weight:700;color:var(--ocean)">{{summary.totalMonthlyStandardFmt}}</div>
        </div>
        {{/if}}
        {{#if summary.totalImplementation}}
        <div style="text-align:center">
          <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Implementação</div>
          <div style="font-size:24px;font-weight:700;color:var(--ocean)">{{summary.totalImplementationFmt}}</div>
        </div>
        {{/if}}
        {{#if summary.totalEconomy}}
        <div style="text-align:center">
          <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Economia Total</div>
          <div style="font-size:24px;font-weight:700;color:#16a34a">{{summary.totalEconomyFmt}}</div>
        </div>
        {{/if}}
      </div>
    </div>

    {{#each lineItems}}
    {{#if this.notes}}
    <p style="font-size:13px;color:#6b7280;margin-top:8px"><em>* {{this.productName}}: {{this.notes}}</em></p>
    {{/if}}
    {{/each}}
  </div>
</section>
{{/if}}

{{#if roadmap}}
<section style="background:#fff">
  <div class="container">
    <h2>Roadmap de Implementação</h2>
    <div class="roadmap-steps">
      {{#each roadmap}}
      <div class="roadmap-item">
        <div class="roadmap-num">{{inc @index}}</div>
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <strong style="font-size:16px">{{this.name}}</strong>
            <span style="font-size:13px;color:#6b7280">{{this.estimatedDays}} dias · {{this.responsible}}</span>
          </div>
          <p style="font-size:14px;color:#4b5563;margin-bottom:8px">{{this.description}}</p>
          {{#if this.tasks}}
          <ul style="list-style:disc;margin-left:20px;font-size:13px;color:#6b7280">
            {{#each this.tasks}}<li>{{this}}</li>{{/each}}
          </ul>
          {{/if}}
        </div>
      </div>
      {{/each}}
    </div>
  </div>
</section>
{{/if}}

{{#if nextSteps}}
<section>
  <div class="container">
    <h2>Próximos Passos</h2>
    <div class="card">
      <h3>Ação Imediata</h3>
      <p>{{nextSteps.immediateAction}}</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:16px">
      {{#if nextSteps.scheduledDate}}
      <div class="card">
        <div style="font-size:12px;color:#6b7280">Data/Hora combinados</div>
        <strong>{{nextSteps.scheduledDate}}</strong>
      </div>
      {{/if}}
      {{#if nextSteps.clientResponsible}}
      <div class="card">
        <div style="font-size:12px;color:#6b7280">Responsável (Cliente)</div>
        <strong>{{nextSteps.clientResponsible}}</strong>
      </div>
      {{/if}}
      {{#if nextSteps.rdResponsible}}
      <div class="card">
        <div style="font-size:12px;color:#6b7280">Responsável (RD)</div>
        <strong>{{nextSteps.rdResponsible}}</strong>
      </div>
      {{/if}}
      {{#if nextSteps.contractingDeadline}}
      <div class="card">
        <div style="font-size:12px;color:#6b7280">Prazo para contratação</div>
        <strong>{{nextSteps.contractingDeadline}}</strong>
      </div>
      {{/if}}
    </div>
    {{#if nextSteps.financialFlow}}<div class="card" style="margin-top:12px"><h3>Fluxo Financeiro</h3><p>{{nextSteps.financialFlow}}</p></div>{{/if}}
    {{#if nextSteps.finalNotes}}<div class="warning" style="margin-top:12px"><strong>Observações:</strong> {{nextSteps.finalNotes}}</div>{{/if}}
  </div>
</section>
{{/if}}

<div style="padding:40px">
  <div class="container">
    <div class="cta">
      <h3>Pronto para começar?</h3>
      <p style="opacity:.9;margin-top:8px">Entre em contato com {{sellerName}} e dê o próximo passo.</p>
      <p style="margin-top:8px;font-size:14px">📧 {{sellerEmail}}</p>
    </div>
  </div>
</div>

<div class="footer">
  <p><strong>RD Station</strong> — Proposta gerada em {{proposalDate}}</p>
  <p style="opacity:.6;margin-top:8px;font-size:12px">Válida até {{validUntil}} · {{sellerName}} · {{sellerEmail}}</p>
</div>

</body>
</html>`;
}
