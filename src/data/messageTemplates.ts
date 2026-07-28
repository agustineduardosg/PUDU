export type CrmMessageTemplate = {
  channel: string;
  content: string;
  id: string;
  isActive: boolean;
  name: string;
  subject: string | null;
};

export const defaultMessageTemplates: CrmMessageTemplate[] = [
  {
    channel: "EMAIL",
    content:
      "Hola {nombre}, soy parte de PUDU IT Solutions. Estuvimos revisando el trabajo de {empresa} y vemos una oportunidad concreta para mejorar {interes}. ¿Te parece si coordinamos una conversación breve esta semana?",
    id: "demo-first-contact",
    isActive: true,
    name: "Primer acercamiento",
    subject: "Una idea tecnológica para tu empresa",
  },
  {
    channel: "EMAIL",
    content:
      "Hola {nombre}, quería retomar nuestra conversación sobre {interes}. Podemos preparar una propuesta acotada con alcance, plazos y próximos pasos. ¿Qué día te acomoda revisarla?",
    id: "demo-follow-up",
    isActive: true,
    name: "Seguimiento",
    subject: "Seguimiento a nuestra conversación",
  },
  {
    channel: "EMAIL",
    content:
      "Hola {nombre}, ya preparamos la propuesta para {empresa}. Resume la solución para {interes}, el plan de implementación y la inversión estimada. Quedo atento para revisarla contigo.",
    id: "demo-proposal",
    isActive: true,
    name: "Envío de propuesta",
    subject: "Propuesta PUDU IT Solutions",
  },
];
