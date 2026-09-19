# FEZOJ — Sistema de opiniones

La web usa Supabase para recibir opiniones, mantenerlas pendientes y publicarlas únicamente después de aprobación.

## Uso

- Página pública: `contacto.html#opiniones`
- Panel privado: `admin.html`
- El panel solicita el correo y contraseña de la cuenta administradora de Supabase.
- Una opinión nueva entra con estado `pending`.
- Desde el panel se puede **Aprobar**, **Rechazar** o **Eliminar**.
- Las opiniones aprobadas aparecen automáticamente en la sección pública.

## Seguridad

La web usa la **Publishable key** de Supabase en el navegador. La protección real está en las políticas RLS configuradas en Supabase. La clave secreta de Supabase no está incluida en el sitio.
