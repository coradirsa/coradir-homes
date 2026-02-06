const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_DIR = path.join(__dirname, '..', 'public', 'img', 'projects');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'img', 'optimized', 'projects');

const imagesToOptimize = ['torre1.webp', 'torre2.webp', 'jk.webp'];

async function optimizeImages() {
  console.log('🚀 Iniciando optimización de imágenes de proyectos\n');

  // Asegurar que existe el directorio de salida
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  for (const imageName of imagesToOptimize) {
    const inputPath = path.join(INPUT_DIR, imageName);
    const outputPath = path.join(OUTPUT_DIR, imageName);

    if (!fs.existsSync(inputPath)) {
      console.log(`   ⚠️  ${imageName} no encontrada, omitiendo...`);
      continue;
    }

    try {
      await sharp(inputPath)
        .webp({ quality: 85, effort: 6 })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const newSize = fs.statSync(outputPath).size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`   ✅ ${imageName} → optimized/${imageName} (${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB, -${reduction}%)`);
    } catch (error) {
      console.error(`   ❌ Error procesando ${imageName}:`, error.message);
    }
  }

  console.log('\n✨ Optimización completada!\n');
}

optimizeImages().catch(console.error);
