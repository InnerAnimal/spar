import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
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

