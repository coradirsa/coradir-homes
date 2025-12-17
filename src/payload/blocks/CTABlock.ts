import type { Block } from 'payload'

export const CTABlock: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    {
      name: 'variant',
      type: 'select',
      required: true,
      defaultValue: 'centered',
      label: 'Variante',
      options: [
        { label: 'Centrado', value: 'centered' },
        { label: 'Con Imagen (Izquierda)', value: 'image-left' },
        { label: 'Con Imagen (Derecha)', value: 'image-right' },
        { label: 'Fullwidth', value: 'fullwidth' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título',
      admin: {
        placeholder: '¿Listo para comenzar?',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        placeholder: 'Descripción breve del llamado a la acción',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen (Opcional)',
      admin: {
        description: 'Solo se usa en variantes con imagen',
        condition: (data) => data?.variant !== 'centered',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 2,
      label: 'Botones',
      labels: {
        singular: 'Botón',
        plural: 'Botones',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Texto del Botón',
          admin: {
            placeholder: 'Contactanos',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'URL',
          admin: {
            placeholder: '/contacto',
          },
        },
        {
          name: 'style',
          type: 'select',
          required: true,
          defaultValue: 'primary',
          label: 'Estilo',
          options: [
            { label: 'Primario', value: 'primary' },
            { label: 'Secundario', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: false,
          label: 'Abrir en nueva pestaña',
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'blue',
      label: 'Color de Fondo',
      options: [
        { label: 'Azul', value: 'blue' },
        { label: 'Verde', value: 'green' },
        { label: 'Gris', value: 'gray' },
        { label: 'Blanco', value: 'white' },
        { label: 'Transparente', value: 'transparent' },
      ],
    },
  ],
}
