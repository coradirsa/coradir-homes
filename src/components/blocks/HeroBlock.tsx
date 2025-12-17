import React from 'react'
import type { Page } from '@/payload-types'
import Image from 'next/image'

type HeroBlockProps = Extract<
  NonNullable<Page['content']>[number],
  { blockType: 'hero' }
>

export default function HeroBlock({ title, subtitle, cta, backgroundImage }: HeroBlockProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && typeof backgroundImage !== 'string' && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage.url || ''}
            alt={backgroundImage.alt || ''}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-gray-200">{subtitle}</p>
        )}
        {cta && (
          <a
            href={cta.url}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  )
}
