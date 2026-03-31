import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/route-handler'
import { signIn } from '@/lib/supabase/auth'

function messageFromUnknown(err: unknown) {
  if (err && typeof err === 'object' && 'message' in err) {
    return String((err as { message: string }).message)
  }
  return 'Invalid email or password'
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseRouteHandlerClient()
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 })
    }

    const { session } = await signIn(supabase, { email, password })

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: messageFromUnknown(error) }, { status: 401 })
  }
}
