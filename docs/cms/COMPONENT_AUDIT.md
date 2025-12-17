# Auditoría de Componentes para CMS - Coradir Homes

**Fecha:** 2025-12-17 - FASE 0
**Objetivo:** Identificar todos los componentes reutilizables para convertirlos en bloques del CMS

---

## 📊 Resumen Ejecutivo

**Total de componentes identificados:** 62
**Componentes convertibles a bloques CMS:** ~35
**Componentes de infraestructura (no CMS):** ~27

---

## 🎨 Componentes Candidatos para Bloques CMS

### 1. **Layout & Hero Sections** (Alta Prioridad)

| Componente | Ubicación | Usado En | Prioridad | Notas |
|------------|-----------|----------|-----------|-------|
| `Hero` | `complejo-coradir/components/Hero.tsx` | Complejo Coradir | ⭐⭐⭐ | Hero con imagen de fondo |
| `HeroSection` | `la-torre-ii/components/HeroSection.tsx` | La Torre II | ⭐⭐⭐ | Hero con video |
| `sectionHero` | `juana-64/components/sectionHero/` | Juana 64 | ⭐⭐⭐ | Hero con stats |
| `InvestmentHero` | `inversiones-inteligentes/components/` | Inversiones | ⭐⭐⭐ | Hero con CTA destacado |

**Bloque CMS Propuesto:** `HeroBlock`
```typescript
{
  blockType: 'hero',
  fields: {
    title: string,
    subtitle: string,
    backgroundImage: upload,
    backgroundVideo?: upload,
    ctaText: string,
    ctaLink: string,
    showStats?: boolean,
    stats?: Array<{ label, value }>,
    alignment: 'left' | 'center' | 'right',
    overlay: 'none' | 'light' | 'dark',
  }
}
```

---

### 2. **Features & Benefits** (Alta Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `FeaturesBar` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐⭐ |
| `AmenitiesSection` | `la-torre-ii/components/` | La Torre II | ⭐⭐⭐ |
| `sectionEspecification` | `juana-64/components/` | Juana 64 | ⭐⭐⭐ |

**Bloque CMS Propuesto:** `FeaturesBlock`
```typescript
{
  blockType: 'features',
  fields: {
    title: string,
    subtitle?: string,
    layout: 'grid-2' | 'grid-3' | 'grid-4' | 'list',
    items: Array<{
      icon: upload | 'select-preset',
      title: string,
      description: string,
    }>,
    backgroundColor: 'white' | 'blue' | 'gray',
  }
}
```

---

### 3. **Carousels & Sliders** (Alta Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `ThreeDSlider` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐⭐ |
| `SliderSection` | `la-torre-ii/components/` | La Torre II | ⭐⭐⭐ |
| `sectionCarucel` | `juana-64/components/` | Juana 64 | ⭐⭐⭐ |
| `carrucel` | `beneficios/components/` | Beneficios | ⭐⭐ |

**Bloque CMS Propuesto:** `CarouselBlock`
```typescript
{
  blockType: 'carousel',
  fields: {
    title?: string,
    images: Array<{
      image: upload,
      caption?: string,
      alt: string, // SEO crítico
    }>,
    autoplay: boolean,
    interval: number, // ms
    navigation: boolean,
    pagination: boolean,
    effect: 'slide' | 'fade' | '3d',
  }
}
```

---

### 4. **Forms** (Alta Prioridad - Integración Crítica)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `ContactForm` | `contacto/components/` | Contacto | ⭐⭐⭐ |
| `projectForm` | `components/` | Múltiples | ⭐⭐⭐ |
| `InvestmentForm` | `components/InvestmentForm/` | Modal Inversión | ⭐⭐⭐ |
| `form` | `juana-64/components/` | Juana 64 | ⭐⭐ |

**Bloque CMS Propuesto:** `FormBlock`
```typescript
{
  blockType: 'form',
  fields: {
    title: string,
    subtitle?: string,
    formType: 'contact' | 'investment' | 'project',
    backgroundImage?: upload,
    includeRecaptcha: boolean, // Siempre true por seguridad
    submitEndpoint: string, // N8N webhook
    successMessage: string,
    profileTypes?: Array<string>, // Para investment form
    transactionTypes?: Array<string>,
  }
}
```

⚠️ **Nota de Seguridad:** Todos los formularios DEBEN mantener reCAPTCHA Enterprise

---

### 5. **CTAs & Banners** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `CtaBanner` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐⭐ |
| `buttonContact` | `components/` | Global | ⭐⭐ |
| `WhatsAppLink` | `components/` | Global | ⭐⭐ |

**Bloque CMS Propuesto:** `CTABlock`
```typescript
{
  blockType: 'cta',
  fields: {
    title: string,
    description?: string,
    buttonText: string,
    buttonLink: string,
    buttonStyle: 'primary' | 'secondary' | 'whatsapp',
    alignment: 'left' | 'center' | 'right',
    backgroundColor: 'white' | 'blue' | 'gradient',
    fullWidth: boolean,
  }
}
```

---

### 6. **Content Sections** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `Ambientes` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐ |
| `Construction` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐ |
| `OverviewSection` | `la-torre-ii/components/` | La Torre II | ⭐⭐ |
| `sectionRooms` | `juana-64/components/` | Juana 64 | ⭐⭐ |

**Bloque CMS Propuesto:** `ContentSectionBlock`
```typescript
{
  blockType: 'contentSection',
  fields: {
    title: string,
    description: richText, // Lexical editor
    image?: upload,
    imagePosition: 'left' | 'right' | 'top' | 'bottom',
    layout: 'two-column' | 'full-width',
    backgroundColor: 'white' | 'blue' | 'gray',
  }
}
```

---

### 7. **Location & Maps** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `ProjectLocation` | `complejo-coradir/components/` | Complejo Coradir | ⭐⭐⭐ |
| `LocationSection` | `la-torre-ii/components/` | La Torre II | ⭐⭐⭐ |

**Bloque CMS Propuesto:** `LocationBlock`
```typescript
{
  blockType: 'location',
  fields: {
    title: string,
    address: string,
    mapImage: upload, // Imagen estática del mapa
    googleMapsLink?: string,
    latitude?: number,
    longitude?: number,
    landmarks?: Array<{ name: string, distance: string }>,
  }
}
```

---

### 8. **Statistics & Counters** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `sectionStats` | `juana-64/components/sectionStats/` | Juana 64 | ⭐⭐ |
| `counter` | `juana-64/components/sectionStats/components/` | Juana 64 | ⭐⭐ |

**Bloque CMS Propuesto:** `StatsBlock`
```typescript
{
  blockType: 'stats',
  fields: {
    title?: string,
    stats: Array<{
      value: string,
      label: string,
      icon?: upload,
    }>,
    layout: 'horizontal' | 'grid',
    animated: boolean, // Contador animado
  }
}
```

---

### 9. **Testimonials & FAQs** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `testimonials` | `components/testimonials/` | Global | ⭐⭐ |
| `faqSection` | `components/faq/` | Global | ⭐⭐⭐ |

**Bloque CMS Propuesto:** `TestimonialsBlock`
```typescript
{
  blockType: 'testimonials',
  fields: {
    title: string,
    testimonials: Array<{
      quote: text,
      author: string,
      role?: string,
      avatar?: upload,
    }>,
    layout: 'carousel' | 'grid',
  }
}
```

**Bloque CMS Propuesto:** `FAQBlock`
```typescript
{
  blockType: 'faq',
  fields: {
    title: string,
    faqs: Array<{
      question: string,
      answer: richText,
    }>,
    defaultExpanded: boolean,
  }
}
```

---

### 10. **Project Cards** (Alta Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `sectionProjectsDone` | `components/` | Homepage | ⭐⭐⭐ |
| `cardProyect` | `components/home/components/` | Homepage | ⭐⭐⭐ |

**Bloque CMS Propuesto:** `ProjectsGridBlock`
```typescript
{
  blockType: 'projectsGrid',
  fields: {
    title: string,
    projects: Array<{
      title: string,
      image: upload,
      link: string,
      status: 'active' | 'coming-soon' | 'completed',
    }>,
    layout: 'stair' | 'grid' | 'masonry',
  }
}
```

---

### 11. **Videos** (Media Prioridad)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `sectionVideos` | `juana-64/components/sectionVideos/` | Juana 64 | ⭐⭐ |

**Bloque CMS Propuesto:** `VideoBlock`
```typescript
{
  blockType: 'video',
  fields: {
    title?: string,
    videoUrl: string, // YouTube, Vimeo, o archivo
    videoFile?: upload,
    thumbnail: upload,
    autoplay: boolean,
    loop: boolean,
    controls: boolean,
  }
}
```

---

### 12. **Typologies / Product Variants** (Específico)

| Componente | Ubicación | Usado En | Prioridad |
|------------|-----------|----------|-----------|
| `TypologiesSection` | `la-torre-ii/components/` | La Torre II | ⭐⭐ |

**Bloque CMS Propuesto:** `TypologiesBlock`
```typescript
{
  blockType: 'typologies',
  fields: {
    title: string,
    description?: string,
    typologies: Array<{
      name: string,
      area: string,
      bedrooms?: number,
      bathrooms?: number,
      price?: string,
      images: Array<upload>,
      features: Array<string>,
      availability: 'available' | 'sold-out' | 'coming-soon',
    }>,
  }
}
```

---

## 🚫 Componentes NO Convertibles (Infraestructura)

Estos componentes NO se convierten en bloques CMS porque son parte de la infraestructura:

### Navegación y Layout
- ❌ `header` - Navegación global (manual)
- ❌ `footer` - Footer global (manual)
- ❌ `mobileMenu` - Menú móvil (parte del header)
- ❌ `hover-link` - Submenú del header

### Funcionalidad Global
- ❌ `bot` - Chatbot global
- ❌ `reCaptcha` - Provider de reCAPTCHA
- ❌ `structuredDataScripts` - SEO automático
- ❌ `InvestmentModal` - Modal global de inversión
- ❌ `InvestmentModalWrapper` - Wrapper del modal
- ❌ `useInvestmentModal` - Hook del modal

### Componentes de Soporte
- ❌ `loader` - Loading spinner
- ❌ `customInput` - Input reutilizable de forms

---

## 📦 Propuesta de Bloques CMS - Priorización

### **Fase 1 - Bloques Esenciales** (Semana 2-3)
1. ✅ `HeroBlock` - 4 variantes
2. ✅ `FeaturesBlock` - Grid de características
3. ✅ `FormBlock` - Formularios con reCAPTCHA
4. ✅ `CTABlock` - Call-to-actions
5. ✅ `ContentSectionBlock` - Secciones de contenido

### **Fase 2 - Bloques Interactivos** (Semana 4-5)
6. ✅ `CarouselBlock` - Galerías/Sliders
7. ✅ `FAQBlock` - Preguntas frecuentes
8. ✅ `ProjectsGridBlock` - Grid de proyectos
9. ✅ `LocationBlock` - Mapas y ubicación
10. ✅ `StatsBlock` - Estadísticas animadas

### **Fase 3 - Bloques Avanzados** (Semana 6+)
11. ✅ `TestimonialsBlock` - Testimonios
12. ✅ `VideoBlock` - Videos embebidos
13. ✅ `TypologiesBlock` - Variantes de productos
14. ✅ `RichTextBlock` - Editor de texto rico (Lexical)
15. ✅ `SpacerBlock` - Espaciador (control de layout)

---

## 🎨 Esquema de Nombres de Bloques

**Convención:** `{Category}{Type}Block`

Ejemplos:
- `LayoutHeroBlock` ❌ (muy largo)
- `HeroBlock` ✅ (simple y claro)
- `FormContactBlock` ❌ (redundante)
- `FormBlock` ✅ (con field `formType`)

---

## 🔄 Proceso de Conversión

### Para cada componente:

1. **Análisis**
   - Identificar props variables (→ campos del CMS)
   - Identificar props fijas (→ defaults en bloque)
   - Identificar dependencias (hooks, contextos)

2. **Abstracción**
   - Crear schema de Payload para el bloque
   - Definir validaciones (Zod)
   - Definir campos obligatorios vs opcionales

3. **Implementación**
   - Crear archivo en `payload/blocks/{blockName}.ts`
   - Crear componente de renderizado
   - Agregar a biblioteca de bloques

4. **Testing**
   - Probar en admin UI de Payload
   - Verificar renderizado en frontend
   - Validar SEO (headings, alt text, etc.)

---

## 📊 Métricas de Conversión

| Métrica | Objetivo |
|---------|----------|
| Bloques Fase 1 | 5 bloques funcionales |
| Bloques Fase 2 | 5 bloques adicionales |
| Cobertura de componentes | 85% de componentes actuales |
| Tiempo de creación página | <30 min con bloques |
| Satisfacción diseñadores | ≥4.5/5 |

---

## 🚀 Próximos Pasos (FASE 0)

- [x] Auditoría completada
- [ ] Crear esquemas TypeScript base para bloques
- [ ] Instalar Payload CMS
- [ ] Crear primer bloque de prueba (`HeroBlock`)
- [ ] Validar renderizado en dev

---

**Documento actualizado:** 2025-12-17
**Estado:** Auditoría Completada ✅
**Siguiente:** Configuración de Payload CMS
