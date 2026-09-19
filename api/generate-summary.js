import { generatePetSummary } from '../server/geminiService.js';

/**
 * Serverless API handler for generating pet health summary with Gemini AI.
 * Compatible with Vercel Serverless Functions and Node HTTP/Express middleware.
 * 
 * Endpoint: POST /api/generate-summary
 */
export default async function handler(req, res) {
  // Enforce HTTP POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed. Use POST.` });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { pet, healthEvents } = body;

    // Validate payload existence and types
    if (!pet || typeof pet !== 'object' || Array.isArray(pet)) {
      return res.status(400).json({ error: "Invalid payload: 'pet' must be a valid object." });
    }

    if (!healthEvents || !Array.isArray(healthEvents)) {
      return res.status(400).json({ error: "Invalid payload: 'healthEvents' must be an array." });
    }

    // Payload size guard: Max 100 events and 50KB total payload size to prevent abuse
    if (healthEvents.length > 100) {
      return res.status(400).json({ error: "Payload rejected: 'healthEvents' array exceeds maximum limit of 100 items." });
    }

    const jsonStringLength = JSON.stringify(body).length;
    if (jsonStringLength > 50000) {
      return res.status(400).json({ error: "Payload rejected: total request payload exceeds maximum size limit of 50KB." });
    }

    // Call server Gemini service with explicit server-side API key
    const apiKey = req.env?.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
    const result = await generatePetSummary({ pet, healthEvents }, apiKey);

    return res.status(200).json(result);
  } catch (err) {
    console.error('[API /api/generate-summary Error]:', err.message);
    const statusCode = err.message?.includes('GEMINI_API_KEY') ? 500 : 500;
    return res.status(statusCode).json({
      error: err.message || 'Internal Server Error during AI summary generation.'
    });
  }
}
