import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'default',
      label: 'Variante',
      options: [
        { label: 'Hero Estándar', value: 'default' },
        { label: 'Hero con Video', value: 'video' },
        { label: 'Hero con Formulario', value: 'form' },
      ],
      admin: {
        description: 'Tipo de hero section',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título Principal',
      admin: {
        placeholder: 'Tu título aquí',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      admin: {
        placeholder: 'Descripción breve',
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen de Fondo',
      admin: {
        description: 'Imagen de fondo del hero (1920x1080px recomendado)',
      },
    },
    {
      name: 'overlay',
      type: 'group',
      label: 'Overlay (Capa sobre la imagen)',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Activar overlay',
        },
        {
          name: 'opacity',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
          label: 'Opacidad (%)',
          admin: {
            description: 'Opacidad de la capa oscura sobre la imagen (0-100)',
          },
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      label: 'Call to Action',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar botón',
        },
        {
          name: 'text',
          type: 'text',
          label: 'Texto del Botón',
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'URL del Botón',
          admin: {
            placeholder: '/contacto',
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primario', value: 'primary' },
            { label: 'Secundario', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
          admin: {
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'full',
      label: 'Altura',
      options: [
        { label: 'Pantalla Completa (100vh)', value: 'full' },
        { label: 'Alta (80vh)', value: 'tall' },
        { label: 'Media (60vh)', value: 'medium' },
        { label: 'Baja (40vh)', value: 'short' },
      ],
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'center',
      label: 'Alineación del Texto',
      options: [
        { label: 'Izquierda', value: 'left' },
        { label: 'Centro', value: 'center' },
        { label: 'Derecha', value: 'right' },
      ],
    },
  ],
}
