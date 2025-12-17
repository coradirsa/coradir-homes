import type { Block } from 'payload'

export const FeaturesBlock: Block = {
  slug: 'features',
  labels: {
    singular: 'Features Section',
    plural: 'Features Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título de la Sección',
      admin: {
        placeholder: 'Nuestros Beneficios',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      admin: {
        placeholder: 'Descripción de la sección',
      },
    },
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'grid-3',
      label: 'Diseño',
      options: [
        { label: '2 Columnas', value: 'grid-2' },
        { label: '3 Columnas', value: 'grid-3' },
        { label: '4 Columnas', value: 'grid-4' },
        { label: 'Lista Vertical', value: 'list' },
      ],
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      label: 'Características',
      labels: {
        singular: 'Característica',
        plural: 'Características',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          label: 'Ícono',
          options: [
            { label: '🏠 Casa', value: 'home' },
            { label: '💰 Dinero', value: 'money' },
            { label: '📊 Gráfico', value: 'chart' },
            { label: '🔒 Seguridad', value: 'security' },
            { label: '⏰ Tiempo', value: 'time' },
            { label: '🎯 Objetivo', value: 'target' },
            { label: '✅ Check', value: 'check' },
            { label: '⭐ Estrella', value: 'star' },
            { label: '📍 Ubicación', value: 'location' },
            { label: '👥 Equipo', value: 'team' },
            { label: '📱 Móvil', value: 'mobile' },
            { label: '💡 Idea', value: 'lightbulb' },
          ],
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Título',
          admin: {
            placeholder: 'Título de la característica',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          label: 'Descripción',
          admin: {
            placeholder: 'Descripción breve de la característica',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Enlace (Opcional)',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: false,
              label: 'Agregar enlace',
            },
            {
              name: 'text',
              type: 'text',
              label: 'Texto del enlace',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
                placeholder: 'Saber más',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              admin: {
                condition: (data, siblingData) => siblingData?.enabled,
                placeholder: '/saber-mas',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      label: 'Color de Fondo',
      options: [
        { label: 'Blanco', value: 'white' },
        { label: 'Gris Claro', value: 'gray-light' },
        { label: 'Azul Claro', value: 'blue-light' },
        { label: 'Verde Claro', value: 'green-light' },
      ],
    },
  ],
}
