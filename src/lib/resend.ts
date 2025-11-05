import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = 'InnerAnimalMedia <noreply@inneranimalmedia.com>',
}: {
  to: string | string[]
  subject: string
  html: string
  from?: string
}) {
  return await resend.emails.send({
    from,
    to,
    subject,
    html,
  })
}

