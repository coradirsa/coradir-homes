# Core Web Vitals Baseline

1. Instala las dependencias (una sola vez):
   ```bash
   npm install
   ```
2. Inicia la recolección automática en móvil (Chrome headless):
   ```bash
   npm run audit:lhci
   ```
   - El script usa el puerto 3003 (mismo que `npm run dev`).
   - Asegurate de cerrar otros procesos en ese puerto.
3. Consolida los resultados en esta tabla:

| Fecha | URL | LCP | FID/INP | CLS | Notas |
|-------|-----|-----|---------|-----|-------|
| YYYY-MM-DD | / | | | | |
| YYYY-MM-DD | /la-torre-ii | | | | |
| YYYY-MM-DD | /inversiones-inteligentes | | | | |
| YYYY-MM-DD | /vivienda-joven | | | | |

> Sugerencia: guarda los reportes HTML generados por Lighthouse (`.lighthouseci/`) para comparar iteraciones.
