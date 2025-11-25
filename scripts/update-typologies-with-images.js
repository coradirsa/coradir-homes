const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'img', 'la-torre-ii', 'typologies');
const COMPONENT_FILE = path.join(__dirname, '..', 'src', 'app', 'la-torre-ii', 'components', 'TypologiesSection.tsx');

function getImagesFromDir(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  return files.map(f => `/img/la-torre-ii/typologies/${path.relative(BASE_DIR, dir).replace(/\\/g, '/')}/${f}`);
}

// Lee el archivo actual
let content = fs.readFileSync(COMPONENT_FILE, 'utf8');

// Mapeo de departamentos a carpetas
const mappings = [
  // Monoambientes
  { searchTitle: '"Dpto D - Patio interior"', folder: 'monoambientes/dpto-d-pb' },
  { searchTitle: '"Dpto A - Patio interior"', folder: 'monoambientes/dpto-a-pb' },
  { searchTitle: '"Dpto F - Balcón"', folder: 'monoambientes/dpto-f' },
  { searchTitle: '"Dpto B - Balcón"', folder: 'monoambientes/dpto-b', typology: 'monoambiente' },

  // Un dormitorio
  { searchTitle: '"Dpto E - Patio interior"', folder: 'un-dormitorio/dpto-e-pb' },
  { searchTitle: '"Dpto C - Patio interior"', folder: 'un-dormitorio/dpto-c-pb' },
  { searchTitle: '"Dpto B - Patio interior"', folder: 'un-dormitorio/dpto-b-pb' },
  { searchTitle: '"Dpto E - Balcón"', folder: 'un-dormitorio/dpto-e' },
  { searchTitle: '"Dpto D - Balcón"', folder: 'un-dormitorio/dpto-d' },
  { searchTitle: '"Dpto C - Balcón"', folder: 'un-dormitorio/dpto-c' },

  // Dos dormitorios
  { searchTitle: '"Dpto G - Balcón panorámico"', folder: 'dos-dormitorios/dpto-g' },
  { searchTitle: '"Dpto A - Balcón al frente"', folder: 'dos-dormitorios/dpto-a' },
];

for (const mapping of mappings) {
  const dir = path.join(BASE_DIR, mapping.folder);
  const images = getImagesFromDir(dir);

  if (images.length === 0) {
    console.log(`⚠️  No se encontraron imágenes para ${mapping.searchTitle} en ${mapping.folder}`);
    continue;
  }

  // Buscar el departamento en el contenido
  const titleRegex = new RegExp(`(title: ${mapping.searchTitle},\\s*image: "[^"]+",)`, 'g');

  const imagesArray = `images: ${JSON.stringify(images, null, 10).replace(/\n/g, '\n        ')},`;

  content = content.replace(titleRegex, `$1\n        ${imagesArray}`);

  console.log(`✅ Agregadas ${images.length} imágenes a ${mapping.searchTitle}`);
}

// Guardar el archivo actualizado
fs.writeFileSync(COMPONENT_FILE, content, 'utf8');

console.log('\n✨ Archivo actualizado correctamente!');
