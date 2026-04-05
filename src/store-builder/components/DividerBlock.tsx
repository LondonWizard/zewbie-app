import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface DividerBlockProps {
  color?: string
  thickness?: number
  margin?: number
}

/** Horizontal rule / divider block. */
export const DividerBlock = memo(function DividerBlock({ color = '#e5e7eb', thickness = 1, margin = 20 }: DividerBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
      style={{ marginTop: margin, marginBottom: margin }}
    >
      <hr style={{ borderColor: color, borderWidth: thickness }} />
    </div>
  )
})

;(DividerBlock as unknown as { craft: object }).craft = {
  displayName: 'Divider',
  props: { color: '#e5e7eb', thickness: 1, margin: 20 },
}
