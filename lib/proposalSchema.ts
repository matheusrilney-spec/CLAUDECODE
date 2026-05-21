import { z } from 'zod';

const dateSchema = z.coerce.date().min(new Date('2024-01-01'));

export const clientInfoSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  contactName: z.string().min(2, 'Nome do contato é obrigatório'),
  segment: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
  sellerName: z.string().min(2, 'Nome do vendedor é obrigatório'),
  sellerEmail: z.string().email('E-mail inválido'),
  proposalDate: dateSchema,
  validUntil: dateSchema,
  proposalType: z.enum([
    'Produto único',
    'Multiproduto Duo',
    'Multiproduto Trio',
    'Projeto customizado',
  ]),
});

export const problemSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().min(10, 'Descrição obrigatória'),
  severity: z.enum(['Crítico', 'Atenção', 'Oportunidade']),
  commercialFlag: z.boolean().optional(),
});

export const diagnosisSchema = z.object({
  objectives: z.string().min(10, 'Objetivo obrigatório'),
  problems: z.array(problemSchema).min(1, 'Adicione pelo menos um problema'),
  impact: z.string().min(10, 'Impacto obrigatório'),
  risks: z.string().min(10, 'Riscos obrigatórios'),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Crítica']),
  moment: z.string().min(10, 'Descrição do momento atual obrigatória'),
});

export const deliverySchema = z.object({
  productName: z.string(),
  deliveries: z.array(z.string().min(3)).min(1, 'Adicione pelo menos uma entrega'),
});

export const solutionSchema = z.object({
  summary: z.string().min(10, 'Resumo obrigatório'),
  productsInvolved: z.array(z.string()).min(1, 'Selecione pelo menos um produto'),
  connection: z.string().min(10, 'Conexão entre produtos obrigatória'),
  deliveries: z.array(deliverySchema),
});

export const useCaseSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  subtitle: z.string().min(3, 'Subtítulo obrigatório'),
  products: z.array(z.string()).min(1, 'Selecione pelo menos um produto'),
  steps: z.array(z.string().min(3)).min(1, 'Adicione pelo menos uma etapa'),
  roi: z.string().min(10, 'Descrição de ROI obrigatória'),
});

export const roiCardSchema = z.object({
  title: z.string().min(3, 'Título obrigatório'),
  description: z.string().min(10, 'Descrição obrigatória'),
  metricBefore: z.string().optional(),
  metricAfter: z.string().optional(),
  financialImpact: z.number().optional(),
  qualitative: z.boolean().optional(),
  notes: z.string().optional(),
});

export const roiSchema = z.object({
  cards: z.array(roiCardSchema),
  summary: z.string().optional(),
});

export const lineItemSchema = z.object({
  productId: z.string().min(1, 'Produto obrigatório'),
  productName: z.string(),
  plan: z.string(),
  metric: z.string(),
  quantity: z.coerce.number().min(0.1, 'Quantidade deve ser maior que 0'),
  tablePrice: z.coerce.number().min(0, 'Preço deve ser maior que 0'),
  discountPercent: z.coerce.number().min(0).max(100, 'Desconto não pode ser maior que 100%'),
  discountAmount: z.coerce.number().min(0),
  promotionalPrice: z.coerce.number().optional(),
  promotionalMonths: z.coerce.number().min(0),
  standardPriceAfterPromo: z.coerce.number().optional(),
  billingType: z.enum(['monthly', 'yearly', 'one-time', 'consumption', 'addon']),
  notes: z.string().optional(),
});

export const proposalSchema = z.object({
  clientInfo: clientInfoSchema,
  diagnosis: diagnosisSchema,
  solution: solutionSchema,
  useCases: z.array(useCaseSchema),
  roi: roiSchema,
  lineItems: z.array(lineItemSchema).min(1, 'Selecione pelo menos um produto'),
  roadmap: z.array(z.object({
    name: z.string().min(3),
    estimatedDays: z.coerce.number().min(1),
    responsible: z.string().min(2),
    description: z.string().min(10),
    tasks: z.array(z.string().min(3)),
  })),
  nextSteps: z.object({
    immediateAction: z.string().min(10),
    scheduledDate: z.coerce.date(),
    clientResponsible: z.string().min(2),
    rdResponsible: z.string().min(2),
    financialFlow: z.string().optional(),
    contractingDeadline: z.string().optional(),
    finalNotes: z.string().optional(),
  }),
});

export type ClientInfo = z.infer<typeof clientInfoSchema>;
export type Diagnosis = z.infer<typeof diagnosisSchema>;
export type Solution = z.infer<typeof solutionSchema>;
export type UseCase = z.infer<typeof useCaseSchema>;
export type ROI = z.infer<typeof roiSchema>;
export type LineItem = z.infer<typeof lineItemSchema>;
export type Proposal = z.infer<typeof proposalSchema>;
