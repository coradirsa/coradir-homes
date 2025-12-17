import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  labels: {
    singular: 'Contact Form',
    plural: 'Contact Forms',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título del Formulario',
      admin: {
        placeholder: 'Contactanos',
      },
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Subtítulo',
      admin: {
        placeholder: 'Completa el formulario y te contactaremos pronto',
      },
    },
    {
      name: 'formType',
      type: 'select',
      required: true,
      defaultValue: 'contact',
      label: 'Tipo de Formulario',
      options: [
        { label: 'Contacto General', value: 'contact' },
        { label: 'Consulta Inversiones', value: 'inversiones' },
        { label: 'Consulta Corporativos', value: 'corporativos' },
        { label: 'Consulta Instituciones', value: 'instituciones' },
        { label: 'Consulta Terrenos', value: 'terrenos' },
        { label: 'Saber Más (Proyecto)', value: 'saber-mas' },
      ],
      admin: {
        description: 'Define a qué webhook de N8N se enviarán los datos',
      },
    },
    {
      name: 'fields',
      type: 'group',
      label: 'Campos del Formulario',
      fields: [
        {
          name: 'showName',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar campo Nombre',
        },
        {
          name: 'showEmail',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar campo Email',
        },
        {
          name: 'showPhone',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar campo Teléfono',
        },
        {
          name: 'showMessage',
          type: 'checkbox',
          defaultValue: true,
          label: 'Mostrar campo Mensaje',
        },
        {
          name: 'showCompany',
          type: 'checkbox',
          defaultValue: false,
          label: 'Mostrar campo Empresa',
        },
        {
          name: 'showInterest',
          type: 'checkbox',
          defaultValue: false,
          label: 'Mostrar campo Interés',
        },
      ],
    },
    {
      name: 'submitButton',
      type: 'group',
      label: 'Botón de Envío',
      fields: [
        {
          name: 'text',
          type: 'text',
          defaultValue: 'Enviar',
          label: 'Texto del Botón',
        },
        {
          name: 'loadingText',
          type: 'text',
          defaultValue: 'Enviando...',
          label: 'Texto mientras envía',
        },
      ],
    },
    {
      name: 'reCaptcha',
      type: 'group',
      label: 'reCAPTCHA',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
          label: 'Activar reCAPTCHA',
          admin: {
            description: 'Protección contra spam con reCAPTCHA Enterprise',
          },
        },
        {
          name: 'minScore',
          type: 'number',
          min: 0,
          max: 1,
          defaultValue: 0.5,
          label: 'Score Mínimo',
          admin: {
            description: 'Score mínimo para aceptar envío (0.0 - 1.0)',
            condition: (data, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'single',
      label: 'Diseño',
      options: [
        { label: 'Formulario Solo', value: 'single' },
        { label: 'Con Imagen (Izquierda)', value: 'with-image-left' },
        { label: 'Con Imagen (Derecha)', value: 'with-image-right' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen Decorativa',
      admin: {
        description: 'Solo se usa en diseños con imagen',
        condition: (data) => data?.layout !== 'single',
      },
    },
    {
      name: 'successMessage',
      type: 'textarea',
      defaultValue: '¡Gracias por contactarnos! Te responderemos pronto.',
      label: 'Mensaje de Éxito',
      admin: {
        description: 'Mensaje que se muestra cuando el envío es exitoso',
      },
    },
  ],
}
