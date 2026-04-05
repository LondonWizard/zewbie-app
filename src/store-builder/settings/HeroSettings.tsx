import { useNode } from '@craftjs/core'

/** Settings panel for the HeroBlock component. */
export function HeroSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Background Image URL</label>
        <input
          type="text"
          value={props.backgroundImage}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.backgroundImage = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Overlay Color</label>
        <input
          type="text"
          value={props.overlayColor}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.overlayColor = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. rgba(0,0,0,0.4)"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
        <input
          type="range"
          min={200}
          max={800}
          value={props.height}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.height = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.height}px</span>
      </div>
    </div>
  )
}
