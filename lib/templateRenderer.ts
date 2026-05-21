import Handlebars from 'handlebars';

interface RenderContext {
  companyName: string;
  contactName: string;
  sellerName: string;
  proposalDate: string;
  validUntil: string;
  [key: string]: any;
}

export function renderTemplate(template: string, context: RenderContext): string {
  const hbs = Handlebars.compile(template);
  return hbs(context);
}

export function createDefaultTemplate(): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta {{companyName}}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
        }
        .header {
            border-bottom: 3px solid #C52B47;
            padding-bottom: 30px;
            margin-bottom: 40px;
        }
        .header h1 {
            color: #C52B47;
            font-size: 36px;
            margin-bottom: 10px;
        }
        .header-meta {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            color: #666;
            margin-top: 20px;
        }
        .section {
            margin-bottom: 50px;
        }
        .section-title {
            font-size: 24px;
            color: #C52B47;
            border-bottom: 2px solid #eee;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .card {
            background: #f9f9f9;
            border-left: 4px solid #C52B47;
            padding: 20px;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th {
            background: #C52B47;
            color: white;
            padding: 12px;
            text-align: left;
            font-weight: 600;
        }
        table td {
            border-bottom: 1px solid #ddd;
            padding: 12px;
        }
        table tr:hover {
            background: #f5f5f5;
        }
        .highlight {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Proposta Comercial</h1>
            <p>RD Station Solutions</p>
            <div class="header-meta">
                <div><strong>Cliente:</strong> {{companyName}}</div>
                <div><strong>Contato:</strong> {{contactName}}</div>
                <div><strong>Vendedor:</strong> {{sellerName}}</div>
                <div><strong>Data:</strong> {{proposalDate}}</div>
                <div><strong>Válida até:</strong> {{validUntil}}</div>
            </div>
        </div>
        
        <div class="section">
            <h2 class="section-title">Diagnóstico</h2>
            {{#if objectives}}
            <div class="card">
                <h3>Objetivo Principal</h3>
                <p>{{objectives}}</p>
            </div>
            {{/if}}
            {{#problems}}
            <div class="card">
                <h3>{{this.title}}</h3>
                <p>{{this.description}}</p>
            </div>
            {{/problems}}
        </div>
        
        <div class="section">
            <h2 class="section-title">Solução Proposta</h2>
            {{#if solutionSummary}}
            <div class="card">
                <p>{{solutionSummary}}</p>
            </div>
            {{/if}}
        </div>
        
        <div class="section">
            <h2 class="section-title">Proposta Comercial</h2>
            <table>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Plano</th>
                        <th>Quantidade</th>
                        <th>Valor Unitário</th>
                        <th>Desconto</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {{#lineItems}}
                    <tr>
                        <td>{{this.productName}}</td>
                        <td>{{this.plan}}</td>
                        <td>{{this.quantity}}</td>
                        <td>R$ {{this.tablePrice}}</td>
                        <td>{{this.discountPercent}}%</td>
                        <td>R$ {{this.total}}</td>
                    </tr>
                    {{/lineItems}}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2 class="section-title">Próximos Passos</h2>
            {{#if nextSteps}}
            <div class="card">
                <p>{{nextSteps}}</p>
            </div>
            {{/if}}
        </div>
        
        <div class="footer">
            <p>Esta proposta foi gerada automaticamente pelo Montador de Propostas RD Station.</p>
            <p>&copy; {{year}} RD Station. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;
}
