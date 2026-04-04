'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { slideDown } from '@/lib/framer-utils'
import { MagneticButton } from '@/lib/MagneticButton'
export default function NavBar() {
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

const [scrolled, setScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={slideDown}
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300
        ${scrolled 
          ? 'bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800' 
          : 'bg-transparent border-transparent'
        }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo - Premium treatment */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 text-white rounded-2xl shadow-2xl shadow-blue-500/40 group-hover:shadow-blue-500/60 group-active:scale-95 transition-all duration-300">
                {/* Subtle inner glow */}
                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="font-bold text-2xl tracking-[-1px] relative z-10">CF</span>
              </div>
              <span className="text-2xl font-semibold tracking-[-0.5px] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                CloseFlow
              </span>
              <span className="text-[22px] font-semibold text-blue-600 dark:text-blue-400 tracking-[-0.5px]">AI</span>
            </Link>
          </div>

          {/* Desktop Navigation - Refined spacing & hover */}
          <div className="hidden md:flex md:items-center md:space-x-10 text-sm font-medium">
            <a
              href="\#features"
              className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all"
            >
              Features
            </a>
            <a
              href="\#how-it-works"
              className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all"
            >
              How it Works
            </a>
            <a
              href="\#pricing"
              className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all"
            >
              Pricing
            </a>
            {/* <a
              href="\#blog"
              className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:bg-blue-600 after:transition-all"
            >
              Blog
            </a> */}
          </div>

          {/* CTA Buttons - Premium gradient & elevation */}
          <div className="hidden md:flex md:items-center md:space-x-3">
            <Link
              href="watch-demo"
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-2"
            >
              <span>Watch Demo</span>
              <span className="text-xs px-2 py-px bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500">2:14</span>
            </Link>

            {/* <MagneticButton
              onClick={() => router.push('/login')}
              className="px-7 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl transition-all duration-200 shadow-sm hover:shadow"
            >
              Log in
            </MagneticButton> */}

            <MagneticButton
              onClick={() => router.push('/login')}
              className="px-7 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-px active:translate-y-0 transition-all duration-200"
            >
              Get Started
            </MagneticButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu - Premium full-bleed style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              <a href="#features" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-3xl transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-3xl transition-colors">
                How it Works
              </a>
              <a href="#pricing" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-3xl transition-colors">
                Pricing
              </a>
              <a href="#blog" className="block text-lg font-semibold text-gray-700 dark:text-gray-200 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-3xl transition-colors">
                Blog
              </a>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <a
                  href="#demo"
                  className="block w-full text-center py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-3xl transition-colors"
                >
                  Watch Demo
                </a>
                <button
                  onClick={() => {
                    router.push('/login')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-4 text-lg font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    router.push('/signup')
                    setMobileMenuOpen(false)
                  }}
                  className="w-full py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl shadow-xl"
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}