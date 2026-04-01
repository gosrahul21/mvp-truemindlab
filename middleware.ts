import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/watch-demo',
  '/auth/callback',
]

const protectedRouteRoles: Record<string, string[]> = {
  // '/settings': ['org_owner', 'org_admin'],
  // '/billing': ['org_owner', 'org_admin'],
  '/team': ['org_owner', 'org_admin'],
}

function redirectPreservingCookies(res: NextResponse, url: URL) {
  const redirect = NextResponse.redirect(url)
  res.cookies.getAll().forEach((c) => {
    redirect.cookies.set(c.name, c.value)
  })
  return redirect
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
          for (const [key, value] of Object.entries(headers)) {
            if (value != null) res.headers.set(key, String(value))
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = req.nextUrl

  const isPublicRoute = publicRoutes.some((route) =>
    route === '/'
      ? pathname === '/'
      : pathname === route || pathname.startsWith(route + '/')
  )

  if (isPublicRoute) {
    if (user && pathname === '/') {
      return redirectPreservingCookies(res, new URL('/dashboard', req.url))
    }
    return res
  }

  if (!user) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return redirectPreservingCookies(res, redirectUrl)
  }

  let membershipData: any = null;

  const isProfileRoute = pathname.startsWith('/profile');

  if (!isProfileRoute) {
    // 1. Fetch organization membership
    const { data: membership } = await supabase
      .from('organization_members')
      .select('organization_id, role')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!membership) {
      if (pathname !== '/create-workspace') {
        return redirectPreservingCookies(res, new URL('/create-workspace', req.url))
      }
    } else {
      // 2. Fetch subscription status
      const { data: subs } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('organization_id', membership.organization_id)
        .limit(1)
      
      const hasSubscription = subs && subs.length > 0;

      if (!hasSubscription) {
        if (pathname !== '/choose-plan') {
          return redirectPreservingCookies(res, new URL(`/choose-plan?orgId=${membership.organization_id}`, req.url))
        }
      } else {
        // 3. User is fully onboarded. Prevent them from revisiting the funnel.
        if (['/create-workspace', '/choose-plan', '/onboarding'].includes(pathname)) {
          return redirectPreservingCookies(res, new URL('/dashboard', req.url))
        }
      }
    }
    
    membershipData = membership;
  }

  const protectedPath = Object.keys(protectedRouteRoles).find((route) =>
    pathname.startsWith(route)
  )

  if (protectedPath) {
    const allowedRoles = protectedRouteRoles[protectedPath]

    // If membershipData wasn't fetched (e.g., they went to an exempt route that is also protected, though unlikely), fetch it
    if (!membershipData) {
      const { data: membership } = await supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()
      membershipData = membership
    }

    if (!membershipData || !allowedRoles.includes(membershipData.role)) {
      return redirectPreservingCookies(res, new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
