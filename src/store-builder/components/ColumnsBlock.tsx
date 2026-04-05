import { memo } from 'react'
import { useNode, Element } from '@craftjs/core'
import { Container } from './Container'
import type { ReactNode } from 'react'

interface ColumnsBlockProps {
  columns?: number
  gap?: number
  children?: ReactNode
}

/** Multi-column layout block. Each column is a droppable area. */
export const ColumnsBlock = memo(function ColumnsBlock({ columns = 2, gap = 16 }: ColumnsBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}
    >
      {Array.from({ length: columns }, (_, i) => (
        <Element key={i} id={`column-${i}`} canvas is={Container} background="#fafafa" padding={12} />
      ))}
    </div>
  )
})

;(ColumnsBlock as unknown as { craft: object }).craft = {
  displayName: 'Columns',
  props: { columns: 2, gap: 16 },
}
