import { safeNextPath } from '@/lib/supabase/auth-redirect'
import { createClient } from '@/lib/supabase/client'

function callbackOrigin() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? ''
}

export function oauthCallbackUrl(nextPath: string) {
  const next = encodeURIComponent(safeNextPath(nextPath))
  return `${callbackOrigin()}/auth/callback?next=${next}`
}

export async function signInWithGoogle(nextPath = '/dashboard') {
  const supabase = createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: oauthCallbackUrl(nextPath),
    },
  })
  if (error) throw error
  if (data.url) {
    window.location.assign(data.url)
  }
}
