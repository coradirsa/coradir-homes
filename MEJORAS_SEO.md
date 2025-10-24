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
  - **Performance Score: 71 → 82/100** 🎉 **(+11 puntos / +15% mejora)**
  - ✅ **Speed Index: 42.1s → 1.1s (-97.5%)** 🔥 - Mejora DRAMÁTICA con WebP
  - ✅ **TBT: 50ms → 32ms (-37%)** - Eliminado Framer Motion
  - ✅ **CLS: 0** (perfecto - se mantiene)
  - ✅ **FCP: 1.0s** (cumple objetivo <1.8s)
  - ⚠️ **LCP: 5.1s → 5.0s** (-1.1%) - Requiere CDN
  - ⚠️ **TTI: 6.9s → 6.5s** (-5.5%) - Requiere code splitting
- [x] Lazy-load secciones pesadas (`SectionProjectsDone`, `TestimonialsSection`) con `dynamic()` y placeholders con SSR habilitado.
- [x] Script de bot externo optimizado con strategy `lazyOnload` para cargar despues de interaccion.
- [x] Imagenes del hero optimizadas (125KB y 151KB WebP) con `priority` y `fetchPriority="high"`.
- [x] Eliminado Framer Motion del componente Bot, reemplazado por CSS animations puras.
- [x] Eliminado Framer Motion del Counter, reemplazado por IntersectionObserver + requestAnimationFrame.
- [x] Optimizado carga de fuentes: weights especificos, preload, adjustFontFallback.
- [x] Agregado preconnect/dns-prefetch para Google Tag Manager y Analytics.
- [ ] **PRÓXIMO**: Build de producción para validar mejoras reales (estimado: 85-90/100)
- [ ] Implementar CDN para imágenes (reducir LCP <2.5s)
- [ ] Code splitting agresivo (reducir TTI <3.8s)
- [ ] Skeleton screens para componentes dinámicos (mejorar Speed Index <3.4s)

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

## 7. Roadmap y Control
- [ ] Establecer backlog priorizado (tecnico, contenido, UX) con responsables y plazos.
- [ ] Iterar en sprints: post-implementacion medir CWV, rankings y conversiones; ajustar estrategia.
- [ ] Documentar aprendizaje en wiki interna y checklist de QA SEO previo a cada release.

