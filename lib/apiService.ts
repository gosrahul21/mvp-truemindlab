export interface CreateOrganizationParams {
  businessName: string
  websiteUrl: string
  primaryOffer: string
  location: string
}

export async function createOrganizationAPI(params: CreateOrganizationParams) {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })
  
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create workspace')
  }
  
  return data
}

export async function fetchPlansAPI() {
  const response = await fetch('/api/plans')
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch plans')
  }
  
  return data
}

export async function createSubscriptionAPI(planId: string, orgId: string) {
  const response = await fetch('/api/subscriptions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, orgId }),
  })
  
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Failed to initialize subscription')
  }
  
  return data
}
