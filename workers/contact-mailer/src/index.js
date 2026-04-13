import { EmailMessage } from 'cloudflare:email'

function json(data, init) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
}

function sanitizeHeader(value) {
  return String(value).replace(/[\r\n]+/g, ' ').trim()
}

function normalizeText(value) {
  return String(value).replace(/\r?\n/g, '\r\n')
}

function senderDomain(sender) {
  const atIndex = sender.lastIndexOf('@')
  return atIndex >= 0 ? sender.slice(atIndex + 1) : 'localhost'
}

function buildMessageId(sender) {
  return `<${crypto.randomUUID()}@${senderDomain(sender)}>`
}

function buildRawEmail(data, sender, recipient) {
  const subject = sanitizeHeader(`New Inquiry from ${data.name} - ${data.company}`)
  const replyTo = sanitizeHeader(data.email)
  const date = new Date().toUTCString()
  const messageId = buildMessageId(sender)
  const textBody = [
    'New contact form submission',
    '',
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Company: ${data.company}`,
    `Gas Type: ${data.gasType}`,
    `Requirement Type: ${data.requirementType}`,
    '',
    'Message:',
    data.message,
  ]
    .map(normalizeText)
    .join('\r\n')

  return [
    `From: HO Oxygen Website <${sender}>`,
    `To: ${recipient}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${subject}`,
    `Date: ${date}`,
    `Message-ID: ${messageId}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    textBody,
    '',
  ].join('\r\n')
}

export default {
  async fetch(request, env) {
    if (request.method !== 'POST') {
      return json({ success: false, error: 'Method not allowed' }, { status: 405 })
    }

    const contentType = request.headers.get('content-type') ?? ''
    if (!contentType.includes('application/json')) {
      return json({ success: false, error: 'Content-Type must be application/json' }, { status: 415 })
    }

    let data
    try {
      data = await request.json()
    } catch {
      return json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const requiredFields = ['name', 'email', 'phone', 'company', 'gasType', 'requirementType', 'message']
    for (const field of requiredFields) {
      if (typeof data[field] !== 'string' || !data[field].trim()) {
        return json({ success: false, error: `Field "${field}" is required` }, { status: 400 })
      }
    }

    const sender = env.CONTACT_SENDER_EMAIL
    const recipient = env.CONTACT_RECIPIENT_EMAIL

    if (!sender || !recipient) {
      return json(
        { success: false, error: 'Missing CONTACT_SENDER_EMAIL or CONTACT_RECIPIENT_EMAIL configuration' },
        { status: 500 },
      )
    }

    const rawMessage = buildRawEmail(
      {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        company: data.company.trim(),
        gasType: data.gasType.trim(),
        requirementType: data.requirementType.trim(),
        message: data.message.trim(),
      },
      sender,
      recipient,
    )

    try {
      const message = new EmailMessage(sender, recipient, rawMessage)
      await env.CONTACT_EMAIL.send(message)
      return json({ success: true })
    } catch (error) {
      console.error('Email send failed', error)
      return json({ success: false, error: 'Cloudflare email send failed' }, { status: 502 })
    }
  },
}
