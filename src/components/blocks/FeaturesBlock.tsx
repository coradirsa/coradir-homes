import React from 'react'
import type { Page } from '@/payload-types'
import Image from 'next/image'

type FeaturesBlockProps = Extract<
  NonNullable<Page['content']>[number],
  { blockType: 'features' }
>

export default function FeaturesBlock({ title, features }: FeaturesBlockProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features?.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow"
            >
              {feature.icon && typeof feature.icon !== 'string' && (
                <div className="mb-6">
                  <Image
                    src={feature.icon.url || ''}
                    alt={feature.icon.alt || ''}
                    width={64}
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
              )}
              <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
