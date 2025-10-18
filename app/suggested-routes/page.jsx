export default function SuggestedRoutes() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-slate-700 py-24">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Find the <span className="text-accent">Safest Route</span>
          </h1>
          <p className="text-2xl text-text-secondary mb-12">
            Across London
          </p>

          <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-2xl">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600">📍</span>
                    <label className="text-sm font-medium text-gray-700">From</label>
                  </div>
                  <input 
                    placeholder="" 
                    className="w-full p-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-accent text-gray-900" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600">📍</span>
                    <label className="text-sm font-medium text-gray-700">To</label>
                  </div>
                  <input 
                    placeholder="" 
                    className="w-full p-4 rounded-lg border-2 border-gray-200 focus:outline-none focus:border-accent text-gray-900" 
                  />
                </div>
              </div>

              <div className="flex justify-center gap-8 py-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" value="walking" className="text-accent" defaultChecked />
                  <span className="text-blue-600">🚶</span>
                  <span className="text-gray-700 font-medium">Walking</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="mode" value="cycling" className="text-accent" />
                  <span className="text-blue-600">🚴</span>
                  <span className="text-gray-700 font-medium">Cycling</span>
                </label>
              </div>

              <button className="w-full bg-accent hover:bg-accent/90 text-primary-dark font-bold py-4 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                🔍 Find Routes
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Route Comparison Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-primary-dark mb-4">Route Comparison</h2>
            <p className="text-xl text-gray-600">Choose between the fastest route or our AI-recommended safest path</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Fastest Route */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600">⚡</span>
                    <h3 className="text-xl font-bold text-primary-dark">Fastest Route</h3>
                  </div>
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    Safety: 7.2/10
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-4 text-center border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">🗺️ 🏢</div>
                  <span className="text-gray-500 font-medium">Interactive map coming soon</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">2.4 km</div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">28 min</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">4</div>
                    <div className="text-sm text-gray-600">Hazards</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-primary-dark mb-3">Route Highlights:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Direct path via Euston Road</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Well-lit main streets</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">Busy pedestrian areas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      <span className="text-gray-700">2 road crossings</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-primary-dark hover:bg-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  📍 Get Directions
                </button>
              </div>
            </div>

            {/* Safest Route */}
            <div className="bg-white border-2 border-accent rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">🛡️</span>
                    <h3 className="text-xl font-bold text-primary-dark">Safest Route</h3>
                    <span className="bg-accent text-primary-dark px-3 py-1 rounded-full text-xs font-bold">
                      Recommended
                    </span>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Safety: 9.4/10
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-4 text-center border-2 border-dashed border-gray-300">
                  <div className="text-4xl mb-2">🗺️ 🏢</div>
                  <span className="text-gray-500 font-medium">Interactive map coming soon</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">2.8 km</div>
                    <div className="text-sm text-gray-600">Distance</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">35 min</div>
                    <div className="text-sm text-gray-600">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">1</div>
                    <div className="text-sm text-gray-600">Hazards</div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-primary-dark mb-3">Route Highlights:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Parks and green spaces</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">CCTV monitored areas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Low crime density</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span className="text-gray-700">Well maintained paths</span>
                    </li>
                  </ul>
                </div>

                <button className="w-full bg-accent hover:bg-accent/90 text-primary-dark font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  📍 Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Tips Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="bg-gradient-to-r from-primary-dark to-primary rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-accent text-2xl">🛡️</span>
                  <h3 className="text-2xl font-bold text-white">Safety Tips</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-accent">✓</span>
                    <span>Stay on well-lit paths, especially during evening hours</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-accent">✓</span>
                    <span>Keep your phone charged and share your route with friends</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-accent">✓</span>
                    <span>Trust your instincts and report any suspicious activity</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/90">
                    <span className="text-accent">✓</span>
                    <span>Consider traveling with a buddy for added safety</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl text-accent">🛡️</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Stay Safe, London!</h4>
                <p className="text-white/80">Your safety is our priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Export & Share Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-primary-dark mb-4">Export & Share</h2>
          <p className="text-xl text-gray-600 mb-12">Save your route or share it with friends and family</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <button className="flex-1 bg-primary-dark hover:bg-primary text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              📥 Export Route Summary
            </button>
            <button className="flex-1 bg-accent hover:bg-accent/90 text-primary-dark font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              🔗 Share Route
            </button>
            <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-primary-dark font-semibold py-4 px-8 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
              👥 Find Travel Buddy
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
