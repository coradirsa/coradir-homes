# Plan de Implementación: CMS Visual para Coradir Homes

**Fecha de Creación:** 2025-12-17
**Última Actualización:** 2025-12-17
**Proyecto:** Sistema de Gestión de Contenido Visual con SEO Automático
**Entorno de Desarrollo:** Rama `dev`
**Objetivo:** Permitir a diseñadores crear/modificar páginas sin código manteniendo seguridad y SEO

## ✅ Estado: FASE 1 Completada (100%)
**Última FASE Completada:** FASE 1 - CMS Backend Core
**Últimas Implementaciones:**
- Colección Pages con versionado y gestión de menú
- Colección Media con optimización de imágenes
- 5 Bloques básicos (Hero, Features, ContactForm, CTA, RichText)
- Admin panel configurado con Live Preview
**Próximo Paso:** FASE 2 - Frontend Integration & Components

---

## 📋 Índice

1. [Visión General](#visión-general)
2. [Análisis de Arquitectura Actual](#análisis-de-arquitectura-actual)
3. [Requisitos Funcionales](#requisitos-funcionales)
4. [Stack Tecnológico Propuesto](#stack-tecnológico-propuesto)
5. [Plan de Implementación por Fases](#plan-de-implementación-por-fases)
6. [Consideraciones de Seguridad](#consideraciones-de-seguridad)
7. [Roadmap y Cronograma](#roadmap-y-cronograma)

---

## 🎯 Visión General

### Problema Actual
- Los diseñadores necesitan conocimientos de React/Next.js para crear/modificar páginas
- Cada cambio requiere desarrollo, commit, build y deploy
- No hay validación automática de SEO antes del deploy
- Proceso lento: cambio simple puede tomar horas

### Solución Propuesta
Sistema CMS headless con:
- ✅ Editor visual drag-and-drop (estilo WordPress/Webflow)
- ✅ Análisis SEO automático en tiempo real
- ✅ Preview en vivo antes de publicar
- ✅ Mantiene toda la seguridad actual (CSP, Docker, etc.)
- ✅ Compatible con Next.js 15 App Router
- ✅ Versionado de contenido y rollback

---

## 🏗️ Análisis de Arquitectura Actual

### Stack Tecnológico Existente
```
Frontend:      Next.js 15.3.8 (App Router)
UI:            Tailwind CSS 4.1.11
Forms:         React Hook Form + Zod
Analytics:     Google Tag Manager + GA4
Seguridad:     CSP estricta, reCAPTCHA Enterprise
Deploy:        Docker + Portainer
Integración:   N8N webhooks, Chatbot
```

### Estructura de Páginas Actual
```
src/app/
├── page.tsx                    # Homepage
├── juana-64/page.tsx          # Proyecto específico
├── la-torre-ii/page.tsx       # Proyecto específico
├── complejo-coradir/page.tsx  # Temporalmente deshabilitado
├── inversiones-inteligentes/
├── corporativos/
├── instituciones/
└── saber-mas/[interes]/       # Páginas dinámicas
```

### Sistema SEO Actual
```typescript
src/lib/seo/
├── metadata.ts         # Generación de metadata
├── structuredData.ts   # Schema.org JSON-LD
├── baseEntries.json    # Configuración SEO base
└── siteConfig.ts       # Config del sitio
```

**✅ Punto Fuerte:** Sistema SEO bien estructurado y centralizado

---

## 📝 Requisitos Funcionales

### RF-001: Editor Visual
- [ ] Drag-and-drop de componentes predefinidos
- [ ] Preview en tiempo real
- [ ] Edición inline de textos e imágenes
- [ ] Sistema de bloques/secciones reutilizables
- [ ] Responsive preview (desktop/tablet/mobile)

### RF-002: Gestión de Contenido
- [ ] CRUD completo de páginas
- [ ] **Sistema de borradores y publicación** (draft/published)
  - [ ] Crear páginas en modo borrador sin afectar producción
  - [ ] Vista previa de borradores antes de publicar
  - [ ] Comparación lado a lado: versión publicada vs borrador
  - [ ] Publicación con un solo clic cuando esté listo
- [ ] Versionado de contenido automático
- [ ] Rollback a versiones anteriores
- [ ] Duplicación de páginas

### RF-003: SEO Automático
- [ ] Análisis automático de:
  - Meta title y description (longitud óptima)
  - Headings structure (H1, H2, H3)
  - Alt text en imágenes
  - URLs amigables
  - Open Graph tags
  - Schema.org JSON-LD
- [ ] Score SEO con sugerencias
- [ ] Prevención de publicación con errores críticos

### RF-004: Componentes Predefinidos
- [ ] Hero sections (con variantes)
- [ ] Formularios de contacto
- [ ] Galerías de imágenes
- [ ] Carruseles
- [ ] CTAs (Call-to-Action)
- [ ] Secciones de features/beneficios
- [ ] Testimonios
- [ ] FAQs
- [ ] Mapas de ubicación

### RF-005: Control de Acceso y Auditoría
- [ ] Autenticación (usuarios del equipo)
- [ ] Roles: Admin, Editor, Viewer
- [ ] **Audit Logs completo (quién modificó qué y cuándo)**
  - [ ] Registro automático de todas las acciones (crear, editar, eliminar, publicar)
  - [ ] Detalle de cambios: qué campos cambiaron exactamente
  - [ ] Información del usuario: nombre, email, IP address
  - [ ] Timestamp preciso de cada acción
  - [ ] Filtros por usuario, fecha, tipo de acción
  - [ ] Comparación visual de versiones (antes/después)
  - [ ] Solo lectura (logs no se pueden modificar, solo admin puede borrar)

---

## 🛠️ Stack Tecnológico Propuesto

### Opción A: **Payload CMS** (Recomendada) ⭐

**Ventajas:**
- ✅ Headless CMS open-source built con Next.js
- ✅ TypeScript nativo (como tu proyecto)
- ✅ Admin UI moderna y customizable
- ✅ Sistema de bloques visual (Block Editor)
- ✅ Integración nativa con Next.js 15
- ✅ Control total sobre datos (MongoDB/PostgreSQL)
- ✅ API REST y GraphQL automáticas
- ✅ Versionado y drafts incluidos
- ✅ Control de acceso granular

**Desventajas:**
- ⚠️ Requiere base de datos (MongoDB recomendado)
- ⚠️ Curva de aprendizaje media

**Stack Completo:**
```
CMS:           Payload CMS 3.x
Database:      MongoDB (Docker container)
Editor:        Lexical (rich text editor)
Media:         Payload Cloud Storage / S3
Preview:       Next.js Draft Mode
```

### Opción B: **Builder.io**

**Ventajas:**
- ✅ Editor visual drag-and-drop muy potente
- ✅ Sin base de datos (SaaS)
- ✅ Preview en tiempo real
- ✅ A/B testing incluido
- ✅ SEO tools integrados

**Desventajas:**
- ⚠️ Servicio pago (free tier limitado)
- ⚠️ Datos en cloud de terceros
- ⚠️ Menos control sobre la arquitectura

### Opción C: **Sanity.io**

**Ventajas:**
- ✅ Studio muy potente y customizable
- ✅ Portable Text (contenido estructurado)
- ✅ Real-time collaboration
- ✅ CDN global

**Desventajas:**
- ⚠️ Servicio pago
- ⚠️ Curva de aprendizaje alta

---

## 🚀 Plan de Implementación por Fases

### **FASE 0: Preparación y Análisis** (1 semana)
**Rama:** `dev`

#### Tareas:
- [x] Auditoría completa de componentes actuales
- [x] Mapeo de páginas existentes a estructura CMS
- [x] Definición de componentes reutilizables
- [x] Setup MongoDB en Docker (local)
- [x] Instalación de Payload CMS
- [x] Configuración de TypeScript types compartidos

#### Detalle de Tareas Completadas (FASE 0 - 100%):
1. ✅ **Auditoría de Componentes Existentes**
   - Analizado 62 componentes totales
   - Identificado 35 componentes convertibles a bloques CMS
   - Creado `docs/cms/COMPONENT_AUDIT.md` con esquemas detallados
   - Priorizados 15 bloques esenciales en 3 fases

2. ✅ **Setup de MongoDB en Docker**
   - Agregado servicio MongoDB 7-jammy a `docker-compose.yml`
   - Configuración de seguridad hardened:
     - Usuario non-root (999:999)
     - Límites de recursos (1 CPU, 1GB RAM)
     - Capabilities eliminadas (cap_drop: ALL)
     - Security options (no-new-privileges)
   - Healthcheck configurado con mongosh
   - Volúmenes persistentes para data y config
   - Red interna `coradir_internal`

3. ✅ **Instalación y Configuración de Payload CMS**
   - Instalado Payload CMS 3.68.5 + dependencias:
     - `@payloadcms/db-mongodb`
     - `@payloadcms/richtext-lexical`
     - `@payloadcms/next`
     - `sharp` para optimización de imágenes
   - Downgrade de Next.js 16.0.10 → 15.4.10 (requerimiento de compatibilidad)
   - Creado `payload.config.ts` con configuración base
   - Creado collection Users para autenticación
   - Variables de entorno configuradas en `.env.example`

4. ✅ **Generación de Secrets y Configuración Local**
   - Generado `MONGO_PASSWORD` con openssl (base64 32 chars)
   - Generado `PAYLOAD_SECRET` con openssl (base64 32 chars)
   - Creado archivo `.env` local con todas las variables
   - Documentado DATABASE_URI para ambos casos (local/Docker)

5. ✅ **Testing de Deploy**
   - Build de imagen Docker exitosa
   - Ambos contenedores corriendo y healthy:
     - `mongodb_coradir_cms` en puerto 27017
     - `web_coradir_homes` en puerto 6118
   - Healthchecks pasando correctamente
   - Next.js 15.4.10 corriendo en modo production
   - Sitemap generado correctamente (24 rutas)

#### Entregables:
- ✅ Documento de componentes reutilizables (`docs/cms/COMPONENT_AUDIT.md`)
- ✅ MongoDB corriendo en Docker con seguridad hardened
- ✅ Payload CMS 3.68.5 instalado y configurado
- ✅ Build de producción exitosa
- ✅ Deploy local funcionando correctamente

---

### **FASE 1: CMS Backend Core** (2 semanas)
**Rama:** `dev`

#### Tareas:
##### 1.1 Setup Inicial
```bash
npm install payload @payloadcms/db-mongodb @payloadcms/richtext-lexical
```

##### 1.2 Configuración de Colecciones
```typescript
// payload.config.ts
collections: [
  {
    slug: 'pages',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
      preview: (doc) => {
        // Vista previa de borradores antes de publicar
        return `${process.env.NEXT_PUBLIC_SITE_URL}/api/preview?slug=${doc.slug}&secret=${process.env.PREVIEW_SECRET}`
      }
    },
    versions: {
      drafts: true,  // ✅ Activa sistema de borradores
      maxPerDoc: 50   // Guarda hasta 50 versiones
    },
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'slug', type: 'text', unique: true },
      {
        name: '_status',
        type: 'select',
        options: [
          { label: 'Borrador', value: 'draft' },      // ✅ No visible en web
          { label: 'Publicado', value: 'published' }   // ✅ Visible en web
        ],
        defaultValue: 'draft',  // Por defecto se crea como borrador
        admin: {
          position: 'sidebar',
          description: 'Los borradores solo son visibles en vista previa, no en producción'
        }
      },
      {
        name: 'content',
        type: 'blocks',
        blocks: [
          HeroBlock,
          FeaturesBlock,
          ContactFormBlock,
          // ... más bloques
        ]
      },
      {
        name: 'seo',
        type: 'group',
        fields: [
          { name: 'title', type: 'text', maxLength: 60 },
          { name: 'description', type: 'textarea', maxLength: 160 },
          { name: 'keywords', type: 'text' },
          { name: 'ogImage', type: 'upload', relationTo: 'media' },
        ]
      }
    ]
  }
]
```

##### 1.3 Migración de Componentes Existentes
- [ ] Convertir Hero sections a bloques Payload
- [ ] Convertir Formularios a bloques
- [ ] Convertir Carruseles a bloques
- [ ] Convertir CTAs a bloques

#### Entregables:
- ✅ Payload CMS funcionando en `/admin`
- ✅ Colección de páginas con versionado
- ✅ Mínimo 5 bloques básicos implementados
- ✅ Sistema de media/uploads funcionando

---

### **FASE 2: Integración con Next.js** (2 semanas)
**Rama:** `dev`

#### Tareas:
##### 2.1 Rutas Dinámicas
```typescript
// src/app/[slug]/page.tsx
export async function generateStaticParams() {
  const pages = await payload.find({ collection: 'pages' })
  return pages.docs.map(page => ({ slug: page.slug }))
}

export default async function Page({ params }) {
  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: params.slug } }
  })

  return <RenderBlocks blocks={page.content} />
}
```

##### 2.2 Componente de Renderizado
```typescript
// src/components/RenderBlocks.tsx
export function RenderBlocks({ blocks }) {
  return blocks.map((block) => {
    switch(block.blockType) {
      case 'hero': return <HeroBlock {...block} />
      case 'features': return <FeaturesBlock {...block} />
      case 'contactForm': return <ContactFormBlock {...block} />
      default: return null
    }
  })
}
```

##### 2.3 Sistema de Vista Previa (Draft Preview)
**Objetivo:** Permitir ver cómo quedará la página antes de publicarla.

**Flujo de trabajo:**
1. Designer crea/edita página en CMS (modo `draft`)
2. Hace clic en botón "Vista Previa" en admin panel
3. Se abre nueva pestaña mostrando exactamente cómo se verá en producción
4. Puede hacer cambios y refrescar preview en tiempo real
5. Cuando está conforme, cambia estado a `published`

**Implementación:**
```typescript
// src/app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // Validar token secreto (previene acceso no autorizado)
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Activar Draft Mode de Next.js
  draftMode().enable()

  // Redirigir a la página en modo preview
  redirect(`/${slug}`)
}
```

```typescript
// src/app/[slug]/page.tsx
import { draftMode } from 'next/headers'

export default async function Page({ params }) {
  const { isEnabled: isDraft } = draftMode()

  // Si está en modo draft, traer versión borrador
  const page = await payload.find({
    collection: 'pages',
    where: { slug: { equals: params.slug } },
    draft: isDraft  // ✅ Esto trae el borrador si isDraft=true
  })

  // Banner visual indicando que es preview
  if (isDraft) {
    return (
      <>
        <PreviewBanner />
        <RenderBlocks blocks={page.content} />
      </>
    )
  }

  return <RenderBlocks blocks={page.content} />
}
```

**Características del Preview:**
- ✅ **Sin afectar producción**: Los visitantes siguen viendo la versión publicada
- ✅ **Tiempo real**: Cambios se reflejan instantáneamente al refrescar
- ✅ **Seguro**: Solo accesible con token secreto
- ✅ **Comparación**: Se puede abrir versión publicada en otra pestaña para comparar
- ✅ **Exit preview**: Botón para salir del modo preview

#### Entregables:
- ✅ Páginas dinámicas renderizando desde Payload
- ✅ Preview mode funcionando
- ✅ ISR (Incremental Static Regeneration) configurado
- ✅ Mantener SEO metadata de páginas existentes

---

### **FASE 3: Analizador SEO Automático** (1.5 semanas)
**Rama:** `dev`

#### Tareas:
##### 3.1 Hook de Validación SEO
```typescript
// payload/hooks/seo-validator.ts
export const seoValidator: CollectionBeforeValidateHook = async ({
  data,
  req
}) => {
  const issues = []

  // Validar title
  if (!data.seo?.title) {
    issues.push({ field: 'seo.title', message: 'Meta title requerido' })
  } else if (data.seo.title.length > 60) {
    issues.push({ field: 'seo.title', message: 'Title muy largo (max 60)' })
  }

  // Validar description
  if (!data.seo?.description) {
    issues.push({ field: 'seo.description', message: 'Meta description requerida' })
  } else if (data.seo.description.length > 160) {
    issues.push({ field: 'seo.description', message: 'Description muy larga (max 160)' })
  }

  // Validar H1 (debe haber exactamente 1)
  const h1Count = countH1InBlocks(data.content)
  if (h1Count === 0) {
    issues.push({ field: 'content', message: 'Falta H1 principal' })
  } else if (h1Count > 1) {
    issues.push({ field: 'content', message: 'Múltiples H1 (solo debe haber 1)' })
  }

  // Validar imágenes sin alt
  const imagesWithoutAlt = findImagesWithoutAlt(data.content)
  if (imagesWithoutAlt.length > 0) {
    issues.push({
      field: 'content',
      message: `${imagesWithoutAlt.length} imágenes sin texto alternativo`
    })
  }

  // Si hay errores críticos, prevenir guardado
  if (issues.some(i => i.severity === 'critical')) {
    throw new Error('Errores críticos de SEO. No se puede publicar.')
  }

  return data
}
```

##### 3.2 Panel de SEO Score
```typescript
// payload/components/SEOScore.tsx
export const SEOScore: React.FC = () => {
  const { data } = useFormFields()
  const score = calculateSEOScore(data)

  return (
    <div className="seo-score">
      <h3>SEO Score: {score.total}/100</h3>
      <ul>
        {score.issues.map(issue => (
          <li key={issue.id} className={issue.severity}>
            {issue.message}
          </li>
        ))}
      </ul>
      <ul>
        {score.suggestions.map(suggestion => (
          <li key={suggestion.id}>
            💡 {suggestion.message}
          </li>
        ))}
      </ul>
    </div>
  )
}
```

##### 3.3 Análisis de Keywords
- [ ] Densidad de palabras clave
- [ ] Ubicación de keywords (title, H1, first paragraph)
- [ ] LSI keywords (sugerencias de palabras relacionadas)

##### 3.4 Análisis de Estructura
- [ ] Jerarquía de headings correcta (H1 > H2 > H3)
- [ ] Longitud de párrafos
- [ ] Uso de listas (mejora readability)
- [ ] Enlaces internos y externos

#### Entregables:
- ✅ Sistema de validación SEO automático
- ✅ Panel visual de SEO score
- ✅ Prevención de publicación con errores críticos
- ✅ Sugerencias de mejora en tiempo real

---

### **FASE 4: Editor Visual Mejorado** (2 semanas)
**Rama:** `dev`

#### Tareas:
##### 4.1 Block Customization
- [ ] Configurador visual de estilos (colores, tipografía)
- [ ] Espaciado visual (padding/margin con slider)
- [ ] Backgrounds (color, gradiente, imagen)
- [ ] Animaciones predefinidas (fade-in, slide-up, etc.)

##### 4.2 Component Library
```typescript
// payload/blocks/index.ts
export const blockLibrary = {
  layout: [
    { name: 'Hero', icon: '🎯', component: HeroBlock },
    { name: 'Dos Columnas', icon: '📰', component: TwoColumnBlock },
    { name: 'Tres Columnas', icon: '📊', component: ThreeColumnBlock },
  ],
  content: [
    { name: 'Texto Rico', icon: '📝', component: RichTextBlock },
    { name: 'Imagen', icon: '🖼️', component: ImageBlock },
    { name: 'Video', icon: '🎥', component: VideoBlock },
    { name: 'Galería', icon: '🖼️', component: GalleryBlock },
  ],
  interactive: [
    { name: 'Formulario', icon: '📋', component: FormBlock },
    { name: 'CTA Button', icon: '🔘', component: CTABlock },
    { name: 'Acordeón', icon: '📂', component: AccordionBlock },
    { name: 'Tabs', icon: '📑', component: TabsBlock },
  ],
  social: [
    { name: 'Testimonios', icon: '💬', component: TestimonialsBlock },
    { name: 'FAQ', icon: '❓', component: FAQBlock },
    { name: 'Social Share', icon: '🔗', component: SocialShareBlock },
  ]
}
```

##### 4.3 Preview Responsivo
```typescript
// payload/components/ResponsivePreview.tsx
export const ResponsivePreview = () => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  return (
    <div className="preview-container">
      <div className="device-selector">
        <button onClick={() => setDevice('desktop')}>💻 Desktop</button>
        <button onClick={() => setDevice('tablet')}>📱 Tablet</button>
        <button onClick={() => setDevice('mobile')}>📱 Mobile</button>
      </div>

      <iframe
        src={`/api/preview?slug=${slug}`}
        className={`preview-frame ${device}`}
        style={{
          width: device === 'desktop' ? '100%' :
                 device === 'tablet' ? '768px' : '375px'
        }}
      />
    </div>
  )
}
```

#### Entregables:
- ✅ Biblioteca de 20+ componentes listos para usar
- ✅ Preview responsivo funcionando
- ✅ Configuración visual de estilos
- ✅ Sistema de templates (duplicar páginas rápido)

---

### **FASE 5: Seguridad y Control de Acceso** (1 semana)
**Rama:** `dev`

#### Tareas:
##### 5.1 Autenticación
```typescript
// payload.config.ts
admin: {
  user: 'users',
  meta: {
    titleSuffix: '- Coradir CMS',
    ogImage: '/assets/cms-og.png',
  },
  components: {
    beforeLogin: [CustomLoginBanner],
  }
}

collections: [
  {
    slug: 'users',
    auth: {
      tokenExpiration: 7200, // 2 horas
      maxLoginAttempts: 5,
      lockTime: 600000, // 10 min
    },
    fields: [
      { name: 'name', type: 'text', required: true },
      { name: 'role', type: 'select', options: ['admin', 'editor', 'viewer'] },
    ]
  }
]
```

##### 5.2 Control de Acceso por Rol
```typescript
// payload/access/pages.ts
export const pagesAccess = {
  create: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  read: () => true, // Público
  update: ({ req: { user } }) => user?.role === 'admin' || user?.role === 'editor',
  delete: ({ req: { user } }) => user?.role === 'admin',
}
```

##### 5.3 Sistema de Audit Logs (Registro de Cambios)
**Objetivo:** Saber quién modificó qué y cuándo, con historial completo de cambios.

**Características:**
- ✅ **Registro automático**: Cada vez que alguien crea/edita/elimina algo, se guarda log
- ✅ **Detalle completo**: Usuario, acción, fecha/hora, qué cambió exactamente
- ✅ **Trazabilidad**: Ver historial de todas las modificaciones de una página
- ✅ **Comparación visual**: Ver diferencias entre versiones (antes/después)
- ✅ **Filtros**: Buscar por usuario, fecha, tipo de acción

**Implementación:**

```typescript
// src/payload/collections/AuditLogs.ts
import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['user', 'action', 'collection', 'timestamp'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        readOnly: true,
      }
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Creó', value: 'create' },
        { label: 'Actualizó', value: 'update' },
        { label: 'Eliminó', value: 'delete' },
        { label: 'Publicó', value: 'publish' },
        { label: 'Despublicó', value: 'unpublish' },
      ],
      admin: {
        readOnly: true,
      }
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      admin: {
        description: 'Qué colección fue modificada (pages, media, etc.)',
        readOnly: true,
      }
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID del documento modificado',
        readOnly: true,
      }
    },
    {
      name: 'documentTitle',
      type: 'text',
      admin: {
        description: 'Título de la página/documento modificado',
        readOnly: true,
      }
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm:ss',
        }
      }
    },
    {
      name: 'changes',
      type: 'json',
      admin: {
        description: 'Detalle de qué campos cambiaron',
        readOnly: true,
      }
    },
    {
      name: 'ipAddress',
      type: 'text',
      admin: {
        description: 'IP desde donde se hizo el cambio',
        readOnly: true,
      }
    }
  ],
  access: {
    create: () => true,  // El hook lo crea automáticamente
    read: ({ req: { user } }) => !!user,  // Solo usuarios logueados
    update: () => false,  // Los logs nunca se modifican
    delete: ({ req: { user } }) => user?.role === 'admin',  // Solo admin puede borrar logs
  },
  timestamps: true,
}
```

```typescript
// src/payload/hooks/audit-log.ts
import type { CollectionAfterChangeHook } from 'payload'

export const createAuditLog: CollectionAfterChangeHook = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Solo crear log si hay usuario logueado
  if (!req.user) return

  // Detectar qué cambió
  const changes: Record<string, { old: any; new: any }> = {}

  if (operation === 'update' && previousDoc) {
    Object.keys(doc).forEach((key) => {
      if (JSON.stringify(doc[key]) !== JSON.stringify(previousDoc[key])) {
        changes[key] = {
          old: previousDoc[key],
          new: doc[key],
        }
      }
    })
  }

  // Crear registro en audit-logs
  await req.payload.create({
    collection: 'audit-logs',
    data: {
      user: req.user.id,
      action: operation,
      collection: req.collection?.config.slug,
      documentId: doc.id,
      documentTitle: doc.title || doc.name || doc.slug,
      timestamp: new Date(),
      changes: operation === 'update' ? changes : doc,
      ipAddress: req.headers.get('x-forwarded-for') || req.ip,
    },
  })
}
```

```typescript
// payload.config.ts - Agregar hook a Pages collection
collections: [
  {
    slug: 'pages',
    hooks: {
      afterChange: [createAuditLog],  // ✅ Registra cada cambio
    },
    // ... resto de config
  }
]
```

**Vista en Admin Panel:**
```
╔══════════════════════════════════════════════════════════════════╗
║ AUDIT LOGS - Historial de Cambios                                ║
╠══════════════════════════════════════════════════════════════════╣
║ Usuario      │ Acción      │ Página        │ Fecha/Hora          ║
╠══════════════╪═════════════╪═══════════════╪═════════════════════╣
║ juan@corp.ar │ Actualizó   │ Juana 64      │ 17/12/2025 14:30:22 ║
║ maria@corp.ar│ Publicó     │ Corporativos  │ 17/12/2025 13:15:10 ║
║ pedro@corp.ar│ Creó        │ Nueva Landing │ 17/12/2025 11:05:33 ║
║ juan@corp.ar │ Eliminó     │ Test Page     │ 16/12/2025 18:42:11 ║
╚══════════════╧═════════════╧═══════════════╧═════════════════════╝
```

**Beneficios:**
- 🔍 **Trazabilidad completa**: Ver quién hizo cada cambio
- 🕐 **Historial temporal**: Saber cuándo se hizo cada modificación
- 🔒 **Seguridad**: Detectar accesos no autorizados o cambios sospechosos
- 📊 **Análisis**: Ver qué usuarios son más activos, qué páginas se modifican más
- 🔙 **Recovery**: Saber qué usuario causó un problema para poder revertir

##### 5.4 CSP para Admin Panel
```typescript
// next.config.ts - Agregar excepción para /admin
{
  source: '/admin/:path*',
  headers: [
    {
      key: 'Content-Security-Policy',
      value: cspForPayloadAdmin, // CSP más permisiva solo para admin
    }
  ]
}
```

#### Entregables:
- ✅ Sistema de autenticación robusto
- ✅ Roles y permisos configurados
- ✅ Audit log completo
- ✅ CSP ajustada para admin sin romper seguridad pública

---

### **FASE 6: Migración de Páginas Existentes** (1.5 semanas)
**Rama:** `dev`

#### Tareas:
##### 6.1 Script de Migración
```typescript
// scripts/migrate-to-payload.ts
import payload from 'payload'
import { existingPages } from './existing-pages-data'

async function migrate() {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    mongoURL: process.env.DATABASE_URI!,
    local: true,
  })

  for (const page of existingPages) {
    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        status: 'published',
        content: convertToBlocks(page.components),
        seo: {
          title: page.metadata.title,
          description: page.metadata.description,
          keywords: page.metadata.keywords,
        }
      }
    })

    console.log(`✅ Migrated: ${page.slug}`)
  }

  console.log('🎉 Migration complete!')
}
```

##### 6.2 Páginas a Migrar (Prioridad)
1. ✅ `/` - Homepage
2. ✅ `/juana-64` - Proyecto principal
3. ✅ `/la-torre-ii` - Proyecto
4. ✅ `/inversiones-inteligentes`
5. ✅ `/corporativos`
6. ✅ `/instituciones`
7. ✅ `/terrenos`
8. ✅ `/beneficios`
9. ✅ `/contacto`
10. ✅ `/saber-mas/[interes]` - Template dinámico

#### Entregables:
- ✅ Todas las páginas existentes migradas a Payload
- ✅ SEO metadata preservado
- ✅ Funcionalidad idéntica a páginas actuales
- ✅ Páginas antiguas mantienen como fallback

---

### **FASE 7: Testing Exhaustivo** (2 semanas)
**Rama:** `dev`

#### Tareas:
##### 7.1 Tests Funcionales
- [ ] CRUD de páginas completo
- [ ] Versionado y rollback
- [ ] Preview mode
- [ ] Publicación y despublicación
- [ ] Duplicación de páginas

##### 7.2 Tests de SEO
- [ ] Validación de meta tags
- [ ] Schema.org JSON-LD generado correctamente
- [ ] Sitemap actualizado automáticamente
- [ ] robots.txt respetado
- [ ] Canonical URLs correctas

##### 7.3 Tests de Performance
- [ ] Lighthouse score ≥95 mantenido
- [ ] ISR funcionando (revalidación cada 1h)
- [ ] Imágenes optimizadas automáticamente
- [ ] Bundle size no aumentado significativamente

##### 7.4 Tests de Seguridad
- [ ] CSP no comprometida
- [ ] reCAPTCHA funcionando en formularios del CMS
- [ ] Inyección de scripts bloqueada
- [ ] Autenticación robusta (pruebas de fuerza bruta)
- [ ] Logs de auditoría completos

##### 7.5 Tests de UX (con diseñadores)
- [ ] Facilidad de creación de páginas
- [ ] Curva de aprendizaje aceptable
- [ ] Preview en tiempo real sin lag
- [ ] Responsive preview útil

#### Entregables:
- ✅ Reporte de testing completo
- ✅ Lista de bugs encontrados y resueltos
- ✅ Aprobación de diseñadores
- ✅ Performance mantenida

---

### **FASE 8: Documentación y Capacitación** (1 semana)
**Rama:** `dev`

#### Tareas:
##### 8.1 Documentación Técnica
- [ ] Guía de arquitectura del CMS
- [ ] Cómo crear nuevos bloques
- [ ] Cómo agregar validaciones SEO
- [ ] Troubleshooting común

##### 8.2 Manual de Usuario
- [ ] Cómo crear una página nueva
- [ ] Cómo usar cada tipo de bloque
- [ ] Cómo interpretar el SEO score
- [ ] Cómo publicar/despublicar
- [ ] Cómo hacer rollback

##### 8.3 Video Tutoriales
- [ ] Tour del CMS (5 min)
- [ ] Crear página desde cero (10 min)
- [ ] Optimización SEO (8 min)
- [ ] Uso de templates (5 min)

##### 8.4 Capacitación del Equipo
- [ ] Sesión práctica con diseñadores (2h)
- [ ] Q&A y resolución de dudas
- [ ] Casos de uso reales

#### Entregables:
- ✅ Documentación completa en `/docs/cms/`
- ✅ 4 video tutoriales
- ✅ Equipo capacitado y confiado

---

### **FASE 9: Deploy a Producción** (1 semana)
**Rama:** `main`

#### Tareas:
##### 9.1 Preparación de Infraestructura
```yaml
# docker-compose.yml - Agregar MongoDB
services:
  mongodb:
    image: mongo:7
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - mongodb_data:/data/db
    networks:
      - coradir-network

  nextjs:
    # ... existing config
    environment:
      DATABASE_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/coradir-cms
      PAYLOAD_SECRET: ${PAYLOAD_SECRET}
    depends_on:
      - mongodb
```

##### 9.2 Merge dev → main
```bash
git checkout main
git merge dev --no-ff -m "feat: add Payload CMS visual editor with SEO validation"
```

##### 9.3 Deploy Checklist
- [ ] Backup de base de datos de producción
- [ ] Variables de entorno configuradas en Portainer
- [ ] MongoDB en producción funcionando
- [ ] Build exitoso en producción
- [ ] Migración de datos de dev a prod
- [ ] Smoke tests en producción
- [ ] Rollback plan listo

##### 9.4 Monitoreo Post-Deploy
- [ ] Logs de errores monitoreados (primeras 24h)
- [ ] Performance monitoreado
- [ ] Feedback de usuarios finales

#### Entregables:
- ✅ CMS en producción funcionando
- ✅ Páginas existentes funcionando idénticamente
- ✅ Diseñadores creando contenido sin problemas

---

## 🔒 Consideraciones de Seguridad

### Mantenimiento de Seguridad Actual

#### CSP (Content Security Policy)
```typescript
// La CSP actual se mantiene para el sitio público
// Solo se relaja para /admin (Payload admin panel)

const publicCSP = "default-src 'self'; script-src 'self' 'unsafe-inline'..." // Actual
const adminCSP = publicCSP + " https://cdn.payloadcms.com" // Solo para /admin
```

#### Docker Security
```dockerfile
# Dockerfile - Mantener prácticas actuales
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat

# Agregar usuario no-root para MongoDB
RUN addgroup -g 1001 mongodb && adduser -D -u 1001 -G mongodb mongodb

# ... resto del Dockerfile actual
```

#### Variables de Entorno Sensibles
```bash
# .env.example - Agregar nuevas vars
PAYLOAD_SECRET=<genera con openssl rand -base64 32>
DATABASE_URI=mongodb://user:pass@mongodb:27017/coradir-cms
PAYLOAD_PREVIEW_SECRET=<genera con openssl rand -base64 32>
```

#### Autenticación Robusta
- ✅ Contraseñas hasheadas (bcrypt)
- ✅ Tokens JWT con expiración corta
- ✅ Rate limiting en login
- ✅ 2FA (opcional, Fase 10)

#### Validación de Inputs
```typescript
// Todos los campos del CMS con validación Zod
import { z } from 'zod'

const PageSchema = z.object({
  title: z.string().min(3).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  content: z.array(BlockSchema),
  seo: SeoSchema,
})
```

---

## 📅 Roadmap y Cronograma

### Timeline Estimado: **12-14 semanas**

```
Semana 1:        FASE 0 - Preparación
Semanas 2-3:     FASE 1 - CMS Backend Core
Semanas 4-5:     FASE 2 - Integración Next.js
Semanas 6-7:     FASE 3 - Analizador SEO
Semanas 8-9:     FASE 4 - Editor Visual Mejorado
Semana 10:       FASE 5 - Seguridad
Semanas 11-12:   FASE 6 - Migración Páginas
Semanas 13-14:   FASE 7 - Testing
Semana 15:       FASE 8 - Documentación
Semana 16:       FASE 9 - Deploy Producción
```

### Hitos Clave

| Fecha Estimada | Hito | Responsable |
|----------------|------|-------------|
| Semana 3 | ✅ CMS Backend funcionando | Dev Team |
| Semana 5 | ✅ Primera página renderizada desde CMS | Dev Team |
| Semana 7 | ✅ SEO automático funcionando | Dev Team |
| Semana 9 | ✅ Editor visual completo | Dev Team |
| Semana 12 | ✅ Todas páginas migradas | Dev Team |
| Semana 14 | ✅ Testing aprobado | QA + Diseñadores |
| Semana 15 | ✅ Equipo capacitado | Diseñadores |
| Semana 16 | 🚀 Deploy a producción | DevOps + Dev Team |

---

## 📊 Métricas de Éxito

### KPIs Técnicos
- ✅ Lighthouse Score ≥95 mantenido
- ✅ Tiempo de carga <2s
- ✅ SEO Score promedio ≥85/100
- ✅ 0 errores críticos de CSP
- ✅ Uptime 99.9%

### KPIs de Negocio
- ✅ Tiempo de creación de página: de 4h → 30min
- ✅ Diseñadores independientes (0 dependencia de devs)
- ✅ 100% páginas con SEO validado
- ✅ 0 páginas publicadas con errores SEO críticos

### KPIs de UX
- ✅ Satisfacción de diseñadores ≥4.5/5
- ✅ Curva de aprendizaje <2 días
- ✅ 0 páginas publicadas con bugs visuales

---

## 🎯 Próximos Pasos Inmediatos

### ~~Esta Semana (Semana 1)~~ ✅ COMPLETADA
1. **~~Hoy:~~ ✅**
   - [x] Crear este plan
   - [x] Aprobar plan con stakeholders
   - [x] Setup MongoDB local en Docker

2. **~~Mañana:~~ ✅**
   - [x] Auditoría de componentes actuales
   - [x] Crear mapeo de componentes → bloques CMS
   - [x] Instalar Payload CMS en rama `dev`

3. **~~Resto de la semana:~~ ✅**
   - [x] Configuración inicial de Payload
   - [x] Crear primer bloque de prueba (Users collection)
   - [x] Test de conexión MongoDB
   - [x] Checkpoint: Demo interno del CMS vacío funcionando

### ✅ FASE 1 COMPLETADA (Semana 2-3)
1. **Configuración de Colecciones:**
   - [x] Crear colección Pages con versionado
   - [x] Crear colección Media para uploads con optimización automática
   - [x] Implementar primeros 5 bloques básicos:
     - [x] HeroBlock (con variantes y overlay configurable)
     - [x] FeaturesBlock (grid y lista, iconos personalizables)
     - [x] ContactFormBlock (integración con N8N, reCAPTCHA)
     - [x] CTABlock (múltiples variantes y estilos)
     - [x] RichTextBlock (Lexical editor, alineación)
   - [x] **EXTRA:** Sistema de gestión de menú en Pages
     - Posición del menú (main, secondary, footer)
     - Orden de aparición
     - Etiqueta personalizada
     - Soporte para páginas padre (submenús)

2. **Admin Panel:**
   - [x] Configurar panel de administración en `/admin`
   - [x] Personalizar branding del CMS (CORADIR CMS)
   - [x] Configurar Live Preview con breakpoints responsive
   - [x] Organización por grupos (Contenido, Multimedia)
   - [x] Formato de fecha español (dd/MM/yyyy)

3. **Configuración Avanzada:**
   - [x] Integración completa con Next.js mediante `withPayload`
   - [x] TypeScript paths configurados (`@payload-config`)
   - [x] Versionado con drafts y autosave (cada 2 segundos)
   - [x] Hasta 50 versiones por documento
   - [x] SEO completo (meta tags, OG image, noindex)

### Próxima Fase (Semana 4-5) - FASE 2
1. **Frontend Integration:**
   - [ ] Crear componentes React para cada bloque
   - [ ] Implementar sistema de renderizado dinámico
   - [ ] Integrar con sistema SEO existente

---

## 📚 Recursos y Referencias

### Documentación Oficial
- [Payload CMS Docs](https://payloadcms.com/docs)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Lexical Editor](https://lexical.dev/)
- [MongoDB Docker](https://hub.docker.com/_/mongo)

### Ejemplos de Referencia
- [Payload E-commerce Template](https://github.com/payloadcms/payload/tree/main/templates/ecommerce)
- [Payload Blog Template](https://github.com/payloadcms/payload/tree/main/templates/blog)

### Inspiración UI
- WordPress Block Editor (Gutenberg)
- Webflow Editor
- Framer Sites
- Notion Blocks

---

## ❓ FAQ

### ¿Por qué Payload CMS y no WordPress?
WordPress requiere PHP y MySQL, stack completamente diferente. Payload es TypeScript + Next.js, se integra perfectamente con tu stack actual.

### ¿Los cambios en el CMS son instantáneos?
No. Usamos ISR (Incremental Static Regeneration) con revalidación cada 1h. Los cambios urgentes pueden forzar rebuild.

### ¿Qué pasa con las páginas actuales durante la migración?
Se mantienen como fallback. Si una página no existe en CMS, Next.js sirve la versión estática actual.

### ¿El CMS consume muchos recursos?
MongoDB + Payload Admin agregan ~300MB RAM. Manejable en tu infraestructura Docker actual.

### ¿Qué pasa si hay un bug en producción?
Rollback inmediato a versión anterior del contenido. Código en Git permite rollback de aplicación.

---

**Documento vivo - Se actualiza con cada fase completada**

---

**Última actualización:** 2025-12-18
**Estado:** FASE 0 Completada ✅ | FASE 1 Completada ✅
**Próxima revisión:** Fin de FASE 2 (Semana 4-5)
