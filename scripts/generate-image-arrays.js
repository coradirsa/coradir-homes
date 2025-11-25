const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'img', 'la-torre-ii', 'typologies');

function getImagesFromDir(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.webp'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  return files;
}

function generateImageArrays() {
  const typologies = {
    monoambientes: [
      { key: 'dpto-d-pb', name: 'Dpto D - Patio interior' },
      { key: 'dpto-a-pb', name: 'Dpto A - Patio interior' },
      { key: 'dpto-f', name: 'Dpto F - Balcón' },
      { key: 'dpto-b', name: 'Dpto B - Balcón' },
    ],
    'un-dormitorio': [
      { key: 'dpto-e-pb', name: 'Dpto E - Patio interior' },
      { key: 'dpto-c-pb', name: 'Dpto C - Patio interior' },
      { key: 'dpto-b-pb', name: 'Dpto B - Patio interior' },
      { key: 'dpto-e', name: 'Dpto E - Balcón' },
      { key: 'dpto-d', name: 'Dpto D - Balcón' },
      { key: 'dpto-c', name: 'Dpto C - Balcón' },
    ],
    'dos-dormitorios': [
      { key: 'dpto-g', name: 'Dpto G - Balcón panorámico' },
      { key: 'dpto-a', name: 'Dpto A - Balcón al frente' },
    ],
  };

  console.log('// Arrays de imágenes para cada departamento:\n');

  for (const [typology, dptos] of Object.entries(typologies)) {
    console.log(`// ${typology}:`);

    dptos.forEach(dpto => {
      const dir = path.join(BASE_DIR, typology, dpto.key);
      const images = getImagesFromDir(dir);

      if (images.length > 0) {
        const imagePaths = images.map(img =>
          `/img/la-torre-ii/typologies/${typology}/${dpto.key}/${img}`
        );

        console.log(`// ${dpto.name} (${images.length} fotos)`);
        console.log(`images: ${JSON.stringify(imagePaths, null, 2).replace(/\n/g, '\n  ')},`);
        console.log('');
      }
    });
    console.log('');
  }
}

generateImageArrays();
