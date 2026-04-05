import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, Pencil, Trash2, Eye } from 'lucide-react'
import api from '../../lib/api'

interface StorePage {
  id: string
  title: string
  slug: string
  isPublished: boolean
  updatedAt: string
}

/** Lists all pages belonging to the user's store with options to create, edit, and delete. */
export default function StorePages() {
  const navigate = useNavigate()
  const [pages, setPages] = useState<StorePage[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/stores/mine/pages')
        setPages(res.data?.data ?? res.data ?? [])
      } catch {
        setPages([
          { id: 'home', title: 'Home', slug: 'home', isPublished: true, updatedAt: new Date().toISOString() },
          { id: 'about', title: 'About', slug: 'about', isPublished: false, updatedAt: new Date().toISOString() },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function createPage() {
    if (!newTitle.trim()) return
    try {
      const res = await api.post('/stores/mine/pages', { title: newTitle })
      const page = res.data?.data ?? res.data
      setPages([...pages, page])
      setNewTitle('')
      setCreating(false)
      navigate(`/store/pages/${page.id}/edit`)
    } catch {
      const fake = { id: Date.now().toString(), title: newTitle, slug: newTitle.toLowerCase().replace(/\s+/g, '-'), isPublished: false, updatedAt: new Date().toISOString() }
      setPages([...pages, fake])
      setNewTitle('')
      setCreating(false)
    }
  }

  async function deletePage(id: string) {
    if (!confirm('Delete this page? This cannot be undone.')) return
    try {
      await api.delete(`/stores/mine/pages/${id}`)
    } catch { /* offline fallback */ }
    setPages(pages.filter((p) => p.id !== id))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Pages</h1>
          <p className="text-gray-500 mt-1">Manage the pages in your storefront</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Page
        </button>
      </div>

      {creating && (
        <div className="mb-6 p-4 rounded-lg border border-blue-200 bg-blue-50">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Page title..."
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && createPage()}
            />
            <button
              onClick={createPage}
              className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium"
            >
              Create
            </button>
            <button
              onClick={() => { setCreating(false); setNewTitle('') }}
              className="px-4 py-2 rounded-md border border-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pages yet. Create your first page to get started.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pages.map((page) => (
            <div
              key={page.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="font-medium text-gray-900">{page.title}</h3>
                  <p className="text-xs text-gray-400">/{page.slug}</p>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    page.isPublished
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {page.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded hover:bg-gray-100" title="Preview" aria-label={`Preview ${page.title}`}>
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
                <Link
                  to={`/store/pages/${page.id}/edit`}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Edit"
                  aria-label={`Edit ${page.title}`}
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </Link>
                <button
                  onClick={() => deletePage(page.id)}
                  className="p-2 rounded hover:bg-red-50"
                  title="Delete"
                  aria-label={`Delete ${page.title}`}
                >
                  <Trash2 className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
