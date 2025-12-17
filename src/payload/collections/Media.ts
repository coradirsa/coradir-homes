import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'alt',
    defaultColumns: ['alt', 'filename', 'mimeType', 'filesize', 'updatedAt'],
    description: 'Gestión de imágenes y archivos multimedia',
    group: 'Multimedia',
  },
  access: {
    read: () => true, // Público puede ver imágenes
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../../public/uploads'),
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 80,
          },
        },
      },
      {
        name: 'card',
        width: 768,
        height: 512,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 85,
          },
        },
      },
      {
        name: 'tablet',
        width: 1024,
        height: 768,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
      {
        name: 'desktop',
        width: 1920,
        height: 1080,
        position: 'centre',
        formatOptions: {
          format: 'webp',
          options: {
            quality: 90,
          },
        },
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    formatOptions: {
      format: 'webp',
      options: {
        quality: 90,
      },
    },
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Texto Alternativo (Alt Text)',
      admin: {
        description: 'Descripción de la imagen para accesibilidad y SEO',
        placeholder: 'Describe la imagen para personas con discapacidad visual',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Epígrafe',
      admin: {
        description: 'Texto que aparece debajo de la imagen (opcional)',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Créditos',
      admin: {
        description: 'Fotógrafo o fuente de la imagen (opcional)',
      },
    },
  ],
  timestamps: true,
}
