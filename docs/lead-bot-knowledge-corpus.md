# Corpus de conocimiento - Lead Bot Coradir Homes

Actualizado: 2026-07-01

Este documento acompaña al corpus estructurado de `src/lib/leadBot/knowledgeBase.json`. La idea es tener una version legible para revisar, corregir y ampliar la base de conocimiento antes de pasarla a reglas, retrieval o prompts.

## Arquitectura de respuesta

El corpus sigue siendo la fuente de verdad. Cuando retrieval encuentra una respuesta directa, el backend arma una `canonicalAnswer` y se la pasa al LLM junto con snippets del corpus para redactar una respuesta mas natural.

La respuesta generada por el LLM no se acepta automaticamente. Antes de responder, el backend verifica que conserve los hechos obligatorios de la respuesta canonica: numeros, precios, cantidades, medidas, direcciones, links y advertencias de validacion con asesor. Si falta alguno, se usa la respuesta extractiva canonica como fallback.

Los guardrails deterministas siguen teniendo prioridad para reclamos, insultos, rechazo de datos, alquiler residencial no disponible, handoff humano y reparaciones por confusion del usuario.

## Fuentes

### Informe tecnico RAG Movilidad

- Rol: referencia metodologica interna.
- Uso en el bot: no debe mostrarse al cliente; sirve para definir como estructurar, auditar y recuperar conocimiento.
- Archivo fuente local: `docs/lead-bot/sources/informe_tecnico_v2.md`
- Paginas: 21
- `source_path`: `source_documents.informe_tecnico_movilidad_rag`

### Condiciones de venta Juana 64 -R

- Rol: fuente comercial verificable.
- Uso en el bot: puede informar al cliente, con cuidado de aclarar que precios, disponibilidad y condiciones finales deben validarse con un asesor.
- Archivo fuente local: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Fecha del documento: 2026-02-06
- Paginas: 2
- `source_path`: `source_documents.condiciones_venta_juana_64_r`

### Complejo San Luis - datos web

- Rol: fuente comercial publica.
- Uso en el bot: puede informar al cliente sobre existencia del proyecto, pagina, ubicacion, beneficios, unidades y folleto.
- Archivo fuente local: `docs/lead-bot/sources/san_luis_web.md`
- Fecha del documento: 2026-06-30
- `source_path`: `source_documents.san_luis_web`

### Juana 64 - datos web

- Rol: fuente comercial publica.
- Uso en el bot: puede informar al cliente sobre caracteristicas visibles de la pagina, escala del proyecto y limites de informacion no publicada.
- Archivo fuente local: `docs/lead-bot/sources/juana_64_web.md`
- Fecha del documento: 2026-07-01
- `source_path`: `source_documents.juana_64_web`

## Aprendizajes aplicables del informe tecnico

Estos puntos vienen del informe tecnico del chatbot RAG de Movilidad. No son contenido comercial para el cliente; son criterios para mejorar este bot.

### Documentos atomicos por dato verificable

- `source_path`: `methodology.corpus_design.principles.atomic_documents`
- Paginas de referencia: 2, 4, 5, 7, 17

Conviene crear unidades cortas por campo u objeto. Para precios, plazos, cuotas, reservas, entregas y condiciones comerciales, cada dato debe poder rastrearse a un nodo concreto.

### Trazabilidad por source_path

- `source_path`: `methodology.corpus_design.principles.source_path_traceability`
- Paginas de referencia: 2, 5, 7

Cada bloque del corpus debe conservar una ruta interna estable. Ese `source_path` no es solo una ruta de archivo: es la ubicacion jerarquica del dato dentro de la base de conocimiento. Permite auditar por que el bot respondio algo.

### Extraccion literal antes que generacion

- `source_path`: `methodology.corpus_design.principles.literal_extraction_first`
- Paginas de referencia: 2, 6, 7, 15

Cuando el usuario pregunta por un precio, porcentaje, plazo, cuota, entrega o condicion, el bot debe priorizar recuperar y copiar el dato exacto del corpus. La redaccion del LLM queda como apoyo, no como fuente de verdad.

### Guardrails para datos comerciales sensibles

- `source_path`: `methodology.corpus_design.principles.guardrails_for_sensitive_commercial_data`
- Paginas de referencia: 7, 18

No inventar precios, stock, disponibilidad exacta, cuotas ni condiciones comerciales. Si el dato no esta en el corpus o puede estar desactualizado, el bot debe decirlo y derivar la validacion a un asesor.

### Separar retrieval de respuesta final

- `source_path`: `methodology.corpus_design.principles.evaluate_retrieval_and_answer_separately`
- Paginas de referencia: 10, 12, 17

Hay que medir dos cosas distintas: si se encontro la fuente correcta y si la respuesta final contiene el dato esperado. Sin esa separacion, parece que el problema es el modelo cuando a veces el problema real es la extraccion del dato dentro del documento recuperado.

### Circuito de mejora con consultas reales

- `source_path`: `methodology.corpus_design.principles.production_feedback_loop`
- Pagina de referencia: 17

El siguiente paso operativo no es solo sumar texto al prompt. Hay que capturar consultas reales anonimizadas, revisar una muestra con criterio humano, actualizar el corpus y monitorear errores por categoria.

## Juana 64 - condiciones comerciales

### Datos publicos del proyecto

- `source_path`: `customer_knowledge.projects.juana_64.public_details`
- Fuente: `docs/lead-bot/sources/juana_64_web.md`

La pagina publica describe Juana 64 como departamentos inteligentes en Juana Koslay, a solo 10 minutos del centro, con entrega proyectada y cupos limitados.

La escala publicada muestra 64 departamentos en total, expresados como 44 departamentos disponibles, 20 departamentos reservados y +64 familias proyectadas. Tambien muestra plan maestro del desarrollo.

Para locales comerciales dentro de Juana 64, la landing de Locales Comerciales informa 6 locales, 84 m2 por local y medidas de 6 m x 14 m.

Caracteristicas publicadas: departamentos de 2 dormitorios, cocina equipada, estacionamiento, estacionamiento individual, construccion rapida, seguridad con IA 24 hs, zona comercial, conectividad optimizada, pileta, paneles solares con proteccion anticorte, calefon electrico, cocina con artefactos electricos, aire acondicionado, espacios recreativos integrados, plazas con juegos y zonas verdes, iluminacion LED y pet friendly.

La pagina confirma pet friendly, pero no confirma terraza, patio privado, orientacion/luminosidad por unidad, cantidad exacta de mascotas permitidas, reglamento de convivencia, sistema constructivo/materiales exactos, expensas ni disponibilidad actualizada por unidad.

### Politica de precios

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.price_policy`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1

El precio de los departamentos y los locales es el mismo para todos.

### Precios de departamentos

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.prices.departments`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1
- Moneda: USD

| Concepto | Valor |
| --- | ---: |
| Precio de lista departamentos | 59.000,00 USD |
| Precio pozo contado | 47.000,00 USD |

### Precios de locales comerciales

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.prices.commercial_units`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1
- Moneda: USD
- Nota: + IVA

| Concepto | Valor |
| --- | ---: |
| Precio de lista locales | 70.000,00 USD |
| Precio pozo contado | 53.000,00 USD |

### Financiacion general

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.financing`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1, 2

Se ofrece financiacion en leasing inmobiliario hasta 96 meses, en dolares o UVA, sin costo de hipoteca, con el 35% de adelanto y con intereses desde 0% para 24 cuotas hasta 8% anual para 96 cuotas.

### Leasing departamentos

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.financing.plans.departments`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1

| Plazo | Interes anual | Adelanto | Alquiler | VR |
| ---: | ---: | ---: | ---: | ---: |
| 24 meses | 0% | 20.650,00 USD | 1.597,92 USD | 1.765,70 USD |
| 48 meses | 4% | 20.650,00 USD | 865,91 USD | 956,83 USD |
| 96 meses | 8% | 20.650,00 USD | 542,14 USD | 599,07 USD |

### Leasing locales comerciales

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.financing.plans.commercial_units`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 1, 2
- Nota: + IVA 21%

| Plazo | Interes anual | Adelanto | Alquiler | VR |
| ---: | ---: | ---: | ---: | ---: |
| 24 meses | 0% | 20.058,02 USD | 1.552,11 USD | 1.552,11 USD |
| 48 meses | 4% | 20.058,02 USD | 841,08 USD | 929,40 USD |
| 96 meses | 8% | 20.058,02 USD | 526,60 USD | 526,60 USD |

### Garantia para inversores

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.investor_guarantee`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 2

Para inversores que compran en pozo, se ofrece garantia de poliza de caucion por el total del dinero aportado con un 3% de incremento.

### Entrega

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.delivery`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 2

El plazo de entrega estimado es de 10 meses para la primera etapa: dos modulos de 16 departamentos y todos los locales, a fin de julio de 2026.

Los demas modulos se entregaran antes de fin de 2026 de acuerdo con el orden de fecha de compra.

### Reserva y forma de pago

- `source_path`: `customer_knowledge.projects.juana_64.sales_conditions.reservation_and_payment`
- Fuente: `docs/lead-bot/sources/condiciones_venta_juana_64_r.md`
- Paginas: 2

Para todas las compras se requiere un 3% de reserva.

| Modalidad | Condicion |
| --- | --- |
| Compra en pozo adelantada | El saldo se abona en 30 dias. |
| Compra terminado | 10% al boleto a los 30 dias y saldo contra entrega. |
| Compra en leasing | 3% a la reserva, 10% a los 60 dias, 22% contra entrega y saldo en las cuotas pactadas. |

## Proyecto San Luis

### Resumen publico

- `source_path`: `customer_knowledge.projects.san_luis.public_details`
- Fuente: `docs/lead-bot/sources/san_luis_web.md`

San Luis es un proyecto de compra en pozo en la Ciudad de San Luis. La web comunica 26 departamentos de 2 dormitorios, estacionamiento individual, cocina equipada, WiFi, seguridad con IA, vigilancia inteligente 24 hs y respaldo CORADIR.

Tambien incluye 2 locales comerciales para proyectos comerciales en crecimiento.

### Ubicacion y links

- `source_path`: `customer_knowledge.projects.san_luis.public_location`
- Direccion publica: Jose Hernandez y Chile, Ciudad de San Luis.
- Pagina publica: `/san-luis`.
- Folleto publico: `/img/san-luis/Folleto%20vertical%20-%20San%20Luis.pdf`.

### Limites de informacion

- `source_path`: `customer_knowledge.projects.san_luis.commercial_data_limits`

La pagina publica no muestra precio, cuotas, financiacion exacta, fecha de entrega cerrada, stock ni disponibilidad por unidad. Si el usuario pide esos datos, el bot debe confirmar que el proyecto existe y derivar la validacion comercial al asesor.

## Reglas recomendadas para el bot

### Cuando el usuario pregunta precios

Usar los valores del corpus solo si la consulta apunta claramente a Juana 64 y a departamento o local. Si pregunta por disponibilidad, stock o reserva de una unidad especifica, responder que lo confirma un asesor.

Respuesta sugerida:

```text
Para Juana 64, segun las condiciones cargadas, los departamentos figuran con precio de lista de 59.000,00 USD y precio pozo contado de 47.000,00 USD. Los locales comerciales figuran con precio de lista de 70.000,00 USD y precio pozo contado de 53.000,00 USD + IVA. Como son condiciones comerciales, conviene validarlas con un asesor antes de tomar una decision.
```

### Cuando el usuario pregunta financiacion

Priorizar leasing inmobiliario: hasta 96 meses, dolares o UVA, sin costo de hipoteca, 35% de adelanto, intereses de 0% a 8% anual segun plazo.

Si pide cuotas concretas, responder con la tabla correspondiente y aclarar si es departamento o local.

### Cuando el usuario pregunta entrega

Usar el dato de la fuente con fecha absoluta: primera etapa a fin de julio de 2026; demas modulos antes de fin de 2026 segun orden de compra.

### Cuando el usuario pregunta condiciones de reserva

Responder que todas las compras requieren 3% de reserva y luego diferenciar por modalidad: pozo adelantada, terminado o leasing.

### Cuando el usuario pregunta si el dato esta vigente

No afirmar vigencia absoluta. Decir que la base esta cargada desde el documento de condiciones fechado el 2026-02-06 y que el asesor debe confirmar condiciones finales.

## Pendientes de corpus

- Agregar superficies por unidad, disponibilidad actualizada y reglamento de convivencia de Juana 64 desde fuentes verificables.
- Separar datos publicables al cliente de datos internos de scoring o metodologia.
- Crear una suite de preguntas esperadas para Juana 64 con `expected_keywords` y `expected_sources`.
- Definir proceso de actualizacion de precios y condiciones, con fecha de vigencia por documento.
