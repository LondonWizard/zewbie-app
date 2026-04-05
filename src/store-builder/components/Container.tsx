import { memo } from 'react'
import { useNode } from '@craftjs/core'
import type { ReactNode } from 'react'

interface ContainerProps {
  background?: string
  padding?: number
  children?: ReactNode
}

/** Droppable container block for the store builder. */
export const Container = memo(function Container({ background = '#ffffff', padding = 20, children }: ContainerProps) {
  const { connectors: { connect, drag } } = useNode()

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      style={{ background, padding, minHeight: 60 }}
      className="rounded-lg border border-dashed border-gray-200"
    >
      {children}
    </div>
  )
})

;(Container as unknown as { craft: object }).craft = {
  displayName: 'Container',
  props: { background: '#ffffff', padding: 20 },
  rules: { canDrag: () => true },
}
