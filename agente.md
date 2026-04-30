# PUDU - Proyecto de Inicio Oficial

## Acceso Local
`http://localhost:3001`

## Ruta del Proyecto
`c:\Users\agust\OneDrive\Desktop\Paginas\stitch_pudu_landing_page`

## Descripción
Página de inicio oficial para PUDU (Prime Utility Digital Upgrade), posicionando a la empresa como la principal "Casa Tecnológica" en Chile para la transformación digital industrial.

## Stack Tecnológico
- **Frontend:** React (Next.js 15+ App Router)
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion
- **Iconos:** Lucide-React
- **Base de Datos:** Prisma ORM
- **Tipografía:** Outfit (Google Fonts)

## Arquitectura del Ecosistema
- **Rutas Dinámicas:** `/industrias/[id]` para despliegue automatizado de sectores.
- **Motor de Contenido:** `industriesContent.json` (Fuente de verdad para los 5 sectores estratégicos).
- **Theming Dinámico:** Inyección de variables CSS (`--industry-accent`) basadas en el sector.

## Componentes Principales
- `Header`: Navegación inteligente con soporte para rutas relativas (`/#hash`).
- `IndustryPage`: Master Template para las 5 industrias (Minería, Salud, Agro, Industrial, Automoción).
- `IndustryGrid`: Home grid conectado dinámicamente al ecosistema.
- `ContactForm`: Captura de leads con pre-clasificación por industria y color dinámico.
- `NotFound`: Página 404 personalizada de grado premium.

## Avances Recientes (Marzo 2026)
1. **Despliegue de Industrias:** Implementación completa de 5 landing pages especializadas con contenido técnico de alta fidelidad.
2. **Optimización de Build:** Resolución de errores de prerenderizado mediante el paso de lógica de hover de JS a CSS puro.
3. **Auditoría UX/SEO:** 
   - Navegación cross-page corregida.
   - Metadatos dinámicos para cada industria.
   - Optimización de carga de imágenes (`next/image`) e iconos (Tree-shaking).
4. **Validación de Datos:** Auditoría de tipos TypeScript y saneamiento de assets visuales.
5. **Identidad de Marca:** Implementación de Favicon oficial (`icon.svg`) y eliminación de assets genéricos de Next.js.
6. **Integración de Contacto Real:** 
   - Configuración de teléfonos corporativos y correos oficiales (`puduit.tech`).
   - Vinculación de redes sociales: LinkedIn e Instagram (Icono actualizado).
7. **Sistema de Notificaciones:** Integración de `nodemailer` con Zoho SMTP para recepción de cada lead en tiempo real por correo electrónico.

## Avances Recientes (Abril 2026)
1. **Vertical de Ciberseguridad:** Implementación del sector "Cybersecurity & GovTech" centrado en Compliance (Ley 21.719) y Safetica DLP.
2. **Alianza Estratégica:** Integración visual y técnica de la alianza con **e-know** (20 años de experiencia), incluyendo branding oficial en la web.
3. **Admin Dashboard (CPQ):** 
   - Desarrollo de un motor de cotizaciones (`/admin/cotizador`) para generación instantánea de PDFs profesionales.
   - Template de PDF con branding premium y anexo de capacidades industriales.
   - Lógica de cálculo de impuestos (IVA) y gestión de múltiples opciones comerciales.
4. **Identidad Visual High-End:** Sustitución de placeholders por imágenes de alta fidelidad generadas y logos oficiales.

## Infraestructura (EasyPanel)
- **Variables de Entorno:** Configuración crítica de `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER` y `SMTP_PASS` en el dashboard de producción para el funcionamiento del correo.
- **Base de Datos:** PostgreSQL administrado vía Prisma.
- **Deployment:** Pipeline automatizado vía GitHub Actions hacia Easypanel.

## Próximos Pasos
- [ ] Refinar el dashboard administrativo con métricas de leads.
- [ ] Implementar autenticación para la ruta `/admin`.
- [ ] Optimizar el rendimiento de renderizado del PDF en dispositivos móviles.
