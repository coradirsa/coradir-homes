# 📋 Guía de Implementación: Investment Modal con GTM

## 🎯 Descripción del Feature

Modal popup para captación de leads de inversiones inmobiliarias con:
- Validación de formulario (React Hook Form + Zod)
- Integración directa con WhatsApp
- Control de visualización (una vez por sesión)
- Tracking manual desde GTM (sin eventos automáticos)
- SEO optimizado (Schema.org FinancialProduct)
- Accesibilidad WCAG 2.1 AA
- Animaciones suaves (Framer Motion)

---

## 📦 Stack Tecnológico Requerido

### Dependencias necesarias (ya instaladas en proyecto Next.js):
- `react-hook-form` - Manejo de formularios
- `@hookform/resolvers` - Resolvers para validación
- `zod` - Validación de schemas
- `framer-motion` - Animaciones
- `next` - Framework (v15+)
- `tailwindcss` - Estilos

---

## 🏗️ Estructura de Archivos

```
src/app/components/InvestmentModal/
├── types.ts                              # Tipos TypeScript
├── useInvestmentModal.ts                 # Hook con lógica
├── InvestmentModalContent.tsx            # Formulario
├── InvestmentModal.tsx                   # Componente principal
├── InvestmentModalWrapper.tsx            # Wrapper client component
├── InvestmentModalStructuredData.tsx     # SEO Schema
└── GTM_IDS.md                            # Documentación GTM
```

---

## 🔧 Configuración Inicial

### 1. **Crear estructura de carpeta**
```bash
mkdir -p src/app/components/InvestmentModal
```

### 2. **Archivos a crear** (en orden):

#### A) `types.ts`
- Define interfaces para formulario
- Config del modal
- Props de componentes
- Return types de hooks

#### B) `useInvestmentModal.ts`
- Hook personalizado con lógica del modal
- Control de sesión (sessionStorage)
- Manejo de apertura/cierre
- ESC key handler
- Body scroll lock
- **IMPORTANTE**: `trackEvents: false` (control manual GTM)

#### C) `InvestmentModalContent.tsx`
- Formulario completo con validación
- Schema Zod para validación
- Integración WhatsApp
- **CRÍTICO**: Agregar IDs únicos a TODOS los elementos:
  - `#investment-modal-content`
  - `#investment-modal-close-btn`
  - `#investment-modal-form`
  - `#investment-modal-submit-btn`
- **NO incluir eventos GTM automáticos** (dataLayer.push desactivado)

#### D) `InvestmentModal.tsx`
- Componente principal
- AnimatePresence de Framer Motion
- Trap focus para accesibilidad
- Backdrop clickeable
- IDs para GTM:
  - `#investment-modal-container`
  - `#investment-modal-backdrop`

#### E) `InvestmentModalWrapper.tsx`
- Client component wrapper
- Dynamic import con `ssr: false`
- **Necesario para Next.js 15+**

#### F) `InvestmentModalStructuredData.tsx`
- Schema.org FinancialProduct
- Script con JSON-LD
- Importar función desde `src/lib/seo/structuredData.ts`

---

## 📝 Parámetros Personalizables

### En `InvestmentModal.tsx` - DEFAULT_CONFIG:

```typescript
const DEFAULT_CONFIG = {
  showOncePerSession: true,           // Mostrar una vez por sesión
  delayMs: 1200,                      // Delay antes de mostrar (ms)
  whatsappNumber: "5492664649967",    // Número de WhatsApp
  trackEvents: false,                 // SIEMPRE false (control manual GTM)
};
```

### En `InvestmentModalContent.tsx` - Mensaje WhatsApp:

```typescript
const mensaje = `Hola! Vengo del pop-up de inversiones de la web [NOMBRE_SITIO].
Quiero que me contacten.

Mis datos son:
- *Nombre:* ${data.nombre}
- *Email:* ${data.email}
- *Teléfono:* ${data.telefono}
- *Monto estimado:* ${data.monto || "No especificado"}
`;
```

**CAMBIAR**: `[NOMBRE_SITIO]` por el identificador del sitio (ej: "homes", "corporativos", etc.)

---

## 🎨 Estilos (Tailwind)

### Colores requeridos en `tailwind.config`:
```js
colors: {
  blue: '#1a3455',      // Primary
  'blue-gray': '#475c77',
  'blue-light': '#3eb3e4',
  gray: '#4d4d4f',
  black: '#343333',
}
```

### Fuentes:
- `font-playfair` - Títulos
- `font-raleway` - Texto

---

## 🔗 Integración en Layout

### En `src/app/layout.tsx`:

```tsx
// 1. Import wrapper (arriba del archivo)
import InvestmentModalWrapper from "./components/InvestmentModal/InvestmentModalWrapper";
import InvestmentModalStructuredData from "./components/InvestmentModal/InvestmentModalStructuredData";

// 2. Agregar structured data (en <head> o antes de </body>)
<InvestmentModalStructuredData />

// 3. Agregar modal (antes de </body>)
<InvestmentModalWrapper />

// 4. Preconnect a WhatsApp (en <head>)
<link rel="preconnect" href="https://wa.me" />
<link rel="dns-prefetch" href="https://wa.me" />
```

---

## 📊 IDs para Google Tag Manager

### Lista completa de IDs (para tracking):

| ID | Elemento | Uso en GTM |
|----|----------|------------|
| `#investment-modal-container` | Contenedor principal | Element Visibility (modal abierto) |
| `#investment-modal-backdrop` | Fondo oscuro | Click - cerrar modal |
| `#investment-modal-content` | Caja blanca | (opcional) interacciones |
| `#investment-modal-close-btn` | Botón X | Click - cerrar |
| `#investment-modal-form` | Formulario | Form Submission |
| `#investment-modal-submit-btn` | Botón CTA | Click - submit |

### Inputs (para capturar valores):
- `#nombre` - Nombre y apellido
- `#email` - Email
- `#telefono` - Teléfono
- `#monto` - Monto estimado
- `#acepta_politica` - Checkbox términos

---

## 🎯 Eventos GTM Sugeridos

```
investment_modal_open       → Cuando el modal aparece
investment_cta_click        → Click en botón principal
investment_form_submit      → Submit del formulario
investment_modal_close      → Cerrar modal (X o backdrop)
```

---

## 🔍 SEO - Structured Data

### Agregar función en `src/lib/seo/structuredData.ts`:

```typescript
export const buildInvestmentProductJsonLd = (site: SiteConfig = siteConfig): StructuredDataEntry => ({
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "Inversión Inmobiliaria con Respaldo",
  description: "Oportunidad de inversión en proyectos de construcción...",
  provider: {
    "@type": "Organization",
    name: site.legalName,
    url: site.url,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: site.phone,
      email: site.email,
      contactType: "investment inquiry",
      areaServed: "AR",
      availableLanguage: ["es"],
    },
  },
  termsOfService: `${site.url}/politica-de-privacidad`,
  category: "Real Estate Investment",
  areaServed: { "@type": "Country", name: "Argentina" },
  feesAndCommissionsSpecification: "Las condiciones específicas...",
});
```

---

## ✅ Checklist de Implementación

### Antes de empezar:
- [ ] Proyecto Next.js 15+
- [ ] Tailwind CSS configurado
- [ ] Fuentes Playfair Display y Raleway cargadas
- [ ] GTM instalado en el sitio
- [ ] Dependencias instaladas (`react-hook-form`, `zod`, `framer-motion`)

### Durante la implementación:
- [ ] Crear carpeta `InvestmentModal/`
- [ ] Copiar/crear 7 archivos base
- [ ] **MODIFICAR mensaje WhatsApp** con nombre del sitio
- [ ] **MODIFICAR número WhatsApp** si es diferente
- [ ] Verificar que `trackEvents: false`
- [ ] Agregar todos los IDs únicos
- [ ] Integrar en `layout.tsx`
- [ ] Agregar structured data SEO
- [ ] Agregar preconnect a WhatsApp

### Testing:
- [ ] Build sin errores (`npm run build`)
- [ ] Modal aparece a los 1.2s
- [ ] Cerrar con ESC funciona
- [ ] Cerrar con X funciona
- [ ] Cerrar con click fuera funciona
- [ ] Validación de form funciona
- [ ] Submit abre WhatsApp correctamente
- [ ] Mensaje pre-llenado correcto
- [ ] No aparece en reload (sessionStorage)
- [ ] Aparece en nueva pestaña
- [ ] GTM Preview detecta elementos con IDs

---

## 🚨 Puntos Críticos

### ❌ **ERRORES COMUNES**:

1. **Next.js 15 - Error `ssr: false`**
   - **Solución**: Usar `InvestmentModalWrapper.tsx` como client component

2. **ESLint error `any`**
   - **Solución**: Usar `(window as Window & { dataLayer?: unknown[] }).dataLayer`

3. **Zod error `literal(true)`**
   - **Solución**: Usar `z.boolean().refine((val) => val === true, {...})`

4. **Modal no cierra con ESC**
   - **Verificar**: Hook de keyboard está en `useInvestmentModal.ts`

5. **Eventos GTM se duplican**
   - **Verificar**: `trackEvents: false` en config

---

## 📱 Comportamiento Esperado

| Acción | Resultado |
|--------|-----------|
| Primera visita | Modal aparece a los 1.2s |
| Reload (F5) | Modal NO aparece |
| Nueva pestaña | Modal aparece |
| Cerrar pestaña → nueva | Modal aparece |
| Incógnito | Modal aparece (nueva sesión) |
| ESC | Modal se cierra |
| Click en X | Modal se cierra |
| Click fuera | Modal se cierra |
| Submit válido | Abre WhatsApp con mensaje |
| Submit inválido | Muestra errores |

---

## 🎨 Personalización de Textos

### Título del modal:
```tsx
<h2>Oportunidad de inversión con respaldo inmobiliario</h2>
```

### Descripción:
```tsx
<p>CORADIR S.A. ofrece la posibilidad de participar...</p>
```

### Botón CTA:
```tsx
<button>Quiero que me contacten</button>
```

### Aviso legal:
```tsx
<p>Esta comunicación tiene carácter exclusivamente informativo...</p>
```

---

## 🔄 Variaciones por Proyecto

### Cambiar según el sitio:

1. **Mensaje WhatsApp**: Línea con "web [NOMBRE]"
2. **Número WhatsApp**: Puede ser diferente por proyecto
3. **Delay**: Ajustar `delayMs` según preferencia
4. **Textos**: Títulos, descripciones, etc.
5. **Colores**: Adaptar a la paleta del proyecto
6. **IDs de GTM**: Mantener el prefijo `investment-*` pero agregar sufijo si hay múltiples modals

---

## 📚 Documentación Adicional

Crear archivo `GTM_IDS.md` con:
- Lista completa de IDs
- Configuración de triggers GTM
- Ejemplos de tags GA4
- Variables personalizadas
- Testing checklist

---

## 🚀 Prompt para IA (Claude/ChatGPT)

```
Necesito implementar un popup modal de inversiones en mi proyecto Next.js siguiendo esta guía:

PROYECTO:
- Framework: Next.js 15+
- Estilos: Tailwind CSS
- Dependencias: react-hook-form, zod, framer-motion (ya instaladas)

REQUISITOS:
1. Modal que aparezca 1 vez por sesión a los 1.2 segundos
2. Formulario con validación: nombre, email, teléfono, monto (opcional)
3. Envío directo a WhatsApp con mensaje pre-llenado
4. IDs únicos en TODOS los elementos para GTM
5. SIN eventos automáticos (trackEvents: false)
6. Schema.org FinancialProduct para SEO
7. Accesibilidad completa (WCAG 2.1 AA)
8. Lazy loading

PERSONALIZACIÓN:
- Número WhatsApp: [TU_NUMERO]
- Nombre del sitio en mensaje: "[NOMBRE_SITIO]"
- Colores: [TUS_COLORES_TAILWIND]

ESTRUCTURA:
Crear en: src/app/components/InvestmentModal/
- types.ts
- useInvestmentModal.ts
- InvestmentModalContent.tsx
- InvestmentModal.tsx
- InvestmentModalWrapper.tsx
- InvestmentModalStructuredData.tsx
- GTM_IDS.md

Integrar en src/app/layout.tsx

Seguir exactamente la guía en: INVESTMENT_MODAL_IMPLEMENTATION_GUIDE.md

Verificar:
✅ trackEvents: false
✅ Todos los elementos tienen IDs únicos
✅ Mensaje WhatsApp incluye identificador del sitio
✅ Build sin errores
✅ Modal funciona correctamente

Cuando termines, dame:
1. Lista de archivos creados
2. Cambios en layout.tsx
3. Lista de IDs para configurar en GTM
4. Comandos para build y deploy local
```

---

## 📞 Soporte

Si encontrás problemas:
1. Verificar que todas las dependencias estén instaladas
2. Revisar errores de ESLint/TypeScript
3. Verificar que los paths de import sean correctos
4. Revisar que `trackEvents: false`
5. Testear en modo incógnito

---

## 🎉 Resultado Final

- ✅ Modal profesional y accesible
- ✅ Control total desde GTM
- ✅ SEO optimizado
- ✅ Performance óptima (lazy loading)
- ✅ Conversión directa a WhatsApp
- ✅ Fácil de replicar en otros proyectos

---

**Última actualización**: 2025-11-14
**Versión**: 1.0
**Proyecto base**: coradir-homes
