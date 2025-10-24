# Configuración de Google Search Console

## 1. Verificar el dominio

### Opción A: Verificación por etiqueta HTML (Recomendado - ya implementado)
Ya tienes Google Tag Manager en tu sitio, así que la verificación automática debería funcionar.

1. Ve a [Google Search Console](https://search.google.com/search-console)
2. Clic en "Agregar propiedad"
3. Elige "Prefijo de URL": `https://www.coradirhomes.com`
4. Método de verificación: **Etiqueta HTML** o **Google Analytics** (ya tienes GTM configurado)
5. Verifica que GTM esté publicado en producción
6. Haz clic en "Verificar"

### Opción B: Verificación por DNS (más completo)
Si tienes acceso al panel DNS de tu dominio:

1. En Search Console, elige "Propiedad de dominio": `coradirhomes.com`
2. Copia el registro TXT que te proporciona Google
3. Ve a tu proveedor DNS (donde está registrado el dominio)
4. Agrega un registro TXT con el valor proporcionado:
   ```
   Tipo: TXT
   Host: @
   Valor: google-site-verification=XXXXXXXXXXXXXX
   ```
5. Espera 5-10 minutos para propagación DNS
6. Vuelve a Search Console y haz clic en "Verificar"

## 2. Subir Sitemap

Ya tienes el sitemap generado automáticamente en: `https://www.coradirhomes.com/sitemap.xml`

### Pasos:
1. Una vez verificada la propiedad, ve a **"Sitemaps"** en el menú lateral
2. En "Agregar un nuevo sitemap", escribe: `sitemap.xml`
3. Haz clic en "Enviar"
4. Espera 24-48 horas para que Google empiece a rastrear

### Verificar que funciona:
- Visita: https://www.coradirhomes.com/sitemap.xml
- Deberías ver todas las URLs del sitio listadas
- También tienes: https://www.coradirhomes.com/robots.txt

## 3. Configurar alertas

En Search Console:
1. Ve a **"Configuración"** → **"Usuarios y permisos"**
2. Agrega usuarios que necesiten acceso
3. Ve a **"Configuración"** → **"Notificaciones por correo"**
4. Activa alertas para:
   - Problemas de indexación
   - Problemas de seguridad
   - Penalizaciones manuales

## 4. Monitorear métricas clave

Después de 7-14 días, revisa:

### Rendimiento:
- **Impresiones**: ¿Cuántas veces aparece tu sitio en búsquedas?
- **CTR**: ¿Qué % de personas hace clic cuando ven tu resultado?
- **Posición promedio**: ¿En qué posición apareces?
- **Consultas principales**: ¿Qué buscan para encontrarte?

### Cobertura:
- URLs indexadas vs. excluidas
- Errores 404
- Páginas con problemas

### Core Web Vitals:
- Verifica que las métricas de Lighthouse se reflejen aquí
- URLs con LCP, FID, CLS problemáticos

## 5. URLs prioritarias para monitorear

```
https://www.coradirhomes.com/
https://www.coradirhomes.com/vivienda-joven
https://www.coradirhomes.com/la-torre-ii
https://www.coradirhomes.com/inversiones-inteligentes
https://www.coradirhomes.com/terrenos
https://www.coradirhomes.com/corporativos
https://www.coradirhomes.com/instituciones
```

## 6. Troubleshooting

### Si no se verifica:
- Asegúrate de que GTM esté publicado (no en draft)
- Verifica que el sitio esté en producción (no staging)
- Usa la verificación por DNS si la HTML falla

### Si el sitemap no se procesa:
- Verifica que robots.txt permita crawling: `User-agent: * / Allow: /`
- Confirma que el sitemap.xml sea accesible públicamente
- Revisa que no haya errores XML en el sitemap

## Siguiente paso: Analytics
Una vez configurado Search Console, conecta con GA4 en:
**Search Console → Configuración → Asociaciones → Google Analytics**
