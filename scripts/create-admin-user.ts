/**
 * Script para crear el primer usuario admin usando Payload CMS API
 * Ejecutar: node --loader ts-node/esm scripts/create-admin-user.ts
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function createAdminUser() {
  console.log('🚀 Conectando a Payload CMS...')

  const payload = await getPayload({ config })

  console.log('✅ Conectado exitosamente')
  console.log('👤 Creando usuario superadmin...')

  try {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: 'csalini@coradir.com.ar',
        password: '159753!Z',
        name: 'Carlos Salini',
        role: 'superadmin',
      },
    })

    console.log('✅ Usuario superadmin creado exitosamente!')
    console.log('   ID:', user.id)
    console.log('   Email:', user.email)
    console.log('   Nombre:', user.name)
    console.log('   Rol:', user.role)
    console.log('\n🔗 Accede al panel admin en: http://localhost:6118/admin')
    console.log('   Email:', 'csalini@coradir.com.ar')
    console.log('   Password:', '159753!Z')

  } catch (error: any) {
    if (error.message?.includes('E11000')) {
      console.log('⚠️  El usuario ya existe')
    } else {
      console.error('❌ Error al crear usuario:', error.message)
    }
  }

  process.exit(0)
}

createAdminUser()
