import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { STORE_TEMPLATES } from '../../store-builder/templates'
import type { StoreTemplate } from '../../store-builder/templates'
import { Check, Eye } from 'lucide-react'
import api from '../../lib/api'

/** Template gallery page where users pick a starting template for their store. */
export default function Templates() {
  const navigate = useNavigate()
  const [applying, setApplying] = useState<string | null>(null)
  const [preview, setPreview] = useState<StoreTemplate | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  function openPreview(template: StoreTemplate) {
    triggerRef.current = document.activeElement as HTMLElement
    setPreview(template)
  }

  const closePreview = useCallback(() => {
    setPreview(null)
    triggerRef.current?.focus()
  }, [])

  // Focus trap and escape-to-close for the preview modal
  useEffect(() => {
    if (!preview) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        closePreview()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    // Focus first element inside dialog
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    focusable?.[0]?.focus()

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [preview, closePreview])

  async function applyTemplate(template: StoreTemplate) {
    setApplying(template.id)
    try {
      await api.post('/stores/current/apply-template', {
        templateId: template.id,
        content: template.content,
      })
      navigate('/store/editor')
    } catch {
      navigate('/store/editor', { state: { template: template.content } })
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Template Gallery</h1>
        <p className="text-gray-500 mt-1">
          Choose a template to get started. You can fully customize it in the editor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STORE_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-[4/3] bg-gray-100">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => openPreview(template)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white text-gray-900 text-sm font-medium hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button
                  onClick={() => applyTemplate(template)}
                  disabled={applying === template.id}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
                >
                  <Check className="w-4 h-4" />
                  {applying === template.id ? 'Applying...' : 'Use Template'}
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
                  {template.category}
                </span>
              </div>
              <p className="text-sm text-gray-500">{template.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Template Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-8"
          onClick={(e) => { if (e.target === e.currentTarget) closePreview() }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="template-preview-title"
            className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h2 id="template-preview-title" className="text-lg font-semibold">{preview.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { applyTemplate(preview); closePreview() }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
                >
                  Use This Template
                </button>
                <button
                  onClick={closePreview}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="p-6">
              <img src={preview.thumbnail} alt={preview.name} className="w-full rounded-lg" loading="lazy" />
              <p className="text-gray-600 mt-4">{preview.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
