# PUDU IT Solutions

Landing corporativa y panel operativo de PUDU, construidos con Next.js,
TypeScript, Tailwind CSS, Prisma y PostgreSQL.

## Módulos actuales

- Landing e industrias.
- Formulario de contacto y captura de leads.
- Panel administrativo.
- Pipeline CRM de ocho etapas.
- Tareas, actividades y preparación de mensajes salientes.
- Cotizador y registro de propuestas.

## Configuración local

1. Copia `.env.example` como `.env.local`.
2. Configura `DATABASE_URL`, `ADMIN_PASSWORD` y `ADMIN_SESSION_SECRET`.
3. Instala las dependencias:

```bash
npm install
```

4. Genera el cliente de Prisma y aplica las migraciones:

```bash
npx prisma generate
npx prisma migrate deploy
```

5. Inicia el proyecto:

```bash
npm run dev
```

La aplicación local queda disponible en
[http://localhost:3001](http://localhost:3001).

## Seguridad administrativa

El acceso a `/admin` usa una cookie de sesión firmada, `HttpOnly`,
`SameSite=Strict` y con una duración máxima de ocho horas. La contraseña y el
secreto de firma solo se leen desde variables de entorno y nunca deben
incorporarse al repositorio.

Genera `ADMIN_SESSION_SECRET` con un valor aleatorio de al menos 32 caracteres.
En producción, utiliza una contraseña exclusiva y configura HTTPS.

## CRM

La migración `20260727000100_crm_foundation` amplía los leads existentes sin
eliminarlos y agrega:

- etapas y prioridades;
- origen del prospecto;
- datos de Instagram, teléfono y ciudad;
- tareas y próximos seguimientos;
- historial de actividades;
- mensajes salientes por email, WhatsApp, Instagram, LinkedIn o SMS.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Validación antes de publicar

Antes de publicar una versión nueva, ejecuta:

```bash
npm run lint
npm run build
```
