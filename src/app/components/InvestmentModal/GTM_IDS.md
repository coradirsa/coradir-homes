# IDs para Google Tag Manager - Investment Modal

## 📊 Elementos rastreables

Todos los eventos automáticos están **DESACTIVADOS**. Usá estos IDs para crear tus triggers en GTM:

### 🎯 **Container Principal**
```
#investment-modal-container
```
- **Qué es**: Contenedor principal del modal
- **Cuándo usarlo**: Para trackear cuando el modal está visible
- **Trigger sugerido**: Element Visibility (cuando aparece)

---

### 🔲 **Backdrop (Fondo oscuro)**
```
#investment-modal-backdrop
```
- **Qué es**: Fondo oscuro detrás del modal
- **Cuándo usarlo**: Para trackear clicks fuera del modal (cerrar)
- **Trigger sugerido**: Click - All Elements (con ID específico)

---

### 📄 **Contenido del Modal**
```
#investment-modal-content
```
- **Qué es**: Caja blanca con todo el contenido
- **Cuándo usarlo**: Para trackear interacciones dentro del modal
- **Trigger sugerido**: Click - All Elements (con ID específico)

---

### ❌ **Botón Cerrar (X)**
```
#investment-modal-close-btn
```
- **Qué es**: Botón "×" arriba a la derecha
- **Cuándo usarlo**: Para trackear cuando cierran el modal con la X
- **Trigger sugerido**: Click - All Elements
- **Event name sugerido**: `investment_modal_close_x`

---

### 📝 **Formulario Completo**
```
#investment-modal-form
```
- **Qué es**: Todo el formulario
- **Cuándo usarlo**: Para trackear submit del formulario
- **Trigger sugerido**: Form Submission
- **Event name sugerido**: `investment_form_submit`
- **Variables disponibles**:
  - `{{Form ID}}` = "investment-modal-form"
  - `{{Form Classes}}` = lista de clases
  - Campos del form: nombre, email, telefono, monto

---

### 🎯 **Botón Principal (CTA)**
```
#investment-modal-submit-btn
```
- **Qué es**: Botón "Quiero que me contacten"
- **Cuándo usarlo**: Para trackear clicks en el CTA principal
- **Trigger sugerido**: Click - All Elements
- **Event name sugerido**: `investment_cta_click`
- **Nota**: Este botón también dispara el submit del form

---

## 🔧 **Configuración recomendada en GTM**

### **1. Trigger: Modal Abierto**
```
Tipo: Element Visibility
Método de selección: ID
ID del elemento: investment-modal-container
Cuándo disparar: Una vez por página
Porcentaje mínimo visible: 50%
```

### **2. Trigger: Click en CTA**
```
Tipo: Click - All Elements
Activar en: Algunos clics
Click Element coincide con selector CSS: #investment-modal-submit-btn
```

### **3. Trigger: Form Submit**
```
Tipo: Form Submission
Activar en: Algunos forms
Form ID equals: investment-modal-form
```

### **4. Trigger: Modal Cerrado**
```
Tipo: Click - All Elements
Activar en: Algunos clics
Click Element coincide con selector CSS: #investment-modal-close-btn, #investment-modal-backdrop
```

---

## 📦 **Variables personalizadas útiles**

### **Capturar valor del monto**
```
Tipo: Variable de capa de datos
Nombre de variable: formMonto
Usar en: Evento de submit para enviar el monto a Analytics
```

### **Capturar origen (homes)**
```
Tipo: Variable personalizada de JavaScript
Código:
function() {
  return 'homes'; // o leer de window.location.hostname
}
```

---

## 🎯 **Eventos sugeridos para Analytics**

### **Event: investment_modal_open**
- Categoría: "Investment Modal"
- Acción: "Open"
- Etiqueta: "homes"

### **Event: investment_cta_click**
- Categoría: "Investment Modal"
- Acción: "CTA Click"
- Etiqueta: "Quiero que me contacten"

### **Event: investment_form_submit**
- Categoría: "Investment Modal"
- Acción: "Form Submit"
- Etiqueta: "homes"
- Valor: {{formMonto}} (si existe)

### **Event: investment_modal_close**
- Categoría: "Investment Modal"
- Acción: "Close"
- Etiqueta: "X button" o "Backdrop click"

---

## 🧪 **Testing en GTM**

1. Activá el **Preview Mode** en GTM
2. Abrí la web: http://localhost:6118
3. Esperá 1.2 segundos (el modal aparece)
4. Verificá en GTM Preview que los elementos con estos IDs estén presentes
5. Probá clicks en cada elemento y verificá que se disparen los triggers

---

## 💡 **Tips**

- **No duplicar eventos**: Si ya tenés un trigger para "All Form Submissions", el form del modal se va a trackear automáticamente
- **Usar el mismo naming**: Mantené la convención `investment_*` para todos los eventos relacionados
- **Capturar errores**: Podés crear un trigger para cuando aparezcan mensajes de error (span con class "text-red-600")
- **A/B Testing**: Podés agregar una variable para identificar qué versión del modal están viendo

---

## 🚀 **Campos del formulario** (para Data Layer)

Si querés capturar los valores del form, estos son los IDs de los inputs:

- `#nombre` - Input de nombre y apellido
- `#email` - Input de email
- `#telefono` - Input de teléfono
- `#monto` - Input de monto (opcional)
- `#acepta_politica` - Checkbox de términos

Ejemplo de código JavaScript para GTM:
```javascript
function() {
  return {
    nombre: document.getElementById('nombre').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    monto: document.getElementById('monto').value || 'no_especificado'
  };
}
```
