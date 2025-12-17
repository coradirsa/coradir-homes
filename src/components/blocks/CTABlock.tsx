import React from 'react'
import type { Page } from '@/payload-types'

type CTABlockProps = Extract<
  NonNullable<Page['content']>[number],
  { blockType: 'cta' }
>

export default function CTABlock({ title, description, primaryCTA, secondaryCTA, backgroundColor }: CTABlockProps) {
  const bgColor = backgroundColor === 'blue' ? 'bg-blue-600' : 'bg-gray-900'

  return (
    <section className={`${bgColor} text-white py-20 px-4`}>
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">{title}</h2>
        {description && (
          <p className="text-xl md:text-2xl mb-10 text-gray-200">
            {description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <a
              href={primaryCTA.url}
              className="inline-block bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              {primaryCTA.label}
            </a>
          )}
          {secondaryCTA && (
            <a
              href={secondaryCTA.url}
              className="inline-block border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 rounded-lg transition-colors"
            >
              {secondaryCTA.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
