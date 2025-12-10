# Plan de Accion SEO para Coradir Homes

## 1. Fundamentos Tecnicos
- [x] Configurar `metadata` granular por pagina (titulo unico, descripcion 150-160 caracteres, `alternates.canonical`).
- [x] Incorporar `robots.txt`, `sitemap.xml` y RSS usando `next-sitemap`; publicar en `public/` y registrar en Search Console.
- [x] Implementar structured data (`Organization`, `WebSite`, `RealEstateProject`, `FAQPage`) via `Script` `application/ld+json` en `src/app/layout.tsx`.
- [x] Activar `generateStaticParams`/ISR en paginas de proyectos para mejorar FCP y control de cache.
- [x] Ajustar `next.config.ts` con cabeceras `Cache-Control` para HTML, imagenes y fuentes; habilitar compresion Brotli/Gzip.
- [x] Anadir `robots` meta con `max-image-preview:large`, `max-snippet:0` cuando sea relevante.
- [x] Validar accesibilidad basica: contrastes, `lang="es"`, etiquetado ARIA coherente.

## 2. Arquitectura de Contenidos
- [x] Redefinir jerarquia de encabezados: 1 `h1` por pagina, `h2`/`h3` tematicos, sin saltos `br`.
- [x] Reescribir copys con keywords objetivos (ej. "departamentos en San Luis", "proyectos inmobiliarios sustentables") y corregir caracteres truncados.
- [x] Crear landing pillar "Proyectos de inversion" con enlaces a cada vertical; revisar menus para eliminar `href="#"`.
- [x] Disenar plan de contenidos evergreen (blog/noticias) en `/saber-mas/[interes]` con clusters tematicos y CTA a formularios.
- [x] Incorporar modulo de testimonios y metricas (KPIs + logos) antes del footer con marcado `Review` o `AggregateRating`.
- [x] Anadir seccion FAQ en paginas principales con preguntas orientadas a busqueda long-tail.

## 3. Medios, Diseno y UX
- [x] Optimizar imagenes: exportar variantes <=1200 px, aplicar `sizes`, `blurDataURL`, y overlays para contraste.
- [x] **Convertir TODAS las imágenes a WebP**. **Ver: [docs/optimizacion-imagenes-webp.md](docs/optimizacion-imagenes-webp.md)**
  - ✅ **31 imágenes convertidas** (PNG/JPG → WebP)
  - ✅ **90.7% de reducción** (32.21 MB → 2.98 MB)
  - ✅ **14 archivos actualizados** con nuevas referencias
  - ✅ **Chatbot: 1.3MB → 38KB** (97% reducción)
  - ✅ **Terrenos hero: 13.2MB → 958KB** (92.8% reducción)
- [x] Migrar tipografias a `next/font` para cargar subsets y `font-display: swap`.
- [x] Estandarizar iconografia en SVG accesible (`title`, `desc`); revisar consistencia cromatica. (No se encontraron SVGs inline que requieran estandarización)
- [x] Reducir CLS en `SectionProjectsDone` fijando alturas minimas calculadas dinamicamente segun viewport.
- [ ] Evaluar modo oscuro solo si suma diferenciacion; en caso positivo, definir tokens de color SEO-friendly.

## 4. Rendimiento y Core Web Vitals
- [x] Medir baseline con Lighthouse movil; documentar resultados. **Ver: [docs/lighthouse-baseline.md](docs/lighthouse-baseline.md)**
- [x] **Implementar optimizaciones completas + WebP**. **Ver: [docs/lighthouse-resultado-final-webp.md](docs/lighthouse-resultado-final-webp.md)**
- [x] **Build de producción completado y validado** ✅
  - **Performance Score: 71 → 99/100** 🎉🔥 **(+28 puntos / +39% mejora)**
  - ✅ **Speed Index: 42.1s → 0.3s (-99.3%)** 🔥 - Mejora DRAMÁTICA
  - ✅ **LCP: 5.1s → 1.0s (-80.4%)** 🔥 - Ahora cumple objetivo <2.5s
  - ✅ **TTI: 6.9s → 0.3s (-95.7%)** 🔥 - Ahora cumple objetivo <3.8s
  - ✅ **TBT: 50ms → 0ms (-100%)** 🔥 - PERFECTO
  - ✅ **CLS: 0** (perfecto - se mantiene)
  - ✅ **FCP: 0.3s** (excelente - muy por debajo del objetivo <1.8s)
- [x] Lazy-load secciones pesadas (`SectionProjectsDone`) con `dynamic()` y placeholders con SSR habilitado.
- [x] Script de bot externo optimizado con strategy `lazyOnload` para cargar despues de interaccion.
- [x] Imagenes del hero optimizadas (125KB y 151KB WebP) con `priority` y `fetchPriority="high"`.
- [x] Eliminado Framer Motion del componente Bot, reemplazado por CSS animations puras.
- [x] Eliminado Framer Motion del Counter, reemplazado por IntersectionObserver + requestAnimationFrame.
- [x] Optimizado carga de fuentes: weights especificos, preload, adjustFontFallback.
- [x] Agregado preconnect/dns-prefetch para Google Tag Manager y Analytics.
- [x] Eliminadas fuentes locales innecesarias (Playfair Display y Raleway estáticas) - usando Next.js Google Fonts.
- [x] Optimizado next.config.ts con security headers y optimizePackageImports.
- [x] Fix TypeScript errors para Next.js 15 (async params en rutas dinámicas).

### 🎯 Próximas optimizaciones (opcionales - ya estamos en 99/100):
- [ ] Implementar CDN para imágenes (Cloudinary/Vercel Image) para mejorar aún más LCP en producción
- [ ] Evaluación de Server Components más agresiva para reducir JavaScript del cliente
- [ ] Implementar Image Placeholders (blurDataURL) para mejorar percepción de carga

## 5. Analitica y Medicion
- [ ] Separar contenedores de Google Tag Manager (produccion / testing) y documentar eventos clave.
- [ ] Configurar Google Analytics 4 con conversiones (envio de formulario, clic CTA, scroll 75%).
- [ ] Anadir `consent mode` y banner CMP si se opera en regiones con normativa.
- [ ] Integrar Search Console, Bing Webmaster Tools y LinkedIn Insight Tag; confirmar verificacion de dominio.
- [ ] Disenar tablero Looker Studio con KPIs SEO (impresiones, CTR, ranking medios) y CRO (ratio de conversion).

## 6. Off-Page y Autoridad
- [ ] Identificar partners locales (camaras, universidades, medios) para obtener enlaces tematicos.
- [ ] Publicar casos de exito descargables y notas de prensa linkeadas a paginas destino.
- [ ] Fomentar citaciones NAP consistentes en directorios confiables; asegurar datos en Google Business Profile.

### Plan 4 semanas (implantacion rapida)
- **Semana 1 - Prospeccion y activos**
  - Armar lista de 40-60 dominios locales/afines (camaras, colegios profesionales, universidades, medios, blogs de arquitectura/deco, portales inmobiliarios serios). Campos: dominio, URL contacto, contacto, DA/visitas, tematica, estado.
  - Preparar 2 activos linkables: (1) caso de exito PDF con KPI/ROI y CTA a landing; (2) guia evergreen "Como invertir en desarrollos en San Luis 2025".
  - Auditar NAP (nombre/telefono/direccion/horario) en sitio, GBP y redes; definir version canonica.
- **Semana 2 - Outreach inicial + GBP**
  - Enviar 6-10 emails personalizados con datos exclusivos; 1 follow-up a los 3-4 dias.
  - Publicar nota de prensa en tu sala de prensa y compartir a 10-15 medios locales/regionales.
  - Completar/optimizar GBP: categorias, fotos WebP, descripcion con keywords suaves; 2-3 posts con UTM y solicitar 3-5 reseñas.
- **Semana 3 - Alianzas y directorios**
  - Reuniones con camaras/universidades para webinar/charla; pedir enlace desde agenda/noticia al recurso evergreen.
  - Alta/actualizacion en 5-8 directorios confiables con NAP consistente; agregar UTM en enlaces de perfil si permite.
  - Segundo set de 6-10 emails + follow-up del lote anterior.
- **Semana 4 - Cierre y control**
  - Reenviar follow-up final a pendientes; ofrecer dato nuevo (ej. avance de obra, KPI de sustentabilidad).
  - Registrar enlaces conseguidos y anclas; evaluar diversidad (marca, parcial, URL).
  - Revisar Search Console: enlaces nuevos, impresiones y CTR de URLs enlazadas; ajustar mensajes segun top queries.

### Plantillas de outreach (personalizar)
- **Prensa/medios**
  - Asunto: Dato exclusivo sobre desarrollos sustentables en San Luis
  - Cuerpo: Hola {nombre}, soy {tu nombre} de Coradir Homes. Estamos publicando datos sobre {dato concreto, ej. ROI o avance de obra} y preparamos una nota + recursos (fotos WebP y cifras verificables). Te dejo el sumario y link a la guia/caso: {URL con UTM}. Si te sirve, te comparto cifras en bruto o vocero para entrevista breve.
- **Camaras / universidades / colegios**
  - Asunto: Charla + datos para socios sobre vivienda/inversion en San Luis
  - Cuerpo: Hola {nombre}, proponemos una charla de 20-30 min para sus socios/estudiantes sobre {tema}. Incluimos un recurso descargable y beneficios para su audiencia. Podemos agendar la proxima semana; aqui el material base: {URL}. Si les interesa, agregamos su logo y les compartimos fotos para su agenda/noticia con enlace al recurso.
- **Blogs/portales afines**
  - Asunto: Guia con datos accionables para {audiencia} en San Luis
  - Cuerpo: Hola {nombre}, vimos su cobertura sobre {articulo}. Preparamos una guia con datos locales (costos de construccion, tiempos de obra, tendencias) y seria un buen complemento para su nota. Link con UTM: {URL}. Puedo adaptar 2-3 parrafos para su audiencia y compartir fotos WebP optimizadas.

### Buenas practicas de anclas y destinos
- Usar mezcla: marca + ubicacion ("Coradir Homes en San Luis"), parciales ("proyectos inmobiliarios en San Luis"), y naked URLs. Evitar exact-match repetitivo.
- Apuntar cada enlace a la URL mas relevante (landing de proyecto, guia evergreen o caso de exito), no siempre a home. Incluir UTM en enlaces de prensa para medir.

### Seguimiento semanal (sheet simple)
- Columnas sugeridas: fecha, dominio origen, URL origen, anchor, URL destino, tipo (dofollow/nofollow), tematica, pais, estado (enviado/aceptado/online), notas.
- KPIs a monitorear: nuevos dominios referidos, trafico org/ref a URLs enlazadas, posiciones para keywords locales, reseñas y vistas en GBP, CTR de URLs enlazadas en Search Console.

### Riesgos a evitar
- No usar directorios masivos ni granjas; evitar posts pagados sin disclosure. Mezclar dofollow/nofollow natural.
- Disavow solo si hay volumen alto de enlaces toxicos; antes, bloquear origenes obvios en Search Console si es necesario.

## 7. Roadmap y Control
- [ ] Establecer backlog priorizado (tecnico, contenido, UX) con responsables y plazos.
- [ ] Iterar en sprints: post-implementacion medir CWV, rankings y conversiones; ajustar estrategia.
- [ ] Documentar aprendizaje en wiki interna y checklist de QA SEO previo a cada release.
