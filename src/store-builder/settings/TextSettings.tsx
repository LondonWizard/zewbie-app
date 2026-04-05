import { useNode } from '@craftjs/core'

/** Settings panel for the TextBlock component. */
export function TextSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Text Content</label>
        <textarea
          value={props.text}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.text = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          rows={3}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
        <input
          type="range"
          min={10}
          max={72}
          value={props.fontSize}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.fontSize = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.fontSize}px</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Font Weight</label>
        <select
          value={props.fontWeight}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.fontWeight = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="300">Light</option>
          <option value="600">Semi-bold</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
        <input
          type="color"
          value={props.color}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.color = e.target.value })}
          className="w-full h-8 cursor-pointer"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Text Align</label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => setProp((p: Record<string, unknown>) => { p.textAlign = align })}
              className={`flex-1 py-1 text-xs rounded border ${
                props.textAlign === align ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
