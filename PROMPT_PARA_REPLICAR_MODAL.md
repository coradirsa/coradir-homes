# 🚀 PROMPT PARA REPLICAR INVESTMENT MODAL EN OTRO PROYECTO

Copiá y pegá este prompt completo en Claude/ChatGPT para replicar el modal en otro proyecto Next.js.

---

## 📋 PROMPT COMPLETO:

```
Necesito que implementes un modal popup de inversiones inmobiliarias idéntico al del proyecto coradir-homes.

PROYECTO ACTUAL:
- Framework: Next.js 15+ con App Router
- Estilos: Tailwind CSS
- TypeScript: Sí
- Dependencias ya instaladas: react-hook-form, @hookform/resolvers, zod, framer-motion

PERSONALIZACIÓN PARA ESTE PROYECTO:
- Número WhatsApp: [REEMPLAZAR_CON_TU_NUMERO] (ej: 5492664649967)
- Identificador del sitio: [REEMPLAZAR_CON_NOMBRE] (ej: "corporativos", "instituciones")
- Este identificador va en el mensaje de WhatsApp para saber de qué web viene el lead

ESPECIFICACIONES TÉCNICAS:

1. ESTRUCTURA DE ARCHIVOS
Crear en: src/app/components/InvestmentModal/

- types.ts
  * Interfaces: InvestmentFormData, InvestmentModalConfig, InvestmentModalProps, UseInvestmentModalReturn
  * Campos form: nombre, email, telefono, monto (optional), acepta_politica (boolean)

- useInvestmentModal.ts
  * Hook personalizado
  * Control sessionStorage con key: "cd_investment_modal_shown"
  * showOncePerSession: true (mostrar 1 vez por sesión)
  * delayMs: 1200 (delay antes de aparecer)
  * Handlers: openModal, closeModal
  * ESC key listener
  * Body scroll lock cuando modal abierto
  * trackEvents: false (CRÍTICO - sin eventos automáticos)

- InvestmentModalContent.tsx
  * Formulario completo con React Hook Form
  * Validación Zod:
    - nombre: min 3 caracteres
    - email: válido
    - telefono: min 8, solo números y caracteres válidos
    - monto: string opcional
    - acepta_politica: boolean.refine(val => val === true)
  * Mensaje WhatsApp:
    ```
    Hola! Vengo del pop-up de inversiones de la web [IDENTIFICADOR_SITIO].
    Quiero que me contacten.

    Mis datos son:
    - *Nombre:* ${nombre}
    - *Email:* ${email}
    - *Teléfono:* ${telefono}
    - *Monto estimado:* ${monto || "No especificado"}
    ```
  * Submit abre WhatsApp: https://wa.me/[NUMERO]?text=[mensaje_codificado]
  * IDs obligatorios:
    - #investment-modal-content (div principal)
    - #investment-modal-close-btn (botón X)
    - #investment-modal-form (formulario)
    - #investment-modal-submit-btn (botón submit)
    - #nombre, #email, #telefono, #monto, #acepta_politica (inputs)

- InvestmentModal.tsx
  * Componente principal
  * Framer Motion AnimatePresence
  * Trap focus (accesibilidad)
  * Config default:
    ```
    showOncePerSession: true,
    delayMs: 1200,
    whatsappNumber: "[TU_NUMERO]",
    trackEvents: false
    ```
  * IDs obligatorios:
    - #investment-modal-container (contenedor principal)
    - #investment-modal-backdrop (fondo oscuro, cerrar al click)
  * Click en backdrop cierra modal
  * Animaciones: fade in backdrop, scale + fade modal

- InvestmentModalWrapper.tsx
  * "use client"
  * Dynamic import de InvestmentModal con ssr: false
  * Export default del wrapper

- InvestmentModalStructuredData.tsx
  * Script con Schema.org JSON-LD
  * Tipo: FinancialProduct
  * Importar buildInvestmentProductJsonLd desde @/lib/seo

- GTM_IDS.md
  * Documentación completa de IDs
  * Guía de configuración GTM
  * Lista de eventos sugeridos
  * Ejemplos de triggers

2. MODIFICAR ARCHIVOS EXISTENTES:

src/app/layout.tsx:
- Importar: InvestmentModalWrapper
- Importar: InvestmentModalStructuredData
- Agregar en <head>:
  ```tsx
  <link rel="preconnect" href="https://wa.me" />
  <link rel="dns-prefetch" href="https://wa.me" />
  ```
- Agregar antes de </body>:
  ```tsx
  {/* Investment Product Structured Data */}
  <InvestmentModalStructuredData />

  {/* Investment Modal - Popup de inversiones inmobiliarias */}
  <InvestmentModalWrapper />
  ```

src/lib/seo/structuredData.ts:
- Agregar función buildInvestmentProductJsonLd:
  ```typescript
  export const buildInvestmentProductJsonLd = (site: SiteConfig = siteConfig): StructuredDataEntry => ({
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: "Inversión Inmobiliaria con Respaldo",
    description: "Oportunidad de inversión en proyectos de construcción de departamentos con garantía real sobre inmuebles mediante contratos privados e hipotecas sobre unidades terminadas.",
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
    feesAndCommissionsSpecification: "Las condiciones específicas (plazos, moneda, intereses, garantías) se acuerdan en contratos privados entre las partes.",
  });
  ```

3. ESTILOS TAILWIND:

El proyecto debe tener estos colores definidos:
- blue (primary)
- blue-gray
- blue-light
- gray
- black

Fuentes:
- font-playfair (títulos)
- font-raleway (texto)

Si no existen, usar las variables CSS del proyecto actual.

4. TEXTOS DEL MODAL:

Título: "Oportunidad de inversión con respaldo inmobiliario"

Descripción: "CORADIR S.A. ofrece la posibilidad de participar en proyectos de construcción de departamentos con garantía real sobre inmuebles de la compañía. Las operaciones se instrumentan mediante contratos privados e hipotecas sobre unidades terminadas (escritura pública e inscripción registral)."

Botón: "Quiero que me contacten"

Aviso legal: "Aviso legal: Esta comunicación tiene carácter exclusivamente informativo y no constituye una oferta pública de valores ni una captación de ahorro del público conforme a las Leyes 26.831 y 21.526. Las condiciones específicas (plazos, moneda, intereses, garantías) se acuerdan en contratos privados entre las partes, instrumentados en escritura pública con inscripción registral."

5. COMPORTAMIENTO:

✅ Modal aparece automáticamente a los 1.2 segundos
✅ Solo una vez por sesión (sessionStorage)
✅ Se cierra con: ESC, botón X, click fuera del modal
✅ Al cerrar pestaña y abrir nueva → modal aparece de nuevo
✅ En incógnito → siempre aparece (nueva sesión)
✅ Validación de formulario antes de submit
✅ Submit exitoso → abre WhatsApp en nueva pestaña
✅ Body scroll bloqueado cuando modal abierto
✅ Focus trap para navegación por teclado
✅ WCAG 2.1 AA compliant

6. GTM TRACKING:

NO incluir eventos automáticos (dataLayer.push)
Solo IDs para control manual desde GTM:

IDs obligatorios:
- #investment-modal-container → Element Visibility
- #investment-modal-backdrop → Click (cerrar)
- #investment-modal-close-btn → Click (cerrar X)
- #investment-modal-form → Form Submission
- #investment-modal-submit-btn → Click (CTA)
- #nombre, #email, #telefono, #monto → Capturar valores

Eventos GTM sugeridos:
- investment_modal_open
- investment_cta_click
- investment_form_submit
- investment_modal_close

7. VERIFICACIONES ANTES DE TERMINAR:

- [ ] npm run build → Sin errores
- [ ] Modal aparece a los 1.2 segundos
- [ ] Cierra con ESC
- [ ] Cierra con X
- [ ] Cierra con click fuera
- [ ] Validación funciona
- [ ] WhatsApp se abre con mensaje correcto
- [ ] Identificador del sitio en mensaje WhatsApp
- [ ] No aparece en reload de página
- [ ] Aparece en nueva pestaña
- [ ] Todos los IDs están presentes
- [ ] trackEvents: false
- [ ] Structured data agregado

ENTREGA:

1. Código completo de los 7 archivos
2. Modificaciones en layout.tsx y structuredData.ts
3. Archivo GTM_IDS.md con documentación
4. Lista de IDs para configurar en GTM
5. Instrucciones de testing

IMPORTANTE:
- NO usar eventos automáticos (dataLayer.push)
- Todos los elementos deben tener IDs únicos
- Mensaje WhatsApp DEBE incluir identificador del sitio
- trackEvents DEBE ser false
```

---

## ✏️ PERSONALIZACIÓN RÁPIDA

Antes de pegar el prompt, reemplazá:

1. `[REEMPLAZAR_CON_TU_NUMERO]` → Tu número de WhatsApp (ej: 5492664308765)
2. `[REEMPLAZAR_CON_NOMBRE]` → Nombre del sitio (ej: "corporativos", "instituciones", "terrenos")

---

## 🎯 EJEMPLO DE USO

```
PERSONALIZACIÓN PARA ESTE PROYECTO:
- Número WhatsApp: 5492664308765
- Identificador del sitio: corporativos
```

Esto generará el mensaje de WhatsApp:
```
Hola! Vengo del pop-up de inversiones de la web corporativos.
Quiero que me contacten...
```

---

## ✅ RESULTADO ESPERADO

La IA te va a entregar:
- 7 archivos TypeScript completos
- Modificaciones exactas para layout.tsx
- Función para structuredData.ts
- Documentación GTM completa
- Instrucciones de testing

Todo listo para copiar/pegar en tu proyecto.
