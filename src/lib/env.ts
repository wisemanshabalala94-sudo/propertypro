import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  PAYSTACK_SECRET_KEY: z.string().min(1),
  PAYSTACK_WEBHOOK_SECRET: z.string().min(1).optional(),
  PAYSTACK_CALLBACK_URL: z.string().url(),
  PAYSTACK_PAYMENT_LINK: z.string().url(),
  DEFAULT_CURRENCY: z.string().default("ZAR"),
  SAVINGS_CONTRIBUTION_ZAR: z.coerce.number().positive().default(100)
});

export function getEnv() {
  return envSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY,
    PAYSTACK_WEBHOOK_SECRET: process.env.PAYSTACK_WEBHOOK_SECRET,
    PAYSTACK_CALLBACK_URL: process.env.PAYSTACK_CALLBACK_URL,
    PAYSTACK_PAYMENT_LINK: process.env.PAYSTACK_PAYMENT_LINK,
    DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY,
    SAVINGS_CONTRIBUTION_ZAR: process.env.SAVINGS_CONTRIBUTION_ZAR
  });
}
