# Dominios de Google Habilitados en CSP - homes.coradir.com.ar

**Fecha:** 2025-12-17
**Sitio:** https://homes.coradir.com.ar
**Propósito:** Verificación con equipo de Google Tag Manager / Analytics

---

## 📋 Resumen Ejecutivo

Este documento lista **todos** los dominios de Google habilitados en la Content Security Policy (CSP) del sitio homes.coradir.com.ar para garantizar el correcto funcionamiento de:

- ✅ Google Tag Manager (GTM)
- ✅ Google Analytics 4 (GA4)
- ✅ Google Ads
- ✅ DoubleClick (Conversiones y Remarketing)
- ✅ Google Fonts
- ✅ reCAPTCHA Enterprise

---

## 🔐 Directivas CSP Configuradas

### 1️⃣ **script-src** (Carga de Scripts JavaScript)

**Dominios de Google permitidos:**
- `https://*.googletagmanager.com` (wildcard)
- `https://googletagmanager.com` (sin www)
- `https://tagmanager.google.com`
- `https://www.google-analytics.com`
- `https://google-analytics.com` (sin www)
- `https://*.google-analytics.com` (wildcard)
- `https://www.gstatic.com`
- `https://www.google.com`
- `https://www.google.com.ar` ⭐ (geolocalización Argentina)
- `https://*.google.com` (wildcard)
- `https://googleads.g.doubleclick.net`
- `https://stats.g.doubleclick.net` ⚠️ (agregado explícitamente)
- `https://www.googleadservices.com`
- `https://*.googlesyndication.com` (wildcard)
- `https://pagead2.googlesyndication.com`

**Políticas especiales:**
- ✅ `'unsafe-inline'` - Requerido por GTM para scripts inline
- ✅ `'unsafe-eval'` - Requerido por GTM para evaluación dinámica

---

### 2️⃣ **script-src-elem** (Elementos `<script>` en HTML)

**Dominios de Google permitidos:** *(Idénticos a script-src)*
- `https://*.googletagmanager.com`
- `https://googletagmanager.com`
- `https://tagmanager.google.com`
- `https://www.google-analytics.com`
- `https://google-analytics.com`
- `https://*.google-analytics.com`
- `https://www.gstatic.com`
- `https://www.google.com`
- `https://www.google.com.ar` ⭐
- `https://*.google.com`
- `https://googleads.g.doubleclick.net`
- `https://stats.g.doubleclick.net` ⚠️
- `https://www.googleadservices.com`
- `https://*.googlesyndication.com`
- `https://pagead2.googlesyndication.com`

---

### 3️⃣ **connect-src** (Conexiones XHR/Fetch/Beacon) ⚡ CRÍTICO

**Dominios de Google permitidos:**
- `https://*.google-analytics.com` (wildcard)
- `https://*.analytics.google.com` (wildcard)
- `https://analytics.google.com`
- `https://google-analytics.com` (sin www)
- `https://*.googletagmanager.com` (wildcard)
- `https://googletagmanager.com` (sin www)
- `https://www.google.com`
- `https://www.google.com.ar` ⭐
- `https://*.google.com` (wildcard)
- `https://recaptchaenterprise.googleapis.com` 🔒 (reCAPTCHA)
- `https://*.doubleclick.net` (wildcard)
- `https://stats.g.doubleclick.net` ⚠️ **EXPLÍCITO** (fix wildcard)
- `https://www.googleadservices.com`
- `https://*.googlesyndication.com` (wildcard)

**⚠️ Nota Importante:** `stats.g.doubleclick.net` está incluido **dos veces**:
1. Cubierto por wildcard `*.doubleclick.net`
2. Declarado explícitamente (algunos navegadores no respetan wildcards de tercer nivel)

---

### 4️⃣ **img-src** (Imágenes y Pixels de Tracking)

**Dominios de Google permitidos:**
- `https://*.google-analytics.com` (wildcard)
- `https://*.googletagmanager.com` (wildcard)
- `https://*.doubleclick.net` (wildcard - pixels de conversión)
- `https://*.google.com` (wildcard)
- `https://www.google.com.ar` ⭐
- `https://www.googleadservices.com`
- `https://*.googlesyndication.com` (wildcard)

**Políticas especiales:**
- ✅ `data:` - Imágenes inline base64
- ✅ `https:` - **Todas las imágenes HTTPS** (muy permisivo, usado para CDNs)

---

### 5️⃣ **style-src** (Hojas de Estilo CSS)

**Dominios de Google permitidos:**
- `https://*.googletagmanager.com` (wildcard)
- `https://googletagmanager.com` (sin www)
- `https://tagmanager.google.com`
- `https://fonts.googleapis.com` 🎨 (Google Fonts)
- `https://*.google.com` (wildcard)

**Políticas especiales:**
- ✅ `'unsafe-inline'` - Estilos inline requeridos por GTM

---

### 6️⃣ **font-src** (Fuentes Web)

**Dominios de Google permitidos:**
- `https://fonts.gstatic.com` 🎨 (Google Fonts)

**Políticas especiales:**
- ✅ `data:` - Fuentes inline base64

---

### 7️⃣ **frame-src** (iFrames permitidos)

**Dominios de Google permitidos:**
- `https://www.google.com` (reCAPTCHA)
- `https://www.google.com.ar` ⭐
- `https://*.google.com` (wildcard)
- `https://*.googletagmanager.com` (wildcard - debug mode)
- `https://googletagmanager.com` (sin www)
- `https://tagmanager.google.com`
- `https://bid.g.doubleclick.net` 💰 (subastas de anuncios)

---

## 🌍 Dominios NO-Google (Para Referencia)

**Servicios propios de Coradir:**
- `https://*.n8n.cloud` - Automatización N8N
- `https://automatic.coradir.com.ar` - Webhook automático
- `https://testbothome.coradir.ai` - Chatbot

---

## 🔍 Verificación Recomendada

### Endpoints Críticos que DEBEN funcionar:

1. **Google Tag Manager:**
   - ✅ `https://www.googletagmanager.com/gtm.js?id=GTM-PBZQ65VZ`

2. **Google Analytics 4:**
   - ✅ `https://www.google-analytics.com/g/collect`
   - ✅ `https://analytics.google.com/g/collect`

3. **DoubleClick (Conversiones):**
   - ✅ `https://stats.g.doubleclick.net/g/collect` ⚠️ (anteriormente bloqueado)
   - ✅ `https://googleads.g.doubleclick.net/pagead/...`

4. **reCAPTCHA Enterprise:**
   - ✅ `https://recaptchaenterprise.googleapis.com/v1/projects/...`
   - ✅ `https://www.google.com/recaptcha/enterprise.js`

---

## ❓ Preguntas para el Equipo de Google

1. **¿Falta algún dominio crítico para GTM/GA4/Ads?**
   - Revisar especialmente subdominios de tercer nivel (ej: `*.g.doubleclick.net`)

2. **¿Es necesario `www.gstatic.com/recaptcha/` en script-src?**
   - Actualmente solo tenemos `www.gstatic.com`

3. **¿Hay nuevos dominios de GA4 o GTM que debamos agregar?**
   - Ej: `region1.google-analytics.com`, `region1.analytics.google.com`

4. **¿Los wildcards `*.google.com` y `*.doubleclick.net` son suficientes?**
   - O debemos declarar subdominios específicos

5. **¿Es correcto usar `'unsafe-inline'` y `'unsafe-eval'`?**
   - ¿O existe alternativa con nonces para GTM?

---

## 📊 Historial de Cambios

### 2025-12-17
- ✅ Agregado `https://stats.g.doubleclick.net` explícitamente en connect-src
- ✅ Agregado `https://www.google.com.ar` para geolocalización Argentina
- ✅ Agregado soporte completo para Google Fonts
- ✅ Agregado `https://www.googleadservices.com` para conversiones
- ✅ Agregado `https://*.googlesyndication.com` para AdSense
- ✅ Agregado `https://bid.g.doubleclick.net` para subastas

---

## 📞 Contacto

**Sitio Web:** https://homes.coradir.com.ar
**GTM Container ID:** GTM-PBZQ65VZ
**Empresa:** Coradir SA
**Ubicación:** San Luis, Argentina 🇦🇷

---

**Generado por:** Claude Code
**Fecha:** 2025-12-17
