import type { Block } from 'payload'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Contenido',
      admin: {
        description: 'Texto enriquecido con formato',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      defaultValue: 'prose',
      label: 'Ancho Máximo',
      options: [
        { label: 'Estrecho (Prose)', value: 'prose' },
        { label: 'Medio (Container)', value: 'container' },
        { label: 'Ancho (Wide)', value: 'wide' },
        { label: 'Completo (Full)', value: 'full' },
      ],
      admin: {
        description: 'Ancho máximo del contenido',
      },
    },
    {
      name: 'textAlign',
      type: 'select',
      defaultValue: 'left',
      label: 'Alineación del Texto',
      options: [
        { label: 'Izquierda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Derecha', value: 'right' },
        { label: 'Justificado', value: 'justify' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'transparent',
      label: 'Color de Fondo',
      options: [
        { label: 'Transparente', value: 'transparent' },
        { label: 'Blanco', value: 'white' },
        { label: 'Gris Claro', value: 'gray-light' },
        { label: 'Gris Oscuro', value: 'gray-dark' },
      ],
    },
  ],
}
