import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { FeaturesBlock } from '../blocks/FeaturesBlock'
import { ContactFormBlock } from '../blocks/ContactFormBlock'
import { CTABlock } from '../blocks/CTABlock'
import { RichTextBlock } from '../blocks/RichTextBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description: 'Gestión de páginas del sitio web',
    group: 'Contenido',
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // Autoguardado cada 2 segundos
      },
    },
    maxPerDoc: 50, // Mantener hasta 50 versiones por documento
  },
  access: {
    read: () => true, // Público puede leer páginas publicadas
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título de la Página',
      admin: {
        description: 'Nombre interno de la página (no se muestra en el sitio)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL (Slug)',
      admin: {
        description: 'URL de la página. Ej: "juana-64" → /juana-64',
        placeholder: 'ejemplo-pagina',
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            // Convertir a formato slug automáticamente
            if (value) {
              return value
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Contenido de la Página',
      blocks: [
        HeroBlock,
        FeaturesBlock,
        ContactFormBlock,
        CTABlock,
        RichTextBlock,
      ],
      admin: {
        description: 'Arrastra y suelta bloques para construir la página',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO y Metadata',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          maxLength: 60,
          admin: {
            description: 'Título que aparece en Google (máx. 60 caracteres)',
            placeholder: 'Título para motores de búsqueda',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          admin: {
            description: 'Descripción que aparece en Google (máx. 160 caracteres)',
            placeholder: 'Descripción breve de la página',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Palabras clave separadas por comas',
            placeholder: 'palabra1, palabra2, palabra3',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen Open Graph',
          admin: {
            description: 'Imagen que aparece al compartir en redes sociales (1200x630px recomendado)',
          },
        },
        {
          name: 'noIndex',
          type: 'checkbox',
          label: 'No indexar (noindex)',
          defaultValue: false,
          admin: {
            description: 'Marcar para evitar que Google indexe esta página',
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de Publicación',
      admin: {
        position: 'sidebar',
        description: 'Fecha en que se publicó la página',
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Actualizar publishedAt cuando se publica por primera vez
        if (operation === 'update' && data._status === 'published' && !data.publishedAt) {
          data.publishedAt = new Date()
        }
        return data
      },
    ],
  },
  timestamps: true,
}
