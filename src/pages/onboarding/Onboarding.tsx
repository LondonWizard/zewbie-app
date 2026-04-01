export default function Onboarding() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Onboarding Wizard</h1>
      <p className="text-gray-500 mb-4">Route: /onboarding</p>
      <p className="text-gray-600">
        5-step setup wizard: Profile info → Store name &amp; subdomain → Choose template → Select products → Payment setup.
      </p>

      <div className="mt-6 flex gap-2">
        {['Profile', 'Store', 'Template', 'Products', 'Payment'].map((step, i) => (
          <div
            key={step}
            className="flex-1 text-center p-3 rounded-lg border border-dashed border-gray-300 bg-gray-50"
          >
            <p className="text-xs font-semibold text-gray-400">Step {i + 1}</p>
            <p className="text-sm text-gray-600 mt-1">{step}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
