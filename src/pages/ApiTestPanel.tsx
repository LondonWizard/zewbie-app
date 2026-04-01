import { useState } from 'react'
import api from '../lib/api'

interface TestResult {
  label: string
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: string
}

const INITIAL_TESTS: TestResult[] = [
  { label: 'GET /system/health', status: 'idle' },
  { label: 'POST /auth/register', status: 'idle' },
  { label: 'POST /auth/login', status: 'idle' },
  { label: 'POST /auth/refresh', status: 'idle' },
  { label: 'GET /stores (CRUD)', status: 'idle' },
  { label: 'GET /products', status: 'idle' },
  { label: 'GET /orders', status: 'idle' },
]

/** API Test Panel — fire test requests and inspect responses. */
export default function ApiTestPanel() {
  const [tests, setTests] = useState<TestResult[]>(INITIAL_TESTS)
  const [response, setResponse] = useState<string>('')

  const updateTest = (index: number, update: Partial<TestResult>) => {
    setTests((prev) => prev.map((t, i) => (i === index ? { ...t, ...update } : t)))
  }

  const runTest = async (index: number) => {
    const test = tests[index]
    updateTest(index, { status: 'loading', data: undefined, error: undefined })

    try {
      let res
      switch (index) {
        case 0:
          res = await api.get('/system/health')
          break
        case 1:
          res = await api.post('/auth/register', {
            email: 'test@example.com',
            password: 'Test1234!',
            name: 'Test User',
          })
          break
        case 2:
          res = await api.post('/auth/login', {
            email: 'test@example.com',
            password: 'Test1234!',
          })
          break
        case 3:
          res = await api.post('/auth/refresh')
          break
        case 4:
          res = await api.get('/stores')
          break
        case 5:
          res = await api.get('/products')
          break
        case 6:
          res = await api.get('/orders')
          break
        default:
          return
      }
      updateTest(index, { status: 'success', data: res.data })
      setResponse(JSON.stringify(res.data, null, 2))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      updateTest(index, { status: 'error', error: message })
      setResponse(`Error on "${test.label}": ${message}`)
    }
  }

  const statusColor = (s: TestResult['status']) => {
    switch (s) {
      case 'idle':
        return 'bg-gray-100 text-gray-500'
      case 'loading':
        return 'bg-yellow-100 text-yellow-700'
      case 'success':
        return 'bg-green-100 text-green-700'
      case 'error':
        return 'bg-red-100 text-red-700'
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">API Test Panel</h1>
      <p className="text-gray-500 mb-4">Route: /api-test</p>
      <p className="text-gray-600 mb-6">
        Fire test requests against the backend API and inspect responses.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          {tests.map((test, i) => (
            <div
              key={test.label}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusColor(test.status)}`}
                >
                  {test.status}
                </span>
                <span className="text-sm font-mono">{test.label}</span>
              </div>
              <button
                onClick={() => runTest(i)}
                disabled={test.status === 'loading'}
                className="px-3 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                Run
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-2">Response</h2>
          <pre className="p-4 bg-gray-900 text-green-400 rounded-lg text-xs font-mono overflow-auto max-h-96 min-h-[200px]">
            {response || 'Run a test to see the response here...'}
          </pre>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">Service Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['API Server', 'Database', 'Redis', 'Storage'].map((service) => (
            <div
              key={service}
              className="p-3 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-center"
            >
              <p className="text-xs font-semibold text-gray-400">{service}</p>
              <p className="text-sm text-gray-400 mt-1">Unknown</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
