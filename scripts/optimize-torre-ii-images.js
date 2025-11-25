const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const BASE_DIR = path.join(__dirname, '..', 'public', 'img', 'la-torre-ii', 'typologies');

async function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  // Primero obtenemos todas las imágenes
  const images = entries
    .filter(entry => {
      if (!entry.isFile()) return false;
      const ext = path.extname(entry.name).toLowerCase();
      return ['.jpg', '.jpeg', '.png'].includes(ext);
    })
    .map(entry => ({
      name: entry.name,
      path: path.join(dir, entry.name)
    }))
    .sort((a, b) => {
      // Extraer números de los nombres para ordenar correctamente
      const numA = parseInt(a.name.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.name.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  console.log(`\n📁 Procesando: ${dir}`);
  console.log(`   Encontradas ${images.length} imágenes`);

  // Convertir cada imagen a WebP con nombre normalizado
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const newName = `${String(i + 1).padStart(2, '0')}.webp`;
    const outputPath = path.join(dir, newName);

    try {
      // Si ya existe un webp con ese nombre y es diferente del origen, skip
      if (fs.existsSync(outputPath) && !img.name.endsWith('.webp')) {
        console.log(`   ⏭️  ${newName} ya existe, omitiendo...`);
        continue;
      }

      await sharp(img.path)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);

      const originalSize = fs.statSync(img.path).size;
      const newSize = fs.statSync(outputPath).size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`   ✅ ${img.name} → ${newName} (${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${reduction}%)`);

      // Eliminar archivo original solo si es JPG/PNG
      if (img.name !== newName) {
        fs.unlinkSync(img.path);
      }
    } catch (error) {
      console.error(`   ❌ Error procesando ${img.name}:`, error.message);
    }
  }

  // Procesar subdirectorios
  const subdirs = entries.filter(entry => entry.isDirectory());
  for (const subdir of subdirs) {
    await processDirectory(path.join(dir, subdir.name));
  }
}

async function main() {
  console.log('🚀 Iniciando optimización de imágenes de La Torre II\n');

  const typologyDirs = [
    'monoambientes',
    'un-dormitorio',
    'dos-dormitorios',
    'cocheras'
  ];

  for (const typology of typologyDirs) {
    const typologyPath = path.join(BASE_DIR, typology);
    if (fs.existsSync(typologyPath)) {
      await processDirectory(typologyPath);
    }
  }

  console.log('\n✨ Optimización completada!\n');
}

main().catch(console.error);
