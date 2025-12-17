import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { Users } from './src/payload/collections/Users'

export default buildConfig({
  // Secret key for JWT tokens
  secret: process.env.PAYLOAD_SECRET || '',

  // Database adapter
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // Rich text editor
  editor: lexicalEditor({}),

  // Collections
  collections: [
    Users,
    // Pages collection will be added in FASE 1
  ],

  // Admin panel configuration
  admin: {
    user: 'users',
  },

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  // Server URL
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3003',
})
