import { memo } from 'react'
import { useNode } from '@craftjs/core'

interface ProductGridBlockProps {
  columns?: number
  gap?: number
  showPrice?: boolean
}

/** Placeholder product grid block that renders sample product cards. */
export const ProductGridBlock = memo(function ProductGridBlock({
  columns = 3,
  gap = 16,
  showPrice = true,
}: ProductGridBlockProps) {
  const { connectors: { connect, drag }, isActive } = useNode((node) => ({
    isActive: node.events.selected,
  }))

  const sampleProducts = [
    { name: 'Diamond Ring', price: '$2,499', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Ring' },
    { name: 'Gold Necklace', price: '$1,899', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Necklace' },
    { name: 'Pearl Earrings', price: '$799', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Earrings' },
    { name: 'Sapphire Bracelet', price: '$1,299', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Bracelet' },
    { name: 'Wedding Band', price: '$999', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Band' },
    { name: 'Pendant', price: '$649', image: 'https://placehold.co/300x300/f1f5f9/475569?text=Pendant' },
  ]

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)) }}
      className={`cursor-move ${isActive ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
    >
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap }}>
        {sampleProducts.slice(0, columns * 2).map((p, i) => (
          <div key={i} className="bg-white rounded-lg border overflow-hidden">
            <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" loading="lazy" />
            <div className="p-3">
              <p className="font-medium text-gray-900">{p.name}</p>
              {showPrice && <p className="text-sm text-gray-500">{p.price}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
})

;(ProductGridBlock as unknown as { craft: object }).craft = {
  displayName: 'Product Grid',
  props: { columns: 3, gap: 16, showPrice: true },
}
