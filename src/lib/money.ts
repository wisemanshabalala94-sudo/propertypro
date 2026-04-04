import { getEnv } from "@/lib/env";

export function toSubunit(amount: number) {
  return Math.round(amount * 100);
}

export function calculateSavingsContribution(amountPaid: number) {
  const env = getEnv();
  return amountPaid >= env.SAVINGS_CONTRIBUTION_ZAR ? env.SAVINGS_CONTRIBUTION_ZAR : 0;
}
