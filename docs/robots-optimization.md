# Optimización de Robots.txt

## Cambios realizados

### ✅ Mejoras implementadas:

#### 1. **Bloqueo de recursos internos**
```
Disallow: /_next/static/
Disallow: /_next/image
```
- Evita que los bots indexen assets de Next.js
- Ahorra crawl budget (recursos de rastreo)
- Los archivos estáticos no aportan valor SEO

#### 2. **Bloqueo de archivos de sistema**
```
Disallow: /*.json$
Disallow: /sitemap-*.xml
```
- Los .json no deben indexarse (datos internos)
- Solo el sitemap principal debe ser público

#### 3. **Allow explícito para páginas importantes**
```
Allow: /vivienda-joven
Allow: /la-torre-ii
Allow: /inversiones-inteligentes
...
```
- Prioriza el rastreo de páginas clave
- Ayuda a Google a entender la jerarquía del sitio

#### 4. **Control de bots SEO tools**
```
User-agent: AhrefsBot
Crawl-delay: 10
```
- Herramientas como Ahrefs, SEMrush consumen crawl budget
- Crawl-delay: 10 segundos = rastreo más lento pero permitido
- Útil para análisis competitivo pero sin impactar performance

#### 5. **Bloqueo de scrapers agresivos**
```
User-agent: MJ12bot
Disallow: /
```
- Bots que solo extraen contenido sin valor
- No aportan tráfico ni SEO
- Liberan recursos del servidor

#### 6. **Prioridad para bots importantes**
```
User-agent: Googlebot
Allow: /
Crawl-delay: 0
```
- Google y Bing sin restricciones
- Máxima velocidad de rastreo
- Incluye Googlebot-Image para búsqueda de imágenes

---

## Crawl Budget

**¿Qué es?**
El número de páginas que Google rastrea en tu sitio en un período determinado.

**¿Por qué importa?**
- Sitios con crawl budget bajo pueden tener páginas sin indexar
- Bloquear recursos innecesarios libera budget para páginas importantes

**Optimizaciones:**
- ✅ Bloqueamos `_next/static/` (JS/CSS chunks)
- ✅ Bloqueamos `_next/image` (imágenes procesadas)
- ✅ Ralentizamos bots SEO (Ahrefs, SEMrush)
- ✅ Bloqueamos scrapers malos

---

## Archivo adicional: security.txt

**Ubicación:** `/.well-known/security.txt`

**Propósito:**
- Estándar RFC 9116 para contacto de seguridad
- Mejora la confianza del sitio
- Facilita reportar vulnerabilidades responsablemente

**Contenido:**
```
Contact: mailto:ia@coradir.com.ar
Preferred-Languages: es, en
Canonical: https://homes.coradir.com.ar/.well-known/security.txt
```

---

## Verificación

### 1. **Probar robots.txt:**
https://homes.coradir.com.ar/robots.txt

### 2. **Google Search Console:**
- Settings → Crawling → robots.txt Tester
- Pegar el contenido y probar URLs

### 3. **Validar que todo funciona:**
```bash
# Verificar que páginas importantes NO estén bloqueadas
curl -A "Googlebot" https://homes.coradir.com.ar/vivienda-joven

# Verificar que APIs estén bloqueadas
curl -A "Googlebot" https://homes.coradir.com.ar/api/verify-captcha
```

---

## Monitoreo post-implementación

**Después de 7 días:**

1. **Search Console → Coverage:**
   - Verificar que no hayan aumentado errores "Blocked by robots.txt"
   - Confirmar que páginas importantes están indexadas

2. **Search Console → Crawl Stats:**
   - Verificar que el crawl budget se usa eficientemente
   - Idealmente: más páginas HTML, menos assets estáticos

3. **Logs del servidor:**
   - Verificar reducción de tráfico de bots bloqueados
   - Confirmar que Googlebot sigue rastreando normalmente

---

## Notas importantes

⚠️ **NUNCA bloquear:**
- `/` (raíz del sitio)
- Páginas públicas importantes
- CSS crítico inline (ya está inline, OK)
- Googlebot o Bingbot

✅ **SIEMPRE bloquear:**
- `/api/` (endpoints internos)
- Archivos de configuración (.env, .json)
- Rutas de admin (si existen)
- Scrapers conocidos como malos

---

## Mejoras futuras opcionales

### 1. **Crawl-delay dinámico:**
Si el servidor sufre, agregar:
```
User-agent: *
Crawl-delay: 1
```

### 2. **Bloqueo de parámetros:**
Si hay URLs con parámetros de tracking:
```
Disallow: /*?utm_*
Disallow: /*?fbclid=*
```

### 3. **Configuración Next.js:**
En `next.config.ts` ya tenemos trailing slash = false, correcto para SEO.
