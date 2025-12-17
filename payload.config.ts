import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

// Collections
import { Users } from './src/payload/collections/Users'
import { Pages } from './src/payload/collections/Pages'
import { Media } from './src/payload/collections/Media'
import { AuditLogs } from './src/payload/collections/AuditLogs'

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
    Pages,
    Media,
    AuditLogs,
  ],

  // Admin panel configuration
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- CORADIR CMS',
    },
  },

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  // Server URL
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3003',
})
