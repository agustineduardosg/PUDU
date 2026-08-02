# QA prepublicación · Stories de landing pages

Fecha de revisión: 2 de agosto de 2026.

## Veredicto

**Aprobación condicionada al despliegue.** La secuencia visual, el mensaje, la clasificación del CRM y la ruta de conversión están aprobados en local. No debe publicarse el sticker de enlace hasta desplegar y comprobar en producción el ancla `#contacto-form`.

## Revisión editorial y visual

| Story | Resultado | Observación final |
| --- | --- | --- |
| 01 | Aprobada | Gancho claro, encuesta simple y foco visible dentro de la zona segura. |
| 02 | Aprobada con texto corregido | Se redujo el texto para que pueda leerse sin saturar la pantalla. |
| 03 | Aprobada con texto corregido | El problema y el beneficio ahora se entienden en una sola lectura. |
| 04 | Aprobada con montaje secuencial | Mostrar una frase por vez; nunca las cuatro simultáneamente. |
| 05 | Aprobada con beneficios agrupados | Usar solo dos bloques: `Responsive + formulario conectado` y `Medición + seguimiento desde el CRM`. |
| 06 | Aprobada | CTA único `LANDING` y sticker de enlace dentro de la zona segura. |

- Los seis fondos miden exactamente 1080 × 1920 px.
- Rostros, dispositivos, flujo visual y elementos críticos permanecen dentro de la zona segura.
- Pies y decoración que entran en zonas de interfaz son elementos no críticos.
- Los fondos no incorporan textos pequeños ni interfaces falsas que compitan con los stickers nativos.
- Mantener los textos importantes fuera de los primeros 250 px y los últimos 320 px.
- Usar blanco como color principal y esmeralda para una sola palabra o frase clave.

## Revisión de conversión

URL final aprobada:

`https://puduit.tech/instagram?utm_source=instagram&utm_medium=organic_story&utm_campaign=landing_pages&utm_content=ig26_story_landing_06&interest=Landing%20page%20y%20conversi%C3%B3n#contacto-form`

Validaciones realizadas en local:

- Abre directamente el formulario y no al inicio de la sección.
- Preselecciona `Landing page y conversión`.
- Conserva `utm_source=instagram`.
- Conserva `utm_medium=organic_story`.
- Conserva `utm_campaign=landing_pages`.
- Conserva `utm_content=ig26_story_landing_06`.
- No presenta desplazamiento horizontal en 390 × 844 ni en 1440 × 900.
- El formulario comienza visible bajo la cabecera en móvil y escritorio.
- No se envió información ficticia a la base de datos durante la prueba.

## Revisión CRM

- `LANDING`, `landing` y `Landing!` se clasifican como la misma palabra clave.
- Interés: `Landing page y conversión`.
- Campaña: `landing_pages`.
- Etiquetas esperadas: `campana:landing-pages`, `origen:instagram-story`, `rubro:general`, `servicio:landing-page` y `utm-campaign:landing_pages`.
- La primera automatización solo saluda y realiza una pregunta de calificación.
- Presupuesto, plazo, cotización o intención de reunión deben transferirse a una tarea humana.

## Control técnico

- Pruebas de palabras clave: aprobadas.
- Compilación de producción: aprobada.
- Advertencia no bloqueante: Next.js informa que la convención `middleware` está deprecada; debe planificarse su migración, pero no impide esta campaña.

## Puerta de publicación

Publicar únicamente cuando se cumplan, en orden, estos pasos:

1. Desplegar la versión que contiene el ancla `#contacto-form` y la clasificación `LANDING`.
2. Abrir la URL final desde un teléfono real y confirmar que el formulario aparece de inmediato con el interés correcto.
3. En Instagram, activar `Subir con la máxima calidad` y evitar ahorro de datos durante la carga.
4. Montar los textos y stickers de forma nativa, respetando las zonas seguras.
5. Revisar la secuencia completa en la vista previa de Instagram.
6. Publicar manualmente las seis Stories en orden.
7. Enviar una prueba real con `LANDING` y un formulario controlado; confirmar que ambos aparecen en el CRM.

## Posición recomendada del CTA final

- Texto `Responde LANDING`: zona media, sin tapar al personaje ni el flujo visual.
- Sticker `Solicitar diagnóstico`: centrado entre 1350 y 1510 px de altura.
- Mantener el sticker por encima de 1600 px para evitar la interfaz inferior de Instagram.

La publicación automática no está autorizada por esta aprobación.
