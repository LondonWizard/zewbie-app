import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface ImageBlockProps {
  src?: string
  alt?: string
  width?: string
  borderRadius?: number
}

/** Image block for the store builder. */
export const ImageBlock = memo(function ImageBlock({
  src = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
  alt = 'Store image',
  width = '100%',
  borderRadius = 8,
}: ImageBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <img src={src} alt={alt} style={{ width, borderRadius }} className="block" loading="lazy" />
    </div>
  )
})

;(ImageBlock as unknown as { craft: object }).craft = {
  displayName: 'Image',
  props: {
    src: 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Image',
    alt: 'Store image',
    width: '100%',
    borderRadius: 8,
  },
}
