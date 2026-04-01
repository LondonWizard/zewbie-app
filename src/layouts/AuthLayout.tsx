import { Outlet, Link } from 'react-router-dom'

/** Centered card layout for authentication pages. */
export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <Link to="/" className="mb-8 text-2xl font-bold text-indigo-600">
        Zewbie
      </Link>
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <Outlet />
      </div>
    </div>
  )
}
