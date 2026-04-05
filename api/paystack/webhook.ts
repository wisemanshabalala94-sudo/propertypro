import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

interface PaystackWebhookCustomer {
  email?: string;
}

interface PaystackWebhookMetadata extends JsonObject {
  invoiceId?: string;
  invoiceReference?: string;
  tenantId?: string;
  organizationId?: string;
  platformFee?: number;
  netAmount?: number;
}

interface PaystackWebhookData extends JsonObject {
  id?: number;
  reference?: string;
  amount?: number;
  status?: string;
  paid_at?: string | null;
  currency?: string;
  metadata?: PaystackWebhookMetadata | null;
  customer?: PaystackWebhookCustomer;
}

interface PaystackWebhookPayload extends JsonObject {
  event?: string;
  data?: PaystackWebhookData;
}

interface WebhookAcknowledgement {
  received: boolean;
  verified: boolean;
  event: string | null;
  reference: string | null;
}

interface ErrorResponse {
  received: false;
  error: string;
}

function getRawBody(request: VercelRequest): string {
  if (typeof request.body === 'string') {
    return request.body;
  }

  if (Buffer.isBuffer(request.body)) {
    return request.body.toString('utf8');
  }

  return JSON.stringify(request.body ?? {});
}

function createSignature(rawBody: string, secretKey: string): string {
  return createHmac('sha512', secretKey).update(rawBody).digest('hex');
}

function verifySignature(rawBody: string, signature: string, secretKey: string): boolean {
  const expectedSignature = createSignature(rawBody, secretKey);
  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const receivedBuffer = Buffer.from(signature, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

export default function handler(
  request: VercelRequest,
  response: VercelResponse<WebhookAcknowledgement | ErrorResponse>
): void {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).json({
      received: false,
      error: 'Method not allowed.'
    });
    return;
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    response.status(500).json({
      received: false,
      error: 'Missing PAYSTACK_SECRET_KEY.'
    });
    return;
  }

  const signatureHeader = request.headers['x-paystack-signature'];
  const signature = Array.isArray(signatureHeader) ? signatureHeader[0] : signatureHeader;

  if (!signature) {
    response.status(400).json({
      received: false,
      error: 'Missing x-paystack-signature header.'
    });
    return;
  }

  const rawBody = getRawBody(request);

  if (!verifySignature(rawBody, signature, secretKey)) {
    response.status(401).json({
      received: false,
      error: 'Invalid Paystack signature.'
    });
    return;
  }

  const payload = (typeof request.body === 'object' && request.body !== null
    ? request.body
    : JSON.parse(rawBody)) as PaystackWebhookPayload;

  response.status(200).json({
    received: true,
    verified: true,
    event: typeof payload.event === 'string' ? payload.event : null,
    reference: typeof payload.data?.reference === 'string' ? payload.data.reference : null
  });
}