export type CrmDemoLead = {
  company: string | null;
  createdAt: Date;
  email: string;
  id: string;
  interest: string;
  message: string;
  name: string;
  priority: string;
  source: string;
  status: string;
  tasks: { dueAt: Date | null }[];
};

export const crmDemoLeads: CrmDemoLead[] = [
  {
    company: "Clínica Andina · Demo",
    createdAt: new Date("2026-07-25T10:30:00-04:00"),
    email: "contacto@clinica-demo.cl",
    id: "demo-clinica",
    interest: "Agenda online",
    message: "Necesitamos ordenar las reservas y reducir las inasistencias.",
    name: "Carolina Muñoz",
    priority: "HIGH",
    source: "INSTAGRAM",
    status: "NEW",
    tasks: [{ dueAt: new Date("2026-07-29T10:00:00-04:00") }],
  },
  {
    company: "Taller Norte · Demo",
    createdAt: new Date("2026-07-23T09:15:00-04:00"),
    email: "ventas@taller-demo.cl",
    id: "demo-taller",
    interest: "CRM",
    message: "Buscamos centralizar clientes, cotizaciones y seguimientos.",
    name: "Felipe Rojas",
    priority: "MEDIUM",
    source: "WEBSITE",
    status: "QUALIFYING",
    tasks: [{ dueAt: new Date("2026-07-30T15:30:00-04:00") }],
  },
  {
    company: "Estudio Sur · Demo",
    createdAt: new Date("2026-07-21T16:45:00-04:00"),
    email: "hola@estudio-demo.cl",
    id: "demo-estudio",
    interest: "Automatización",
    message: "Queremos automatizar la recepción y clasificación de documentos.",
    name: "Marcela Soto",
    priority: "URGENT",
    source: "REFERRAL",
    status: "CONTACTED",
    tasks: [],
  },
  {
    company: "Constructora Pacífico · Demo",
    createdAt: new Date("2026-07-18T11:00:00-04:00"),
    email: "proyectos@constructora-demo.cl",
    id: "demo-constructora",
    interest: "SaaS",
    message: "Necesitamos una plataforma para controlar avances y clientes.",
    name: "Diego Arancibia",
    priority: "HIGH",
    source: "LINKEDIN",
    status: "MEETING",
    tasks: [{ dueAt: new Date("2026-08-01T09:00:00-04:00") }],
  },
  {
    company: "EcoMarket · Demo",
    createdAt: new Date("2026-07-10T12:20:00-04:00"),
    email: "gerencia@ecomarket-demo.cl",
    id: "demo-ecomarket",
    interest: "Landing page",
    message: "Queremos mejorar la conversión de nuestras campañas digitales.",
    name: "Paula Contreras",
    priority: "MEDIUM",
    source: "CAMPAIGN",
    status: "PROPOSAL",
    tasks: [],
  },
];
