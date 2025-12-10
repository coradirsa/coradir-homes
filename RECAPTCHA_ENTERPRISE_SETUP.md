# Configuración de reCAPTCHA Enterprise

Este documento explica cómo configurar reCAPTCHA Enterprise para el proyecto.

## 🔑 Variables de Entorno Requeridas

### 1. NEXT_PUBLIC_RECAPTCHA_SITE_KEY
**Valor actual:** `6Ld0YWYrAAAAAG8P-0JBdoRnLop74rCmY8wZfdg-`

Esta es la clave pública que se usa en el frontend. Ya está configurada.

### 2. RECAPTCHA_PROJECT_ID
**Valor:** `captcha-v3-463413`

Este es el ID del proyecto de Google Cloud que contiene tu reCAPTCHA Enterprise.

**Dónde encontrarlo:**
- Ve a [Google Cloud Console](https://console.cloud.google.com/)
- En la parte superior verás el nombre del proyecto y al lado el ID del proyecto
- Usa ese ID en esta variable

### 3. RECAPTCHA_API_KEY
**IMPORTANTE:** Esta es la clave que falta configurar.

**Cómo obtenerla:**

#### Opción A: Crear una nueva API Key (Recomendado)

1. Ve a [Google Cloud Console - APIs & Services - Credentials](https://console.cloud.google.com/apis/credentials)
2. Asegúrate de estar en el proyecto correcto (`captcha-v3-463413`)
3. Haz clic en **"+ CREATE CREDENTIALS"** → **"API Key"**
4. Se creará una nueva API Key (cópiala inmediatamente)
5. Haz clic en el nombre de la API Key para editarla
6. En **"API restrictions"**:
   - Selecciona **"Restrict key"**
   - Busca y selecciona **"reCAPTCHA Enterprise API"**
7. En **"Application restrictions"** (opcional pero recomendado):
   - Selecciona **"IP addresses"**
   - Agrega la IP de tu servidor
8. Guarda los cambios

#### Opción B: Usar una API Key existente

1. Ve a [Google Cloud Console - APIs & Services - Credentials](https://console.cloud.google.com/apis/credentials)
2. Busca una API Key existente que tenga habilitada "reCAPTCHA Enterprise API"
3. Copia la clave

### 4. RECAPTCHA_MIN_SCORE (Opcional)
**Valor por defecto:** `0.5`

Este es el score mínimo para considerar válida una solicitud. Valores posibles: 0.0 a 1.0
- 0.0 = Muy probable bot
- 1.0 = Muy probable humano
- 0.5 = Balance razonable (recomendado)

## 📋 Pasos de Configuración

### En tu servidor/Portainer:

1. **Agregar las variables de entorno al contenedor:**

```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Ld0YWYrAAAAAG8P-0JBdoRnLop74rCmY8wZfdg-
RECAPTCHA_PROJECT_ID=captcha-v3-463413
RECAPTCHA_API_KEY=TU_API_KEY_AQUI
RECAPTCHA_MIN_SCORE=0.5
```

2. **Rebuilding el contenedor:**
   - En Portainer, ve al stack
   - Haz clic en "Update the stack"
   - Activa "Re-pull image and redeploy"
   - Haz clic en "Update"

## ✅ Verificar que funciona

1. Abre la consola del navegador (F12)
2. Ve a cualquier página con formulario (ej: `/juana-64`)
3. Completa y envía el formulario
4. En los logs del contenedor deberías ver:
   ```
   Respuesta de reCAPTCHA Enterprise: {
     "valid": true,
     "action": "form_submit",
     "score": 0.9,
     ...
   }
   ```

## 🔒 Seguridad

- **NUNCA** compartas la `RECAPTCHA_API_KEY` públicamente
- **NUNCA** la pongas en el código fuente
- Solo debe estar en variables de entorno del servidor
- Restringe la API Key por IP si es posible

## 🐛 Troubleshooting

### Error: "Variables de reCAPTCHA Enterprise no configuradas"
**Causa:** Falta alguna de las variables de entorno (SITE_KEY, PROJECT_ID o API_KEY)
**Solución:** Verifica que todas las variables estén configuradas en Portainer

### Error: "browser-error"
**Causa:** La SITE_KEY no coincide con el PROJECT_ID
**Solución:** Verifica que estés usando la SITE_KEY correcta para tu proyecto

### Error 403 o 401 en los logs
**Causa:** La API Key no tiene permisos o está mal configurada
**Solución:**
1. Verifica que la API Key esté correcta
2. Asegúrate de que tenga habilitada "reCAPTCHA Enterprise API"
3. Verifica las restricciones de IP

### Score muy bajo (< 0.5)
**Causa:** reCAPTCHA detecta comportamiento sospechoso
**Solución:**
1. Puede ser tráfico legítimo en desarrollo
2. Ajusta el `RECAPTCHA_MIN_SCORE` si es necesario
3. Revisa los logs para ver las razones

## 📚 Referencias

- [Google reCAPTCHA Enterprise Docs](https://cloud.google.com/recaptcha-enterprise/docs)
- [reCAPTCHA Enterprise REST API](https://cloud.google.com/recaptcha-enterprise/docs/reference/rest)
