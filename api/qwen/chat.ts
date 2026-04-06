import { Handler } from '@vercel/node';

interface QwenChatMessage {
  role: string;
  content: string;
}

interface QwenChatRequest {
  messages: QwenChatMessage[];
}

const handler: Handler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const messages = (body as QwenChatRequest)?.messages;

  if (!Array.isArray(messages) || messages.some(msg => !msg.role || !msg.content)) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  const apiKey = process.env.QWEN_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Qwen API key' });
  }

  try {
    const response = await fetch('https://api.qwen.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'qwen-max',
        messages,
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data?.error ?? 'Qwen API request failed', details: data });
    }

    return res.status(200).json({ content: data?.choices?.[0]?.message?.content ?? 'No response from Qwen.' });
  } catch (error) {
    console.error('Qwen chat endpoint error:', error);
    return res.status(500).json({ error: 'Qwen chat failed' });
  }
};

export default handler;
