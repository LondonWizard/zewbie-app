/** Pre-built store templates as serialized Craft.js JSON. */

const heroContent = (title: string, subtitle: string, bgColor: string) => ({
  ROOT: {
    type: { resolvedName: 'Container' },
    props: { background: '#ffffff', padding: 0 },
    displayName: 'Container',
    custom: {},
    hidden: false,
    nodes: ['hero', 'products', 'footer-text'],
    linkedNodes: {},
    isCanvas: true,
  },
  hero: {
    type: { resolvedName: 'HeroBlock' },
    props: {
      backgroundImage: `https://placehold.co/1200x600/${bgColor.replace('#', '')}/f1f5f9?text=${encodeURIComponent(title)}`,
      overlayColor: 'rgba(0,0,0,0.4)',
      height: 400,
    },
    displayName: 'Hero Section',
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
    parent: 'ROOT',
  },
  products: {
    type: { resolvedName: 'ProductGridBlock' },
    props: { columns: 3, gap: 16, showPrice: true },
    displayName: 'Product Grid',
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
    parent: 'ROOT',
  },
  'footer-text': {
    type: { resolvedName: 'TextBlock' },
    props: { text: subtitle, fontSize: 14, color: '#9ca3af', textAlign: 'center', fontWeight: 'normal' },
    displayName: 'Text',
    custom: {},
    hidden: false,
    nodes: [],
    linkedNodes: {},
    parent: 'ROOT',
  },
})

export interface StoreTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  category: 'minimal' | 'luxury' | 'bold' | 'classic' | 'modern'
  content: Record<string, unknown>
}

export const STORE_TEMPLATES: StoreTemplate[] = [
  {
    id: 'minimal-elegance',
    name: 'Minimal Elegance',
    description: 'Clean, modern design with generous whitespace. Perfect for high-end jewelry.',
    thumbnail: 'https://placehold.co/400x300/f8fafc/475569?text=Minimal+Elegance',
    category: 'minimal',
    content: heroContent('Minimal Elegance', '© 2026 Your Store. All rights reserved.', '0f172a'),
  },
  {
    id: 'luxury-gold',
    name: 'Luxury Gold',
    description: 'Opulent gold-accented theme for premium diamond collections.',
    thumbnail: 'https://placehold.co/400x300/1c1917/d4a574?text=Luxury+Gold',
    category: 'luxury',
    content: heroContent('Luxury Gold', 'Crafted with passion, worn with pride.', '78350f'),
  },
  {
    id: 'bold-statement',
    name: 'Bold Statement',
    description: 'High-contrast, bold typography for brands that stand out.',
    thumbnail: 'https://placehold.co/400x300/18181b/f43f5e?text=Bold+Statement',
    category: 'bold',
    content: heroContent('Bold Statement', 'Make a statement with every piece.', '881337'),
  },
  {
    id: 'classic-tradition',
    name: 'Classic Tradition',
    description: 'Timeless serif-based design evoking heritage and craftsmanship.',
    thumbnail: 'https://placehold.co/400x300/faf5ff/6b21a8?text=Classic+Tradition',
    category: 'classic',
    content: heroContent('Classic Tradition', 'A legacy of fine craftsmanship since 1980.', '3b0764'),
  },
  {
    id: 'modern-edge',
    name: 'Modern Edge',
    description: 'Sleek, tech-inspired look with vibrant accent colors.',
    thumbnail: 'https://placehold.co/400x300/0c4a6e/38bdf8?text=Modern+Edge',
    category: 'modern',
    content: heroContent('Modern Edge', 'Where innovation meets artistry.', '0c4a6e'),
  },
]
