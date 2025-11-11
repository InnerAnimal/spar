import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
})

export async function getStripeCustomer(userId: string) {
  // Get or create Stripe customer for user
  const supabase = await import('./supabase/server').then(m => m.createClient())
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single()

  if (profile?.stripe_customer_id) {
    return await stripe.customers.retrieve(profile.stripe_customer_id)
  }

  return null
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<Stripe.Customer> {
  const supabase = await import('./supabase/server').then(m => m.createClient())
  
  // Check if customer already exists
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', userId)
    .single()

  if (profile?.stripe_customer_id) {
    const customer = await stripe.customers.retrieve(profile.stripe_customer_id)
    if (!customer.deleted) {
      return customer as Stripe.Customer
    }
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: email || profile?.email,
    name: name || profile?.full_name,
    metadata: {
      userId,
    },
  })

  // Update profile with Stripe customer ID
  await supabase
    .from('profiles')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId)

  return customer
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const supabase = await import('./supabase/server').then(m => m.createClient())
  
  // Get user profile for email/name
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  const customer = await getOrCreateStripeCustomer(
    userId,
    profile?.email || '',
    profile?.full_name || undefined
  )

  const session = await stripe.checkout.sessions.create({
    customer: customer.id,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
    },
  })

  return session
}

export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<Stripe.BillingPortal.Session> {
  const supabase = await import('./supabase/server').then(m => m.createClient())
  
  // Get user profile for email/name
  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  const customer = await getOrCreateStripeCustomer(
    userId,
    profile?.email || '',
    profile?.full_name || undefined
  )

  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    return_url: returnUrl,
  })

  return session
}

