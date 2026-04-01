import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Plan } from '@/lib/supabase/types'
import { fetchPlansAPI, createSubscriptionAPI } from '@/lib/apiService'

export function useChoosePlan() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orgId = searchParams.get('orgId')
  
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

  useEffect(() => {
    if (!orgId) {
      router.push('/create-workspace')
      return
    }

    const fetchPlans = async () => {
      try {
        const data = await fetchPlansAPI()
        
        if (data.plans) {
          setPlans(data.plans)
          // Default select the first free plan if exists
          const freePlan = data.plans.find((p: Plan) => p.price_monthly === 0)
          if (freePlan) setSelectedPlanId(freePlan.id)
          else if (data.plans.length > 0) setSelectedPlanId(data.plans[0].id)
        }
      } catch (err) {
        console.error('Failed to load plans', err)
        setError('Failed to load available plans.')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [orgId, router])

  const handleSubscribe = async () => {
    if (!selectedPlanId || !orgId) return

    setSubmitting(true)
    setError('')

    try {
      await createSubscriptionAPI(selectedPlanId, orgId)

      // successfully subscribed, head to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      setSubmitting(false)
    }
  }

  return {
    plans,
    loading,
    submitting,
    error,
    selectedPlanId,
    setSelectedPlanId,
    handleSubscribe,
    orgId
  }
}
