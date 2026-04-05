import { memo } from 'react'
import { useNode, Element } from '@craftjs/core'
import { Container } from './Container'
import { TextBlock } from './TextBlock'
import { ButtonBlock } from './ButtonBlock'

interface HeroBlockProps {
  backgroundImage?: string
  overlayColor?: string
  height?: number
}

/** Hero section block with background image, headline, and CTA. */
export const HeroBlock = memo(function HeroBlock({
  backgroundImage = 'https://placehold.co/1200x600/1e293b/f1f5f9?text=Hero+Section',
  overlayColor = 'rgba(0,0,0,0.4)',
  height = 400,
}: HeroBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`relative cursor-move ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height,
      }}
    >
      <div style={{ background: overlayColor }} className="absolute inset-0" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <Element id="hero-title" canvas is={Container} background="transparent" padding={0}>
          <TextBlock text="Welcome to Our Store" fontSize={42} fontWeight="bold" color="#ffffff" textAlign="center" />
          <TextBlock text="Discover unique, handcrafted jewelry" fontSize={18} color="#e2e8f0" textAlign="center" />
          <ButtonBlock text="Shop Collection" background="#2563eb" size="lg" />
        </Element>
      </div>
    </div>
  )
})

;(HeroBlock as unknown as { craft: object }).craft = {
  displayName: 'Hero Section',
  props: {
    backgroundImage: 'https://placehold.co/1200x600/1e293b/f1f5f9?text=Hero+Section',
    overlayColor: 'rgba(0,0,0,0.4)',
    height: 400,
  },
}
