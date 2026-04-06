import { useState, useCallback, useRef, useEffect } from 'react'
import { Editor, Frame, Element, useEditor } from '@craftjs/core'
import { Toolbox } from './panels/Toolbox'
import { SettingsPanel } from './panels/SettingsPanel'
import { TopBar } from './panels/TopBar'
import { Container } from './components/Container'
import { TextBlock } from './components/TextBlock'
import { ImageBlock } from './components/ImageBlock'
import { ButtonBlock } from './components/ButtonBlock'
import { HeroBlock } from './components/HeroBlock'
import { ProductGridBlock } from './components/ProductGridBlock'
import { DividerBlock } from './components/DividerBlock'
import { VideoBlock } from './components/VideoBlock'
import { ColumnsBlock } from './components/ColumnsBlock'
import { TextSettings } from './settings/TextSettings'
import { ImageSettings } from './settings/ImageSettings'
import { ButtonSettings } from './settings/ButtonSettings'
import { ContainerSettings } from './settings/ContainerSettings'
import { HeroSettings } from './settings/HeroSettings'
import { ProductGridSettings } from './settings/ProductGridSettings'
import { DividerSettings } from './settings/DividerSettings'
import { VideoSettings } from './settings/VideoSettings'
import { ColumnsSettings } from './settings/ColumnsSettings'
import { useAutoSave } from './hooks/useAutoSave'
import { useVersionHistory } from './hooks/useVersionHistory'
import { History, AlertCircle, CheckCircle2 } from 'lucide-react'
import api from '../lib/api'

TextBlock.craft = { ...TextBlock.craft, related: { settings: TextSettings } }
ImageBlock.craft = { ...ImageBlock.craft, related: { settings: ImageSettings } }
ButtonBlock.craft = { ...ButtonBlock.craft, related: { settings: ButtonSettings } }
Container.craft = { ...Container.craft, related: { settings: ContainerSettings } }
HeroBlock.craft = { ...HeroBlock.craft, related: { settings: HeroSettings } }
ProductGridBlock.craft = { ...ProductGridBlock.craft, related: { settings: ProductGridSettings } }
DividerBlock.craft = { ...DividerBlock.craft, related: { settings: DividerSettings } }
VideoBlock.craft = { ...VideoBlock.craft, related: { settings: VideoSettings } }
ColumnsBlock.craft = { ...ColumnsBlock.craft, related: { settings: ColumnsSettings } }

const RESOLVER = {
  Container,
  TextBlock,
  ImageBlock,
  ButtonBlock,
  HeroBlock,
  ProductGridBlock,
  DividerBlock,
  VideoBlock,
  ColumnsBlock,
}

const VIEWPORT_WIDTHS = { desktop: '100%', tablet: '768px', mobile: '375px' } as const

interface StoreBuilderProps {
  storeId: string
  pageId: string
  storeName?: string
  pageName?: string
  initialContent?: string
}

/** Save listener that serializes the editor state and feeds it to auto-save. */
function SaveListener({ onJsonChange }: { onJsonChange: (json: string) => void }) {
  const { query } = useEditor()
  const prevRef = useRef<string>('')

  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const json = query.serialize()
        if (json !== prevRef.current) {
          prevRef.current = json
          onJsonChange(json)
        }
      } catch {
        // editor not ready yet
      }
    }, 2000)
    return () => clearInterval(interval)
  }, [query, onJsonChange])

  return null
}

/** Full-featured store builder with drag-and-drop blocks, auto-save, and version history. */
export function StoreBuilder({
  storeId,
  pageId,
  storeName = 'My Store',
  pageName = 'Home',
  initialContent,
}: StoreBuilderProps) {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [editorJson, setEditorJson] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [sideTab, setSideTab] = useState<'blocks' | 'settings'>('blocks')
  const [saveError, setSaveError] = useState<string | null>(null)

  const { versions, loading: versionsLoading, fetchVersions, restoreVersion } = useVersionHistory(storeId, pageId)

  const handleSave = useCallback(async (data: string) => {
    setSaveError(null)
    try {
      await api.put(`/stores/${storeId}/pages/${pageId}`, { content: JSON.parse(data) })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      setSaveError(msg)
      throw err
    }
  }, [storeId, pageId])

  const { isSaving, lastSaved, manualSave } = useAutoSave({
    data: editorJson,
    onSave: handleSave,
    debounceMs: 3000,
  })

  const handlePreview = useCallback(() => {
    window.open(`/store/preview/${storeId}/${pageId}`, '_blank')
  }, [storeId, pageId])

  const handleJsonChange = useCallback((json: string) => {
    setEditorJson(json)
  }, [])

  const handleRestoreVersion = useCallback(async (versionId: string) => {
    const content = await restoreVersion(versionId)
    if (content) {
      window.location.reload()
    }
  }, [restoreVersion])

  return (
    <Editor resolver={RESOLVER} enabled>
      <div className="flex flex-col h-screen bg-gray-100">
        <TopBar
          storeName={storeName}
          pageName={pageName}
          onSave={manualSave}
          onPreview={handlePreview}
          isSaving={isSaving}
          lastSaved={lastSaved}
          viewport={viewport}
          onViewportChange={setViewport}
        />

        {/* Save status banner */}
        {saveError && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-xs">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Save failed: {saveError}</span>
            <button onClick={manualSave} className="ml-auto underline hover:no-underline">Retry</button>
          </div>
        )}
        {lastSaved && !saveError && (
          <div className="flex items-center gap-2 px-4 py-1 bg-green-50 border-b border-green-200 text-green-700 text-xs">
            <CheckCircle2 className="w-3 h-3" />
            <span>Last saved at {lastSaved}</span>
          </div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar: blocks + settings */}
          <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSideTab('blocks')}
                className={`flex-1 py-2 text-xs font-medium ${sideTab === 'blocks' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Blocks
              </button>
              <button
                onClick={() => setSideTab('settings')}
                className={`flex-1 py-2 text-xs font-medium ${sideTab === 'settings' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              >
                Settings
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sideTab === 'blocks' ? <Toolbox /> : <SettingsPanel />}
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-auto p-6 flex justify-center">
            <div
              style={{ width: VIEWPORT_WIDTHS[viewport], maxWidth: '100%', transition: 'width 0.3s' }}
              className="bg-white rounded-lg shadow-lg min-h-full"
            >
              <Frame data={initialContent}>
                <Element canvas is={Container} background="#ffffff" padding={0}>
                  <HeroBlock />
                  <Element canvas is={Container} background="#ffffff" padding={40}>
                    <TextBlock text="Featured Products" fontSize={28} fontWeight="bold" textAlign="center" />
                    <ProductGridBlock columns={3} />
                  </Element>
                </Element>
              </Frame>
            </div>
          </div>

          {/* Right sidebar: version history */}
          <div className={`bg-white border-l border-gray-200 transition-all ${showHistory ? 'w-64' : 'w-10'}`}>
            <button
              onClick={() => {
                setShowHistory(!showHistory)
                if (!showHistory) fetchVersions()
              }}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-50"
              title="Version History"
              aria-label="Toggle version history"
            >
              <History className="w-4 h-4" />
            </button>
            {showHistory && (
              <div className="p-3 overflow-y-auto">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Version History
                </h3>
                {versionsLoading ? (
                  <p className="text-xs text-gray-400">Loading...</p>
                ) : versions.length === 0 ? (
                  <p className="text-xs text-gray-400">No versions yet. Publish your store to create a snapshot.</p>
                ) : (
                  <div className="space-y-2">
                    {versions.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => handleRestoreVersion(v.id)}
                        className="w-full text-left p-2 rounded border border-gray-200 hover:bg-blue-50 text-xs"
                      >
                        <span className="font-medium">v{v.version}</span>
                        <br />
                        <span className="text-gray-400">
                          {new Date(v.createdAt).toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveListener onJsonChange={handleJsonChange} />
    </Editor>
  )
}
