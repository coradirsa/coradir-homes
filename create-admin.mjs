/**
 * Script para crear el primer usuario admin via API de Payload CMS
 * Ejecutar: node create-admin.mjs
 */

const API_URL = 'http://localhost:6118'

async function createFirstUser() {
  const userData = {
    email: 'csalini@coradir.com.ar',
    password: '159753!Z',
    name: 'Carlos Salini',
    role: 'superadmin'
  }

  console.log('🚀 Creando usuario superadmin...')
  console.log('   Email:', userData.email)
  console.log('   Nombre:', userData.name)
  console.log('   Rol:', userData.role)
  console.log('')

  try {
    // Intenta con el endpoint de first register
    const response = await fetch(`${API_URL}/api/users/first-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Usuario superadmin creado exitosamente!')
      console.log('   ID:', data.doc?.id || data.user?.id)
      console.log('')
      console.log('🔗 Accede al panel admin en: http://localhost:6118/admin')
      console.log('   Email: csalini@coradir.com.ar')
      console.log('   Password: 159753!Z')
      return
    }

    // Si falla, intenta con el endpoint regular
    const response2 = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    const data2 = await response2.json()

    if (!response2.ok) {
      console.error('❌ Error al crear usuario:', data2)
      if (data2.message?.includes('E11000')) {
        console.log('\n⚠️  El usuario ya existe. Intenta iniciar sesión con:')
        console.log('   Email: csalini@coradir.com.ar')
        console.log('   URL: http://localhost:6118/admin/login')
      }
      process.exit(1)
    }

    console.log('✅ Usuario superadmin creado exitosamente!')
    console.log('   ID:', data2.doc?.id || data2.id)
    console.log('')
    console.log('🔗 Accede al panel admin en: http://localhost:6118/admin')
    console.log('   Email: csalini@coradir.com.ar')
    console.log('   Password: 159753!Z')

  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    console.log('\n💡 Asegúrate de que el servidor esté corriendo en http://localhost:6118')
    process.exit(1)
  }
}

createFirstUser()
