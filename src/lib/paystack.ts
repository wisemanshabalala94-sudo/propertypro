import crypto from "crypto";
import { getEnv } from "@/lib/env";

const paystackBaseUrl = "https://api.paystack.co";

interface InitializePayload {
  email: string;
  amount: number;
  reference: string;
  callback_url?: string;
  currency?: string;
  metadata?: Record<string, unknown>;
  channels?: string[];
}

interface TransferRecipientPayload {
  name: string;
  account_number: string;
  bank_code: string;
  currency?: string;
}

interface TransferPayload {
  amount: number;
  recipient: string;
  reason: string;
}

export async function initializePaystackTransaction(payload: InitializePayload) {
  const env = getEnv();
  const response = await fetch(`${paystackBaseUrl}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: payload.email,
      amount: String(payload.amount),
      reference: payload.reference,
      callback_url: payload.callback_url ?? env.PAYSTACK_CALLBACK_URL,
      currency: payload.currency ?? env.DEFAULT_CURRENCY,
      metadata: payload.metadata,
      channels: payload.channels ?? ["card", "bank_transfer", "eft"]
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack initialize failed: ${errorText}`);
  }

  return response.json();
}

export async function verifyPaystackTransaction(reference: string) {
  const env = getEnv();
  const response = await fetch(`${paystackBaseUrl}/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack verify failed: ${errorText}`);
  }

  return response.json();
}

export async function createPaystackTransferRecipient(payload: TransferRecipientPayload) {
  const env = getEnv();
  const response = await fetch(`${paystackBaseUrl}/transferrecipient`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "nuban",
      name: payload.name,
      account_number: payload.account_number,
      bank_code: payload.bank_code,
      currency: payload.currency ?? env.DEFAULT_CURRENCY
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack transfer recipient failed: ${errorText}`);
  }

  return response.json();
}

export async function initiatePaystackTransfer(payload: TransferPayload) {
  const env = getEnv();
  const response = await fetch(`${paystackBaseUrl}/transfer`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      source: "balance",
      amount: String(payload.amount),
      recipient: payload.recipient,
      reason: payload.reason
    }),
    cache: "no-store"
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Paystack transfer failed: ${errorText}`);
  }

  return response.json();
}

export function isValidPaystackSignature(rawBody: string, signature: string | null) {
  const env = getEnv();
  if (!signature) {
    return false;
  }

  const digest = crypto.createHmac("sha512", env.PAYSTACK_WEBHOOK_SECRET).update(rawBody).digest("hex");
  return digest === signature;
}
