# ASSISTANT_RULES.md - Reglas para el Asistente

## 🚫 REGLA FUNDAMENTAL
**NUNCA PERO NUNCA HAGAS COSAS HARDCODEADAS**

## ✅ Buenas Prácticas SIEMPRE

1. **Utilizar SIEMPRE buenas prácticas de desarrollo**
   - Código limpio y mantenible
   - Principios SOLID
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)

2. **Seguir la arquitectura existente del código**
   - Respetar los patrones ya implementados
   - Mantener consistencia con el estilo actual
   - No reinventar la rueda si ya existe una solución

3. **Cada interacción es independiente**
   - No asumir contexto previo de mensajes anteriores
   - Tratar cada request como nuevo
   - Solo usar contexto previo si se indica explícitamente

4. **No encapricharse con soluciones que no funcionan**
   - Si algo no funciona, buscar alternativas
   - No insistir en una implementación fallida
   - Pivotar rápidamente a otras opciones

5. **Investigar cuando no estés seguro**
   - Hacer búsquedas por internet para confirmar
   - Verificar documentación oficial
   - No asumir, siempre verificar

6. **Funcionalidades DINÁMICAS**
   - Todo debe ser configurable
   - Evitar valores fijos en el código
   - Usar variables de entorno, archivos de configuración o parámetros
   - El sistema debe adaptarse, no ser rígido

## 📋 Checklist antes de implementar

- [ ] ¿Estoy hardcodeando algo? → Hacerlo dinámico
- [ ] ¿Estoy siguiendo la arquitectura existente?
- [ ] ¿Mi solución es flexible y configurable?
- [ ] ¿He verificado que mi approach funciona?
- [ ] ¿Necesito buscar más información antes de proceder?

## 📌 REGLAS ADICIONALES

1. **Verificar antes de modificar**
   - SIEMPRE leer el archivo completo antes de editar
   - Buscar dónde se usa el código que voy a cambiar
   - Entender el flujo completo antes de tocar nada

2. **No hacer suposiciones sobre el entorno**
   - No asumir que existen librerías sin verificar
   - No asumir estructuras de carpetas sin confirmar
   - No asumir versiones de dependencias

3. **Preguntar cuando hay múltiples opciones válidas**
   - Si hay varias formas de resolver algo, preguntar cuál prefieres
   - No tomar decisiones arquitecturales sin consultar
   - No cambiar estilos o patrones existentes sin razón

4. **Mantener cambios mínimos y enfocados**
   - No refactorizar código que funciona sin que se pida
   - Hacer solo lo necesario para resolver el problema
   - No agregar "mejoras" no solicitadas

5. **Documentar solo cuando sea necesario**
   - No agregar comentarios obvios
   - No crear README o docs sin que se pidan
   - Mantener el nivel de documentación existente

## 🚫 NO HACER

1. **NO crear archivos de test automáticamente**
   - No generar archivos test_*.py sin que se pidan
   - Los tests se harán manualmente
   - No crear test suites sin autorización

2. **NO crear scripts de ejecución**
   - No hacer archivos .sh
   - No hacer archivos .bat
   - No crear scripts de automatización sin pedirlo

3. **NO ejecutar comandos directamente**
   - Las dependencias están en un venv de Python
   - El usuario debe ejecutar los comandos
   - Solo sugerir qué comandos ejecutar, no ejecutarlos

## 🧹 LIMPIEZA DE CÓDIGO OBSOLETO

**REGLA CRÍTICA**: Cuando reemplaces funciones o crees archivos nuevos:
- **SIEMPRE eliminar el código obsoleto que ya no se use**
- **SIEMPRE eliminar archivos que fueron reemplazados**
- **NO dejar código comentado "por si acaso"**
- **NO dejar archivos duplicados o versiones antiguas**
- **Mantener el proyecto limpio y sin código basura**

## ⚠️ Recordatorio constante

**Si estás escribiendo un valor fijo directamente en el código, DETENTE y piensa cómo hacerlo configurable.**

**Si vas a crear un archivo de test o script, DETENTE y pregunta primero si es necesario.**

**Si vas a ejecutar un comando, DETENTE y pide al usuario que lo ejecute.**

**Si reemplazaste código o archivos, ELIMINA los obsoletos inmediatamente.**