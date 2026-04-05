import { useNode } from '@craftjs/core'

/** Settings panel for the ImageBlock component. */
export function ImageSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
        <input
          type="text"
          value={props.src}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.src = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Alt Text</label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.alt = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
        <input
          type="text"
          value={props.width}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.width = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. 100%, 300px"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius</label>
        <input
          type="range"
          min={0}
          max={50}
          value={props.borderRadius}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.borderRadius = parseInt(e.target.value) })}
          className="w-full"
        />
        <span className="text-xs text-gray-500">{props.borderRadius}px</span>
      </div>
    </div>
  )
}
