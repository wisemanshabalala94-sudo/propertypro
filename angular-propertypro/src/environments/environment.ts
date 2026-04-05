export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200/api',
  supabaseUrl: '', // SET VIA .env.local: NEXT_PUBLIC_SUPABASE_URL
  supabaseKey: '', // SET VIA .env.local: NEXT_PUBLIC_SUPABASE_ANON_KEY
  paystackPublicKey: '', // SET VIA .env.local: PAYSTACK_PUBLIC_KEY
  paystackSecretKey: '', // SET VIA .env.local: PAYSTACK_SECRET_KEY
  paystack: {
    publicKey: '',
    secretKey: '',
    webhookSecret: '',
    callbackUrl: 'http://localhost:4200/payments/callback'
  },
  paystackCallbackUrl: 'http://localhost:4200/payments/callback',
  currency: 'ZAR',
  savingsContributionAmount: 100
};
