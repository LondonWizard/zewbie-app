import { useEditor, Element } from '@craftjs/core'
import {
  Type, Image, SquareMousePointer, LayoutGrid, Columns2,
  Minus, PlayCircle, Star,
} from 'lucide-react'
import { Container } from '../components/Container'
import { TextBlock } from '../components/TextBlock'
import { ImageBlock } from '../components/ImageBlock'
import { ButtonBlock } from '../components/ButtonBlock'
import { HeroBlock } from '../components/HeroBlock'
import { ProductGridBlock } from '../components/ProductGridBlock'
import { DividerBlock } from '../components/DividerBlock'
import { VideoBlock } from '../components/VideoBlock'
import { ColumnsBlock } from '../components/ColumnsBlock'

const BLOCKS = [
  { label: 'Text', icon: Type, element: <TextBlock /> },
  { label: 'Image', icon: Image, element: <ImageBlock /> },
  { label: 'Button', icon: SquareMousePointer, element: <ButtonBlock /> },
  { label: 'Container', icon: LayoutGrid, element: <Element canvas is={Container} /> },
  { label: 'Columns', icon: Columns2, element: <ColumnsBlock /> },
  { label: 'Divider', icon: Minus, element: <DividerBlock /> },
  { label: 'Video', icon: PlayCircle, element: <VideoBlock /> },
  { label: 'Hero', icon: Star, element: <HeroBlock /> },
  { label: 'Products', icon: LayoutGrid, element: <ProductGridBlock /> },
] as const

/** Drag-and-drop toolbox panel listing available block types. */
export function Toolbox() {
  const { connectors } = useEditor()

  return (
    <div className="p-3 space-y-1">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Blocks</h3>
      <div className="grid grid-cols-2 gap-2">
        {BLOCKS.map(({ label, icon: Icon, element }) => (
          <button
            key={label}
            ref={(ref) => { if (ref) connectors.create(ref, element) }}
            className="flex flex-col items-center gap-1 p-3 rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-grab active:cursor-grabbing"
          >
            <Icon className="w-5 h-5 text-gray-600" />
            <span className="text-xs text-gray-700">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
