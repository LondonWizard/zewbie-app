export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-4">Route: /dashboard</p>
      <p className="text-gray-600">
        Revenue summary, recent orders, store traffic, quick actions, and notifications.
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {['Revenue', 'Orders', 'Traffic', 'Notifications'].map((card) => (
          <div
            key={card}
            className="p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50"
          >
            <p className="text-xs font-semibold text-gray-400">{card}</p>
            <p className="text-sm text-gray-400 mt-2">Placeholder</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        <p className="text-sm text-gray-400">Content placeholder — implementation pending</p>
      </div>
    </div>
  )
}
