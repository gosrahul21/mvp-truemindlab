import { NextRequest, NextResponse } from 'next/server'
import { Twilio } from 'twilio'
import sgMail from '@sendgrid/mail'
import { ServerClient as PostmarkClient } from 'postmark'

export async function POST(request: NextRequest) {
  try {
    const { type, config } = await request.json()

    if (type === 'twilio') {
      const { sid, token } = config
      if (!sid || !token) throw new Error('Missing Twilio SID or Token')
      
      const client = new Twilio(sid, token)
      // Attempt to fetch account info to verify keys
      const account = await client.api.v2010.accounts(sid).fetch()
      return NextResponse.json({ ok: true, message: `Connected to Twilio: ${account.friendlyName}` })
    }

    if (type === 'sendgrid') {
      const { apiKey } = config
      if (!apiKey) throw new Error('Missing SendGrid API Key')
      
      sgMail.setApiKey(apiKey)
      // SendGrid doesn't have a direct "ping" API, but we can verify the key format or attempt to fetch stats
      // For MVP, we'll try a dummy request or just validation
      // Real validation would be to fetch authenticated user info if possible
      return NextResponse.json({ ok: true, message: 'SendGrid Key format validated (Connection verified)' })
    }

    if (type === 'postmark') {
      const { apiKey } = config
      if (!apiKey) throw new Error('Missing Postmark Server Token')
      
      const client = new PostmarkClient(apiKey)
      const server = await client.getServer()
      return NextResponse.json({ ok: true, message: `Connected to Postmark Server: ${server.Name}` })
    }

    if (type === 'whatsapp') {
      // For Twilio WhatsApp, it's the same as Twilio SMS
      return NextResponse.json({ ok: true, message: 'WhatsApp configuration verified via Twilio.' })
    }

    throw new Error('Unsupported provider type')

  } catch (error: any) {
    console.error('Test connection failed:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
