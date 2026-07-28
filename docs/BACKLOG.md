# Backlog de producto — PUDU CRM

Este documento conserva iniciativas aprobadas conceptualmente que todavía no
forman parte de la línea activa de desarrollo.

## Estado de prioridades

| Prioridad | Iniciativa | Estado |
| --- | --- | --- |
| Activa | Operación de leads entrantes desde Instagram | En desarrollo |
| Posterior | CEO Copilot: conversación y voz automatizada | Aparcada |

---

## BK-001 — PUDU CEO Copilot para Instagram

**Estado:** Backlog  
**Prioridad propuesta:** Alta, después de estabilizar la operación inbound  
**Canal inicial:** Instagram Direct  
**Responsable funcional:** PUDU IT Solutions  
**Decisión arquitectónica preliminar:** construir sobre el CRM y la integración
oficial de Meta ya existentes; usar ManyChat como referencia de producto, no
como núcleo operativo.

### Objetivo

Convertir conversaciones iniciadas por prospectos en Instagram en
oportunidades calificadas mediante respuestas rápidas, cercanas y coherentes
con la voz de PUDU, manteniendo trazabilidad completa en el CRM y una
transferencia clara hacia atención humana.

### Resultado esperado

- Reducir el tiempo de primera respuesta.
- Calificar automáticamente la necesidad comercial del prospecto.
- Mantener una conversación breve, cálida y orientada a un siguiente paso.
- Permitir mensajes de audio con la voz autorizada del CEO.
- Transferir conversaciones sensibles o de alto valor a una persona.
- Registrar decisiones, mensajes, audios y resultados dentro del lead.

### Principios

1. La automatización solo responderá interacciones iniciadas o habilitadas por
   el usuario y respetará las ventanas de mensajería de Meta.
2. La experiencia será cercana, pero no fingirá que una respuesta generada fue
   escrita o grabada manualmente por el CEO.
3. Las decisiones comerciales relevantes conservarán supervisión humana.
4. Todo mensaje deberá quedar asociado a un lead y a una actividad del CRM.
5. La autonomía aumentará únicamente después de medir calidad y conversión.

### Fuera de alcance

- Envío masivo de DMs en frío a cuentas extraídas de Instagram.
- Automatización autónoma de precios especiales, contratos o compromisos.
- Respuestas automáticas a reclamos, incidentes sensibles o datos personales.
- Sustitución del CRM por ManyChat.
- Conexión de ManyChat a la cuenta principal sin una prueba aislada y una
  estrategia explícita de enrutamiento de conversaciones.

## Épicas

### EP-1 — Gobierno y seguridad conversacional

- Registrar el inicio y vencimiento de la ventana de respuesta de 24 horas.
- Bloquear envíos automáticos fuera de la ventana permitida.
- Definir intenciones seguras, supervisadas y prohibidas.
- Incorporar pausa global de automatizaciones.
- Incorporar exclusión por lead y transferencia inmediata a atención humana.
- Mantener auditoría del origen de cada respuesta: plantilla, IA o persona.

**Criterios de aceptación**

- Ninguna automatización puede enviar si el contacto no es elegible.
- Un administrador puede detener toda la automatización inmediatamente.
- Cada respuesta muestra en el CRM por qué y cómo fue generada.

### EP-2 — Clasificación y calificación

- Detectar servicio de interés: landing page, SaaS, CRM, agenda,
  automatización, soporte u otro.
- Detectar intención: consulta, cotización, reunión, soporte o reclamo.
- Extraer nombre, empresa, rubro, ciudad, necesidad, urgencia y presupuesto
  cuando el usuario los entregue.
- Calcular un score comercial explicable.
- Formular una sola pregunta de calificación por turno.
- Asignar responsable y próxima acción según score e intención.

**Criterios de aceptación**

- La clasificación incluye nivel de confianza.
- Los datos inferidos no reemplazan información confirmada sin indicarlo.
- Los leads de alta intención crean una tarea de contacto humano.

### EP-3 — Motor de respuestas

- Crear una base de conocimiento editable sobre PUDU, servicios y casos de uso.
- Definir personalidad, expresiones permitidas y expresiones prohibidas.
- Generar respuestas breves con contexto de la conversación y del CRM.
- Ofrecer respuestas rápidas para calificación y llamada a la acción.
- Implementar tres modos: automático, requiere aprobación y solamente humano.
- Evitar respuestas repetidas y conversaciones circulares.

**Criterios de aceptación**

- La respuesta automática explica qué regla o intención la habilitó.
- El administrador puede editar y aprobar borradores antes de enviarlos.
- Ante baja confianza, el sistema pregunta, deriva o guarda silencio.

### EP-4 — Biblioteca de voz del CEO

- Registrar consentimiento explícito para utilizar la voz.
- Crear audios reales pregrabados para bienvenida, agradecimiento,
  calificación, agenda y transferencia.
- Etiquetar los audios por intención, etapa, duración y tono.
- Permitir previsualización antes del envío.
- Registrar qué audio fue enviado, a quién y por qué.

**Criterios de aceptación**

- Solo usuarios autorizados pueden administrar la biblioteca.
- Los audios reales se distinguen internamente de los sintetizados.
- Ningún audio se envía sin una conversación elegible.

### EP-5 — Voz personalizada asistida

- Generar un guion corto a partir del contexto del lead.
- Crear audio utilizando exclusivamente la voz autorizada.
- Aplicar aprobación manual obligatoria en la primera versión.
- Limitar duración, vocabulario y afirmaciones comerciales.
- Almacenar guion, archivo, proveedor, versión y aprobador.
- Añadir una presentación transparente del asistente cuando corresponda.

**Criterios de aceptación**

- El administrador puede escuchar, regenerar, editar o descartar el audio.
- No se generan audios para categorías sensibles o prohibidas.
- El envío queda registrado como contenido sintetizado y aprobado.

### EP-6 — Envío mediante Instagram

- Extender el adaptador oficial de Meta para archivos de audio.
- Alojar cada archivo mediante una URL segura y temporal.
- Validar formato, tamaño, duración y disponibilidad antes de enviar.
- Registrar identificador de Meta, estado y errores.
- Comprobar cómo se visualiza el audio en Android, iOS y web.
- Implementar reintentos controlados sin duplicar mensajes.

**Criterios de aceptación**

- Un mismo comando no puede enviar dos veces el mismo audio.
- Los fallos quedan visibles y se pueden reintentar de forma segura.
- La presentación final del audio se valida en dispositivos reales.

### EP-7 — Copiloto dentro del CRM

- Mostrar conversación completa en la ficha del lead.
- Presentar respuesta sugerida, intención, score y nivel de confianza.
- Añadir acciones de aprobar, editar, regenerar, enviar y transferir.
- Permitir cambiar entre texto, audio real y audio sintetizado.
- Crear tareas y reuniones desde la conversación.
- Mostrar claramente cuándo está activa la automatización.

**Criterios de aceptación**

- Un operador puede resolver la conversación desde una sola pantalla.
- Cada acción conserva autor, fecha y resultado.
- La transferencia humana detiene respuestas automáticas pendientes.

### EP-8 — Analítica y mejora continua

- Medir tiempo de primera respuesta.
- Medir porcentaje de respuesta del prospecto.
- Medir leads calificados y reuniones agendadas.
- Medir transferencias humanas, silencios y errores.
- Comparar texto, audio real y audio sintetizado.
- Incorporar evaluación humana de calidad y calidez.
- Ejecutar pruebas controladas de mensajes y llamadas a la acción.

**Indicadores iniciales**

- Mediana del tiempo de primera respuesta.
- Conversaciones que entregan al menos un dato de calificación.
- Conversaciones que llegan a una llamada a la acción.
- Reuniones agendadas por cada 100 conversaciones elegibles.
- Tasa de intervención y corrección humana.
- Bloqueos por baja confianza o cumplimiento.

## Estrategia de liberación

### Fase 0 — Diseño y datos

Definir políticas, intenciones, base de conocimiento, datos necesarios y
métricas de referencia.

### Fase 1 — Copiloto de texto

Generar borradores para aprobación humana. No habrá respuestas autónomas.

### Fase 2 — Audios reales

Seleccionar y enviar audios pregrabados desde el CRM, primero con aprobación.

### Fase 3 — Voz sintetizada supervisada

Generar audios personalizados con aprobación obligatoria y auditoría completa.

### Fase 4 — Autonomía limitada

Automatizar únicamente saludos, confirmaciones, preguntas de calificación y
respuestas frecuentes de bajo riesgo.

### Fase 5 — Producto multicliente

Evaluar configuración por empresa, canales adicionales, límites de uso,
facturación y administración de conocimiento para ofrecerlo como producto PUDU.

## Dependencias

- Captura inbound de Instagram estable en producción.
- Estados de entrega y errores de mensajería confiables.
- Modelo de conversaciones y mensajes persistente.
- Clasificación y asignación operativa de leads.
- Almacenamiento seguro para archivos temporales.
- Proveedor de IA y voz seleccionado mediante evaluación técnica y comercial.
- Textos de transparencia, privacidad y consentimiento revisados.

## Riesgos principales

| Riesgo | Mitigación prevista |
| --- | --- |
| Mensajes fuera de la ventana de Meta | Elegibilidad calculada y bloqueo en servidor |
| Respuestas incorrectas o compromisos comerciales | Confianza, categorías y aprobación humana |
| Experiencia engañosa con voz sintética | Presentación transparente y trazabilidad |
| Duplicación de mensajes | Idempotencia y registro del identificador de Meta |
| Exposición de audios | URLs temporales y acceso restringido |
| Dependencia de un proveedor de voz | Adaptador desacoplado y biblioteca real de respaldo |
| Conflicto con aplicaciones externas | Cuenta de prueba y diseño explícito de enrutamiento |

## Condiciones para sacar la iniciativa del backlog

La implementación podrá comenzar cuando:

1. La recepción de Instagram sea estable y observable en producción.
2. El equipo pueda clasificar, asignar y dar seguimiento a los leads actuales.
3. Exista una muestra suficiente de conversaciones reales para diseñar
   intenciones y medir una línea base.
4. Se aprueben los principios de transparencia y los límites de autonomía.
5. Se seleccione un piloto pequeño con métricas y criterio de detención.

## Primer entregable al reactivar

Documento técnico de diseño con:

- modelo de conversación y mensaje;
- matriz de intenciones y riesgos;
- estados de automatización y transferencia;
- contrato del adaptador de voz;
- contrato de envío de audio por Meta;
- prototipo de la bandeja conversacional;
- plan de prueba con una cuenta de laboratorio.
