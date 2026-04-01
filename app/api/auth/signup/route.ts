import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { signUp } from '@/lib/supabase/auth'

function messageFromUnknown(err: unknown) {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: string }).message)
  }
  return 'Failed to create account'
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await signUp(supabase, {
      email,
      password,
      fullName,
    })

    if (result.needsEmailConfirmation) {
      return NextResponse.json({
        needsEmailConfirmation: true,
        user: result.user,
      })
    }

    return NextResponse.json({
      needsEmailConfirmation: false,
      user: result.user,
    })
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: messageFromUnknown(error) }, { status: 400 })
  }
}
