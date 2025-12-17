import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const secret = searchParams.get('secret')

  // Verificar secret para prevenir acceso no autorizado
  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // Verificar que la URL esté presente
  if (!url) {
    return new Response('URL parameter is required', { status: 400 })
  }

  // Habilitar draft mode
  const draft = await draftMode()
  draft.enable()

  // Redirigir a la URL solicitada
  redirect(url)
}
