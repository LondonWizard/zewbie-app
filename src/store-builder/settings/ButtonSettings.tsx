import { useNode } from '@craftjs/core'

/** Settings panel for the ButtonBlock component. */
export function ButtonSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
        <input
          type="text"
          value={props.text}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.text = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
        <input
          type="text"
          value={props.href}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.href = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
        <input
          type="color"
          value={props.background}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.background = e.target.value })}
          className="w-full h-8 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
        <input
          type="color"
          value={props.color}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.color = e.target.value })}
          className="w-full h-8 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Size</label>
        <div className="flex gap-1">
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <button
              key={size}
              onClick={() => setProp((p: Record<string, unknown>) => { p.size = size })}
              className={`flex-1 py-1 text-xs rounded border ${
                props.size === size ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200'
              }`}
            >
              {size.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={props.fullWidth}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.fullWidth = e.target.checked })}
          className="rounded"
          id="fullWidth"
        />
        <label htmlFor="fullWidth" className="text-xs text-gray-600">Full Width</label>
      </div>
    </div>
  )
}
