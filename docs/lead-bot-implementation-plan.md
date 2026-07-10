# Plan de implementacion: Bot calificador y conversor para Coradir Homes

## Resumen

El objetivo es construir un bot nativo dentro de `coradir-homes` que reemplace el WhatsApp flotante como primera interaccion comercial. El bot debe priorizar conversiones calificadas: detectar intencion, medir capacidad, temporalidad y decision, clasificar leads y ejecutar la siguiente accion comercial.

La implementacion debe ser agnostica al proveedor de IA. Debe poder funcionar con OpenAI, DeepSeek, Grok, Gemini, Ollama u otros proveedores compatibles, cambiando configuracion por variables de entorno y sin tocar la logica comercial.

## Principios de arquitectura

- El bot no debe ser solo un chat libre. Debe ser un funnel conversacional guiado.
- La IA debe ser la capa principal para interpretar texto libre, responder dudas, resumir conversaciones y detectar objeciones.
- La calificacion comercial no debe depender exclusivamente del modelo. El scoring final, eventos, CRM y handoff deben quedar deterministas.
- Las reglas locales quedan como fallback y guardrails, no como motor principal de conversacion.
- WhatsApp no debe ser la primera via de contacto. Debe aparecer como handoff posterior a una calificacion minima o cuando el usuario pide hablar con una persona.
- El bot no debe pedir telefono como requisito: el telefono se obtiene cuando el usuario escribe por WhatsApp. Para CRM/nurturing se puede pedir email.
- La integracion externa debe estar desacoplada. Como la web de Homes y el sistema inmobiliario conviven en el mismo servidor, la opcion principal debe ser comunicacion server-to-server directa con el CRM; N8N queda como fallback o puente temporal.

## Arquitectura propuesta

- Frontend: widget React propio dentro de Next.js.
- Backend: API routes de Next.js para conversacion, scoring, proveedor IA e integraciones externas.
- IA: capa `LLMProvider` intercambiable por entorno.
- Integraciones externas: capa `LeadSink` intercambiable.
- Integracion principal v1: API directa del CRM Homes del sistema inmobiliario.
- N8N: adapter opcional de fallback/transicion, no dependencia central.
- Comunicacion recomendada: API route de `coradir-homes` llama al CRM desde servidor usando `x-homes-token`; el navegador nunca conoce el token.

## Fase 1 - Base del widget

Checklist:

- [ ] Crear el componente global `LeadQualificationChat`.
- [ ] Renderizarlo desde `src/app/layout.tsx`.
- [ ] Reemplazar el uso global de `WhatsAppButton`.
- [ ] Crear estados visuales del widget:
  - cerrado;
  - abierto;
  - minimizado;
  - cargando;
  - error.
- [ ] Persistir en `localStorage`:
  - `clientId`;
  - estado parcial del lead;
  - historial resumido;
  - ultima clasificacion.
- [ ] Evitar que el widget tape contenido critico en mobile.
- [ ] Agregar eventos de analytics mediante `dataLayer`:
  - `lead_bot_open`;
  - `lead_bot_step`;
  - `lead_bot_mql`;
  - `lead_bot_sql`;
  - `lead_bot_conversion`;
  - `lead_bot_whatsapp_handoff`.

## Fase 2 - Modelo interno de lead

Crear un modelo de datos interno para representar el estado comercial de la conversacion.

Campos sugeridos:

```ts
type LeadIntent = "comprar" | "alquilar" | "invertir" | "consultar" | "indefinido";
type LeadClassification = "SQL" | "MQL" | "NURTURE";

type LeadState = {
  clientId: string;
  intent: LeadIntent;
  project?: string;
  budget?: string;
  timeline?: string;
  decisionRole?: string;
  name?: string;
  email?: string;
  score: number;
  classification?: LeadClassification;
  missingFields: string[];
};
```

Checklist:

- [ ] Definir intencion:
  - compra;
  - alquiler;
  - inversion;
  - consulta;
  - indefinido.
- [ ] Detectar proyecto/interes:
  - `complejo-coradir`;
  - `juana-64`;
  - `la-torre-ii`;
  - `san-luis`;
  - `terrenos`;
  - general.
- [ ] Capturar presupuesto o capacidad.
- [ ] Capturar plazo de decision.
- [ ] Capturar rol:
  - decisor;
  - influenciador;
  - consulta para otra persona;
  - indefinido.
- [ ] Capturar datos de seguimiento:
  - nombre;
  - email;

## Fase 3 - Motor de scoring y clasificacion

El scoring debe ser propio y explicito. La IA puede normalizar respuestas libres, pero no debe ser la unica responsable de decidir si un lead es SQL.

Reglas base:

- `SQL`: capacidad clara, plazo de 0 a 6 meses, decisor o influenciador. El contacto humano se resuelve por WhatsApp.
- `MQL`: interes real, pero falta algun dato clave o todavia no tiene capacidad/plazo definido.
- `NURTURE`: curioso, plazo largo, baja intencion o consulta informativa sin urgencia.

Checklist:

- [ ] Crear `src/lib/leadBot/scoring.ts`.
- [ ] Implementar puntaje por capacidad.
- [ ] Implementar puntaje por plazo.
- [ ] Implementar puntaje por rol decisor.
- [ ] Implementar puntaje por email disponible para seguimiento, sin bloquear WhatsApp.
- [ ] Implementar clasificacion `SQL`, `MQL`, `NURTURE`.
- [ ] Exponer razones de clasificacion para debug y CRM.

Ejemplo de salida:

```ts
type QualificationResult = {
  score: number;
  classification: "SQL" | "MQL" | "NURTURE";
  reasons: string[];
  missingFields: string[];
};
```

## Fase 4 - Motor de conversion

La prioridad no es solo calificar. El bot debe convertir segun el estado del usuario.

Acciones comerciales:

- SQL: habilitar WhatsApp con asesor y registrar resumen para CRM.
- MQL: seguir orientando, pedir email opcional para informacion y habilitar WhatsApp si hay intencion comercial clara.
- NURTURE: ofrecer folleto, contenido informativo y registrar para remarketing/CRM.
- Alta intencion sin email: permitir WhatsApp y pedir email solo si aporta valor para enviar resumen o informacion.

Checklist:

- [ ] Crear `src/lib/leadBot/conversion.ts`.
- [ ] Definir acciones posibles:
  - `ask_next_question`;
  - `send_project_info`;
  - `request_contact`;
  - `schedule_call`;
  - `email_nurture`;
  - `whatsapp_handoff`;
  - `download_brochure`.
- [ ] Crear copy para cada CTA.
- [ ] Adaptar el CTA segun pagina actual.
- [ ] Mostrar WhatsApp si hay intencion comercial suficiente o pedido explicito de humano.

Ejemplo:

```ts
type ConversionAction = {
  type:
    | "ask_next_question"
    | "send_project_info"
    | "request_contact"
    | "schedule_call"
    | "email_nurture"
    | "whatsapp_handoff"
    | "download_brochure";
  label: string;
  payload?: Record<string, unknown>;
};
```

## Fase 5 - Capa IA agnostica

Crear una interfaz comun para proveedores de modelos.

Checklist:

- [ ] Crear `src/lib/leadBot/providers/types.ts`.
- [ ] Crear adapter OpenAI-compatible.
- [ ] Usar el adapter OpenAI-compatible para:
  - OpenAI;
  - DeepSeek;
  - Grok/xAI;
  - cualquier proveedor compatible con el formato Chat Completions.
- [ ] Crear adapter Gemini.
- [ ] Crear adapter Ollama local/remoto.
- [ ] Crear factory de providers segun variables de entorno.
- [ ] Manejar errores y fallback sin romper la calificacion deterministica.

Variables sugeridas:

```env
LEAD_BOT_ENABLED=true
LEAD_BOT_LLM_PROVIDER=openai-compatible
LEAD_BOT_LLM_MODEL=gpt-4o-mini
LEAD_BOT_LLM_BASE_URL=
LEAD_BOT_LLM_API_KEY=
```

Interfaz sugerida:

```ts
type LLMMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type LLMProvider = {
  generateText(messages: LLMMessage[]): Promise<string>;
};
```

Uso esperado de IA:

- Responder dudas frecuentes del usuario.
- Interpretar respuestas libres.
- Normalizar presupuesto/plazo/rol.
- Resumir conversacion.
- Detectar objeciones comerciales.

Interpretacion IA-first:

- Si `LEAD_BOT_LLM_PROVIDER`, `LEAD_BOT_LLM_MODEL` y credenciales estan configuradas, el bot debe llamar a la IA en cada turno relevante.
- La IA debe devolver una respuesta visible y campos normalizados en JSON.
- Los campos normalizados alimentan el scoring deterministico y el CRM.
- Si la IA falla o no esta configurada, se usa la capa liviana local como fallback.
- La IA no debe depender de frases exactas. Debe entender señales como:
  - pedidos de opciones/catalogo;
  - respuestas vagas o de indecision;
  - datos concretos de presupuesto/contacto/plazo;
  - ultima pregunta realizada por el asistente.
- Si el usuario pide opciones de forma ambigua, la IA debe mostrar un resumen ordenado de proyectos activos.
- Si el usuario entrega un presupuesto numerico sin moneda, la IA debe aclarar si habla de pesos o dolares sin ignorar preguntas nuevas del usuario.
- Si hay consultas mixtas, por ejemplo departamento y local, la IA debe reconocer ambos intereses y pedir prioridad o proponer evaluarlos en paralelo.

No usar IA para:

- Decidir sola la clasificacion final.
- Ejecutar acciones externas directamente.
- Inventar precios, disponibilidad o condiciones comerciales.

## Fase 6 - API interna del bot

Crear una API server-side para procesar cada interaccion del widget.

Endpoint:

```txt
POST /api/lead-bot/message
```

Entrada:

```json
{
  "clientId": "uuid",
  "message": "Estoy interesado en comprar",
  "state": {},
  "tracking": {
    "pathname": "/complejo-coradir",
    "referrer": "",
    "utm_source": "",
    "utm_campaign": ""
  }
}
```

Salida:

```json
{
  "reply": "Perfecto. Para orientarte mejor, queres comprar, alquilar o invertir?",
  "state": {},
  "classification": "MQL",
  "score": 45,
  "nextAction": {
    "type": "ask_next_question",
    "label": "Continuar"
  },
  "events": []
}
```

Checklist:

- [ ] Crear `src/app/api/lead-bot/message/route.ts`.
- [ ] Validar payload de entrada.
- [ ] Reconstruir estado del lead.
- [ ] Llamar a IA solo cuando haga falta.
- [ ] Ejecutar scoring.
- [ ] Ejecutar motor de conversion.
- [ ] Devolver respuesta y estado actualizado.
- [ ] Agregar rate limiting basico por IP/clientId.
- [ ] Loguear errores sin exponer datos sensibles al cliente.

## Fase 7 - Integracion externa

La integracion externa debe estar desacoplada mediante una interfaz `LeadSink`.

Default v1: CRM Homes directo.

Motivo:

- La web de Homes y el sistema inmobiliario conviven en el mismo servidor.
- El CRM Homes ya expone endpoints tokenizados para ingesta, por ejemplo `POST /api/homes/ingest/web-form`.
- El CRM ya maneja deduplicacion por email/telefono, conversaciones, mensajes, actividades, tareas, estados y `bot_status`.
- Evita una dependencia innecesaria en N8N para un flujo que puede resolverse server-to-server.
- Mejora trazabilidad: el CRM inmobiliario queda como fuente canonica desde el primer evento.

Fallback:

- Mantener `N8nLeadSink` como fallback temporal si el CRM no esta disponible o si algun flujo operativo todavia vive solo en N8N.
- El bot no debe cambiar si se alterna entre `HomesCrmLeadSink` y `N8nLeadSink`; solo cambia el adapter.

Checklist:

- [ ] Crear `src/lib/leadBot/sinks/types.ts`.
- [ ] Crear `HomesCrmLeadSink`.
- [ ] Crear `N8nLeadSink` solo como fallback opcional.
- [ ] Mapear el payload avanzado del bot al endpoint `POST /api/homes/ingest/web-form`.
- [ ] Enviar `classification`, `score`, `qualification`, `conversion` y tracking dentro de `rawPayload` mientras el CRM no tenga campos dedicados.
- [ ] Evaluar si conviene agregar campos dedicados al CRM para clasificacion y score.
- [ ] Configurar integracion por entorno:

```env
LEAD_BOT_INTEGRATION_PROVIDER=homes-crm
HOMES_CRM_BASE_URL=http://localhost:3076
HOMES_CRM_WEBHOOK_TOKEN=
N8N_LEAD_BOT_WEBHOOK_URL=
LEAD_BOT_WHATSAPP_NUMBER=5492664649967
```

Eventos comerciales enviados al sink:

- `lead_mql`;
- `lead_sql`;
- `lead_nurture`;
- `schedule_request`;
- `whatsapp_handoff`.

## Contrato con CRM Homes

Payload base:

```json
{
  "source": "chatbot_homes",
  "action_type": "lead_sql",
  "user_data": {
    "client_id": "uuid",
    "name": "Juan Perez",
    "email": "juan@email.com",
    "phone": "+549..."
  },
  "qualification": {
    "intent": "comprar",
    "project": "complejo-coradir",
    "budget": "definido",
    "timeline": "0-3 meses",
    "decision_role": "decisor",
    "score": 85,
    "classification": "SQL",
    "reasons": [
      "Tiene plazo corto",
      "Declara capacidad de compra",
      "Es decisor"
    ],
    "missing_fields": []
  },
  "conversion": {
    "recommended_action": "schedule_call",
    "cta_shown": "Agendar llamada con Florencia",
    "funnel_stage": "qualified"
  },
  "conversation_data": {
    "summary": "Resumen comercial breve",
    "messages": []
  },
  "tracking": {
    "pathname": "/complejo-coradir",
    "referrer": "",
    "utm_source": "",
    "utm_medium": "",
    "utm_campaign": "",
    "utm_term": "",
    "utm_content": "",
    "timestamp": "ISO_DATE"
  }
}
```

Mapeo recomendado al CRM:

- Endpoint: `POST /api/homes/ingest/web-form`.
- Header: `x-homes-token: <HOMES_CRM_WEBHOOK_TOKEN>`.
- Campos principales:
  - `providerEventId`;
  - `name`;
  - `email`;
  - `phone`;
  - `interesting`;
  - `message`;
  - `timestamp`;
  - `source`;
  - `transactionType`;
  - `profileType`;
  - `sourceDetail`;
  - `rawPayload`.
- `rawPayload` debe incluir el payload completo del bot: scoring, conversion, tracking, resumen e historial resumido.

Responsabilidades del CRM en v1:

- Guardar o actualizar el lead en CRM/base inmobiliaria.
- Deduplicar por email/telefono.
- Crear fuente del lead y conversacion inicial.
- Guardar el payload completo en `rawPayload`.
- Crear sugerencia/actividad/tarea comercial cuando corresponda.
- Mantener logs de integracion mediante `homes_webhook_events`.
- Devolver confirmacion o error al bot.

Pendientes del CRM para reemplazar N8N al 100%:

- [ ] Confirmar URL interna/externa del backend CRM desde el contenedor de Homes.
- [ ] Configurar `HOMES_CRM_WEBHOOK_TOKEN` en `coradir-homes`.
- [ ] Confirmar `HOMES_WEBHOOK_TOKEN` en el CRM.
- [ ] Agregar, si hace falta, campos dedicados para `classification`, `score`, `qualification` y `conversion`.
- [ ] Definir si el CRM envia email automatico o si el bot solo crea tarea/actividad para ventas.
- [ ] Definir si el CRM maneja Calendar directo o si la agenda queda para una fase posterior.
- [ ] Mantener N8N solo para flujos que todavia no existan nativamente en el CRM.

## Cambios recomendados en el sistema inmobiliario

El CRM Homes ya tiene una base suficiente para recibir leads del bot sin una migracion inicial:

- `POST /api/homes/ingest/web-form` permite crear/actualizar leads desde la web.
- El CRM deduplica por email y telefono.
- El CRM crea fuente, conversacion y mensaje inicial.
- `rawPayload` permite guardar todo el payload enriquecido del bot.
- `homes_webhook_events` permite auditar la ingesta.
- `bot_status` ya permite diferenciar atencion por bot, asesor o pausa.

MVP sin tocar base:

- [ ] Enviar el lead calificado al endpoint existente `POST /api/homes/ingest/web-form`.
- [ ] Guardar `classification`, `score`, `qualification`, `conversion`, tracking y resumen dentro de `rawPayload`.
- [ ] Mapear `classification` a campos existentes cuando sea posible:
  - `SQL` -> `prioridad: "alta"`, `estado: "interesado"`;
  - `MQL` -> `prioridad: "media"`, `estado: "nuevo"`;
  - `NURTURE` -> `prioridad: "baja"`, `estado: "nuevo"`;
  - handoff humano -> `bot_status: "asesor"`.
- [ ] Crear el mensaje inicial del lead con un resumen legible para ventas.

Recomendado para operar bien desde el CRM:

- [ ] Crear una migracion en `inmobilario` para guardar calificacion como dato de primera clase.
- [ ] Opcion A: agregar campos a `homes_leads`:
  - `classification`;
  - `score`;
  - `intent`;
  - `timeline`;
  - `decisionRole`;
  - `recommendedAction`;
  - `qualificationSummary`.
- [ ] Opcion B: crear tabla `homes_lead_qualifications`:
  - `leadId`;
  - `classification`;
  - `score`;
  - `intent`;
  - `projectSlug`;
  - `budgetStatus`;
  - `budgetRange`;
  - `timeline`;
  - `decisionRole`;
  - `recommendedAction`;
  - `summary`;
  - `modelProvider`;
  - `rawPayload`;
  - `createdAt`.
- [ ] Agregar filtros en `/dashboard/homes` por:
  - clasificacion;
  - score;
  - proyecto;
  - intencion;
  - proxima accion;
  - estado de bot.
- [ ] Agregar estados comerciales utiles:
  - `calificado_sql`;
  - `mql_nurturing`;
  - `agenda_pendiente`;
  - `derivado_asesor`;
  - `descartado_no_califica`.
- [ ] Crear tareas automaticas para ventas:
  - SQL: llamar en menos de 24 horas;
  - agenda solicitada: confirmar horario;
  - MQL: seguimiento en 7 dias;
  - NURTURE: email/contenido y remarketing.
- [ ] Crear templates de respuesta para email/WhatsApp desde el CRM.

Decision operativa:

- La primera implementacion puede usar el endpoint actual y `rawPayload`.
- En paralelo conviene preparar la migracion del CRM para que ventas pueda operar SQL/MQL desde columnas y filtros, sin depender de revisar JSON.

## Fase 8 - UX y copy comercial

El bot debe guiar sin parecer un formulario rigido.

Checklist:

- [ ] Crear mensaje inicial contextual por pagina.
- [ ] Permitir respuestas libres.
- [ ] Mantener preguntas cortas.
- [ ] Evitar pedir todos los datos al inicio.
- [ ] Pedir email cuando haya valor claro, sin pedir telefono como requisito.
- [ ] Mostrar CTA segun etapa:
  - SQL: "Hablar por WhatsApp";
  - MQL: "Recibir informacion por email";
  - NURTURE: "Descargar folleto" o "Ver proyecto";
  - handoff: "Continuar por WhatsApp".
- [ ] Adaptar copy por proyecto.
- [ ] Manejar usuario que insiste en WhatsApp antes de calificar:
  - responder valor del bot;
  - hacer una pregunta clave si falta contexto minimo;
  - habilitar WhatsApp si hay intencion comercial clara o pedido explicito de humano;
  - pedir email solo como dato opcional para resumen/CRM.

## Fase 9 - Medicion

Metricas principales:

- Aperturas del bot.
- Conversaciones iniciadas.
- Leads con contacto.
- MQL.
- SQL.
- Tasa MQL -> SQL.
- Agenda solicitada.
- Agenda confirmada.
- Handoff a WhatsApp.
- Conversion por pagina.
- Conversion por UTM/campania.

Checklist:

- [ ] Enviar eventos a `dataLayer`.
- [ ] Incluir `clientId` anonimo.
- [ ] Incluir `classification`, `score`, `project` e `intent`.
- [ ] No enviar datos personales a analytics si no es necesario.
- [ ] Enviar datos personales solo al backend/CRM.

## Fase 10 - Tests

Checklist:

- [ ] Tests unitarios de scoring.
- [ ] Tests unitarios de siguiente mejor accion.
- [ ] Tests de adapters IA con mocks.
- [ ] Tests de payload CRM.
- [ ] Tests opcionales de fallback N8N.
- [ ] Tests de API para:
  - `MQL`;
  - `SQL`;
  - `NURTURE`;
  - error de IA;
  - error de CRM;
  - fallback N8N;
  - payload invalido.
- [ ] Pruebas visuales desktop/mobile.
- [ ] Verificar que el formulario actual sigue funcionando.
- [ ] Verificar que WhatsApp no saltea la calificacion.
- [ ] Verificar eventos `dataLayer`.

## Fase 11 - Rollout

Checklist:

- [ ] Implementar con `LEAD_BOT_ENABLED=false` por defecto.
- [ ] Probar en desarrollo local.
- [ ] Probar en staging.
- [ ] Activar en produccion con flag.
- [ ] Monitorear errores de API.
- [ ] Revisar logs del CRM Homes.
- [ ] Revisar logs de N8N solo si se activa fallback.
- [ ] Comparar conversiones contra WhatsApp flotante previo.
- [ ] Ajustar scoring y preguntas segun calidad real de leads.

## Decisiones tomadas

- El bot sera React nativo, no iframe.
- Se activara en toda la web.
- Reemplazara el WhatsApp flotante global.
- La prioridad es maximizar SQLs y conversiones calificadas.
- La IA sera agnostica al proveedor.
- La calificacion sera deterministica.
- La integracion externa principal sera directa al CRM Homes del sistema inmobiliario.
- N8N queda como fallback/transicion, no como orquestador principal.

## Supuestos

- La web de Homes y el sistema inmobiliario conviven en el mismo servidor.
- La comunicacion directa al CRM sera server-to-server desde API routes de Next.js.
- Google Calendar no es obligatorio para la primera version si el CRM crea una tarea de seguimiento para ventas.
- WhatsApp se habilitara solo como handoff posterior.
- El proveedor IA se definira por variables de entorno.
- La base de conocimiento inicial saldra del contenido ya existente en la web y de documentos comerciales disponibles.

## Pendientes externos

- Confirmar la URL interna del CRM desde el entorno donde corre `coradir-homes`.
- Confirmar token `HOMES_WEBHOOK_TOKEN` y configurar `HOMES_CRM_WEBHOOK_TOKEN`.
- Confirmar si el endpoint actual `POST /api/homes/ingest/web-form` alcanza para el bot o si conviene crear `POST /api/homes/ingest/lead-bot`.
- Confirmar si el CRM debe enviar emails/WhatsApp automaticos o solo crear tareas para ventas.
- Revisar el workflow real de N8N solo como referencia/fallback.
- Confirmar responsables comerciales y destino de cada tipo de lead:
  - Florencia;
  - Alberto;
  - email de nurturing;
  - WhatsApp humano.
- Confirmar textos finales de email y WhatsApp.
