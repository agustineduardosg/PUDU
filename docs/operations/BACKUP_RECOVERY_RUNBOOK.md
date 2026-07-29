# Respaldo y recuperación del CRM PUDU

## Objetivo inicial

- RPO: perder como máximo 24 horas de datos.
- RTO: recuperar el servicio en un máximo de 4 horas.
- Alcance: PostgreSQL, variables de entorno de producción y versión desplegada.
- Estado actual: procedimiento preparado; la automatización externa y la primera restauración deben verificarse en EasyPanel/Hostinger.

## Política

1. Ejecutar un respaldo lógico diario de PostgreSQL con `pg_dump` en formato custom.
2. Conservar 7 respaldos diarios, 4 semanales y 6 mensuales.
3. Guardar una copia fuera del VPS. Un respaldo alojado únicamente en el mismo servidor no protege ante pérdida total.
4. Cifrar el almacenamiento y limitar el acceso a la cuenta operativa de PUDU.
5. No guardar contraseñas, URLs de base de datos ni archivos `.env` dentro del repositorio.

## Verificación diaria

- Confirmar que el archivo existe y su tamaño es mayor que cero.
- Confirmar que el proceso terminó sin errores.
- Registrar fecha, tamaño, ubicación y resultado en la bitácora operativa.
- Si falla dos veces consecutivas, abrir un incidente crítico.

## Prueba de recuperación trimestral

1. Crear una base temporal vacía y aislada de producción.
2. Restaurar el último respaldo con `pg_restore`.
3. Ejecutar las migraciones Prisma pendientes.
4. Verificar cantidades de leads, mensajes de Instagram, tareas, cotizaciones y eventos.
5. Abrir la aplicación contra la base temporal y comprobar login, CRM y detalle de un lead.
6. Eliminar la base temporal una vez documentado el resultado.

## Recuperación ante incidente

1. Detener escrituras si la base activa puede seguir corrompiéndose.
2. Documentar la hora del incidente y seleccionar el respaldo anterior válido.
3. Restaurar en una base nueva; no sobrescribir la única copia disponible.
4. Validar integridad y ejecutar migraciones.
5. Cambiar `DATABASE_URL` en EasyPanel hacia la base recuperada.
6. Desplegar la última versión estable y realizar una prueba de humo.
7. Registrar la pérdida real de datos, tiempo de recuperación y causa raíz.

## Prueba de humo posterior

- La landing carga correctamente.
- El formulario crea un único lead y una tarea.
- El lead aparece en el pipeline.
- El panel Operaciones no muestra errores de base de datos.
- El webhook de Instagram procesa un mensaje de prueba.
- El envío de correo permanece sujeto a aprobación manual.

## Datos que deben configurarse fuera del repositorio

- Host, puerto y nombre de la base productiva.
- Destino externo cifrado de respaldos.
- Cuenta operativa con permisos mínimos de lectura y respaldo.
- Agenda automática del respaldo y canal de alertas.
