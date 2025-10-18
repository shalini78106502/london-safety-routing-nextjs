'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-primary-dark/95 backdrop-blur-md text-white sticky top-0 shadow-lg z-40 border-b border-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-primary-dark font-bold">🗺️</span>
          </div>
          <div className="text-white font-bold text-lg">London Safety Routing</div>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          <Link href="/" className="text-text-secondary hover:text-accent transition-colors duration-200">Home</Link>
          <Link href="/suggested-routes" className="text-text-secondary hover:text-accent transition-colors duration-200">Suggested Routes</Link>
          <Link href="/hazard-reporting" className="text-text-secondary hover:text-accent transition-colors duration-200">Hazard Reporting</Link>
          <Link href="/find-buddy" className="text-text-secondary hover:text-accent transition-colors duration-200">Find Buddy</Link>
        </nav>

        <div className="md:hidden">
          <button 
            onClick={() => setOpen(!open)} 
            className="p-2 rounded-lg glass-effect text-accent hover:bg-white/20 transition-colors"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass-effect mx-4 mb-4 rounded-lg">
          <nav className="flex flex-col gap-4 p-4">
            <Link href="/" className="text-text-secondary hover:text-accent transition-colors">Home</Link>
            <Link href="/suggested-routes" className="text-text-secondary hover:text-accent transition-colors">Suggested Routes</Link>
            <Link href="/hazard-reporting" className="text-text-secondary hover:text-accent transition-colors">Hazard Reporting</Link>
            <Link href="/find-buddy" className="text-text-secondary hover:text-accent transition-colors">Find Buddy</Link>
          </nav>
        </div>
      )}
    </header>
  )
}
