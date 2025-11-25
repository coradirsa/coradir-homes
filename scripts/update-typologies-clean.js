const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'img', 'la-torre-ii', 'typologies');
const COMPONENT_FILE = path.join(__dirname, '..', 'src', 'app', 'la-torre-ii', 'components', 'TypologiesSection.tsx');

function getImagesFromDir(dir) {
  if (!fs.existsSync(dir)) return [];

  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    })
    .map(f => `/img/la-torre-ii/typologies/${path.relative(BASE_DIR, dir).replace(/\\/g, '/')}/${f}`);
}

let content = fs.readFileSync(COMPONENT_FILE, 'utf8');

// Mapeo de departamentos
const mappings = [
  { title: 'Dpto D - Patio interior', folder: 'monoambientes/dpto-d-pb' },
  { title: 'Dpto A - Patio interior', folder: 'monoambientes/dpto-a-pb' },
  { title: 'Dpto F - Balcón', folder: 'monoambientes/dpto-f' },
  { title: 'Dpto B - Balcón', folder: 'monoambientes/dpto-b', context: 'monoambiente' },
  { title: 'Dpto E - Patio interior', folder: 'un-dormitorio/dpto-e-pb' },
  { title: 'Dpto C - Patio interior', folder: 'un-dormitorio/dpto-c-pb' },
  { title: 'Dpto B - Patio interior', folder: 'un-dormitorio/dpto-b-pb' },
  { title: 'Dpto E - Balcón', folder: 'un-dormitorio/dpto-e' },
  { title: 'Dpto D - Balcón', folder: 'un-dormitorio/dpto-d' },
  { title: 'Dpto C - Balcón', folder: 'un-dormitorio/dpto-c' },
  { title: 'Dpto G - Balcón panorámico', folder: 'dos-dormitorios/dpto-g' },
  { title: 'Dpto A - Balcón al frente', folder: 'dos-dormitorios/dpto-a' },
];

for (const mapping of mappings) {
  const dir = path.join(BASE_DIR, mapping.folder);
  const images = getImagesFromDir(dir);

  if (images.length === 0) {
    console.log(`⚠️  ${mapping.title}: No hay imágenes`);
    continue;
  }

  const imagesArrayStr = JSON.stringify(images, null, 10).replace(/\n/g, '\n        ');

  // Buscar el bloque del departamento y reemplazar/agregar el array de imágenes
  const regex = new RegExp(
    `(\\{\\s*title: "${mapping.title}",\\s*image: "[^"]+",)(?:\\s*images: \\[[^\\]]*\\],)?`,
    'g'
  );

  const replacement = `$1\n        images: ${imagesArrayStr},`;

  const newContent = content.replace(regex, replacement);

  if (newContent !== content) {
    content = newContent;
    console.log(`✅ ${mapping.title}: ${images.length} fotos`);
  } else {
    console.log(`⚠️  ${mapping.title}: No se encontró en el archivo`);
  }
}

fs.writeFileSync(COMPONENT_FILE, content, 'utf8');
console.log('\n✨ Componente actualizado!');
