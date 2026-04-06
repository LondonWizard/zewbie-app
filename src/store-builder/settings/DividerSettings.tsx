import { useNode } from '@craftjs/core'

/** Settings panel for the DividerBlock component. */
export function DividerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
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
        <label className="block text-xs font-medium text-gray-600 mb-1">Thickness</label>
        <input
          type="range"
          min={1}
          max={8}
          value={props.thickness}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.thickness = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.thickness}px</span>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Margin</label>
        <input
          type="range"
          min={0}
          max={60}
          value={props.margin}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.margin = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.margin}px</span>
      </div>
    </div>
  )
}
