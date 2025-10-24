# Configuración de Conversiones en Google Analytics 4

## Estado actual
Ya tienes GA4 instalado con el ID: `G-0FW1131XF8` a través de GTM.

## 1. Eventos a configurar

### A. Envío de formulario ✅ (Más importante)
**Trigger:** Cuando un usuario envía el formulario de contacto en cualquier página

**Páginas con formularios:**
- `/vivienda-joven` - Formulario principal
- `/la-torre-ii` - Formulario de contacto
- `/saber-mas/[interes]` - Formularios de interés

### B. Clic en CTAs
**Botones importantes:**
- "Quiero saber más" (hero)
- "Sumate a este gran proyecto" (vivienda-joven)
- "Contactanos" (header/footer)
- "Ver más" / "Saber más" (cards de proyectos)

### C. Scroll profundo
**Trigger:** Usuario hace scroll hasta 75% de la página

### D. Llamadas telefónicas (si aplica)
**Trigger:** Clic en número de teléfono

---

## 2. Implementación con GTM (Recomendado)

### Paso 1: Configurar evento de envío de formulario

Ya tienes `react-hook-form` en tu código. Vamos a agregar tracking:

#### Código a agregar en tus formularios:

**Archivo: `src/app/vivienda-joven/components/form/form.tsx`**

```typescript
const onSubmit = async (data: FormData) => {
  setLoading(true);
  try {
    // ... tu código de verificación de captcha ...

    const response = await fetch(
      "https://docs.google.com/forms/d/e/1FAIpQLSeJ2j3pSTFaCOMjZNpFJ4NR_YXNvuqkzgCYw48FseBpbA19xA/formResponse",
      formOptions
    );

    if (response.ok) {
      // 🆕 AGREGAR: Enviar evento a GA4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'form_submit', {
          form_name: 'Vivienda Joven - Contacto',
          form_location: '/vivienda-joven',
          value: 1,
        });
      }

      toast.success("Formulario enviado exitosamente!");
      reset();
    }
  } catch (error) {
    // ... manejo de errores ...
  } finally {
    setLoading(false);
  }
};
```

**Archivo: `src/app/la-torre-ii/components/ContactSection.tsx`**
```typescript
// Similar al anterior, agregar después de envío exitoso:
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'form_submit', {
    form_name: 'La Torre II - Contacto',
    form_location: '/la-torre-ii',
    value: 1,
  });
}
```

**Archivo: `src/app/saber-mas/[interes]/components/saberMas.tsx`**
```typescript
// Después de envío exitoso:
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'form_submit', {
    form_name: `Saber Más - ${interes}`,
    form_location: `/saber-mas/${interes}`,
    value: 1,
  });
}
```

### Paso 2: Tracking de clics en CTAs

**Archivo: `src/app/components/buttonContact.tsx`**

```typescript
export default function ButtonContact({ href, className, label, icon, id }: ButtonContactProps) {
  const handleClick = () => {
    // 🆕 AGREGAR: Tracking de clic
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'cta_click', {
        cta_text: label,
        cta_location: href,
        button_id: id || 'unknown',
      });
    }
  };

  return (
    <Link
      href={href}
      className={className}
      id={id}
      onClick={handleClick}
    >
      {/* ... resto del componente ... */}
    </Link>
  );
}
```

### Paso 3: Scroll tracking (usar GTM)

En **Google Tag Manager**:

1. Ve a **"Etiquetas"** → **"Nueva"**
2. Configuración de etiqueta:
   - Tipo: **Google Analytics: Evento GA4**
   - ID de configuración: `G-0FW1131XF8`
   - Nombre del evento: `scroll`
   - Parámetros del evento:
     - `percent_scrolled: {{Scroll Depth Threshold}}`

3. Activador:
   - Tipo: **Desplazamiento**
   - Porcentajes verticales: `25, 50, 75, 90`
   - Solo en: **Todas las páginas**

4. Guarda y **Publica**

---

## 3. Configurar conversiones en GA4

### En la interfaz de GA4:

1. Ve a **Admin** → **Conversiones**
2. Haz clic en **"Nuevo evento de conversión"**
3. Agrega estos eventos como conversiones:

| Nombre del evento | Descripción | Valor |
|-------------------|-------------|-------|
| `form_submit` | Envío de formulario | Alto |
| `cta_click` | Clic en CTA principal | Medio |
| `scroll` (75%) | Engagement alto | Bajo |

4. Para cada uno, marca como **"Marcar como conversión"**

---

## 4. Crear un helper de tracking

**Archivo: `src/lib/analytics.ts`** (nuevo)

```typescript
// Helper para tracking de eventos en GA4
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

// Eventos específicos
export const trackFormSubmit = (formName: string, formLocation: string) => {
  trackEvent('form_submit', {
    form_name: formName,
    form_location: formLocation,
    value: 1,
  });
};

export const trackCTAClick = (ctaText: string, ctaLocation: string, buttonId?: string) => {
  trackEvent('cta_click', {
    cta_text: ctaText,
    cta_location: ctaLocation,
    button_id: buttonId || 'unknown',
  });
};

export const trackProjectView = (projectName: string, projectUrl: string) => {
  trackEvent('view_item', {
    item_name: projectName,
    item_category: 'Proyecto Inmobiliario',
    item_list_name: 'Proyectos',
  });
};
```

Luego usar en tus componentes:
```typescript
import { trackFormSubmit, trackCTAClick } from '@/lib/analytics';

// En el formulario:
trackFormSubmit('Vivienda Joven - Contacto', '/vivienda-joven');

// En botones:
trackCTAClick(label, href, id);
```

---

## 5. Verificar que funciona

### Usando Google Tag Assistant:
1. Instala [Google Tag Assistant](https://tagassistant.google.com/)
2. Abre tu sitio en local o producción
3. Haz clic en "Connect"
4. Realiza acciones (enviar formulario, hacer clic en botones)
5. Verifica que los eventos aparezcan en tiempo real

### En GA4 Tiempo Real:
1. Ve a **Informes** → **Tiempo real**
2. Abre tu sitio en otra pestaña
3. Realiza acciones
4. Deberías ver los eventos aparecer en ~30 segundos

---

## 6. Embudos de conversión (opcional)

Una vez tengas datos (2-4 semanas), crea embudos:

1. **Embudo Vivienda Joven:**
   - Visita `/vivienda-joven`
   - Scroll 75%
   - Clic CTA "Sumate"
   - `form_submit`

2. **Embudo La Torre II:**
   - Visita `/la-torre-ii`
   - View amenities
   - Clic CTA "Contactar"
   - `form_submit`

---

## 7. Objetivos de conversión sugeridos

| Objetivo | Meta Mensual | Cómo medirlo |
|----------|--------------|--------------|
| Formularios enviados | 20-50 | `form_submit` |
| CTR de proyectos | >15% | Clics / Impresiones |
| Tiempo en sitio | >2 min | GA4 engagement |
| Bounce rate | <60% | GA4 engagement rate |

---

## Próximos pasos

1. ✅ Implementar código de tracking en formularios
2. ✅ Configurar scroll tracking en GTM
3. ✅ Marcar eventos como conversiones en GA4
4. ⏳ Esperar 7-14 días para datos
5. 📊 Crear informes personalizados
6. 🔄 Iterar basado en resultados
