import type { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['user', 'action', 'collection', 'documentTitle', 'timestamp'],
    description: 'Historial de cambios realizados en el CMS',
    group: 'Sistema',
    pagination: {
      defaultLimit: 50,
    },
  },
  access: {
    create: () => true, // Los hooks crean logs automáticamente
    read: ({ req: { user } }) => !!user, // Solo usuarios autenticados pueden ver logs
    update: () => false, // Los logs nunca se modifican
    delete: ({ req: { user } }) => user?.role === 'admin', // Solo admins pueden eliminar logs
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Usuario',
      admin: {
        readOnly: true,
        description: 'Usuario que realizó la acción',
      },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      label: 'Acción',
      options: [
        { label: 'Creó', value: 'create' },
        { label: 'Actualizó', value: 'update' },
        { label: 'Eliminó', value: 'delete' },
        { label: 'Publicó', value: 'publish' },
        { label: 'Despublicó', value: 'unpublish' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collection',
      type: 'text',
      required: true,
      label: 'Colección',
      admin: {
        description: 'Tipo de contenido modificado (pages, media, etc.)',
        readOnly: true,
      },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      label: 'ID del Documento',
      admin: {
        description: 'Identificador único del documento modificado',
        readOnly: true,
      },
    },
    {
      name: 'documentTitle',
      type: 'text',
      label: 'Título del Documento',
      admin: {
        description: 'Nombre de la página o archivo modificado',
        readOnly: true,
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      label: 'Fecha y Hora',
      admin: {
        readOnly: true,
        date: {
          displayFormat: 'dd/MM/yyyy HH:mm:ss',
        },
      },
    },
    {
      name: 'changes',
      type: 'json',
      label: 'Detalle de Cambios',
      admin: {
        description: 'Qué campos fueron modificados',
        readOnly: true,
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      label: 'Dirección IP',
      admin: {
        description: 'IP desde donde se realizó el cambio',
        readOnly: true,
      },
    },
  ],
  timestamps: true,
}
