export const environment = {
  production: true,
  appUrl: 'https://propertypro-ashy.vercel.app',
  apiUrl: 'https://propertypro-ashy.vercel.app/api',
  supabaseUrl: '', // SET VIA VERCEL ENV: SUPABASE_URL
  supabaseKey: '', // SET VIA VERCEL ENV: SUPABASE_ANON_KEY
  paystackPublicKey: '', // SET VIA VERCEL ENV: PAYSTACK_PUBLIC_KEY
  paystackSecretKey: '', // SET VIA VERCEL ENV: PAYSTACK_SECRET_KEY
  paystack: {
    publicKey: '', // SET VIA VERCEL ENV: PAYSTACK_PUBLIC_KEY
    secretKey: '', // SET VIA VERCEL ENV: PAYSTACK_SECRET_KEY
    webhookSecret: '', // SET VIA VERCEL ENV: PAYSTACK_WEBHOOK_SECRET
    callbackUrl: 'https://propertypro-ashy.vercel.app/payments/callback'
  },
  paystackCallbackUrl: 'https://propertypro-ashy.vercel.app/payments/callback',
  currency: 'ZAR',
  savingsContributionAmount: 100
};
