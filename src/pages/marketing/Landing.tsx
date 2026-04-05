import { Link } from 'react-router-dom'
import { ArrowRight, Store, Palette, CreditCard, BarChart3, Shield, Zap } from 'lucide-react'

const FEATURES = [
  { icon: Store, title: 'Build Your Store', desc: 'Drag-and-drop builder with 5 premium templates. No coding required.' },
  { icon: Palette, title: 'Full Customization', desc: 'Custom colors, fonts, domains, and branding. Make it truly yours.' },
  { icon: CreditCard, title: 'Earn Commissions', desc: 'Set your markup (10-45%) and earn on every sale. We handle payments.' },
  { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track visitors, orders, revenue, and customer behavior.' },
  { icon: Shield, title: 'Secure & Reliable', desc: 'Enterprise-grade security, Stripe payments, and 99.9% uptime.' },
  { icon: Zap, title: 'Social Selling', desc: 'Connect Instagram, TikTok, Facebook, and more to sell everywhere.' },
]

const STEPS = [
  { step: '1', title: 'Create Your Store', desc: 'Sign up and pick a template in under 2 minutes.' },
  { step: '2', title: 'Choose Products', desc: 'Browse our curated catalog of premium jewelry and diamonds.' },
  { step: '3', title: 'Start Selling', desc: 'Share your store link and earn on every sale.' },
]

/** Marketing landing page with hero, features, how-it-works, and CTAs. */
export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://placehold.co/1920x1080/1e293b/334155?text=')] opacity-10" />
        <div className="relative max-w-6xl mx-auto px-6 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Launch Your Jewelry<br />
            <span className="text-blue-400">Store in Minutes</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Create a beautiful online store, curate from our premium product catalog, and earn commissions on every sale. No inventory needed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-gray-600 text-gray-300 font-semibold hover:bg-gray-800 transition-colors text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to sell jewelry online</h2>
            <p className="text-gray-500 text-lg">Powerful tools without the complexity</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
            <p className="text-gray-500 text-lg">Three steps to your own jewelry business</p>
          </div>
          <div className="space-y-8">
            {STEPS.map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-full bg-blue-600 text-white text-xl font-bold flex items-center justify-center flex-shrink-0">
                  {step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start selling?</h2>
          <p className="text-gray-300 text-lg mb-8">
            Join thousands of creators earning commissions on premium jewelry. No upfront costs.
          </p>
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-lg"
          >
            Create Your Store
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
