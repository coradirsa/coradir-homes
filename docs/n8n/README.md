# Workflows n8n para leads de Homes

Flujos de `automatic.coradir.com.ar` que reenvian leads al CRM Inmobiliario (`https://inmobiliario.coradir.com.ar/api/homes/ingest/web-form`).

## Archivos

| Archivo | Estado | Origen de leads |
|---|---|---|
| `Coradir_Homes_Fixed (1).json` | Export del flujo **activo en produccion** (formularios web) | `projectForm.tsx`, `source: website_coradir_homes_form` |
| `Coradir_Homes_Fixed_v2.workflow.json` | Version mejorada del anterior, lista para importar | idem |
| `homes-lead-bot.workflow.json` | Nuevo, para importar | Fallback del lead bot (`src/lib/leadBot/sinks/n8n.ts`, `source: chatbot_homes`) |

## Que hace el flujo de produccion (Coradir_Homes_Fixed)

```text
Webhook /webhook/homes-leads
  -> Validacion IA (Z.AI glm-5.2): VALID / INVALID (spam, inyeccion, datos falsos)
  -> si VALID:
       - INSERT en Postgres db-homes tabla homes_leads (estadistica propia)
       - POST al CRM Inmobiliario /api/homes/ingest/web-form (token Homes CRM)
       -> email automatico de gracias al lead (BCC asesores)
       -> registra la respuesta automatica en el CRM (/api/homes/ingest/outbound-response)
```

## Mejoras de la v2 (dos huecos del flujo original)

1. **Si el validador IA se cae, el lead se perdia**: el nodo LLM ahora tiene `onError: continueRegularOutput` y el IF trata la falta de veredicto como VALID (fail-open). Antes, un timeout de Z.AI abortaba la ejecucion y el formulario ya habia recibido 200: lead perdido sin rastro.
2. **Los leads marcados INVALID se descartaban en silencio**: ahora la rama false del IF los inserta igual en `homes_leads` con `source` sufijado `:invalido_ia` y el motivo de la IA en el mensaje. Un falso positivo del validador ya no borra un lead real; se pueden auditar con `SELECT * FROM homes_leads WHERE source LIKE '%:invalido_ia'`.

Para adoptar la v2: importar, verificar credenciales (referencia las mismas: `Homes CRM Token`, `SMTP web@coradir`, `db-homes`, `Z.AI Coradir`), **desactivar el flujo viejo** y activar la v2 (comparten el path `homes-leads`, no pueden estar activos los dos).

## homes-lead-bot (nuevo)

El payload del lead bot tiene otra forma (`user_data` anidado, `qualification`, etc.), no pasa por `Coradir_Homes_Fixed`. Este flujo lo transforma al formato `web-form` del CRM (clasificacion -> prioridad/estado, resumen para asesor, UTMs, `providerEventId` para dedup) y devuelve `{ success, leadId }` que es lo que espera el sink.

Es el **fallback**: el camino primario del bot es server-to-server directo al CRM. Importar, crear/seleccionar la credencial `Homes CRM Token` (Header Auth: name `x-homes-token`, value = `HOMES_WEBHOOK_TOKEN` del backend) y activar.

## Variables de entorno de la web

```bash
# Formularios (frontend)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://automatic.coradir.com.ar/webhook/homes-leads

# Lead bot: camino primario directo al CRM (server-side)
LEAD_BOT_INTEGRATION_PROVIDER=homes-crm
HOMES_CRM_BASE_URL=https://inmobiliario.coradir.com.ar
HOMES_CRM_WEBHOOK_TOKEN=<token privado>

# Lead bot: fallback via n8n (opcional)
N8N_LEAD_BOT_WEBHOOK_URL=https://automatic.coradir.com.ar/webhook/homes-lead-bot
```

## Nota sobre la respuesta del webhook

`homes-leads` responde 200 apenas recibe el POST (antes de validar/insertar): si algo falla despues, el usuario ya vio "gracias" y el fallo queda solo en Executions de n8n. Es un trade-off aceptado (no bloquear el formulario por lentitud del CRM/LLM); con la v2 ningun lead se pierde aunque falle un paso.
