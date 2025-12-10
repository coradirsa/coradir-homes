# Migración a reCAPTCHA Enterprise - Resumen

## 📋 Cambios Realizados

### 1. Backend - API Route
- **Archivo:** `src/app/api/verify-captcha/route.ts`
- **Cambios:**
  - Migrado de reCAPTCHA v3 estándar a **reCAPTCHA Enterprise**
  - Implementación usando **REST API** (sin SDK, ideal para Docker)
  - Eliminada dependencia de `@google-cloud/recaptcha-enterprise`
  - Validación de token, action y score de riesgo
  - Logs detallados para debugging

### 2. Frontend - Provider
- **Archivo:** `src/app/components/reCaptcha.tsx`
- **Cambios:**
  - Agregado `useEnterprise={true}` al GoogleReCaptchaProvider
  - Configuración optimizada de carga del script

### 3. Formularios
- **Archivos modificados:**
  - `src/app/components/projectForm.tsx`
  - `src/app/contacto/components/ContactForm.tsx`
  - `src/app/saber-mas/[interes]/components/saberMas.tsx`
- **Cambio:** Todos los formularios ahora envían el parámetro `action` junto con el `token`

### 4. Configuración Docker
- **docker-compose.yml:**
  - Eliminada: `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY`
  - Agregadas: `RECAPTCHA_PROJECT_ID`, `RECAPTCHA_API_KEY`, `RECAPTCHA_MIN_SCORE`

- **Dockerfile:**
  - Eliminado build arg: `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY`

### 5. Variables de Entorno
- **.env.example:**
  - Actualizado con las nuevas variables requeridas
  - Documentación clara de dónde obtener cada valor

### 6. Optimizaciones de Memoria
- **docker-compose.yml:**
  - Memoria límite aumentada de 1GB → 2GB
  - Memoria reservada aumentada de 256MB → 512MB
  - Agregado `NODE_OPTIONS=--max-old-space-size=1536`

## 🔐 Variables de Entorno Requeridas

```bash
# Frontend (pública)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ld0YWYrAAAAAG8P-0JBdoRnLop74rCmY8wZfdg-

# Backend (privadas)
RECAPTCHA_PROJECT_ID=captcha-v3-463413
RECAPTCHA_API_KEY=AIzaSyBsu5kYOt74xm_W3dqCZrCVPxaSc6A1yks
RECAPTCHA_MIN_SCORE=0.5
```

## 🚀 Pasos para Deploy en Producción

### 1. Actualizar Variables en Portainer

En la configuración del stack de Portainer:

**ELIMINAR:**
```
NEXT_PUBLIC_RECAPTCHA_SECRET_KEY
```

**AGREGAR/ACTUALIZAR:**
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ld0YWYrAAAAAG8P-0JBdoRnLop74rCmY8wZfdg-
RECAPTCHA_PROJECT_ID=captcha-v3-463413
RECAPTCHA_API_KEY=AIzaSyBsu5kYOt74xm_W3dqCZrCVPxaSc6A1yks
RECAPTCHA_MIN_SCORE=0.5
NODE_OPTIONS=--max-old-space-size=1536
```

### 2. Pull y Rebuild

Desde tu servidor o Portainer:

```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

O en Portainer:
1. Ve al stack "coradir-homes"
2. Click en "Update the stack"
3. Activa "Re-pull image and redeploy"
4. Click en "Update"

### 3. Verificar que Funciona

1. **Abrir la consola del navegador (F12)**
2. **Navegar a:** https://homes.coradir.com.ar/juana-64
3. **Completar y enviar el formulario**
4. **Ver los logs del contenedor:**

```bash
docker logs web_coradir_homes --tail 50 -f
```

Deberías ver algo como:
```json
Respuesta de reCAPTCHA Enterprise: {
  "valid": true,
  "action": "form_submit",
  "score": 0.9
}
```

## ✅ Beneficios de la Migración

1. **Soluciona el error "browser-error"** - Ya no hay mismatch entre keys
2. **Mejor seguridad** - reCAPTCHA Enterprise ofrece protección nivel empresarial
3. **Más simple para Docker** - No requiere archivos de credenciales, solo variables de entorno
4. **Mejor performance** - Configuración optimizada de memoria para Next.js
5. **Logs detallados** - Más fácil debuggear problemas

## 🐛 Troubleshooting

### Error: "Variables de reCAPTCHA Enterprise no configuradas"
- **Causa:** Falta alguna variable de entorno
- **Solución:** Verificar que `RECAPTCHA_PROJECT_ID`, `RECAPTCHA_API_KEY` y `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` estén configuradas

### Error 403 en los logs
- **Causa:** API Key incorrecta o sin permisos
- **Solución:**
  1. Verificar que la API Key sea correcta
  2. Ir a Google Cloud Console → APIs & Services → Credentials
  3. Editar la API Key y asegurar que tenga habilitada "reCAPTCHA Enterprise API"

### Score bajo (< 0.5)
- **Causa:** reCAPTCHA detecta comportamiento sospechoso
- **Solución:**
  1. Puede ser normal en desarrollo
  2. Ajustar `RECAPTCHA_MIN_SCORE` si es necesario (ej: 0.3)
  3. Revisar logs para entender las razones

### Container se queda sin memoria
- **Causa:** Next.js procesando imágenes pesadas
- **Solución:** Ya implementado - límite de 2GB y NODE_OPTIONS configurado

## 📚 Documentación Adicional

- **Setup detallado:** Ver `RECAPTCHA_ENTERPRISE_SETUP.md`
- **Google Cloud Console:** https://console.cloud.google.com/
- **reCAPTCHA Admin:** https://www.google.com/recaptcha/admin

## 📝 Commits Relacionados

1. `656137d` - feat: migrate to reCAPTCHA Enterprise with REST API
2. `3cb2c7f` - fix: configure Node.js to use increased memory allocation
3. `a0d6d14` - fix: increase memory limits to prevent container hanging
4. `3cb3301` - fix: update next-sitemap transform function syntax

## ✨ Resumen

Esta migración moderniza la implementación de reCAPTCHA, soluciona el error "browser-error", mejora la seguridad y optimiza el uso de recursos del contenedor. Todo está listo para deploy en producción.

---

**Fecha de migración:** 10 de Diciembre, 2025
**Desarrollador:** IA Software Coradir + Claude Code
