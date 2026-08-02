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
    channel: "INSTAGRAM",
    content:
      "Hola {nombre}, gracias por escribir LANDING a PUDU. Para orientarte mejor: ¿hoy tus clientes encuentran en un solo lugar tus servicios, beneficios y una forma clara de contactarte?",
    id: "instagram-landing-qualification",
    isActive: true,
    name: "Instagram · Landing page",
    subject: null,
  },
  {
    channel: "INSTAGRAM",
    content:
      "Hola {nombre}, gracias por escribir SALUD a PUDU. Para orientarte sin pedir datos sensibles: ¿cómo coordinas hoy las solicitudes y confirmaciones de hora?",
    id: "instagram-salud-qualification",
    isActive: true,
    name: "Instagram · Salud",
    subject: null,
  },
  {
    channel: "INSTAGRAM",
    content:
      "Hola {nombre}, gracias por escribir AGENDA a PUDU. ¿Cómo registras hoy una reserva y su confirmación?",
    id: "instagram-agenda-qualification",
    isActive: true,
    name: "Instagram · Agenda",
    subject: null,
  },
  {
    channel: "INSTAGRAM",
    content:
      "Hola {nombre}, gracias por escribir FITNESS a PUDU. ¿Cómo registras hoy las consultas, pagos y renovaciones?",
    id: "instagram-fitness-qualification",
    isActive: true,
    name: "Instagram · Fitness",
    subject: null,
  },
  {
    channel: "INSTAGRAM",
    content:
      "Hola {nombre}, gracias por escribir DIAGNÓSTICO a PUDU 👋 ¿Qué te gustaría ordenar primero: 1) ventas y seguimiento, 2) agenda y reservas, 3) tareas repetitivas o 4) otro proceso? Si prefieres dejar el contexto y tu medio de contacto de una vez, puedes hacerlo aquí: https://puduit.tech/ig",
    id: "instagram-diagnostic-qualification",
    isActive: true,
    name: "Instagram · Diagnóstico",
    subject: null,
  },
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
