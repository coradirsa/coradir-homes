import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'name', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => {
      // Solo superadmin puede crear usuarios
      return user?.role === 'superadmin'
    },
    update: ({ req: { user } }) => {
      // Usuarios pueden actualizar su propio perfil
      // Superadmin puede actualizar cualquier usuario
      if (user?.role === 'superadmin') return true
      return {
        id: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => {
      // Solo superadmin puede eliminar usuarios
      return user?.role === 'superadmin'
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre Completo',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        {
          label: 'Super Admin',
          value: 'superadmin',
        },
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'Viewer',
          value: 'viewer',
        },
      ],
      access: {
        // Solo superadmin puede cambiar roles
        create: ({ req: { user } }) => user?.role === 'superadmin',
        update: ({ req: { user } }) => user?.role === 'superadmin',
      },
    },
  ],
}
