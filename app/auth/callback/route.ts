import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ensureUserWorkspace } from '@/lib/supabase/auth'
import { safeNextPath } from '@/lib/supabase/auth-redirect'
import type { TypedSupabaseClient } from '@/lib/supabase/auth'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = safeNextPath(url.searchParams.get('next'))

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url))
  }

  const redirectUrl = new URL(next, url.origin)
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
          for (const [key, value] of Object.entries(headers)) {
            if (value != null) response.headers.set(key, String(value))
          }
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('OAuth callback:', error.message)
    return NextResponse.redirect(new URL('/login?error=oauth', request.url))
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    try {
      await ensureUserWorkspace(supabase as TypedSupabaseClient, user)
    } catch (e) {
      console.error('ensureUserWorkspace:', e)
      return NextResponse.redirect(new URL('/login?error=bootstrap', request.url))
    }
  }

  return response
}
