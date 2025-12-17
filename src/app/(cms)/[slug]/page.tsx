import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import RenderBlocks from '@/components/RenderBlocks'

type Props = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const page = docs[0]

  if (!page) {
    return {}
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || undefined,
    keywords: page.seo?.keywords || undefined,
    openGraph: page.seo?.ogImage
      ? {
          images: [
            {
              url: typeof page.seo.ogImage === 'string'
                ? page.seo.ogImage
                : page.seo.ogImage.url || '',
            },
          ],
        }
      : undefined,
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const { isEnabled: isDraftMode } = await draftMode()
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    draft: isDraftMode,
  })

  const page = docs[0]

  if (!page) {
    notFound()
  }

  return (
    <div>
      <RenderBlocks blocks={page.content || []} />
    </div>
  )
}

// NOTE: generateStaticParams is commented out because it requires MongoDB connection at build time
// For production deployment, consider using ISR or on-demand revalidation instead
// export async function generateStaticParams() {
//   try {
//     const payload = await getPayload({ config })
//     const { docs } = await payload.find({
//       collection: 'pages',
//       limit: 100,
//       draft: false,
//     })
//     return docs.map((page) => ({
//       slug: page.slug,
//     }))
//   } catch (error) {
//     console.warn('Failed to generate static params for CMS pages:', error)
//     return []
//   }
// }

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour
