# Persistencia y resumen diario del bot

## 1. Crear las tablas

Ejecutar `docs/lead-bot/migrations/001_sessions_and_events.sql` en el PostgreSQL de Homes.

## 2. Configurar variables

Copiar y completar las variables `LEAD_BOT_DATABASE_*`, `SMTP_*` y `LEAD_BOT_CRON_SECRET`
documentadas en `.env.example`. El destinatario predeterminado es `homes@coradir.com.ar`.

## 3. Programar el envío

Configurar n8n o cron para ejecutar todos los días después de las 00:05 (Argentina):

```http
POST https://homes.coradir.com.ar/api/cron/lead-bot-daily-report
Authorization: Bearer <LEAD_BOT_CRON_SECRET>
Content-Type: application/json

{}
```

Sin `date`, el endpoint informa el día anterior en `America/Argentina/Buenos_Aires`.
Para reprocesar una fecha específica se puede enviar `{ "date": "2026-07-14" }`.

## Eventos registrados

`bot_opened`, `user_message`, `bot_reply`, `contact_requested`, `contact_provided`,
`contact_declined`, `whatsapp_cta_shown`, `whatsapp_clicked`, `crm_submitted` y
`crm_submit_failed`.

La persistencia es observacional: si PostgreSQL no está disponible, el bot continúa
respondiendo y deja el error en los logs del servidor.
