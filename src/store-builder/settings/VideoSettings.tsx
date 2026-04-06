import { useNode } from '@craftjs/core'

/** Settings panel for the VideoBlock component. */
export function VideoSettings() {
  const { actions: { setProp }, props } = useNode((node) => ({ props: node.data.props }))

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Embed URL</label>
        <input
          type="text"
          value={props.url}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.url = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="https://www.youtube.com/embed/..."
        />
        <p className="text-xs text-gray-400 mt-1">YouTube and Vimeo embed URLs only</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
        <input
          type="text"
          value={props.width}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.width = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="e.g. 100%, 560px"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Aspect Ratio</label>
        <select
          value={props.aspectRatio}
          onChange={(e) => setProp((p: Record<string, unknown>) => { p.aspectRatio = e.target.value })}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="16/9">16:9</option>
          <option value="4/3">4:3</option>
          <option value="1/1">1:1</option>
          <option value="21/9">21:9</option>
        </select>
      </div>
    </div>
  )
}
