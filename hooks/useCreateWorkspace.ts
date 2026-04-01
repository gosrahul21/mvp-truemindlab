import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createOrganizationAPI } from '@/lib/apiService'

export function useCreateWorkspace() {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [primaryOffer, setPrimaryOffer] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!businessName.trim()) return

    setLoading(true)
    setError('')

    try {
      const data = await createOrganizationAPI({
        businessName: businessName.trim(),
        websiteUrl: websiteUrl.trim(),
        primaryOffer: primaryOffer.trim(),
        location: location.trim()
      })

      // If they successfully created the workspace, route them to the plan selection
      router.push(`/choose-plan?orgId=${data.organization.id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return {
    businessName, setBusinessName,
    websiteUrl, setWebsiteUrl,
    primaryOffer, setPrimaryOffer,
    location, setLocation,
    loading, error,
    handleCreateWorkspace,
  }
}
