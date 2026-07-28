# 🚀 Guía de Integraciones SEO - Coradir Homes

Después de alcanzar **99/100 en Lighthouse**, los siguientes pasos son configurar herramientas de medición y autoridad.

---

## 📚 Índice de guías

### 1️⃣ [Search Console - Verificación y Sitemap](./search-console-setup.md)
**Tiempo:** 5 minutos
**Prioridad:** 🔴 ALTA

**Qué hace:**
- Verifica tu sitio en Google Search Console
- Sube el sitemap.xml para indexación
- Configura alertas de problemas
- Monitorea impresiones, CTR y posiciones

**Acción inmediata:**
1. Ir a [Google Search Console](https://search.google.com/search-console)
2. Agregar propiedad: `https://homes.coradir.com.ar`
3. Verificar con GTM (ya instalado)
4. Subir sitemap: `sitemap.xml`

---

### 2️⃣ [Google Analytics 4 - Conversiones](./ga4-conversions-setup.md)
**Tiempo:** 30 minutos (implementación de código)
**Prioridad:** 🔴 ALTA

**Qué hace:**
- Trackea envíos de formularios
- Mide clics en CTAs importantes
- Detecta usuarios comprometidos (scroll 75%)
- Configura conversiones para medir ROI

**Eventos a implementar:**
- ✅ `form_submit` - Envío de formularios
- ✅ `cta_click` - Clics en botones principales
- ✅ `scroll` - Engagement profundo
- ✅ `view_item` - Visualización de proyectos

**Acción inmediata:**
1. Crear helper de tracking en `src/lib/analytics.ts`
2. Agregar tracking en formularios (3 archivos)
3. Agregar tracking en botones (1 archivo)
4. Configurar scroll en GTM
5. Marcar eventos como conversiones en GA4

---

### 3️⃣ [Google Business Profile](./google-business-profile-setup.md)
**Tiempo:** 15 minutos iniciales, luego mantenimiento semanal
**Prioridad:** 🟡 MEDIA-ALTA

**Qué hace:**
- Te posiciona en el "Map Pack" de Google
- Genera confianza con reseñas
- Aumenta llamadas y visitas
- Mejora SEO local

**Checklist inicial:**
- [ ] Crear/reclamar perfil
- [ ] Completar NAP (Name, Address, Phone)
- [ ] Subir 10+ fotos de calidad
- [ ] Agregar descripción con keywords
- [ ] Configurar horarios
- [ ] Agregar servicios y productos
- [ ] Solicitar verificación
- [ ] Pedir primeras 5 reseñas

**Mantenimiento:**
- 📅 1-2 posts por semana
- ⭐ Responder todas las reseñas
- 📸 Actualizar fotos mensualmente

---

## 🎯 Plan de acción recomendado

### Semana 1:
- [x] ✅ Optimizar performance a 99/100
- [ ] 🔴 Configurar Search Console (5 min)
- [ ] 🔴 Implementar tracking GA4 (30 min)
- [ ] 🟡 Crear Google Business Profile (15 min)

### Semana 2:
- [ ] Esperar verificación de Google Business (7-14 días)
- [ ] Publicar primer post en Google Business
- [ ] Pedir primeras 5 reseñas a clientes
- [ ] Verificar que eventos GA4 funcionen

### Semana 3-4:
- [ ] Revisar primeros datos en Search Console
- [ ] Analizar conversiones en GA4
- [ ] Optimizar CTAs basado en datos
- [ ] Crear dashboard en Looker Studio

### Mes 2-3:
- [ ] Publicaciones semanales en Google Business
- [ ] Alcanzar 10+ reseñas con 4.5+ estrellas
- [ ] Link building local (partners, directorios)
- [ ] Iterar basado en métricas

---

## 📊 Métricas objetivo (3 meses)

| Métrica | Baseline | Meta 3 meses |
|---------|----------|--------------|
| **Performance Lighthouse** | 71 → 99/100 | ✅ 99/100 |
| **Impresiones Search Console** | ? | 5,000+/mes |
| **CTR orgánico** | ? | >3% |
| **Conversiones (forms)** | ? | 20-50/mes |
| **Reseñas Google** | 0 | 15+ |
| **Rating promedio** | - | 4.7+ |
| **Llamadas desde Google** | 0 | 30+/mes |

---

## 🔗 Enlaces útiles

- 📊 [Google Search Console](https://search.google.com/search-console)
- 📈 [Google Analytics 4](https://analytics.google.com/)
- 📍 [Google Business Profile](https://business.google.com/)
- 🏷️ [Google Tag Manager](https://tagmanager.google.com/)
- 🔍 [Google Tag Assistant](https://tagassistant.google.com/)
- 📱 App móvil: Google Business Profile Manager

---

## ❓ ¿Necesitas ayuda?

Si tienes dudas sobre alguna integración:
1. Lee la guía específica en los links arriba
2. Verifica que hayas seguido todos los pasos
3. Usa las herramientas de debugging (Tag Assistant, Tiempo Real GA4)

---

## 📝 Notas importantes

### Sobre Search Console:
- Los datos tardan 24-48 horas en aparecer
- Necesitas 7-14 días para ver tendencias
- El sitemap se procesa gradualmente

### Sobre GA4:
- Los eventos aparecen en "Tiempo Real" en ~30 segundos
- Los informes completos tardan 24-48 horas
- Las conversiones se pueden marcar retroactivamente

### Sobre Google Business:
- La verificación tarda 7-14 días por correo
- Las reseñas afectan el ranking local
- Responder reseñas mejora la reputación

---

## ✅ Checklist de implementación

### Técnico:
- [x] Performance 99/100
- [x] Sitemap.xml generado
- [x] Robots.txt configurado
- [x] GTM instalado
- [x] GA4 conectado
- [ ] Search Console verificado
- [ ] Eventos de conversión implementados

### Contenido:
- [x] Structured data implementado
- [x] Metadata optimizada
- [x] Alt text en imágenes
- [ ] Posts semanales en Google Business
- [ ] Reseñas de clientes

### Medición:
- [ ] Dashboard de KPIs creado
- [ ] Conversiones configuradas
- [ ] Alertas activadas
- [ ] Reportes mensuales automatizados

---

¡Éxito con las integraciones! 🚀
