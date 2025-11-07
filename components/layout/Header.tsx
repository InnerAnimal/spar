'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b transition-shadow ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-[70px]">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 text-gray-900 font-semibold text-lg hover:opacity-80 transition-opacity"
          >
            <div className="w-9 h-9 relative">
              <Image
                src="https://static.wixstatic.com/media/33e096_671c6a950ec34c81b4e787ad92066c26~mv2.png"
                alt="Southern Pets Animal Rescue Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="hidden sm:inline">Southern Pets Animal Rescue</span>
            <span className="sm:hidden">Southern Pets</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-4">
            <li>
              <Link
                href="/"
                className="px-4 py-2.5 rounded-md font-medium text-[15px] hover:bg-gray-50 transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/adopt"
                className="px-4 py-2.5 rounded-md font-medium text-[15px] hover:bg-gray-50 transition-colors"
              >
                Adopt
              </Link>
            </li>
            <li>
              <Link
                href="/services"
                className="px-4 py-2.5 rounded-md font-medium text-[15px] hover:bg-gray-50 transition-colors"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                href="/forms"
                className="px-4 py-2.5 rounded-md font-medium text-[15px] hover:bg-gray-50 transition-colors"
              >
                Forms
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <Link
              href="/"
              className="block py-3 border-b border-gray-100 font-medium hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/adopt"
              className="block py-3 border-b border-gray-100 font-medium hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Adopt
            </Link>
            <Link
              href="/services"
              className="block py-3 border-b border-gray-100 font-medium hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/forms"
              className="block py-3 font-medium hover:text-green-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Forms
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
