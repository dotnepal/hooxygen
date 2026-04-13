/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Accepts a JSON contact form submission, validates required fields,
 * then forwards the normalized payload to the internal contact mailer Worker
 * over a Service Binding.
 */

interface ContactFormData {
  name: string
  email: string
  phone: string
  company: string
  gasType?: string
  requirementType?: string
  message?: string
}

export interface Env {
  CONTACT_MAILER: Fetcher
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  // Only accept JSON
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return Response.json({ success: false, error: 'Content-Type must be application/json' }, { status: 415 })
  }

  let data: ContactFormData
  try {
    data = (await request.json()) as ContactFormData
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  // Server-side validation of required fields
  const required: (keyof ContactFormData)[] = ['name', 'email', 'phone', 'company']
  for (const field of required) {
    const value = data[field]
    if (!value || typeof value !== 'string' || !value.trim()) {
      return Response.json(
        { success: false, error: `Field "${field}" is required` },
        { status: 400 },
      )
    }
  }

  // Basic phone number check (digits, spaces, dashes, parentheses)
  // check that phone number contains 10 digits
  // Check phone number format: +977-{10 digits} or 01-{9 digits}
  // const phonePattern = /^(\+977[-\s]?)?(01[-\s]?)?\d{9}$/
  // if (!phonePattern.test(data.phone)) {
  //   return Response.json({ success: false, error: 'Invalid phone number' }, { status: 400 })
  // }

  // Basic email format check
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(data.email)) {
    return Response.json({ success: false, error: 'Invalid email address' }, { status: 400 })
  }

  const payload = {
    email: data.email.trim(),
    name: data.name.trim(),
    phone: data.phone.trim(),
    company: data.company.trim(),
    gasType: data.gasType?.trim() || 'Not specified',
    requirementType: data.requirementType?.trim() || 'Not specified',
    message: data.message?.trim() ?? '(no message)',
  }

  // After payload construction, before calling mailer
  if (!env.CONTACT_MAILER) {
    console.error('CONTACT_MAILER service binding is not configured')
    return Response.json(
      { success: false, error: 'Service not configured. Please call us directly.' },
      { status: 503 },
    )
  }

  const mailerResponse = await env.CONTACT_MAILER.fetch('https://contact-mailer.internal/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!mailerResponse.ok) {
    const mailerBody = await mailerResponse.text()
    console.error('Contact mailer failed', {
      status: mailerResponse.status,
      body: mailerBody,
    })
    return Response.json(
      { success: false, error: 'Email delivery failed. Please try again.' },
      { status: 500 },
    )
  }

  return Response.json({ success: true })
}
