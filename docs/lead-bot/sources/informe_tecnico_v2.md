# Informe tecnico v2 - Chatbot RAG para Movilidad Electrica CORADIR

Fuente convertida a Markdown/texto para uso interno del lead bot.

- Documento original: informe_tecnico_v2.pdf
- Fecha indicada en el documento original: 2026-06-19
- Paginas: 21
- Uso: referencia metodologica interna para estructurar corpus, trazabilidad, retrieval y evaluacion.

---

          Universidad de Buenos Aires — Facultad de Ingeniería
                        Diplomatura en Inteligencia Artificial
                              Taller de Proyecto Final




Chatbot RAG para Movilidad Eléctrica
           CORADIR
Recuperación híbrida y respuesta extractiva sobre una base de conocimiento
                    corporativa de vehículos eléctricos




  Integrante:   Carlos Salini
        SIU:    d0124
         Rol:   Desarrollo integral: datos, arquitectura RAG, evaluación y documentación
       Track:   A — RAG / Chatbot
       Fecha:   19/06/2026
 Repositorio:   https://github.com/xKaruXx/DIIA-salini
Índice
1. Resumen Ejecutivo                                                                                  2

2. Justificación de la Solución                                                                       2
   2.1. Contexto y problema . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .       2
   2.2. Decisiones de diseño . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      3

3. EDA y Descubrimientos                                                                             4
   3.1. Descripción del corpus . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     4
   3.2. Hallazgos y decisiones derivadas . . . . . . . . . . . . . . . . . . . . . . . . . . . .     4

4. Arquitectura Propuesta                                                                             6
   4.1. Visión general . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .    6
   4.2. Etapas del pipeline . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     7
   4.3. Stack tecnológico . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     8

5. Evaluación de Resultados                                                                           9
   5.1. Protocolo de evaluación . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .       9
   5.2. Métricas utilizadas e interpretación . . . . . . . . . . . . . . . . . . . . . . . . . .     10
   5.3. Resultados comparativos . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      11
   5.4. Métricas de retrieval . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .    12
   5.5. Métricas de generación . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     13
   5.6. Selección del modelo de embeddings . . . . . . . . . . . . . . . . . . . . . . . . .         13
   5.7. Selección del LLM de chat . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      14
   5.8. Métricas operativas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .    14
   5.9. Análisis de errores . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .    15

6. Conclusiones                                                                                      16
   6.1. Logros . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   16
   6.2. Limitaciones . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .   16
   6.3. Aprendizajes del proyecto . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .      17
   6.4. Trabajo futuro . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     17
   6.5. Consideraciones éticas . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .     18

7. Referencias                                                                                       18

Anexos                                                                                               18

A. Configuración del sistema                                                                         18

B. Comandos de reproducción                                                                          19

C. Ejemplos de consulta con trazabilidad                                                             19




                                                   1
1.     Resumen Ejecutivo
    CORADIR S.A. mantiene la información comercial y técnica de su línea de vehículos eléctricos
(modelos TITO, TITA, BARRE-TITA, CHIKI y la aplicación CONTACTITO) en un documento
JSON administrativo: especificaciones, precios, agencias oficiales por provincia, infraestructura de
carga y preguntas frecuentes. Esa información no era consultable en lenguaje natural: el personal
de ventas y los visitantes del sitio web dependían de búsquedas manuales sobre un documento
jerárquico, sin trazabilidad de qué fuente respalda cada dato.
    Este proyecto implementa un chatbot web alimentado por un sistema RAG (Retrieval Aug-
mented Generation) que convierte esa base de conocimiento en un corpus recuperable, medible y
trazable. El sistema combina recuperación léxica y vectorial (Chroma) sobre 111 documentos atómi-
cos con source_path trazable. En este informe, source_path significa la ruta jerárquica del campo
dentro del JSON original; por ejemplo, vehiculos_detalles.TITO.modelos_disponibles[1]
identifica el nodo exacto desde donde salió una especificación. Esa ruta permite auditar que la
respuesta se apoyó en el dato correcto. El sistema completa esa trazabilidad con una capa de
respuesta extractiva con términos de foco por tipo de pregunta, y generación con un LLM local
(qwen3.5 servido por Ollama) como ruta de respaldo. La lógica de dominio evita responder fuera
del corpus y deriva las consultas comerciales sensibles a una validación humana. Todo el stack
corre en hardware local, sin servicios pagos.
    Los resultados sobre el conjunto de evaluación de 64 casos con fuentes esperadas fueron:
exactitud por palabras clave de 64/64 (100 %) frente a un baseline de 35/64 (54,7 %) antes de la
mejora extractiva; Recall@5 de retrieval de 0,969 con MRR de 0,916 y Top-1 de 0,875; Context
Faithfulness medio de 0,895 en generación. La latencia de la ruta extractiva es de 0,01 s por
consulta; la ruta generativa promedia 3,8 s con el modelo recomendado (qwen3.5:4b) y el costo
marginal por consulta es nulo por tratarse de modelos locales.
    La conclusión principal es que, en este corpus, el cuello de botella no estaba en encontrar el
documento correcto sino en seleccionar, dentro de ese documento, la línea que contenía el dato
pedido: 24 de los 29 fallos del baseline ya tenían la fuente esperada en el top-5. La principal
limitación es que el conjunto de evaluación se usó iterativamente durante la mejora, por lo que el
100 % final indica cobertura del benchmark y no una garantía de exactitud ante consultas reales
nuevas. Para pasar de prueba de concepto a MVP operativo falta validar con consultas no vistas,
medir satisfacción de usuarios reales y automatizar la vigencia de precios.


2.     Justificación de la Solución
2.1.   Contexto y problema
    CORADIR es un fabricante argentino de vehículos eléctricos con una red de agencias en varias
provincias. Su información de productos cambia con frecuencia (precios en USD, disponibilidad,
accesorios, condiciones de compra) y se administra en un JSON jerárquico de uso interno. Las
consultas típicas que recibe la empresa — “¿cuánta autonomía tiene el TITO S5?”, “¿qué agencia
hay en Moreno?”, “¿el precio incluye patentamiento?” — requieren conocer la estructura del
documento para responderlas, y no existía forma de auditar de dónde salió cada respuesta.
    El problema técnico es entonces doble: (i) hacer recuperable en lenguaje natural una base de
conocimiento administrativa con datos exactos (precios, direcciones, especificaciones), donde una
respuesta aproximada es peor que no responder; y (ii) hacerlo de forma medible y trazable, de
modo que cada respuesta pueda rastrearse hasta el campo del JSON que la respalda. El requisito
de datos exactos condiciona todo el diseño: el sistema prioriza extraer literalmente el dato de la
fuente recuperada antes que parafrasearlo con un modelo generativo.




                                                 2
2.2.    Decisiones de diseño
    Cada decisión se documenta con el esquema decisión, alternativas, criterio y trade-off asumido.
El Cuadro 1 resume las seis decisiones principales y deja explícito qué se descartó en cada caso;
esa lectura evita presentar preferencias como si fueran decisiones de ingeniería.

 Decisión                      Alternativas                       Criterio                        Trade-off asumido
 Documentos atómicos por       Chunking clásico por tama-         Los datos son campos pun-       111 docs muy cortos ⇒ Pre-
 campo del JSON (media         ño fijo (200–400 tokens) con       tuales; el EDA mostró me-       cision@5 baja por chunks
 44 tokens)                    solapamiento                       diana de 24 tokens en el cor-   “extra” recuperados
                                                                  pus
 Retrieval híbrido: léxico +   Solo vectorial; solo léxico        Recall@5 y Top-1 sobre 64       Dos índices a mantener; ran-
 vectorial                     (BM25-like)                        casos con fuentes esperadas     king léxico sensible a stop-
                                                                                                  words
 Embeddings                    nomic-embed-text,                  Matriz de retrieval vectorial   No es el mejor en MRR
 nomic-embed-text-v2-moe       embeddinggemma,                    puro sobre 64 casos (Cua-       (lo supera embeddinggemma);
                               qwen3-embedding:0.6b               dro 8)                          cambio diferido
 LLM qwen3.5:4b para la        11 modelos locales de 270M         Score sintético + latencia +    4,19/5 vs. 4,29/5 del qwen3.
 demo                          a 32B evaluados                    peso en disco (Figura 8)        5:latest; 26 % menos laten-
                                                                                                  cia y la mitad de memoria
 Mejorar la capa extractiva    Reindexar con otro embed-          24/29 fallos ya tenían la       La capa extractiva agrega re-
 antes que cambiar embed-      ding; reranking con cross-         fuente en top-5: el problema    glas específicas del dominio
 dings                         encoder                            era la selección de líneas      que hay que mantener
 Stack 100 % local (Ollama     APIs pagas (OpenAI) para           Costo por consulta, privaci-    Modelos locales más débiles
 + Chroma + SQLite)            LLM y embeddings                   dad de datos comerciales, re-   que los de frontera; latencia
                                                                  producibilidad sin claves       ligada al hardware


        Cuadro 1: Resumen de decisiones de diseño con alternativas, criterio y costo asumido.


Chunking y documentos atómicos. El corpus está formado por registros breves del JSON
administrativo: precios, direcciones, especificaciones técnicas, preguntas frecuentes y datos institu-
cionales. Cada registro concentra una unidad de información que debe mantenerse trazable. Con esa
estructura, la decisión de chunking consistió en definir si convenía agrupar campos cercanos o con-
servar cada dato como unidad independiente. Se eligió un documento por campo u objeto del JSON
(scripts/prepare_dataset.py), cada uno con metadatos \{id,section,title,source_path\}.
Esta estrategia preserva la relación directa entre respuesta y fuente: si el usuario pregunta por
una dirección, un precio o una autonomía, el sistema puede recuperar el registro exacto en lugar
de un bloque amplio con varios datos mezclados. El costo es un corpus de documentos muy cortos
que penaliza la Precision@5 porque aparecen vecinos de la misma sección; se aceptó ese costo
porque Recall y Top-1 son las medidas que condicionan que la respuesta tenga la fuente correcta.

Secuenciamiento del cambio de embeddings. La evaluación de embeddings mostró que
embeddinggemma y qwen3-embedding:0.6b superan a nomic-embed-text-v2-moe en retrieval
vectorial puro. El análisis de fallos del benchmark extendido ubicó el principal error en otra etapa:
24 de los 29 casos fallidos ya tenían la fuente correcta en el top-5, pero la respuesta no seleccionaba
el dato pedido dentro del documento recuperado. Por ese motivo se priorizó la capa extractiva,
que corregía la mayor parte de los errores observados sin reconstruir el índice. La comparación de
embeddings queda documentada como insumo para la siguiente validación, idealmente con un
conjunto de preguntas nuevo y el pipeline ya congelado.

Reranking. Se consideró agregar un reranker neuronal sobre el top-K recuperado. Se descartó
por dos razones medidas en el propio sistema: (i) el primer documento relevante ya aparece en
promedio en la posición 1,22 del ranking híbrido, de modo que el margen de mejora de reordenar es
chico; y (ii) el patrón de fallos no era de orden sino de extracción del campo dentro del documento.



                                                              3
El costo evitado es la latencia y memoria de un segundo modelo en una máquina que ya sirve el
LLM y los embeddings.


3.     EDA y Descubrimientos
3.1.    Descripción del corpus
    La fuente es una base administrativa consolidada de CORADIR Movilidad Eléctrica (47 KB):
información institucional, catálogo de vehículos con especificaciones, precios por variante, agencias
por provincia, infraestructura de carga (Ecocarga), preguntas frecuentes y condiciones comerciales.
El preprocesamiento la convierte en un archivo JSONL con un documento por línea para indexación
y auditoría. El Cuadro 2 resume las medidas descriptivas del EDA, calculadas con los criterios de
riqueza léxica del material de clase (TTR y MATTR con ventana 50) [2].

        Medida descriptiva                                                            Valor
        Documentos indexables                                                           111
        Tokens totales                                                                4 907
        Tokens por documento (media / mediana / p90 / máx.)          44,21 / 24 / 105 / 401
        TTR promedio                                                                  0,834
        MATTR promedio (ventana 50)                                                   0,854
        Documentos muy cortos (< 30 tokens)                                              67
        Documentos muy largos (> 200 tokens)                                              2
        Documentos con baja densidad léxica                                               0

       Cuadro 2: Medidas descriptivas del EDA sobre el corpus preprocesado (111 documentos).


3.2.    Hallazgos y decisiones derivadas
Hallazgo 1: el corpus es de documentos muy cortos y asimétricos. La distribución de
longitudes (Figura 1) está fuertemente sesgada: mediana de 24 tokens, con 67 documentos por
debajo de 30 tokens y solo 2 outliers largos (la ficha técnica completa del TITO, 401 tokens, y el
listado de agencias de Buenos Aires, 388 tokens). A partir de este patrón se decidió no aplicar
chunking por tamaño: fragmentar documentos que en su mayoría ya son atómicos podía romper
unidades de significado. Los dos documentos largos se trataron en la capa extractiva (selección de
líneas dentro del documento) en lugar de subdividirlos en el índice.




                                                 4
Figura 1: Distribución de longitud por documento del corpus (tokens). La masa se concentra debajo
de 50 tokens, con dos outliers (388 y 401 tokens) que corresponden a la ficha técnica del TITO y a las
agencias de Buenos Aires.


Hallazgo 2: la estructura jerárquica del JSON es un activo de trazabilidad. Cada
campo del JSON tiene una ruta natural. A esa ruta se la guardó como source_path: no es una
URL ni una ruta de archivo, sino la dirección interna del dato dentro del JSON administrativo. Por
ejemplo, vehiculos_detalles.TITO.modelos_disponibles[1] apunta a un modelo específico
dentro de la sección de vehículos. A partir de esa estructura se decidió conservar source_path
como metadato de cada documento, lo que después habilitó definir expected_sources por caso
de evaluación y auditar el retrieval contra fuentes esperadas. La decisión convirtió una propiedad
administrativa del JSON en una evidencia de trazabilidad: cada respuesta puede mostrar qué
campo del corpus la respalda.

Hallazgo 3: la riqueza léxica no justificaba normalización agresiva. Con MATTR
promedio de 0,854 y ningún documento con baja densidad léxica, no había evidencia de vocabulario
degenerado o repetitivo. A partir de esa medición se decidió no aplicar lematización ni stemming
global sobre el corpus, y concentrar el esfuerzo de normalización solo en la búsqueda léxica
(minúsculas, acentos y stopwords interrogativas), preservando los valores literales — “USD
17.731,25”, “Ficha 2073” — que el usuario necesita recibir exactos.

Hallazgo 4: la distribución por sección es desbalanceada. El corpus concentra documentos
en vehiculos_detalles, precios y agencias (Figura 2), que coinciden con las categorías de
consulta más frecuentes. Por esa distribución se diseñó el conjunto de evaluación extendido
respetando esa proporción (22 casos de vehículos y 12 de precios sobre 64) y se ponderaron en
la búsqueda léxica las entidades de dominio (TITO, TITA S2, CHIKI, CONTACTITO Plus,
Ecocarga) por sobre términos genéricos.




                                                  5
Figura 2: Documentos por sección del corpus. El desbalance guio la composición del conjunto de evaluación
y la ponderación de entidades en la búsqueda léxica.

   Los documentos extremos detectados por el EDA (campos de 1–5 tokens como empresa.
fundacion o sitios_web.principal) se revisaron manualmente y se conservaron: contienen
datos puntuales (URLs, fechas, emails) que son justamente el tipo de dato exacto que el sistema
debe poder devolver.


4.     Arquitectura Propuesta
4.1.    Visión general
    Las Figuras 3 y 4 separan el pipeline en dos momentos: preparación de la base de conocimiento
y atención de consultas. La arquitectura no delega todas las respuestas al LLM. Primero intenta
recuperar y extraer literalmente el dato cuando la pregunta apunta a precios, direcciones, auto-
nomías, colores u otras propiedades puntuales. Si esa ruta no alcanza, usa recuperación híbrida
y generación controlada con contexto. Este diseño sigue el patrón general de RAG con índice
precomputado [1].




Figura 3: Arquitectura offline de ingesta e indexado: la base administrativa se normaliza en 111 documentos
atómicos con source_path y se indexa en Chroma con embeddings locales.




                                                    6
Figura 4: Arquitectura online de consulta: FastAPI aplica guardrails, intenta una respuesta extractiva
con fuente y usa recuperación híbrida más LLM local como respaldo cuando la extracción literal no
alcanza.


4.2.   Etapas del pipeline
   Para cada etapa se declara entrada, proceso, salida y almacenamiento.
Ingesta y preprocesamiento.
     Entrada: base administrativa en JSON jerárquico. Proceso: scripts/prepare_dataset.py
     normaliza encoding, aplana el árbol y genera un documento atómico por campo u obje-
     to, conservando la ruta de origen. Salida: \{id,section,title,content,source_path\}
     por línea. Almacenamiento: dataset/knowledge_base_movilidad.jsonl (111 documentos,
     versionado en el repositorio).
Vectorización e indexado.
     Entrada: el JSONL anterior. Proceso: embeddings con nomic-embed-text-v2-moe (768
     dimensiones) servidos por Ollama; creación o carga del índice al iniciar la API. Salida:
     índice vectorial persistente. Almacenamiento: chroma_db/ (Chroma 0.6.3), una colección
     por modelo de embeddings para poder comparar configuraciones sin pisar índices.
Guardrails.
     Entrada: la pregunta del usuario. Proceso: reglas previas al retrieval para casos sensibles
     (consultas de precios fuera de catálogo, pedidos de contacto, temas de seguridad) con
     respuestas controladas; límite de mensajes fuera de dominio por sesión con cierre automático.
     Salida: respuesta controlada o pase a la siguiente etapa. Almacenamiento: no aplica (reglas
     en api/chat_service.py).
Ruta extractiva.
     Entrada: pregunta en dominio. Proceso: búsqueda léxica sobre los 111 documentos (top-
     8) con normalización, remoción de stopwords interrogativas y ponderación de entidades;
     selección de líneas dentro del documento según términos de foco por tipo de pregunta
     (colores, dimensiones, direcciones, costos no incluidos, etc.) con un presupuesto dinámico de
     líneas; expansión de bloques estructurados tipo lista. Salida: respuesta extractiva literal con
     su fuente, o vacío si no hay match suficiente. Almacenamiento: índice léxico en memoria,
     construido desde el JSONL al iniciar.
Recuperación híbrida (ruta generativa).
     Entrada: pregunta reformulada con el historial de la sesión (un LLM reescribe la consulta si
     hay contexto conversacional previo). Proceso: combinación de resultados léxicos (máximo 2
     fragmentos) y vectoriales de Chroma hasta top-5. Salida: contexto concatenado con títulos
     y fuentes. Almacenamiento: no persiste; se arma por consulta.


                                                  7
Generación y verificación.
     Entrada: contexto recuperado + pregunta + historial. Proceso: prompt con variante strict
    (instruye responder solo con el contexto y admitir “no se especifica” cuando el dato no
     está), generación con qwen3.5 vía Ollama, sanitización de la salida (remoción de trazas de
     razonamiento del modelo). Salida: respuesta final. Almacenamiento: mensajes y sesiones en
     SQLite (chatbot_movilidad.db) vía SQLAlchemy.
Serving.
     Entrada: mensajes del usuario desde el chat web. Proceso: FastAPI con WebSocket (api/
     main.py), autenticación JWT de sesión, rate limiting por IP para acciones de contacto, y
     webhooks opcionales a n8n para derivación comercial. Salida: respuesta en el chat embebido
    (chat_assets/). Almacenamiento: SQLite local (PostgreSQL configurable vía DATABASE_
     URL).

4.3.   Stack tecnológico
   El Cuadro 3 resume los componentes con sus versiones y el rol de cada uno en el pipeline.

 Componente            Tecnología                         Versión            Rol
 API y serving         FastAPI + Uvicorn                  0.115.8 / 0.34.0   HTTP, WebSocket del chat, JWT
 Orquestación RAG      LangChain (+ community, ollama)    0.3.19             Prompts, memoria, cadenas
 Vector store          Chroma                             0.6.3              Índice vectorial persistente
 Embeddings            nomic-embed-text-v2-moe            475M par., 768d    Vectorización multilingüe
 LLM (demo)            qwen3.5:4b vía Ollama              4B par.            Generación ruta LLM
 LLM (benchmark)       qwen3.5:latest vía Ollama          32B par.           Generación en evaluaciones
 Persistencia          SQLAlchemy + SQLite                2.0.38             Sesiones, mensajes, rate limit
 Tokenización          tiktoken                           0.9.0              Conteos de tokens del EDA
 Análisis y gráficos   pandas + matplotlib                2.2.3 / 3.10.0     Benchmarks y figuras
 Frontend              HTML/CSS/JS + WebSocket            —                  Chat web embebible
 Integración externa   n8n (webhooks, opcional)           —                  Derivación de contactos

           Cuadro 3: Stack tecnológico con versiones (según requirements.txt y .env).

    Criterio de reproducibilidad: con el repositorio, requirements.txt, .env.example y los
comandos del Anexo B, otro evaluador puede regenerar el JSONL, reindexar y repetir todos
los benchmarks de evaluación. Los resultados citados están versionados como JSON en docs/:
benchmark extendido, auditoría de chunks, matriz de embeddings y matriz manual de modelos.
    El Cuadro 4 explicita los archivos y salidas producidas durante el proceso, junto con su rol en
la trazabilidad del sistema.




                                                8
       Artefacto                  Rol                                    Ubicación
       Base administrativa ori-   Fuente consolidada del dominio         JSON fuente versionado en
       ginal                                                             dataset/
       Corpus RAG preproce-       Documentos atómicos indexables con     dataset/knowledge_base_
       sado                       metadatos, incluyendo source_path      movilidad.jsonl
       Índice vectorial           Persistencia local de embeddings en    chroma_db/
                                  Chroma
       Benchmarks de respues-     Cobertura por configuración y suite    docs/benchmark_*.json
       ta                         de regresión
       Auditoría de chunks        Evidencia de retrieval por caso y      docs/auditoria_rag_
                                  fuente esperada                        chunks_clase6.*
       Matrices de modelos y      Comparación de alternativas locales    docs/evaluacion_modelos_
       embeddings                 para LLM y embeddings                  *.md;    docs/evaluacion_
                                                                         embeddings_locales.md
       Figuras del informe        Gráficos del EDA, arquitectura, eva-   docs/informe_tecnico/
                                  luación y selección de modelo          figs/

            Cuadro 4: Artefactos versionados o reproducibles usados para auditar el pipeline.


5.      Evaluación de Resultados
5.1.     Protocolo de evaluación
    Se construyeron tres conjuntos de evaluación versionados en el repositorio:
      MVP (15 casos): preguntas factuales directas con expected_keywords; sirvió como prueba
      de humo del MVP.
      Extendido (64 casos): cubre 13 categorías (vehículos, precios, agencias, carga, compra,
      empresa, etc.) respetando la distribución del corpus. Cada caso define expected_keywords
      (el dato exacto que debe aparecer en la respuesta) y expected_sources (los source_path
      que la respaldan), lo que permite evaluar por separado la respuesta final y el retrieval.
      Matriz manual de modelos (21 preguntas × 11 modelos): 7 factuales, 7 ambiguas y 7
      fuera de dominio, para seleccionar el LLM de chat.
    El criterio de acierto del benchmark automatizado es estricto: un caso pasa solo si la respuesta
contiene todas las expected_keywords (valores literales como “17.731,25” o “ISO 9001”). No
hay split train/test en el sentido clásico porque no se entrena ningún modelo; el riesgo análogo
— sobreajuste de las reglas extractivas al conjunto de evaluación — existe y queda declarado
como limitación metodológica del trabajo. El ground truth de expected_sources se construyó
manualmente revisando el JSON original, por lo que la trazabilidad fue verificada caso por caso y
no inferida automáticamente.
    La composición del conjunto extendido se detalla en el Cuadro 5; la Figura 5 muestra la
misma distribución para hacer visible el peso relativo de cada categoría. Se conservan ambos
porque el cuadro explicita qué valida cada grupo de casos y el gráfico permite leer de un vistazo
la concentración del benchmark.




                                                      9
         Categoría              Casos   Qué valida
         Vehículos                 22   Especificaciones, autonomía, capacidad, colores y va-
                                        riantes
         Precios                   12   Valores exactos en USD, accesorios y combinaciones de
                                        variantes
         Agencias                   6   Localidad, provincia, nombre y dirección
         Compra                     5   Reserva, entrega, condiciones comerciales y patenta-
                                        miento
         Empresa                    5   Información institucional, plantas, certificaciones y va-
                                        lores
         Carga                      4   Carga domiciliaria, carga rápida e infraestructura Eco-
                                        carga
         App y movilidad            4   CONTACTITO, app móvil y beneficios de movilidad
                                        eléctrica
         Posventa                   2   Garantía, reclamos y servicio técnico
         Beneficios, comer-         4   Casos de borde y datos de contacto
         cial, contacto y si-
         tios web

            Cuadro 5: Composición del benchmark extendido de 64 casos por categoría.




Figura 5: Distribución de casos del benchmark extendido. Vehículos y precios concentran más de la
mitad de las preguntas porque son las zonas de mayor exposición comercial.

    El conjunto extendido cubre las zonas de consulta esperables del dominio. Las categorías de
vehículos y precios concentran más de la mitad de los casos porque son las áreas donde un error
tiene mayor impacto comercial; también se incluyeron agencias, compra, empresa, carga, posventa
y casos de contacto o sitios web para probar trazabilidad fuera del catálogo principal. Cada caso
combina tres piezas: una pregunta en lenguaje natural, una lista de palabras o valores obligatorios
y una o más fuentes esperadas. Por ejemplo, una consulta de autonomía exige recuperar la ficha
del vehículo correspondiente y mencionar los valores exactos; una consulta de precio exige el
monto final y la fuente de la variante comercial. Este diseño permite separar dos diagnósticos: si
el sistema recuperó la fuente correcta y si, además, extrajo el dato correcto de ella.

5.2.   Métricas utilizadas e interpretación
   Las métricas se eligieron para separar tres preguntas: si la respuesta final contiene el dato
esperado, si el retrieval recupera la fuente correcta y si la generación queda respaldada por el

                                                   10
contexto. Para retrieval se usan medidas estándar de búsqueda de información [3].
Accuracy por keywords.
     Porcentaje de casos cuya respuesta contiene todas las palabras o valores obligatorios definidos
     en el benchmark. Es la métrica principal de respuesta final porque el dominio exige datos
     exactos.
Precision@5.
     Proporción de chunks relevantes dentro de los cinco recuperados. Penaliza ruido en el
     contexto.
Recall@5.
     Proporción de fuentes esperadas que aparecen dentro del top-5. Es central para decidir si el
     sistema tuvo oportunidad de responder correctamente.
MRR.
     Inversa de la posición del primer chunk relevante. Resume cuán arriba aparece la primera
     fuente útil.
Top-1 source accuracy.
     Porcentaje de consultas donde el primer chunk recuperado coincide con una fuente esperada.
Token Overlap y Context Faithfulness.
     Medidas offline de generación: la primera verifica presencia de datos esperados y la segunda
     estima cuánto de la respuesta queda respaldado por el contexto recuperado.

5.3.   Resultados comparativos
   El Cuadro 6 muestra la progresión completa, del baseline a la versión final, sobre los mis-
mos 64 casos y con la misma configuración de retrieval (híbrido, top-5, qwen3.5:latest +
nomic-embed-text-v2-moe). El baseline obligatorio es el sistema RAG “ingenuo”: recuperación
más generación, sin la capa extractiva mejorada.

 Configuración             Casos correctos       Accuracy      Cambio introducido
 MVP (15 casos, humo)                   15/15        100,0 %   —
 Baseline extendido                     35/64       54,7 %     RAG sin extracción mejorada
 Iteración 1                            46/64       71,9 %     Extracción por bloques estructurados
 Iteración 2                            57/64       89,1 %     Ranking por entidad + stopwords
 Sistema final (it. 3)                 64/64      100,0 %      Ajustes de casos restantes

Cuadro 6: Comparación de configuraciones sobre el benchmark extendido de 64 casos (fuente:
docs/benchmark_extendido_strict_*.json). La iteración 1 introdujo 2 regresiones; ambas quedaron
corregidas en la iteración 3 y se incorporaron al análisis de errores.

    La Figura 6 representa la misma progresión en forma visual para mostrar el efecto incremental
de cada iteración sobre la suite de desarrollo.




                                                11
Figura 6: Progresión experimental desde el baseline extendido hasta la suite de desarrollo cerrada. La
mejora mantiene corpus, índice y embeddings; el resultado final no corresponde a una validación held-out.

    El pasaje de 54,7 % a 100 % en esta suite se logró sin cambiar el corpus, el índice, ni el modelo
de embeddings. Por lo tanto, el experimento aísla el efecto de la capa extractiva sobre los errores
conocidos. La última fila debe leerse con dos aclaraciones: primero, el conjunto de evaluación se
usó para diagnosticar y corregir entre iteraciones, por lo que mide cobertura del benchmark de
desarrollo y no generalización; segundo, el criterio por keywords verifica la presencia del dato
exacto, pero no mide fluidez, utilidad percibida ni robustez ante preguntas nuevas. La afirmación
defendible es acotada: con corpus, índice y configuración congelados, la capa extractiva final
cubre todos los casos conocidos y corrige los errores observados en las iteraciones previas. La
generalización requiere un conjunto held-out de preguntas no usadas durante el ajuste.

5.4.   Métricas de retrieval
   Sobre la corrida final se auditaron los 257 chunks recuperados en los 64 casos contra las fuentes
esperadas (Cuadro 7).

                      Métrica (top-5, retrieval híbrido)                    Valor
                      Recall@5 (medio)                                      0,969
                      Precision@5 (media)                                   0,319
                      MRR                                                   0,916
                      Top-1 source accuracy                                 0,875
                      Posición media del primer chunk relevante              1,22
                      Casos con alguna fuente esperada en top-5             63/64
                      Casos con todas las fuentes esperadas en top-5        61/64

Cuadro 7: Auditoría de retrieval sobre la corrida final (docs/auditoria_rag_chunks_clase6.json).

    La combinación Recall@5 alto (0,969) con Precision@5 baja (0,319) es una consecuencia directa
de la decisión de corpus atómico: casi siempre la fuente correcta está entre los 5 recuperados
(y en promedio en la posición 1,22), pero la acompañan vecinos cortos de la misma sección. El
diagnóstico automático de la auditoría clasificó 46 de 64 casos como “revisar chunks extra” y solo
3 como “fuente esperada ausente”, lo que confirma que el ruido — y no la falta de cobertura — es
el costo a vigilar.


                                                   12
5.5.    Métricas de generación
    Con la metodología de la clase 6 se midieron Token Overlap (presencia de las keywords
esperadas en la respuesta) y Context Faithfulness (proporción de la respuesta respaldada por el
contexto recuperado) sobre los 64 casos: Token Overlap medio de 1,0 y Context Faithfulness medio
de 0,895, con 51/64 casos por encima del umbral de 0,8. Los 13 casos restantes quedaron marcados
como “posible alucinación o contexto no trazado”; la inspección mostró que se concentran en
categorías con documentos muy cortos (contacto: 0,267; sitios web: 0,429), donde la respuesta
extractiva agrega texto de encabezado que la métrica no encuentra en el chunk auditado. Es un
límite de la métrica y del trazado, no necesariamente una alucinación: distinguirlos requiere la
revisión manual que se propone como trabajo futuro.

5.6.    Selección del modelo de embeddings
   Se evaluaron los cuatro embeddings disponibles localmente en modo vectorial puro (sin
búsqueda léxica ni generación), para medir el componente semántico aislado sobre los mismos 64
casos (Cuadro 8).

       Embedding                           Precision@5       Recall@5      MRR       Top-1
       embeddinggemma (307M)                        24,4 %      80,5 %   69,5 %     60,9 %
       qwen3-embedding:0.6b (596M)                  24,1 %     81,2 %     67,9 %     57,8 %
       nomic-embed-text-v2-moe (475M)               20,0 %      74,2 %    64,3 %     54,7 %
       nomic-embed-text (137M)                      13,4 %      43,8 %    29,9 %     20,3 %

Cuadro 8: Retrieval vectorial puro por modelo de embeddings, top-5, 64 casos (docs/evaluacion_
embeddings_locales.md).

   La Figura 7 grafica las tres medidas más relevantes de la matriz para comparar rápidamente
cobertura, ordenamiento y acierto top-1 entre modelos.




Figura 7: Comparación visual de Recall@5, MRR y Top-1 en retrieval vectorial puro. La mejora de
embeddinggemma y qwen3-embedding:0.6b queda medida, aunque no se adoptó para la versión final del
pipeline.

    Dos conclusiones salieron de esta matriz. Primero, el embedding inicial (nomic-embed-text)
era el eslabón más débil del sistema: con 43,8 % de Recall@5 vectorial, la cobertura del baseline

                                               13
dependía de la búsqueda léxica. Se migró a nomic-embed-text-v2-moe, que casi duplica el
Recall@5 vectorial. Segundo, embeddinggemma y qwen3-embedding:0.6b son mejores aún en
modo vectorial puro; no se adoptaron en esta versión porque la mejora extractiva ya había llevado
el benchmark a 64/64 con el índice existente. Quedan como candidatos medidos para la próxima
iteración, especialmente si se arma un conjunto nuevo de validación no visto durante el desarrollo.

5.7.   Selección del LLM de chat
    Sobre la matriz manual (21 preguntas × 11 modelos locales, 231 respuestas) se midió un
score sintético de calidad 1–5 por respuesta, separando preguntas factuales, ambiguas y fuera
de dominio, junto con la latencia promedio y el peso local del modelo (Figura 8). Los mejores
fueron qwen3.5:latest (score 4,29; 16/21 respuestas aceptables; 5,18 s; 6,6 GB) y qwen3.5:4b
(4,19; 15/21; 3,84 s; 3,4 GB). Se eligió qwen3.5:4b como modelo de la demo: cede 0,10 de score y
una respuesta aceptable a cambio de 26 % menos latencia y la mitad de memoria, lo que permite
convivir con los embeddings en la misma GPU/CPU. Modelos menores quedaron descartados con
evidencia: gemma3:270m produjo respuestas vacías (8/21) y lfm2.5-thinking:1.2b no emitió
respuesta final utilizable en ningún caso (solo traza de razonamiento). nemotron-3-nano:4b
destacó en rechazar preguntas fuera de dominio (5,0/5) y se anotó como alternativa si se prioriza
ese comportamiento.




Figura 8: Decisión operativa de LLM: porcentaje de respuestas aceptables vs. latencia promedio; el
tamaño de burbuja es el peso local del modelo. qwen3.5:4b es el compromiso elegido para la demo.


5.8.   Métricas operativas
    La Figura 9 resume la diferencia operativa entre rutas: la ruta extractiva es prácticamente
inmediata para preguntas factuales, mientras que la generación local queda reservada para
consultas que necesitan redacción con contexto. Esta comparación explica por qué la arquitectura
prioriza extracción antes de invocar el LLM.




                                                14
Figura 9: Latencia promedio por ruta de respuesta. La ruta extractiva permite resolver consultas factuales
en 0,01 s; la ruta generativa depende del LLM local seleccionado.

       Latencia. La ruta extractiva responde en 0,01 s promedio (benchmark de 64 casos). La
       ruta generativa depende del modelo: 3,84 s promedio con qwen3.5:4b y 5,18 s con qwen3.5:
       latest (matriz manual). En operación, la mayoría de las preguntas factuales del dominio
       resuelven por la ruta extractiva.
       Costo. Nulo por consulta: todos los modelos corren localmente vía Ollama. El costo real
       es fijo (hardware y energía), con requisito de ∼3,4 GB de disco/memoria para el LLM de
       demo más ∼1 GB del embedding.
       Huella del índice. 111 documentos × 768 dimensiones: el índice Chroma es de tama-
       ño despreciable y se reconstruye en segundos, lo que permitió iterar configuraciones de
       embeddings sin fricción.

5.9.    Análisis de errores
    Se documentan cuatro fallas reales observadas durante el desarrollo, con su causa raíz y
corrección. Las dos primeras provienen del baseline extendido; las dos últimas son regresiones
introducidas por la propia mejora, que se consideran igual de informativas.

Caso 1: variante de precio no solicitada. Entrada: “¿Cuál es el precio de la TITA S2
300?” (caso tita_s2_300_precio). Salida errónea: la respuesta del baseline omitía el precio
de la versión base (USD 16.981,25) y priorizaba variantes con furgón y aire acondicionado,
que comparten el documento de precios. Causa raíz: el ranking interno de líneas favorecía las
coincidencias más largas (“TITA S2 300 AA Furgón”) por sobre la versión base pedida. Corrección:
penalización de variantes no solicitadas (furgón, refrigerado, AA) cuando la pregunta pide la
versión base; el caso pasa en la corrida final.

Caso 2: entidad geográfica genérica desplaza a la específica. Entrada: “¿Qué agencia hay
en Moreno?” (caso agencia_buenos_aires_moreno). Salida errónea: respondía con menciones
genéricas de “Buenos Aires” sin la agencia CHIAMO MOTORS ni su dirección (Acceso Oeste Sur
12.802). Causa raíz: el documento de agencias de Buenos Aires es el segundo más largo del corpus
(388 tokens) y la búsqueda léxica puntuaba “Buenos Aires” por encima de la localidad consultada;
además, las stopwords interrogativas (“qué”, “cuál”) subían FAQs genéricas. Corrección: mayor
prioridad a coincidencias de ciudad/localidad específica, reconstrucción de ítems de lista (nombre



                                                   15
+ ciudad + dirección) y remoción de stopwords interrogativas en la búsqueda léxica. Las cinco
agencias del benchmark pasan en la corrida final.

Caso 3 (regresión): pérdida de la capacidad de carga. Entrada: “¿Qué capacidad de
carga y de pasajeros tiene la TITA S2-300?” (caso tita_s2_capacidad). Salida errónea: tras la
iteración 1 de la mejora, la respuesta dejó de incluir “500 kg”, que el baseline sí devolvía. Causa
raíz: el nuevo presupuesto de líneas por tipo de pregunta recortó la línea de capacidad de caja al
priorizar el bloque de pasajeros. Corrección: ajuste del presupuesto dinámico y de los términos
de foco de capacidad en la iteración 3; se verificó la ausencia de regresiones contra el baseline
completo antes de congelar la versión.

Caso 4 (cobertura de retrieval): fuentes institucionales ausentes. Entrada: “¿Qué
plantas de fabricación tiene CORADIR?” (caso empresa_plantas_fabricacion, una de las 5
fallas de retrieval del baseline). Salida errónea: no aparecían Planta San Luis ni Planta Buenos
Aires; la fuente esperada no estaba en el top-5. Causa raíz: los documentos institucionales son
muy cortos y léxicamente alejados de la formulación de la pregunta (“plantas” vs. “fabricación”), y
el embedding inicial los rankeaba mal. Corrección: reconstrucción de ítems de plantas (nombre +
ubicación + capacidad) en la capa extractiva; en la auditoría final quedan 3 casos de la categoría
empresa marcados con fuente esperada fuera del top-5 vectorial que resuelven por la vía léxica —
se deja anotado como el punto más frágil del retrieval actual.


6.      Conclusiones
6.1.     Logros
    El objetivo inicial era convertir una base administrativa de CORADIR en un sistema de
consulta en lenguaje natural que pudiera responder con datos exactos, mostrar de dónde sale
cada respuesta y medirse contra una línea de base. Ese objetivo se alcanzó para el corpus y
el benchmark de desarrollo: el sistema final respondió correctamente los 64 casos del conjunto
extendido, frente a 35/64 del baseline inicial (54,7 %). La mejora no surgió de cambiar el LLM ni
de aumentar tamaño de modelo, sino de corregir la capa de selección de evidencia.
    El logro técnico más importante fue separar recuperación y respuesta final. La auditoría
mostró Recall@5 de 0,969, MRR de 0,916 y Top-1 de 0,875: en la mayoría de los errores, el
documento correcto ya estaba recuperado, pero el sistema no elegía la línea adecuada dentro de
ese documento. Ese diagnóstico evitó una decisión más costosa y menos precisa, como reemplazar
primero el embedding o agregar reranking, y orientó el esfuerzo hacia la extracción literal de
datos.
    También quedó resuelta la trazabilidad: cada documento indexado conserva un source_path
que apunta al campo del JSON original, y cada caso de evaluación tiene fuentes esperadas contra
las que se audita el retrieval. En un dominio comercial con precios, direcciones y especificaciones,
esa trazabilidad es tan importante como la respuesta visible, porque permite verificar si el sistema
respondió desde una fuente válida.
    En términos operativos, la ruta extractiva responde en 0,01 s promedio y la ruta generativa
local promedia 3,84 s con qwen3.5:4b. El costo marginal por consulta es nulo porque se usan
Ollama, Chroma y SQLite en hardware local. La selección del LLM y de embeddings quedó
documentada con matrices comparativas: se evaluaron 11 modelos de chat y 4 embeddings sobre
casos reproducibles.

6.2.     Limitaciones
     1. Riesgo de sobreajuste al benchmark. Los 64 casos se usaron para diagnosticar y
        corregir entre iteraciones. El 100 % final mide cobertura de ese conjunto; la exactitud ante

                                                 16
     consultas reales nuevas no está medida. Es la limitación más importante del trabajo.
  2. Precision@5 baja (0,319). El corpus atómico mete vecinos irrelevantes en el top-5. Hoy lo
     absorbe la capa extractiva, pero cualquier cambio hacia respuestas más generativas heredará
     ese ruido de contexto.
  3. Reglas extractivas específicas del dominio. Los términos de foco y presupuestos de
     líneas están calibrados para este corpus; no se transfieren automáticamente a otro dominio
     y agregan costo de mantenimiento cuando cambie la estructura del JSON.
  4. Preguntas múltiples sin descomposición explícita. El sistema puede responder
     consultas con más de una intención cuando ambas caen cerca en el ranking, pero no divide
     formalmente la pregunta en subconsultas auditables.
  5. Variantes de formulación sin templetización de intención. La capa extractiva
     reconoce varios términos de foco, aunque todavía no existe un catálogo declarativo de
     plantillas que conecte intención, entidad y campos esperados.
  6. Faithfulness medida offline y con proxy léxico. Los 13 casos bajo el umbral de 0,8
     requieren revisión manual para separar alucinación real de límite de la métrica; tampoco
     hay medición de faithfulness por consulta en producción.
  7. Corpus chico y de dominio cerrado. 111 documentos y 4 907 tokens: las conclusiones
     sobre chunking y retrieval híbrido no son extrapolables a corpus grandes sin reevaluar (en
     particular, el índice léxico en memoria no escala como está).
  8. Datos con vencimiento. Precios y disponibilidad cambian; el sistema no detecta obsoles-
     cencia de su propia base.

6.3.    Aprendizajes del proyecto
       Separar la evaluación de retrieval de la de respuesta final fue la decisión metodológica más
       rentable: sin expected_sources por caso, la conclusión “hay que cambiar el embedding”
       hubiera parecido razonable y hubiera sido incorrecta.
       Documentar las regresiones intermedias (los dos casos que la iteración 1 rompió) obligó a
       verificar contra el baseline completo antes de congelar cada cambio; esa disciplina evitó
       optimizar un subconjunto a costa del resto.
       En modelos pequeños servidos por Ollama, los detalles de integración importan tanto
       como el modelo: la separación de la traza de razonamiento (think:false) cambió modelos
       “inutilizables” a utilizables en la matriz de evaluación.
       Qué haría distinto: congelar un conjunto de evaluación no visto desde el día uno, antes de
       iterar reglas extractivas, para poder reportar generalización además de cobertura.

6.4.    Trabajo futuro
    Derivado directamente de las limitaciones: (i) corto plazo: construir un conjunto de validación
nuevo con consultas reales anonimizadas del chat y medir el sistema congelado contra él; reevaluar
embeddinggemma/qwen3-embedding:0.6b con el pipeline completo; revisar manualmente los 13
casos de faithfulness baja. (ii) Mediano plazo: métricas de faithfulness por consulta en producción
con muestreo; proceso de actualización del JSON fuente con reindexado automático y verificación
de vigencia de precios; generalizar la capa extractiva a configuración declarativa por dominio. En
esa línea, una mejora concreta es construir un templetizador de intención: un archivo de reglas
revisable que relacione formas de pregunta, entidades del dominio, campos esperados y criterios
de extracción. Eso permitiría mover parte de la lógica hoy escrita en código a una configuración
más fácil de auditar y mantener. Para transformarlo en MVP operativo, el siguiente paso no es
agregar más texto al prompt sino cerrar un circuito de operación: captura de consultas reales,
revisión humana de una muestra, actualización controlada de la base de conocimiento y monitoreo
de errores por categoría.



                                                17
6.5.   Consideraciones éticas
    El corpus contiene únicamente información comercial pública de la empresa (no hay datos
personales de clientes en la base de conocimiento). El canal de chat sí captura voluntariamente
emails y teléfonos para derivación comercial: se aplican rate limiting por IP y validación, y
esos datos quedan en la base local de sesiones, no en el corpus indexado. Las respuestas sobre
precios y condiciones incluyen el riesgo de desactualización señalado en las limitaciones: el sistema
es un canal informativo y no constituye una cotización ni asesoramiento comercial vinculante.
La confirmación de precios, financiación, disponibilidad y condiciones finales corresponde a las
agencias oficiales o a un representante humano autorizado.


7.     Referencias

[1] P. Lewis et al., “Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks”,
    Advances in Neural Information Processing Systems 33 (NeurIPS), 2020.

[2] M. A. Covington y J. D. McFall, “Cutting the Gordian Knot: The Moving-Average Type–Token
    Ratio (MATTR)”, Journal of Quantitative Linguistics, 17(2), 2010.

[3] C. D. Manning, P. Raghavan y H. Schütze, Introduction to Information Retrieval, Cambridge
    University Press, 2008.

[4] Z. Nussbaum et al., “Nomic Embed: Training a Reproducible Long Context Text Embedder”,
    Nomic AI, 2024. https://www.nomic.ai/blog/posts/nomic-embed-text-v1

[5] Qwen Team, “Qwen Technical Reports”, Alibaba Cloud. https://qwenlm.github.io/

[6] Chroma, “Chroma Documentation”. https://docs.trychroma.com/

[7] Ollama, “Ollama Documentation”. https://docs.ollama.com/

[8] S. Ramírez, “FastAPI Documentation”. https://fastapi.tiangolo.com/

[9] LangChain, “LangChain Python Documentation”. https://python.langchain.com/

[10] C. Salinas, Materiales del Taller de Proyecto Final (clases 4, 6 y 7), Diplomatura en Inteligencia
    Artificial, UBA–FIUBA, 2026.


Anexos

A.     Configuración del sistema
    Variables de entorno principales (.env); los valores por defecto permiten reproducir la demo
sin servicios externos:

LLM_PROVIDER=ollama
CHAT_MODEL_NAME=qwen3.5:4b
EMBEDDING_PROVIDER=ollama
EMBEDDING_MODEL_NAME=nomic-embed-text-v2-moe:latest
PROMPT_VARIANT=strict
DATABASE_URL=sqlite:///./chatbot_movilidad.db
RAG_DATASET_PATH=dataset/knowledge_base_movilidad.jsonl
RAW_DATASET_PATH=dataset/dataset_movilidad.json
VECTORSTORE_BASE_DIR=chroma_db

                                                  18
OLLAMA_BASE_URL=http://localhost:11434
N8N_WEBHOOK_URL=            # opcional


B.      Comandos de reproducción
# Instalación
pip install -r requirements.txt
Copy-Item .env.example .env
ollama pull qwen3.5:4b
ollama pull nomic-embed-text-v2-moe

# Preprocesamiento (JSON -> JSONL de 111 documentos)
python scripts/prepare_dataset.py

# Servidor + demo
python run.py --host 0.0.0.0 --port 8851
# o bien:
powershell -ExecutionPolicy Bypass -File scripts/start_presentation_demo.ps1

# Benchmark extendido (genera el JSON de resultados)
py scripts/run_benchmark.py --cases dataset/evaluacion_rag_extendida.json
   --prompt-variant strict --llm-provider ollama
   --chat-model qwen3.5:latest --embedding-provider ollama
   --embedding-model nomic-embed-text-v2-moe:latest
   --output docs/benchmark_extendido_strict_post_extraccion_v3.json

# Auditoria de chunks recuperados
py scripts/generate_rag_chunk_audit.py

# Matriz de embeddings (retrieval vectorial puro)
py -3 scripts/run_embedding_efficiency_matrix.py
   --cases dataset/evaluacion_rag_extendida.json --continue-on-error

# Matriz manual de modelos de chat
py scripts/run_manual_model_evaluation.py --models all
   --timeout 120 --num-predict 280


C.      Ejemplos de consulta con trazabilidad
     Casos reales del benchmark final (respuestas literales del sistema):

Consulta factual de especificación. Pregunta: “¿Cuánta autonomía tiene el TITO S5 y
cómo se carga?” Respuesta: “carga: Enchufe 220V 50hz - Ficha 2073 / tiempo carga: 8 horas
/ Admite recarga parciales / autonomía: 300 Km”. Fuente top-1: vehiculos_detalles.TITO.
modelos_disponibles[1] (ruta léxica; latencia 0,01 s).

Consulta de precio compuesto. Pregunta: “¿Cuánto cuesta la TITA S2 300 AA con
furgón refrigerado?” Respuesta: “El precio 23.632,00 se obtiene de sumar a 17.731,25 USD
(precio de TITA S2 300 AA) el accesorio furgón refrigerado que cuesta 5.900 USD”. Fuentes:
Precios_Vehiculos_Actualizados.TITAS2 y documento de accesorios de la misma sección.


                                                 19
Consulta fuera de dominio (guardrail). Las preguntas sin match de dominio pasan al
clasificador off-topic; tras varios intentos consecutivos fuera de tema el sistema avisa y cierra la
sesión (“SESSION_TERMINATE”), comportamiento verificado en la matriz manual con las 7
preguntas no respondibles por modelo.




                                                20

