import { useParams } from 'react-router-dom'

export default function StorePageEdit() {
  const { id } = useParams()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Edit Store Page</h1>
      <p className="text-gray-500 mb-4">Route: /store/pages/{id}/edit</p>
      <p className="text-gray-600">
        Edit a specific store page — content blocks, SEO metadata, visibility.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
