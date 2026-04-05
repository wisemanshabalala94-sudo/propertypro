import { Handler } from '@vercel/node';
import crypto from 'crypto';

export const config = { api: { bodyParser: false } };

const handler: Handler = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const signature = req.headers['x-paystack-signature'] as string;
  if (!signature) return res.status(401).json({ error: 'Missing signature' });

  const rawBody = await new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });

  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY ?? '').update(rawBody).digest('hex');
  if (hash !== signature) return res.status(401).json({ error: 'Invalid signature' });

  const event = JSON.parse(rawBody);

  if (event.event === 'charge.success') {
    const { reference, amount, metadata } = event.data;
    const invoiceId = metadata?.invoiceId;
    if (invoiceId) {
      try {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_KEY;
        if (url && key) {
          await fetch(`${url}/rest/v1/invoices?id=eq.${invoiceId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
            body: JSON.stringify({ status: 'paid', amount_paid: amount / 100, paid_at: new Date().toISOString(), payment_method: 'paystack', payment_reference_code: reference })
          });
          await fetch(`${url}/rest/v1/payments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', apikey: key, Authorization: `Bearer ${key}`, Prefer: 'return=representation' },
            body: JSON.stringify({ organization_id: metadata?.organizationId, invoice_id: invoiceId, tenant_id: metadata?.tenantId, amount: amount / 100, payment_method: 'paystack_card', paystack_reference: reference, status: 'completed', processed_at: new Date().toISOString() })
          });
        }
      } catch (err) { console.error('Webhook error:', err); }
    }
  }

  return res.status(200).json({ received: true });
};

export default handler;
