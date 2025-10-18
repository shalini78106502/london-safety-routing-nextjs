export default function HazardReporting() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-slate-700 py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
            Report a <span className="text-accent">Hazard</span>
          </h1>
          <p className="text-xl text-text-secondary mb-12">
            Help keep London safe by reporting hazards and incidents in your area
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">850+</div>
              <div className="text-sm text-text-secondary">Reports Filed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">95%</div>
              <div className="text-sm text-text-secondary">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24h</div>
              <div className="text-sm text-text-secondary">Avg Response</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Submit Hazard Report Form */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-red-500">⚠️</span>
                <h3 className="text-xl font-bold text-primary-dark">Submit Hazard Report</h3>
              </div>
              
              <form className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-gray-500">📋</span>
                    Hazard Type *
                  </label>
                  <select className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900">
                    <option>Select hazard type...</option>
                    <option>Poor Lighting</option>
                    <option>Road damage</option>
                    <option>Construction Hazard</option>
                    <option>Pothole</option>
                    <option>Unsafe crossing</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-gray-500">📍</span>
                    Location *
                  </label>
                  <input 
                    placeholder="Enter street address or landmark..."
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900" 
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    💡 Be as specific as possible (e.g., "Outside Tesco, King's Road, Chelsea")
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-gray-500">⚡</span>
                    Severity Level *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="severity" value="low" className="text-accent" />
                      <span className="text-sm text-gray-700">Low Risk</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="severity" value="medium" className="text-accent" />
                      <span className="text-sm text-gray-700">Medium Risk</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="severity" value="high" className="text-accent" />
                      <span className="text-sm text-gray-700">High Risk</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-gray-500">📝</span>
                    Description *
                  </label>
                  <textarea 
                    placeholder="Describe the hazard in detail. Include when you noticed it, any immediate dangers, and any other relevant information..."
                    className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900" 
                    rows={4}
                  ></textarea>
                  <div className="text-xs text-gray-500 mt-1">Minimum 20 characters</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <span className="text-gray-500">📷</span>
                    Upload Images (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">☁️</div>
                    <div className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</div>
                    <div className="text-xs text-gray-500">PNG, JPG up to 10MB</div>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input type="checkbox" className="mt-1" />
                  <div className="text-sm">
                    <span className="text-blue-600 font-medium">👤 Report anonymously</span>
                    <div className="text-gray-600">Anonymous reports help protect your privacy but may limit our ability to follow up with you.</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-gray-500">📅</span>
                      Date
                    </label>
                    <input type="date" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <span className="text-gray-500">⏰</span>
                      Time (optional)
                    </label>
                    <input type="time" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent text-gray-900" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-accent hover:bg-accent/90 text-primary-dark font-bold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    ✅ Submit Report
                  </button>
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                    💾 Save Draft
                  </button>
                </div>
              </form>
            </div>

            {/* Location Map & Recent Reports */}
            <div className="space-y-8">
              {/* Location Map */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-blue-600">🗺️</span>
                  <h3 className="text-xl font-bold text-primary-dark">Location Map</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 mb-4">
                  <div className="text-4xl mb-2">🗺️ 🏢</div>
                  <span className="text-gray-500 font-medium">Interactive map integration coming soon</span>
                  <p className="text-gray-400 text-sm mt-2">Click on the map to select hazard location</p>
                </div>

                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">💡</span>
                  <div className="text-sm text-blue-800">
                    <strong>Tip:</strong> The more precise your location, the better we can respond to the hazard.
                  </div>
                </div>
              </div>

              {/* Recent Reports */}
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-green-600">📊</span>
                  <h3 className="text-xl font-bold text-primary-dark">Recent Reports in Your Area</h3>
                </div>

                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500">�</span>
                        <div>
                          <div className="font-semibold text-primary-dark">Poor Lighting</div>
                          <div className="text-sm text-gray-600">Victoria Park, East London</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>📅 Reported 2 days ago</span>
                            <span>👁️ Under Review</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">High Risk</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-orange-500">⚠️</span>
                        <div>
                          <div className="font-semibold text-primary-dark">Construction Hazard</div>
                          <div className="text-sm text-gray-600">Regent Street, Westminster</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>📅 Reported 1 days ago</span>
                            <span>🔄 In Progress</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium Risk</span>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <span className="text-orange-500">🕳️</span>
                        <div>
                          <div className="font-semibold text-primary-dark">Pothole</div>
                          <div className="text-sm text-gray-600">Camden High Street, Camden</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span>📅 Reported 3 days ago</span>
                            <span>🔄 In Progress</span>
                          </div>
                        </div>
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">Medium Risk</span>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-4 bg-accent hover:bg-accent/90 text-primary-dark font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                  View All Reports →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Situations */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto bg-red-50 border-2 border-red-200 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-red-800 mb-2">Emergency Situations</h3>
              <p className="text-red-700">
                If you're witnessing an immediate danger or emergency situation, please contact emergency services directly instead of using this form.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl mb-2">📞</div>
                <div className="font-bold text-red-800 mb-1">Emergency</div>
                <div className="text-2xl font-bold text-red-600">999</div>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl mb-2">🚔</div>
                <div className="font-bold text-red-800 mb-1">Police Non-Emergency</div>
                <div className="text-2xl font-bold text-red-600">101</div>
              </div>

              <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className="text-3xl mb-2">🏛️</div>
                <div className="font-bold text-red-800 mb-1">City Council</div>
                <div className="text-xl font-bold text-red-600">0207 XXX XXXX</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
