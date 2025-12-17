import React from 'react'
import type { Page } from '@/payload-types'

type RichTextBlockProps = Extract<
  NonNullable<Page['content']>[number],
  { blockType: 'richText' }
>

export default function RichTextBlock({ content }: RichTextBlockProps) {
  // Payload Lexical editor devuelve el contenido en formato JSON
  // Por ahora renderizamos un contenedor básico
  // En el futuro se puede integrar el serializador de Lexical

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-lg">
        {/* TODO: Integrar serializer de Lexical para renderizar el contenido rich text */}
        <div>
          {JSON.stringify(content, null, 2)}
        </div>
      </div>
    </section>
  )
}
