/**
 * Script para crear el primer usuario superadmin en Payload CMS
 * Uso: node create-first-user.js
 */

const API_URL = 'http://localhost:6118'

async function createFirstUser() {
  const userData = {
    email: 'csalini@coradir.com.ar',
    password: '159753!Z',
    name: 'Carlos Salini',
    role: 'superadmin'
  }

  try {
    console.log('Creando primer usuario superadmin...')
    console.log('Email:', userData.email)

    const response = await fetch(`${API_URL}/api/users/first-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Error al crear usuario:', data)
      process.exit(1)
    }

    console.log('✅ Usuario superadmin creado exitosamente!')
    console.log('   Email:', userData.email)
    console.log('   Rol: superadmin')
    console.log('\n🔗 Accede al panel admin en: http://localhost:6118/admin')
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    process.exit(1)
  }
}

createFirstUser()
