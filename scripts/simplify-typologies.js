const fs = require('fs');
const path = require('path');

const COMPONENT_FILE = path.join(__dirname, '..', 'src', 'app', 'la-torre-ii', 'components', 'TypologiesSection.tsx');

const content = fs.readFileSync(COMPONENT_FILE, 'utf8');

// Eliminar el campo images de todos los variants
let newContent = content.replace(/images: \[[^\]]*\],?\s*/g, '');

// Actualizar las rutas de las imágenes de monoambientes
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/monoambientes\/dpto-d-pb\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/monoambientes/01.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/monoambientes\/dpto-a-pb\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/monoambientes/02.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/monoambientes\/dpto-f\/02\.webp"/g,
  'image: "/img/la-torre-ii/typologies/monoambientes/03.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/monoambientes\/dpto-b\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/monoambientes/04.webp"'
);

// Actualizar las rutas de 1 dormitorio
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-e-pb\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/01.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-c-pb\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/02.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-b-pb\/01\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/03.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-e\/18\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/04.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-d\/09\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/05.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/un-dormitorio\/dpto-c\/11\.webp"/g,
  'image: "/img/la-torre-ii/typologies/un-dormitorio/06.webp"'
);

// Actualizar las rutas de 2 dormitorios
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/dos-dormitorios\/dpto-g\/15\.webp"/g,
  'image: "/img/la-torre-ii/typologies/dos-dormitorios/01.webp"'
);
newContent = newContent.replace(
  /image: "\/img\/la-torre-ii\/typologies\/dos-dormitorios\/dpto-a\/09\.webp"/g,
  'image: "/img/la-torre-ii/typologies/dos-dormitorios/02.webp"'
);

fs.writeFileSync(COMPONENT_FILE, newContent, 'utf8');

console.log('✅ Componente simplificado y actualizado!');
