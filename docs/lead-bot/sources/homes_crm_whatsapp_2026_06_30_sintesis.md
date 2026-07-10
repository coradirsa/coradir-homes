# Sintesis de conversaciones WhatsApp Homes CRM - 2026-06-30

Fuente de referencia interna agregada, generada a partir del export local `homes_crm_conversaciones_2026-06-30.json`.

No incluye nombres, telefonos, emails ni mensajes textuales identificables. Se usa para ajustar tono, consultas frecuentes y cobertura del lead bot.

## Volumen observado

- Mensajes WhatsApp analizados: 3340.
- Mensajes entrantes de contactos: 1108.
- Mensajes salientes o de sistema: 2272.
- El flujo comercial manual repite mucho el envio de folleto/condiciones, una introduccion de Juana 64 y cierres tipo "quedo a disposicion".

## Consultas frecuentes detectadas

| Categoria | Conteo aproximado |
| --- | ---: |
| Saludo o interes generico | 394 |
| Juana 64 / departamentos / vivienda | 243 |
| Precio o valor | 53 |
| Entrega, obra o plazos | 51 |
| Financiacion, cuotas, credito o leasing | 47 |
| Ubicacion o direccion | 43 |
| Visita, llamada o humano | 37 |
| Disponibilidad o unidades | 35 |
| Inversion o renta | 35 |
| Fotos, planos, medidas o cocheras | 35 |
| Alquiler | 31 |
| Locales comerciales | 23 |
| Requisitos, garantia o documentacion | 19 |
| Terrenos o lotes | 13 |

## Implicancias para el bot

- Cuando el usuario abre con "me interesa", "quiero mas info" o un saludo desde una pagina especifica, conviene responder primero con una orientacion comercial corta y no saltar directo a presupuesto.
- Para datos sensibles como precio, reserva, entrega, alquiler, leasing, stock y disponibilidad, el bot debe responder con datos trazables y aclarar validacion comercial.
- Las consultas reales mezclan vivienda, inversion, alquiler y locales; el bot debe separar intereses antes de calificar.
- El tono esperado es rioplatense, directo y breve: explicar, orientar y cerrar con una pregunta simple.
- Si piden visita, asesor o llamada, primero se deben guardar nombre y un email o telefono cuando todavia no existen en el estado.
