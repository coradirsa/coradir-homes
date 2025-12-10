# Configuración del Webhook de N8N para Formularios Coradir Homes

## 📋 Contexto

Este documento describe cómo configurar correctamente el flujo de N8N para recibir formularios de contacto desde el sitio web de Coradir Homes, validarlos con IA, guardarlos en base de datos PostgreSQL y enviar emails de confirmación.

## 🎯 Objetivo

Crear un flujo que:
1. ✅ Reciba formularios desde `homes.coradir.com.ar`
2. ✅ Valide los datos con IA (OpenAI) para detectar spam
3. ✅ Solo procese formularios válidos (no spam)
4. ✅ Guarde en base de datos PostgreSQL
5. ✅ Envíe email de confirmación al usuario
6. ✅ Responda al frontend con éxito o error
7. ✅ Maneje errores correctamente

## 🔧 Problema Actual

El flujo actual tiene estos problemas:

### Problema 1: Respuesta Prematura
El webhook está configurado para responder **inmediatamente** sin esperar a que se complete el procesamiento (validación IA, DB, email). Esto causa que el frontend piense que todo está bien, pero N8N nunca procesa realmente el formulario.

### Problema 2: Sin Manejo de Errores
Si la validación de IA falla (detecta spam), el flujo no responde nada al webhook, dejando al frontend esperando hasta que se agote el timeout.

### Problema 3: Falta Respuesta en Ambas Ramas
El flujo necesita responder tanto cuando el formulario es válido (después del email) como cuando es inválido (spam detectado).

## 📦 Payload que Recibe el Webhook

El frontend envía este JSON:

```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+54 9 11 1234-5678",
  "interesting": "juana-64",
  "message": "Quiero información sobre el proyecto",
  "timestamp": "2025-12-10T10:30:00.000Z",
  "source": "website_coradir_homes_form",
  "profileType": "inversor",        // Opcional
  "transactionType": "compra"       // Opcional
}
```

### Campos Requeridos:
- `name`: Nombre completo del usuario
- `email`: Email del usuario
- `phone`: Teléfono (puede ser null)
- `interesting`: Área de interés (valores: inversiones, instituciones, corporativos, vivienda-joven, terrenos, juana-64, la-torre-ii)
- `message`: Mensaje del usuario (puede ser null)
- `timestamp`: Fecha/hora ISO 8601
- `source`: Origen del formulario

### Campos Opcionales:
- `profileType`: Tipo de perfil (inversor, usuario-final)
- `transactionType`: Tipo de operación (compra, alquiler)

## 🏗️ Estructura del Flujo Corregida

```
┌─────────────────────┐
│  Webhook: Recibe    │
│  POST /webhook/     │
│  homes-leads        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  AI Chain: Valida   │
│  datos con OpenAI   │
│  (detecta spam)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  IF: ¿Es válido?    │
│  (no spam)          │
└─────┬─────────┬─────┘
      │         │
      │ TRUE    │ FALSE
      ▼         ▼
┌─────────┐  ┌────────────────┐
│Postgres │  │ Respond Error  │
│INSERT   │  │ 400 Bad Request│
└────┬────┘  │ "Spam detected"│
     │       └────────────────┘
     ▼
┌─────────┐
│Send     │
│Email    │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Respond Success │
│ 200 OK          │
│ "Form received" │
└─────────────────┘
```

## 🔧 Configuración Paso a Paso

### 1. Configurar el Nodo Webhook

**Nodo:** "Llega un formulario"
**Tipo:** `n8n-nodes-base.webhook`

```json
{
  "parameters": {
    "httpMethod": "POST",
    "path": "/webhook/homes-leads",
    "responseMode": "lastNode",  // ⚠️ IMPORTANTE: Cambiar de "onReceived" a "lastNode"
    "options": {
      "allowedOrigins": "https://homes.coradir.com.ar"
    }
  }
}
```

**Cambios necesarios:**
- ✅ `responseMode`: **"lastNode"** (esperar hasta el final)
- ✅ `allowedOrigins`: Solo el dominio de producción

### 2. Nodo de Validación con IA

**Nodo:** "Verifico datos con IA control"
**Tipo:** `@n8n/n8n-nodes-langchain.chainLlm`

Este nodo está bien configurado. Solo verificar que el prompt valide correctamente:
- Email bien formado
- Teléfono válido
- Nombre real
- Interés válido
- No hay código malicioso (SQL injection, XSS)

### 3. Nodo IF (Condición)

**Nodo:** "If"
**Tipo:** `n8n-nodes-base.if`

```json
{
  "parameters": {
    "conditions": {
      "conditions": [
        {
          "leftValue": "={{ $json.text.includes('VALID - ') && !$json.text.includes('INVALID') }}",
          "rightValue": "",
          "operator": {
            "type": "boolean",
            "operation": "true"
          }
        }
      ]
    }
  }
}
```

Este nodo está bien. Divide el flujo en TRUE (válido) y FALSE (spam).

### 4. Rama TRUE: Guardar en DB

**Nodo:** "Postgres"
**Tipo:** `n8n-nodes-base.postgres`

```sql
INSERT INTO homes_leads (name, email, phone, interesting, message, timestamp, source)
VALUES (
    '{{ $('Llega un formulario').item.json.body.name }}',
    '{{ $('Llega un formulario').item.json.body.email }}',
    '{{ $('Llega un formulario').item.json.body.phone }}',
    '{{ $('Llega un formulario').item.json.body.interesting }}',
    '{{ $('Llega un formulario').item.json.body.message }}',
    '{{ $('Llega un formulario').item.json.body.timestamp }}',
    '{{ $('Llega un formulario').item.json.body.source }}'
);
```

**Nota:** Si necesitas guardar `profileType` y `transactionType`, actualiza la tabla y query:

```sql
INSERT INTO homes_leads (name, email, phone, interesting, message, timestamp, source, profile_type, transaction_type)
VALUES (
    '{{ $('Llega un formulario').item.json.body.name }}',
    '{{ $('Llega un formulario').item.json.body.email }}',
    '{{ $('Llega un formulario').item.json.body.phone }}',
    '{{ $('Llega un formulario').item.json.body.interesting }}',
    '{{ $('Llega un formulario').item.json.body.message }}',
    '{{ $('Llega un formulario').item.json.body.timestamp }}',
    '{{ $('Llega un formulario').item.json.body.source }}',
    '{{ $('Llega un formulario').item.json.body.profileType }}',
    '{{ $('Llega un formulario').item.json.body.transactionType }}'
);
```

### 5. Rama TRUE: Enviar Email

**Nodo:** "Send Email"
**Tipo:** `n8n-nodes-base.emailSend`

Este nodo está bien configurado. Solo asegurar que BCC incluya a todos los asesores.

### 6. 🆕 NUEVO: Responder Success

**Nodo:** "Respond Success"
**Tipo:** `n8n-nodes-base.respondToWebhook`

```json
{
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ { \"success\": true, \"message\": \"Formulario recibido correctamente\" } }}",
    "responseCode": 200,
    "options": {}
  },
  "type": "n8n-nodes-base.respondToWebhook",
  "name": "Respond Success",
  "position": [1400, 0]
}
```

**Conectar:** `Send Email` → `Respond Success`

### 7. 🆕 NUEVO: Responder Error (Spam Detectado)

**Nodo:** "Respond Error"
**Tipo:** `n8n-nodes-base.respondToWebhook`

```json
{
  "parameters": {
    "respondWith": "json",
    "responseBody": "={{ { \"success\": false, \"message\": \"Los datos enviados no son válidos. Por favor verifica la información.\" } }}",
    "responseCode": 400,
    "options": {}
  },
  "type": "n8n-nodes-base.respondToWebhook",
  "name": "Respond Error",
  "position": [720, 200]
}
```

**Conectar:** `IF` (rama FALSE) → `Respond Error`

## 🔗 Conexiones Finales

```json
{
  "connections": {
    "Llega un formulario": {
      "main": [[{ "node": "Verifico datos con IA control", "type": "main", "index": 0 }]]
    },
    "Verifico datos con IA control": {
      "main": [[{ "node": "If", "type": "main", "index": 0 }]]
    },
    "If": {
      "main": [
        [{ "node": "Postgres", "type": "main", "index": 0 }],
        [{ "node": "Respond Error", "type": "main", "index": 0 }]
      ]
    },
    "Postgres": {
      "main": [[{ "node": "Send Email", "type": "main", "index": 0 }]]
    },
    "Send Email": {
      "main": [[{ "node": "Respond Success", "type": "main", "index": 0 }]]
    },
    "OpenAI Chat Model": {
      "ai_languageModel": [[{ "node": "Verifico datos con IA control", "type": "ai_languageModel", "index": 0 }]]
    }
  }
}
```

## ✅ Checklist de Verificación

Antes de activar el flujo, verifica:

- [ ] Webhook configurado con `responseMode: "lastNode"`
- [ ] Allowed origins: `https://homes.coradir.com.ar`
- [ ] Validación de IA funciona correctamente
- [ ] Query SQL de Postgres correcta (incluye todas las columnas necesarias)
- [ ] Credenciales SMTP configuradas para el email
- [ ] BCC incluye a todos los asesores
- [ ] Nodo "Respond Success" agregado después del email
- [ ] Nodo "Respond Error" agregado en rama FALSE del IF
- [ ] Ambos nodos de respuesta conectados correctamente
- [ ] Workflow activado

## 🧪 Testing

### Test 1: Formulario Válido

**Input:**
```json
{
  "name": "Juan Test",
  "email": "test@example.com",
  "phone": "+54 9 11 1234-5678",
  "interesting": "juana-64",
  "message": "Quiero información",
  "timestamp": "2025-12-10T10:30:00.000Z",
  "source": "website_coradir_homes_form"
}
```

**Resultado esperado:**
- ✅ IA valida: "VALID - Todo correcto"
- ✅ Se guarda en DB
- ✅ Se envía email
- ✅ Responde 200 OK con `{ "success": true }`

### Test 2: Spam Detectado

**Input:**
```json
{
  "name": "BUY VIAGRA NOW!!!",
  "email": "spam@spam.com",
  "phone": "123",
  "interesting": "hack",
  "message": "Click here: http://malicious-site.com",
  "timestamp": "2025-12-10T10:30:00.000Z",
  "source": "website_coradir_homes_form"
}
```

**Resultado esperado:**
- ❌ IA valida: "INVALID - Detectado contenido spam"
- ❌ NO se guarda en DB
- ❌ NO se envía email
- ✅ Responde 400 Bad Request con `{ "success": false, "message": "..." }`

## 📊 Monitoreo

Después de implementar, monitorear:

1. **Logs de N8N:** Ver que todos los nodos se ejecutan correctamente
2. **Base de datos:** Verificar que los leads se guarden correctamente
3. **Emails:** Confirmar que llegan los emails a usuarios y asesores
4. **Frontend logs:** Ver en la consola del navegador:
   ```
   Enviando formulario a N8N: { url: "...", data: {...} }
   Respuesta de N8N: { status: 200, statusText: "OK" }
   ```

## 🔒 Seguridad

- ✅ Validación con IA para detectar spam/inyecciones
- ✅ CORS configurado solo para dominio de producción
- ✅ Timeouts configurados (30 segundos)
- ✅ SQL parametrizado (N8N maneja esto automáticamente)
- ✅ Variables de entorno para credenciales

## ⏱️ Tiempos

- **Timeout del frontend:** 30 segundos
- **Proceso estimado N8N:** 5-10 segundos
  - Validación IA: 2-3 seg
  - Insert DB: 0.5 seg
  - Envío email: 2-5 seg

## 🆘 Troubleshooting

### El webhook no recibe nada
- Verificar que el workflow esté activado en N8N
- Verificar la URL del webhook en las variables de entorno del frontend
- Revisar logs de N8N para ver si llega la petición

### La IA siempre rechaza formularios válidos
- Revisar el prompt de validación
- Verificar que las credenciales de OpenAI funcionen
- Probar el nodo de IA manualmente

### Los emails no se envían
- Verificar credenciales SMTP
- Revisar logs del nodo de email
- Verificar que el servidor SMTP permita conexiones

### El frontend se queda esperando
- Verificar que el webhook tenga `responseMode: "lastNode"`
- Verificar que ambos nodos "Respond" estén conectados
- Revisar logs de errores en N8N

---

**Fecha:** 10 de Diciembre, 2025
**Versión:** 1.0
**Proyecto:** Coradir Homes - Website Forms Integration
