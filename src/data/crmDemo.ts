export type CrmDemoLead = {
  assignedTo: string | null;
  city: string | null;
  company: string | null;
  createdAt: Date;
  email: string | null;
  id: string;
  instagram: string | null;
  interest: string;
  message: string;
  name: string;
  nextFollowUpAt: Date | null;
  notes: string | null;
  phone: string | null;
  priority: string;
  qualificationConfidence?: number;
  qualificationReason?: string | null;
  qualificationSummary?: string | null;
  classificationVersion?: string | null;
  qualifiedAt?: Date | null;
  score: number;
  source: string;
  status: string;
  tags?: string[];
  tasks: { dueAt: Date | null }[];
};

export const crmDemoLeads: CrmDemoLead[] = [
  {
    assignedTo: "Agustín",
    city: "Santiago",
    company: "Clínica Andina · Demo",
    createdAt: new Date("2026-07-25T10:30:00-04:00"),
    email: "contacto@clinica-demo.cl",
    id: "demo-clinica",
    instagram: "@clinicaandina_demo",
    interest: "Agenda online",
    message: "Necesitamos ordenar las reservas y reducir las inasistencias.",
    name: "Carolina Muñoz",
    nextFollowUpAt: new Date("2026-07-29T10:00:00-04:00"),
    notes: "Interesada en recordatorios por WhatsApp y panel para recepción.",
    phone: "+56 9 5555 0101",
    priority: "HIGH",
    score: 82,
    source: "INSTAGRAM",
    status: "NEW",
    tasks: [{ dueAt: new Date("2026-07-29T10:00:00-04:00") }],
  },
  {
    assignedTo: "Agustín",
    city: "Antofagasta",
    company: "Taller Norte · Demo",
    createdAt: new Date("2026-07-23T09:15:00-04:00"),
    email: "ventas@taller-demo.cl",
    id: "demo-taller",
    instagram: "@tallernorte_demo",
    interest: "CRM",
    message: "Buscamos centralizar clientes, cotizaciones y seguimientos.",
    name: "Felipe Rojas",
    nextFollowUpAt: new Date("2026-07-30T15:30:00-04:00"),
    notes: "Hoy gestionan clientes con planillas separadas.",
    phone: "+56 9 5555 0202",
    priority: "MEDIUM",
    score: 64,
    source: "WEBSITE",
    status: "QUALIFYING",
    tasks: [{ dueAt: new Date("2026-07-30T15:30:00-04:00") }],
  },
  {
    assignedTo: "Agustín",
    city: "Concepción",
    company: "Estudio Sur · Demo",
    createdAt: new Date("2026-07-21T16:45:00-04:00"),
    email: "hola@estudio-demo.cl",
    id: "demo-estudio",
    instagram: null,
    interest: "Automatización",
    message: "Queremos automatizar la recepción y clasificación de documentos.",
    name: "Marcela Soto",
    nextFollowUpAt: null,
    notes: "Referida por un cliente anterior. Alta urgencia operativa.",
    phone: "+56 9 5555 0303",
    priority: "URGENT",
    score: 91,
    source: "REFERRAL",
    status: "CONTACTED",
    tasks: [],
  },
  {
    assignedTo: "Agustín",
    city: "Viña del Mar",
    company: "Constructora Pacífico · Demo",
    createdAt: new Date("2026-07-18T11:00:00-04:00"),
    email: "proyectos@constructora-demo.cl",
    id: "demo-constructora",
    instagram: "@constructorapacifico_demo",
    interest: "SaaS",
    message: "Necesitamos una plataforma para controlar avances y clientes.",
    name: "Diego Arancibia",
    nextFollowUpAt: new Date("2026-08-01T09:00:00-04:00"),
    notes: "Reunión técnica agendada con operaciones y administración.",
    phone: "+56 9 5555 0404",
    priority: "HIGH",
    score: 86,
    source: "LINKEDIN",
    status: "MEETING",
    tasks: [{ dueAt: new Date("2026-08-01T09:00:00-04:00") }],
  },
  {
    assignedTo: "Agustín",
    city: "Puerto Montt",
    company: "EcoMarket · Demo",
    createdAt: new Date("2026-07-10T12:20:00-04:00"),
    email: "gerencia@ecomarket-demo.cl",
    id: "demo-ecomarket",
    instagram: "@ecomarket_demo",
    interest: "Landing page",
    message: "Queremos mejorar la conversión de nuestras campañas digitales.",
    name: "Paula Contreras",
    nextFollowUpAt: null,
    notes: "Propuesta enviada. Esperando confirmación del presupuesto.",
    phone: "+56 9 5555 0505",
    priority: "MEDIUM",
    score: 76,
    source: "CAMPAIGN",
    status: "PROPOSAL",
    tasks: [],
  },
];

export function getCrmDemoLeadDetail(leadId: string) {
  const lead = crmDemoLeads.find((candidate) => candidate.id === leadId);

  if (!lead) {
    return null;
  }

  return {
    ...lead,
    activities: [
      {
        body: lead.message,
        createdAt: lead.createdAt,
        id: `${lead.id}-activity-entry`,
        title: "Prospecto ingresado al CRM",
        type: "NOTE",
      },
      {
        body: "Se revisó la necesidad inicial y se preparó el próximo paso.",
        createdAt: new Date(lead.createdAt.getTime() + 1000 * 60 * 60 * 24),
        id: `${lead.id}-activity-review`,
        title: "Calificación inicial",
        type: "STATUS_CHANGE",
      },
    ],
    messages: [
      {
        channel: "EMAIL",
        content: `Hola ${lead.name}, preparamos una primera idea para ${lead.interest.toLowerCase()}.`,
        createdAt: new Date(lead.createdAt.getTime() + 1000 * 60 * 90),
        id: `${lead.id}-message`,
        recipient: lead.email,
        status: "DRAFT",
        subject: `Propuesta inicial de PUDU para ${lead.company || lead.name}`,
      },
    ],
    tasks: lead.tasks.map((task, index) => ({
      completedAt: null,
      description: "Contactar al prospecto y registrar el resultado.",
      dueAt: task.dueAt,
      id: `${lead.id}-task-${index}`,
      priority: lead.priority,
      status: "PENDING",
      title: "Realizar seguimiento comercial",
    })),
  };
}
