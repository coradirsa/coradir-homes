# Lead Bot Changelog

## 2026-07-10 - Navegar a otra pagina de proyecto cambia el foco (sin borrar historial)

### Objetivo

Que el bot priorice el proyecto de la pagina que el usuario esta viendo: si charla sobre Villa Mercedes y despues abre /juana-64, la siguiente respuesta debe enfocarse en Juana 64. El historial y los datos capturados se conservan siempre (siguen valiendo para el resumen al asesor).

### Cambios realizados

- `types.ts`: nuevo campo `lastPageProject` en `LeadBotState` (ultimo proyecto derivado de la pagina desde donde escribio el usuario).
- `parser.ts (resolveProject)`: si `projectFromPath(pathname)` difiere de `lastPageProject`, hubo navegacion y la pagina actual manda sobre el proyecto conversado. Una mencion explicita de proyecto en el mensaje sigue ganando sobre todo. Sin navegacion, la conversacion sigue mandando (se preserva la decision del 2026-07-07).
- `parser.ts (resolveProject)`: el guard "departamento implica juana-64" que protegia solo a san-luis ahora protege tambien a villa-mercedes y la-torre-ii: el implicito solo aplica sin contexto de proyecto.
- `service.ts`: en turnos con navegacion, la extraccion de campos del LLM no puede pisar el proyecto resuelto deterministicamente (el LLM arrastra el proyecto del historial).
- `ai.ts`: el prompt recibe `paginaActual` en el estado y, en turnos con navegacion, una nota explicita ("este proyecto" = el de la pagina actual).
- `systemPrompt.ts`: regla nueva sobre paginaActual + equipamiento de Villa Mercedes.
- Corpus: Villa Mercedes ahora comunica equipamiento de las unidades (igual a Juana 64): cocina con artefactos electricos, calefon electrico, aire acondicionado, iluminacion LED y bano con lavarropas y tender rebatible; detalle final por unidad lo confirma un asesor (`knowledgeBase.json`, `retrieval.ts`, `systemPrompt.ts`, `sources/villa_mercedes_web.md`).
- `retrieval.ts`: matcher nuevo `wantsEquipment` ("equipados", "que incluyen", electrodomesticos, etc.) rutea a la respuesta de caracteristicas de VM/San Luis.
- Casos nuevos en `evaluation-cases.json`: `page_navigation_switches_project` y `villa_mercedes_equipamiento`.

### Verificacion

- API local: VM -> /juana-64 con "y este proyecto que tiene?" responde Juana 64 con project=juana-64 e historial intacto; mencion explicita "y en villa mercedes cuanto sale?" desde /juana-64 sigue cambiando a VM; "los departamentos vienen equipados?" en /villa-mercedes responde el equipamiento y mantiene project=villa-mercedes.

### Decision

La navegacion entre paginas de proyecto es una senal explicita del usuario, equivalente a nombrar el proyecto. Prioridad: mencion explicita en el mensaje > navegacion detectada (cambio de pagina) > proyecto conversado > proyecto de la pagina como default de arranque. Nada de esto borra historial ni datos capturados.

## 2026-07-07 - La conversacion manda sobre el proyecto de la pagina

### Objetivo

Corregir que el bot "se encerraba" en el proyecto de la pagina donde estaba parado el usuario: despues de cambiar de proyecto charlando (VM -> San Luis), el siguiente mensaje volvia a responder sobre Villa Mercedes y la conversacion aparecia borrada.

### Causa raiz

Habia una regla de "conflicto proyecto pagina vs proyecto estado" duplicada en dos lugares, y en ambos borraba la conversacion entera:

- `service.ts (normalizeIncomingState)`: si `tracking.pathname` daba un proyecto distinto al del estado entrante, descartaba TODO el estado (mensajes incluidos) y arrancaba de cero con el proyecto de la pagina. Esto pasaba en el mensaje siguiente a cualquier cambio de proyecto en el chat, sin necesidad de recargar.
- `LeadQualificationChat.tsx (readStoredState)`: misma regla al montar el componente o navegar; ademas el merge hacia `initialState.project || parsed.project` (la pagina pisaba el proyecto conversado).

### Cambios realizados

- `service.ts`: se elimino el descarte por conflicto. El merge ahora es `project: incoming.project || base.project`: el proyecto de la pagina es solo default cuando la conversacion no definio uno.
- `LeadQualificationChat.tsx`: se reemplazo el conflicto por una regla de vigencia: conversacion vacia o sin actividad por mas de 12 hs arranca de cero con el proyecto de la pagina (conservando nombre/email/telefono ya capturados); conversacion viva se preserva siempre y su proyecto manda (`parsed.project || initialState.project`).
- Caso nuevo `page_project_does_not_override_conversation` en `evaluation-cases.json`: estado con project san-luis + path /villa-mercedes + "genial y cuanto sale?" debe responder San Luis.

### Verificacion

- E2E con navegador real (UI del chat): switch VM->SL, recarga de pagina, "genial y cuanto sale?" responde San Luis con la conversacion intacta; conversacion envejecida 24 hs resetea al proyecto de la pagina conservando el nombre.
- Suite: 45/45 (plantillas + casos) y 7/7 casos nuevos aislados.

### Decision

El proyecto derivado del pathname es un default de arranque, nunca una autoridad: no pisa ni borra lo conversado. La unica via para resetear una conversacion viva es su vencimiento por inactividad (12 hs) o que el usuario cambie de proyecto explicitamente.

## 2026-07-07 - Menciones de proyecto con negacion y cambio de proyecto

### Objetivo

Corregir que el bot ignoraba negaciones al detectar proyecto: parado en /villa-mercedes, "pero no quiero en Villa Mercedes sino en San Luis" respondia el overview de Villa Mercedes. El parser tomaba el primer proyecto mencionado sin importar la negacion, el retrieval activaba contexto por sola mencion del nombre y el fallback de pathname re-imponia el proyecto de la pagina.

### Cambios realizados

- `parser.ts`: nuevo `getProjectMentionState(message)` que clasifica cada mencion de proyecto como afirmada o negada. La clausula se corta en `sino|pero|aunque|,;.` ("sino X" afirma X); marcadores de negacion: `no, tampoco, nada de, en vez de, en lugar de, descartar, olvidate de` y negacion pospuesta ("X no").
- `parseProject` devuelve el primer proyecto AFIRMADO segun prioridad; si solo hay menciones negadas devuelve undefined (sin caer en patrones implicitos).
- `resolveProject`: si el usuario nego explicitamente el proyecto actual o el de la pagina y no afirmo otro, el proyecto queda abierto (se limpia) en lugar de re-imponerse por pathname.
- `retrieval.ts`: `isVillaMercedesContext` / `isSanLuisContext` usan menciones afirmadas/negadas; un proyecto negado nunca activa su contexto, una afirmacion del otro proyecto lo desactiva, y con `state.project` apuntando a otro proyecto no se reactiva por historial reciente.
- `knowledge.ts`: `buildLocationReply`, `buildMediaOrBrochureReply` y `buildSpecificInterestReply` aplican la misma logica en sus chequeos por texto.
- `systemPrompt.ts`: regla nueva para el LLM: si el usuario rechaza un proyecto, no insistir y responder sobre el que si le interesa.
- 6 casos nuevos en `evaluation-cases.json`: overview/ubicacion/limites de precios de Villa Mercedes, switch VM->SL con negacion, switch SL->VM y negacion pura que limpia el proyecto de pagina.

### Verificacion

Suite parcial contra dev local: 45/45 (6 casos nuevos + 39 casos de plantillas de regresion de Juana 64, Ruta 3 y San Luis).

### Decision

La deteccion de proyecto pasa de "primer match gana" a menciones con sentimiento compartidas por parser, retrieval y respuestas canonicas. El proyecto de la pagina es solo un default: un rechazo explicito lo limpia y una afirmacion de otro proyecto lo pisa.

## 2026-07-07 - Alta de proyecto Villa Mercedes en el corpus

### Objetivo

Incorporar el nuevo proyecto Complejo Villa Mercedes (pagina /villa-mercedes) al conocimiento del bot para que responda con datos verificables y sin inventar condiciones comerciales.

### Cambios realizados

- Nueva fuente `docs/lead-bot/sources/villa_mercedes_web.md` con los datos publicos de la pagina: 20 departamentos (12 de 2 dormitorios y 8 monoambientes), parking individual con posibilidad de techado, cocina equipada, WiFi, seguridad con IA, complejo cerrado, Riobamba 477 (Ciudad de Villa Mercedes), folleto publico y limites de informacion comercial.
- `knowledgeBase.json`: documento fuente `villa_mercedes_web`, proyecto `customer_knowledge.projects.villa_mercedes` y 5 chunks de retrieval (resumen, ubicacion, unidades, folleto y limites comerciales).
- `retrieval.ts`: contexto Villa Mercedes con respuestas directas de ubicacion, folleto, caracteristicas, limites de precios/financiacion y overview; se excluye Villa Mercedes del contexto San Luis para no confundir con la provincia.
- `knowledge.ts`: resumen, label, ubicacion y ramas de saludo, intro, detalle, beneficios, proceso de compra, precios, financiacion, media/folleto, pagina y ubicacion para `villa-mercedes`.
- `parser.ts`: deteccion por nombre (`villa mercedes`, `riobamba`) antes que San Luis y por pathname `/villa-mercedes`.
- `ai.ts` y `systemPrompt.ts`: `villa-mercedes` como proyecto valido y ficha en el prompt del LLM.
- `LeadQualificationChat.tsx`: deteccion de proyecto al abrir el chat desde /villa-mercedes.

### Decision

Villa Mercedes se comunica solo con datos publicos de la web. Precios, cuotas, financiacion, entrega y disponibilidad no existen en el corpus, por lo que el bot debe reconocer el limite y derivar a asesor.

## 2026-07-02 - Handoff con resumen y limpieza de terminos internos

### Objetivo

Corregir respuestas que seguian sonando a salida tecnica (`Lo que si esta cargado`, `informacion cargada/publicada`) y cerrar mejor los casos donde falta un dato con CTA a asesor. Ademas, cuando el usuario acepta hablar con un humano, el bot debe pedir datos y enviar el contexto resumido al equipo.

### Cambios realizados

- Se agrego generacion de `advisorSummary` con LLM y fallback deterministico antes de enviar el lead al sink configurado.
- El resumen se envia en Homes CRM (`conversationData.advisorSummary`) y n8n (`conversation_data.advisor_summary`).
- El texto prearmado de WhatsApp incluye `Resumen para asesor` cuando el estado ya lo tiene.
- Se detecta aceptacion corta del CTA a asesor (`si`, `dale`, `ok`) si la respuesta anterior ofrecio contacto con asesor.
- Se cambio el handoff para pedir nombre + email/numero despues de confirmar interes en asesor, explicando que se envia un resumen.
- Se agrego sanitizacion final de respuestas visibles para bloquear terminos internos como `corpus`, `informacion cargada`, `fuente cargada` o `lo que si esta cargado`.
- Se ajustaron fallbacks de San Luis, Juana 64, alquiler residencial y locales para usar `Esa informacion todavia no la tengo...` + CTA a asesor.
- Se agregaron regresiones para San Luis + mascotas, aceptacion de asesor y captura de contacto con resumen.

### Decision

El bot puede seguir usando retrieval y respuestas canonicas como fuente de verdad, pero la respuesta visible se redacta con tono comercial. Si falta informacion, se reconoce el limite y se ofrece contacto con asesor; si el usuario acepta, se captura contacto y se genera un resumen para no perder contexto.

## 2026-07-02 - CTA comercial en datos faltantes y proyectos terminados

### Objetivo

Mejorar cierres conversacionales cuando falta informacion y evitar respuestas con tono interno. El bot no debe cerrar con "no tengo publicado" ni descartar La Torre II de forma seca.

### Cambios realizados

- Se cambio el tono de datos faltantes a: `Esa informacion todavia no la tengo...`.
- Se agrego CTA explicito: `¿Queres que te ponga en contacto con un asesor para consultarlo directamente?`.
- Se ajustaron respuestas de pet friendly/reglamento para Juana 64.
- Si el usuario pregunta por vivir con perros desde San Luis, ahora se muestran opciones de vivienda: Juana 64 confirmado pet friendly y San Luis como proyecto residencial con reglamento a validar.
- Se ajusto San Luis precio/financiacion para responder aun cuando el usuario escriba `cuantosale`.
- Se reemplazo `No tomo La Torre II...` por una salida positiva: proyecto terminado consultable con asesor si hay disponibilidad.
- En consultas de vivienda/otro lado, la respuesta ahora presenta Juana 64, San Luis y La Torre II cuando corresponde.
- Se agregaron regresiones para `cuantosale`, CTA a asesor y La Torre II.
- Se corrigio un falso rechazo de contacto: frases como `No solo quiero...` ya no se interpretan como negativa a dejar datos.

### Decision

Cuando falta un dato por unidad, reglamento, precio o disponibilidad, el bot debe admitir el limite con lenguaje comercial y ofrecer contacto con asesor. No debe sonar como auditoria de corpus ni como descarte interno de proyectos.

## 2026-07-02 - LLM con retrieval en turnos normales y fix de contexto pet friendly

### Objetivo

Evitar que reglas contextuales acumuladas repitan una respuesta vieja cuando el usuario ya cambio de consulta. El caso detectado fue Juana 64: despues de hablar de perros/pet friendly, preguntas como "como son los deptos?" o "son solo en Juana Koslay?" seguian respondiendo sobre reglamento de mascotas.

### Cambios realizados

- Se restringio la inferencia contextual de `pet friendly` en `src/lib/leadBot/retrieval.ts`.
- Ya no se toma cualquier frase corta posterior a una consulta de perros como follow-up de mascotas.
- Se agrego deteccion de nuevo tema para preguntas con `como`, `solo`, `otro lado`, `hay`, `tienen`, `caracteristicas`, `ubicacion`, `precio` o `financiacion`.
- Se corrigio el falso positivo donde `sol` matcheaba dentro de `solo` y activaba respuestas sobre buena luz.
- Se amplio el alcance de "solo en Juana Koslay" para tolerar "solo en", "otro lado" y el typo "Juana Kolay".
- Se amplio el saludo para frases coloquiales como "hola wachin todo bien?" sin saltar a formulario de intencion.
- Se enriquecio la respuesta de alcance "No solo Juana Koslay" para mencionar Juana 64 y San Luis con caracteristicas basicas.
- En `src/lib/leadBot/service.ts`, los turnos normales ahora intentan LLM con retrieval aunque exista un fallback deterministico. Los guardrails y datos exactos sensibles siguen teniendo prioridad.
- Las consultas de expensas quedan en respuesta deterministica porque son dato no publicado/sensible y el texto debe conservar la advertencia exacta.
- Se agregaron regresiones en `docs/lead-bot/evaluation-cases.json` para:
  - saludo coloquial;
  - consulta de caracteristicas despues de hablar de perros;
  - consulta de otras ubicaciones despues de hablar de perros.

### Decision

El LLM queda como redactor/interprete principal en turnos normales con contexto recuperado. Las reglas deterministicas quedan como fallback y para casos sensibles: reclamos, insultos, rechazo de datos, handoff, contacto, alquiler no disponible y datos comerciales exactos.

## 2026-07-01 - Juana 64 pet friendly y referencias contextuales

### Objetivo

Corregir respuestas sobre mascotas en Juana 64. El bot estaba tratando `pet friendly` como dato no confirmado y, en aclaraciones como "los de Juana 64", saltaba al siguiente campo de scoring en vez de responder la consulta.

### Cambios realizados

- Se actualizo `docs/lead-bot/sources/juana_64_web.md`.
- Se actualizo `docs/lead-bot-knowledge-corpus.md`.
- Se actualizo `src/lib/leadBot/knowledgeBase.json`:
  - Juana 64 queda marcado como pet friendly.
  - Sigue pendiente de validacion: reglamento de convivencia y cantidad exacta de mascotas/perros por unidad.
- Se agrego respuesta directa en `src/lib/leadBot/retrieval.ts` para consultas de mascotas/pet friendly.
- La deteccion usa historial reciente para resolver aclaraciones como "los de Juana 64" cuando la pregunta anterior hablaba de pet friendly.
- Se acoto el detector de link/pagina para que frases como "en la web decia que son pet friendly" no devuelvan ubicacion o link del proyecto.
- Se ajustaron prompt y fallback para no pedir presupuesto antes de responder preferencias residenciales concretas.
- Se agregaron regresiones en `docs/lead-bot/evaluation-cases.json`.

### Decision

El dato confirmado es `pet friendly`; no se debe inventar reglamento, cupo exacto de mascotas ni condiciones por unidad. Esos puntos se derivan a asesor.

## 2026-07-01 - Redaccion LLM grounded por corpus

### Objetivo

Pasar de respuestas mayormente extractivas a un flujo donde el corpus sigue siendo la fuente de verdad y el LLM redacta la respuesta visible cuando hay datos recuperados.

### Cambios realizados

- Se agrego soporte para `canonicalAnswer` en `src/lib/leadBot/ai.ts`.
- El prompt del LLM ahora recibe:
  - respuesta canonica recuperada del corpus;
  - fragments/snippets relevantes;
  - estado del lead;
  - historial reciente.
- `src/lib/leadBot/service.ts` intenta generar una respuesta LLM grounded cuando existe `directKnowledgeAnswer`.
- Se agrego validacion post-LLM:
  - extrae datos obligatorios de la respuesta canonica;
  - valida numeros, montos, porcentajes, medidas, URLs, fechas, direcciones y necesidad de asesor;
  - preserva frases sensibles de limite comercial como `financiacion exacta` y el CTA a asesor;
  - si el LLM omite un dato obligatorio, se usa la respuesta extractiva canonica como fallback.
- Se mantuvieron respuestas deterministicas para guardrails sensibles:
  - quejas/reclamos;
  - insultos o abuso;
  - rechazo de datos de contacto;
  - alquiler residencial no disponible;
  - handoff humano;
  - reparacion por confusion del usuario.
- Se agrego timeout configurable para providers LLM con `LEAD_BOT_LLM_TIMEOUT_MS` (default 4500 ms) y fallback al corpus si el proveedor demora o falla.
- Se documento `LEAD_BOT_LLM_TIMEOUT_MS=4500` en `.env.example` y se propago a `docker-compose.yml`.
- El fallback por error/timeout de IA ahora se registra como warning corto, sin stack completo.

### Arquitectura resultante

```text
Usuario
-> normalizacion de estado y parser
-> guardrails deterministas
-> retrieval/corpus genera respuesta canonica
-> LLM redacta con canonicalAnswer + snippets
-> validacion de hechos obligatorios
-> respuesta LLM si pasa, respuesta extractiva si falla
-> scoring + CRM/handoff si corresponde
```

### Criterio de replicacion

Para sumar nuevos datos al bot:

1. Agregar fuente Markdown en `docs/lead-bot/sources/`.
2. Incorporar el dato atomico en `src/lib/leadBot/knowledgeBase.json`.
3. Crear o ajustar retrieval directo en `src/lib/leadBot/retrieval.ts` si el dato es sensible o exacto.
4. Agregar caso en `docs/lead-bot/evaluation-cases.json`.
5. Ejecutar:

```powershell
npx tsc --noEmit --pretty false
npm run build
npm run bot:evaluate -- --base-url http://localhost:6121
```

### Verificaciones esperadas

- La respuesta visible puede variar en redaccion si la genera el LLM.
- Los datos exactos no deben variar.
- Si el LLM omite datos obligatorios, el fallback extractivo conserva la respuesta correcta.

## 2026-07-01 - Cantidad de departamentos y locales Juana 64

### Cambios realizados

- Se reviso contenido local de la web:
  - `src/app/juana-64/components/sectionStats/sectionStats.tsx`
  - `src/app/juana-64/components/sectionRooms/sectionRooms.tsx`
  - `src/app/locales-comerciales/data.ts`
- Se actualizo `docs/lead-bot/sources/juana_64_web.md`.
- Se actualizo `docs/lead-bot-knowledge-corpus.md`.
- Se actualizo `src/lib/leadBot/knowledgeBase.json`.
- Se ajusto retrieval para responder:
  - Juana 64 tiene 64 departamentos publicados: 44 disponibles + 20 reservados.
  - Locales Juana 64 tiene 6 locales, 84 m2 por local, medidas 6 m x 14 m.
- Se agregaron casos:
  - `juana64_department_and_commercial_unit_count`
  - `juana64_commercial_unit_count_only`

### Decision

Las preguntas de cantidad de unidades se tratan como dato exacto de corpus. El LLM puede redactar, pero debe conservar cantidades, medidas y validacion con asesor.

## 2026-07-01 - Preferencias residenciales no confirmadas

### Cambios realizados

- Se agrego fuente `docs/lead-bot/sources/juana_64_web.md`.
- Se cargo contexto publico de Juana 64:
  - caracteristicas confirmadas;
  - escala del proyecto;
  - limites de informacion no publicada.
- Se ajusto el prompt para no inventar:
  - terraza;
  - patio;
  - luminosidad/orientacion por unidad;
  - cantidad exacta de mascotas;
  - materiales exactos;
  - expensas.
- Se agrego post-procesado para que, cuando el usuario pide esos datos y no estan confirmados, la respuesta incluya validacion con asesor.

### Decision

Estas consultas son buenas candidatas para LLM con contexto recuperado, porque requieren interpretar preferencias y responder con tono natural sin inventar.
