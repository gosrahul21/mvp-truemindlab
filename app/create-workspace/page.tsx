'use client'

import { motion } from 'framer-motion'
import { fadeInUp } from '@/lib/framer-utils'
import Layout from '../components/Layout'

import { useCreateWorkspace } from '@/hooks/useCreateWorkspace'

export default function CreateWorkspacePage() {
  const {
    businessName, setBusinessName,
    websiteUrl, setWebsiteUrl,
    primaryOffer, setPrimaryOffer,
    location, setLocation,
    loading, error,
    handleCreateWorkspace,
  } = useCreateWorkspace()

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="min-h-screen flex items-center justify-center bg-[#050810] px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">Create your workspace</h2>
            <p className="mt-2 text-sm text-gray-400">
              Welcome to Follow AI! Let's get started by setting up your organization.
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleCreateWorkspace}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-md bg-red-900/30 border border-red-500/50 text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-300 mb-1">
                  Workspace Name *
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  autoFocus
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                  placeholder="e.g. Acme Corp"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  Website URL
                </label>
                <input
                  id="websiteUrl"
                  name="websiteUrl"
                  type="url"
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                  placeholder="e.g. https://acme.com"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="primaryOffer" className="block text-sm font-medium text-gray-300 mb-1">
                  Primary Offer
                </label>
                <input
                  id="primaryOffer"
                  name="primaryOffer"
                  type="text"
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                  placeholder="e.g. AI Consulting Services"
                  value={primaryOffer}
                  onChange={(e) => setPrimaryOffer(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-700 placeholder-gray-500 text-white bg-gray-900/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:z-10 sm:text-sm transition-all"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !businessName.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  'Continue'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </Layout>
  )
}
