export default function VerifyEmail() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Verify Email</h1>
      <p className="text-gray-500 mb-4">Route: /auth/verify-email/:token</p>
      <p className="text-gray-600">
        Email verification confirmation with auto-redirect to dashboard.
      </p>
      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
