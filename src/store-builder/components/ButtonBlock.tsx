import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface ButtonBlockProps {
  text?: string
  background?: string
  color?: string
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  href?: string
}

/** Strips dangerous URI schemes, allowing only http(s) and relative paths. */
function sanitizeHref(href: string): string {
  if (!href) return '#'
  const lower = href.toLowerCase().trim()
  if (lower.startsWith('javascript:') || lower.startsWith('data:') || lower.startsWith('vbscript:')) return '#'
  return href
}

/** Call-to-action button block for the store builder. */
export const ButtonBlock = memo(function ButtonBlock({
  text = 'Shop Now',
  background = '#2563eb',
  color = '#ffffff',
  size = 'md',
  fullWidth = false,
  href = '#',
}: ButtonBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <a
        href={sanitizeHref(href)}
        style={{ background, color }}
        className={`inline-block rounded-lg font-semibold ${sizeClasses[size]} ${fullWidth ? 'w-full text-center' : ''}`}
      >
        {text}
      </a>
    </div>
  )
})

;(ButtonBlock as unknown as { craft: object }).craft = {
  displayName: 'Button',
  props: { text: 'Shop Now', background: '#2563eb', color: '#ffffff', size: 'md', fullWidth: false, href: '#' },
}
