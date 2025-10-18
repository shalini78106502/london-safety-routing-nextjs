import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="relative container mx-auto px-6 py-32 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight">
              Navigate London
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-accent mb-8 leading-tight">
              Safely & Smart
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed">
              Discover the safest routes across London with real-time hazard 
              data, community insights, and intelligent routing for pedestrians 
              and cyclists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href="/suggested-routes" className="bg-accent hover:bg-accent/90 text-black font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg">
                🗺️ Find Safe Routes
              </Link>
              <Link href="/hazard-reporting" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2 text-lg">
                ⚠️ Report Hazard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-900">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Smart Routing Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-slate-900">Smart Routing</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered route optimization considering safety, distance, 
                and real-time conditions.
              </p>
            </div>

            {/* Hazard Alerts Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.02c-5.51 0-9.98 4.47-9.98 9.98s4.47 9.98 9.98 9.98 9.98-4.47 9.98-9.98S17.51 2.02 12 2.02zM13 17h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-slate-900">Hazard Alerts</h3>
              <p className="text-gray-600 leading-relaxed">
                Community-driven hazard reporting and real-time safety 
                notifications.
              </p>
            </div>

            {/* Travel Buddies Card */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H16c-.8 0-1.54.37-2.01.99L12 11l-1.99-2.01A2.5 2.5 0 0 0 8 8H5.46c-.8 0-1.54.37-2.01.99L1 14.5V22h2v-6h2l2-6 2 6h2v6h4zm-8-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S10.5 9.17 10.5 10s.67 1.5 1.5 1.5z"/>
                </svg>
              </div>
              <h3 className="font-bold text-2xl mb-4 text-slate-900">Travel Buddies</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with fellow travelers for safer journeys across 
                London.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Navigate Safely Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-dark mb-6">
            Ready to Navigate Safely?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Join thousands of Londoners who trust our platform for safer journeys every day.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/suggested-routes" className="bg-accent hover:bg-accent/90 text-primary-dark font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              🗺️ Start Routing
            </Link>
            <Link href="/find-buddy" className="bg-primary-dark hover:bg-primary text-white font-semibold px-8 py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center gap-2">
              👥 Find Travel Buddies
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
