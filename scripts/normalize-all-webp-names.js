const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname, '..', 'public', 'img', 'la-torre-ii', 'typologies');

async function normalizeDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Obtener solo archivos WebP
  const webpFiles = entries
    .filter(entry => entry.isFile() && entry.name.endsWith('.webp'))
    .map(entry => entry.name)
    .sort((a, b) => {
      // Extraer números para ordenar correctamente
      const getNumbers = (name) => {
        const matches = name.match(/\d+/g);
        return matches ? matches.map(Number) : [0];
      };
      const numsA = getNumbers(a);
      const numsB = getNumbers(b);

      for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
        const diff = (numsA[i] || 0) - (numsB[i] || 0);
        if (diff !== 0) return diff;
      }
      return a.localeCompare(b);
    });

  if (webpFiles.length === 0) {
    // Procesar subdirectorios
    const subdirs = entries.filter(entry => entry.isDirectory());
    for (const subdir of subdirs) {
      await normalizeDirectory(path.join(dir, subdir.name));
    }
    return;
  }

  console.log(`\n📁 ${path.relative(BASE_DIR, dir)}`);
  console.log(`   Encontrados ${webpFiles.length} archivos WebP`);

  // Renombrar temporalmente para evitar conflictos
  const tempRenames = [];
  webpFiles.forEach((file, index) => {
    const oldPath = path.join(dir, file);
    const tempName = `__temp_${String(index + 1).padStart(2, '0')}.webp`;
    const tempPath = path.join(dir, tempName);

    fs.renameSync(oldPath, tempPath);
    tempRenames.push({ temp: tempName, final: `${String(index + 1).padStart(2, '0')}.webp` });
  });

  // Renombrar a nombres finales
  tempRenames.forEach(({ temp, final }) => {
    const tempPath = path.join(dir, temp);
    const finalPath = path.join(dir, final);
    fs.renameSync(tempPath, finalPath);
    console.log(`   ✅ ${temp} → ${final}`);
  });

  // Procesar subdirectorios
  const subdirs = entries.filter(entry => entry.isDirectory());
  for (const subdir of subdirs) {
    await normalizeDirectory(path.join(dir, subdir.name));
  }
}

async function main() {
  console.log('🚀 Normalizando nombres de archivos WebP\n');

  const typologyDirs = [
    'monoambientes',
    'un-dormitorio',
    'dos-dormitorios',
  ];

  for (const typology of typologyDirs) {
    const typologyPath = path.join(BASE_DIR, typology);
    if (fs.existsSync(typologyPath)) {
      await normalizeDirectory(typologyPath);
    }
  }

  console.log('\n✨ Normalización completada!\n');
}

main().catch(console.error);
