import { useEditor } from '@craftjs/core'
import { Undo2, Redo2, Eye, Save, Monitor, Smartphone, Tablet } from 'lucide-react'

interface TopBarProps {
  storeName: string
  pageName: string
  onSave: () => void
  onPreview: () => void
  isSaving: boolean
  lastSaved: string | null
  viewport: 'desktop' | 'tablet' | 'mobile'
  onViewportChange: (v: 'desktop' | 'tablet' | 'mobile') => void
}

/** Editor toolbar with undo/redo, viewport toggles, save, and preview. */
export function TopBar({
  storeName,
  pageName,
  onSave,
  onPreview,
  isSaving,
  lastSaved,
  viewport,
  onViewportChange,
}: TopBarProps) {
  const { canUndo, canRedo, actions } = useEditor((_, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }))

  return (
    <div className="flex items-center justify-between h-12 px-4 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-900">{storeName}</span>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-500">{pageName}</span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-gray-100 disabled:opacity-30"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-gray-200 mx-2" />

        <button
          onClick={() => onViewportChange('desktop')}
          className={`p-2 rounded ${viewport === 'desktop' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          title="Desktop"
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewportChange('tablet')}
          className={`p-2 rounded ${viewport === 'tablet' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          title="Tablet"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => onViewportChange('mobile')}
          className={`p-2 rounded ${viewport === 'mobile' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          title="Mobile"
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        {lastSaved && (
          <span className="text-xs text-gray-400">Saved {lastSaved}</span>
        )}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-60"
        >
          <Save className="w-3.5 h-3.5" />
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={onPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
      </div>
    </div>
  )
}
