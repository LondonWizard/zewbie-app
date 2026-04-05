import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Package, MapPin, Truck, Clock, CheckCircle, CreditCard } from 'lucide-react'
import api from '../../lib/api'

interface OrderData {
  id: string
  orderNumber: string
  status: string
  customerEmail: string
  shippingAddress: Record<string, string> | null
  totalPrice: number
  taxAmount: number
  shippingAmount: number
  platformFee: number
  userCommission: number
  trackingNumber: string | null
  createdAt: string
  storeProduct: {
    product: { name: string; images: string[] }
  } | null
  payment: { status: string; method: string } | null
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']

/** Order detail page with status timeline, shipping info, and payment breakdown. */
export default function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data?.data ?? res.data)
      } catch {
        setOrder(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-100 rounded w-1/3" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Order not found.</p>
        <Link to="/orders" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to Orders</Link>
      </div>
    )
  }

  const activeStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link to="/orders" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-400">
            {new Date(order.createdAt).toLocaleDateString()} &middot; {order.customerEmail}
          </p>
        </div>
        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
          {order.status}
        </span>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">Order Progress</h2>
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex-1 flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                i <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {i <= activeStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < activeStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          {STATUS_STEPS.map((step) => (
            <div key={step} className="flex-1 text-center">
              <span className="text-[10px] text-gray-500">{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4" /> Product
          </h2>
          {order.storeProduct?.product ? (
            <div className="flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                {order.storeProduct.product.images?.[0] && (
                  <img src={order.storeProduct.product.images[0]} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">{order.storeProduct.product.name}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Product info unavailable</p>
          )}
        </div>

        {/* Shipping */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Shipping
          </h2>
          {order.shippingAddress ? (
            <div className="text-sm text-gray-600 space-y-0.5">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No shipping address provided</p>
          )}
          {order.trackingNumber && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <Truck className="w-4 h-4 text-blue-500" />
              <span className="font-mono text-blue-600">{order.trackingNumber}</span>
            </div>
          )}
        </div>

        {/* Payment */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment
          </h2>
          {order.payment ? (
            <div className="text-sm space-y-1">
              <p>Method: <span className="font-medium">{order.payment.method}</span></p>
              <p>Status: <span className="font-medium">{order.payment.status}</span></p>
            </div>
          ) : (
            <p className="text-sm text-gray-400">Payment pending</p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Price Breakdown
          </h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>${((order.totalPrice - order.taxAmount - order.shippingAmount) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Tax</span>
              <span>${(order.taxAmount / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping</span>
              <span>${(order.shippingAmount / 100).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>${(order.totalPrice / 100).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-green-600">
              <span>Your Commission</span>
              <span>${(order.userCommission / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
