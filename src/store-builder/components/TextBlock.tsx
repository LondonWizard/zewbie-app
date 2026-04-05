import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface TextBlockProps {
  text?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  textAlign?: 'left' | 'center' | 'right'
}

/** Editable text block for the store builder. */
export const TextBlock = memo(function TextBlock({
  text = 'Edit this text',
  fontSize = 16,
  fontWeight = 'normal',
  color = '#333333',
  textAlign = 'left',
}: TextBlockProps) {
  const { connectors: { connect, drag }, isActive, actions: { setProp } } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <p
        contentEditable={isActive}
        suppressContentEditableWarning
        onBlur={(e) => setProp((props: TextBlockProps) => { props.text = e.currentTarget.textContent ?? '' })}
        style={{ fontSize, fontWeight, color, textAlign, outline: 'none' }}
      >
        {text}
      </p>
    </div>
  )
})

;(TextBlock as unknown as { craft: object }).craft = {
  displayName: 'Text',
  props: { text: 'Edit this text', fontSize: 16, fontWeight: 'normal', color: '#333333', textAlign: 'left' },
}
