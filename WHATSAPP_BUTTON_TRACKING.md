# WhatsApp Button - Tracking Configuration

## Configuración del Evento en Google Tag Manager

### Event Details
- **Event Name:** `whatsapp_click`
- **Event Category:** `engagement`
- **Event Label:** `[pathname]` (ruta actual de la página)
- **Button ID:** `whatsapp-float-button`

---

## Listado de Rutas y Mensajes Personalizados

| Ruta | Mensaje de WhatsApp | Event Label (GTM) |
|------|---------------------|-------------------|
| `/` | Hola! Estoy interesado en conocer más sobre sus propiedades | `/` |
| `/proyectos` | Hola! Vi los proyectos y me gustaría más información | `/proyectos` |
| `/la-torre-ii` | Hola! Me interesa La Torre II, quisiera más detalles | `/la-torre-ii` |
| `/juana-64` | Hola! Me interesa Juana 64, quisiera más información | `/juana-64` |
| `/complejo-coradir` | Hola! Me interesa el Complejo Coradir, quisiera más detalles | `/complejo-coradir` |
| `/inversiones-inteligentes` | Hola! Me interesa invertir, quisiera más información | `/inversiones-inteligentes` |
| `/contacto` | Hola! Quisiera ponerme en contacto con ustedes | `/contacto` |
| `/saber-mas/*` | Hola! Quisiera recibir más información sobre sus propiedades | `/saber-mas/[interes]` |
| `/beneficios` | Hola! Estoy interesado en sus propiedades | `/beneficios` |
| `/corporativos` | Hola! Estoy interesado en sus propiedades | `/corporativos` |
| `/instituciones` | Hola! Estoy interesado en sus propiedades | `/instituciones` |
| `/terrenos` | Hola! Estoy interesado en sus propiedades | `/terrenos` |
| `/gracias` | Hola! Estoy interesado en sus propiedades | `/gracias` |
| **Otras rutas** | Hola! Estoy interesado en sus propiedades | `[pathname]` |

---

## Configuración en Google Tag Manager

### 1. Variables a crear

#### Variable: WhatsApp Click Pathname
- **Tipo:** Variable de capa de datos
- **Nombre de variable de capa de datos:** `gtmOnElementVisibility`
- **Usar en:** Todos los eventos de WhatsApp

### 2. Trigger (Disparador)

#### Trigger: WhatsApp Button Click
- **Tipo:** Evento personalizado
- **Nombre del evento:** `whatsapp_click`
- **Este disparador se activa en:** Todos los eventos personalizados

### 3. Tag (Etiqueta)

#### Tag: WhatsApp Click - GA4 Event
- **Tipo:** Google Analytics: Evento de GA4
- **Nombre del evento:** `whatsapp_click`
- **Parámetros del evento:**
  - `event_category`: `engagement`
  - `event_label`: `{{Page Path}}`
  - `button_location`: `floating_bottom_right`
  - `destination`: `whatsapp`
- **Disparador:** WhatsApp Button Click

---

## Datos que se envían a Google Analytics

```javascript
gtag('event', 'whatsapp_click', {
  event_category: 'engagement',
  event_label: '/la-torre-ii',  // Ejemplo: pathname actual
  value: '/la-torre-ii'         // Pathname para análisis
});
```

---

## Análisis Recomendados

### Métricas a monitorear en GA4:

1. **Total de clics en WhatsApp por página**
   - Dimensión: `event_label`
   - Métrica: `event_count`

2. **Tasa de conversión de WhatsApp**
   - Comparar páginas vistas vs clics en WhatsApp

3. **Páginas con mayor engagement**
   - Ordenar por `event_count` descendente

4. **Embudo de conversión**
   - Landing page → Click WhatsApp → Conversión

---

## Testing

Para verificar que el tracking funciona correctamente:

1. Abrir Chrome DevTools
2. Ir a la pestaña Console
3. Ejecutar: `dataLayer` para ver todos los eventos
4. Hacer clic en el botón de WhatsApp
5. Verificar que aparezca el evento con:
   ```javascript
   {
     event: 'whatsapp_click',
     event_category: 'engagement',
     event_label: '/la-torre-ii'
   }
   ```

---

## Número de WhatsApp

**Número configurado:** `+54 266 454-7788` (5492664547788)

---

## Notas Técnicas

- El botón usa el hook `useWhatsAppUtm` que añade parámetros UTM al mensaje si el usuario viene de una campaña
- El componente está envuelto en `<Suspense>` para manejar hooks de Next.js
- El botón se renderiza después de 1 segundo para mejorar el performance inicial
- El tooltip aparece a los 3 segundos y se oculta automáticamente a los 8 segundos

---

## Archivo de Implementación

**Ubicación:** `src/app/components/WhatsAppButton.tsx`
**ID del botón:** `whatsapp-float-button`
