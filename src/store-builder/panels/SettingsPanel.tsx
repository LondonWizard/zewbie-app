import { useEditor } from '@craftjs/core'

/** Renders the settings form for the currently selected block. */
export function SettingsPanel() {
  const { selected, actions } = useEditor((state) => {
    const currentNodeId = [...state.events.selected][0]
    if (currentNodeId) {
      return {
        selected: {
          id: currentNodeId,
          name: state.nodes[currentNodeId]?.data?.displayName ?? state.nodes[currentNodeId]?.data?.name,
          settings: state.nodes[currentNodeId]?.related?.settings,
          isDeletable: state.nodes[currentNodeId]?.data?.name !== 'Container' || currentNodeId !== 'ROOT',
        },
      }
    }
    return { selected: null }
  })

  if (!selected) {
    return (
      <div className="p-4 text-center text-sm text-gray-400">
        Click a block on the canvas to edit its settings
      </div>
    )
  }

  const SettingsComponent = selected.settings

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {selected.name} Settings
        </h3>
        {selected.isDeletable && (
          <button
            onClick={() => actions.delete(selected.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
      {SettingsComponent ? <SettingsComponent /> : (
        <p className="text-sm text-gray-400">No settings available</p>
      )}
    </div>
  )
}
