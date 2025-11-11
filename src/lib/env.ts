/**
 * Environment variable validation utility
 * Ensures all required environment variables are set before runtime
 */

const requiredEnvVars = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  
  // App
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
} as const

const optionalEnvVars = {
  // Cloudflare R2
  CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID || process.env.CLOUDFLARE_ACCOUNT_ID,
  CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  CLOUDFLARE_R2_PUBLIC_URL: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  
  // Stripe Webhook
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  
  // AI APIs
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  
  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
} as const

export function validateEnvironment() {
  const missing: string[] = []
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please set these in your Vercel project settings or .env.local file.'
    )
  }
  
  return true
}

export function getEnvVar(key: keyof typeof requiredEnvVars | keyof typeof optionalEnvVars): string {
  const value = requiredEnvVars[key as keyof typeof requiredEnvVars] || 
                optionalEnvVars[key as keyof typeof optionalEnvVars]
  
  if (!value && key in requiredEnvVars) {
    throw new Error(`Required environment variable ${key} is not set`)
  }
  
  return value || ''
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 
         (isProduction() ? 'https://inneranimalmedia.com' : 'http://localhost:3000')
}

