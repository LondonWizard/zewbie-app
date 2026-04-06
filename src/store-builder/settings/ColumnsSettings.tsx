import { useNode } from '@craftjs/core'

/** Settings panel for the ColumnsBlock component. */
export function ColumnsSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Columns</label>
        <div className="flex gap-1">
          {[2, 3, 4].map((cols) => (
            <button
              key={cols}
              onClick={() => setProp((p: Record<string, unknown>) => { p.columns = cols })}
              className={`flex-1 py-1 text-xs rounded border ${
                props.columns === cols ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200'
              }`}
            >
              {cols}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Gap</label>
        <input
          type="range"
          min={0}
          max={48}
          value={props.gap}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.gap = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.gap}px</span>
      </div>
    </div>
  )
}
