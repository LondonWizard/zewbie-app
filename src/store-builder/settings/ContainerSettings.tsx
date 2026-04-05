import { useNode } from '@craftjs/core'

/** Settings panel for the Container component. */
export function ContainerSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
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
        <label className="block text-xs font-medium text-gray-600 mb-1">Padding</label>
        <input
          type="range"
          min={0}
          max={80}
          value={props.padding}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.padding = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.padding}px</span>
      </div>
    </div>
  )
}
