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
