import React from 'react'
import type { Page } from '@/payload-types'
import HeroBlock from './blocks/HeroBlock'
import FeaturesBlock from './blocks/FeaturesBlock'
import CTABlock from './blocks/CTABlock'
import ContactFormBlock from './blocks/ContactFormBlock'
import RichTextBlock from './blocks/RichTextBlock'

type Props = {
  blocks: NonNullable<Page['content']>
}

export default function RenderBlocks({ blocks }: Props) {
  if (!blocks || blocks.length === 0) {
    return null
  }

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero':
            return <HeroBlock key={index} {...block} />
          case 'features':
            return <FeaturesBlock key={index} {...block} />
          case 'cta':
            return <CTABlock key={index} {...block} />
          case 'contactForm':
            return <ContactFormBlock key={index} {...block} />
          case 'richText':
            return <RichTextBlock key={index} {...block} />
          default:
            return null
        }
      })}
    </>
  )
}
