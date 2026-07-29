# Lista de control de despliegue

## Antes

- Revisar que no se incluyan secretos ni grabaciones de voz.
- Ejecutar generación Prisma, pruebas, lint y build.
- Confirmar que existe un respaldo reciente de la base.
- Revisar las migraciones que serán aplicadas.

## Durante

- Aplicar `prisma migrate deploy` antes de recibir tráfico con el nuevo código.
- Desplegar una versión identificable por commit.
- Mantener disponible la imagen estable anterior para rollback.

## Después

- Abrir landing, formulario, login y panel Operaciones.
- Enviar un formulario de prueba y comprobar que no se duplica.
- Verificar analítica, webhook de Instagram y creación de tarea.
- Confirmar headers de seguridad y revisar incidentes abiertos.
- No habilitar envíos automáticos; la aprobación humana sigue siendo obligatoria.

## Rollback

Si la migración o la prueba de humo falla, retirar tráfico de la versión nueva y volver a la imagen estable anterior. Si hubo cambios incompatibles de datos, restaurar en una base nueva usando el runbook de recuperación; no improvisar cambios destructivos sobre producción.
