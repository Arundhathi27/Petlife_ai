import { GoogleGenAI } from '@google/genai';

/**
 * Server-only Gemini Q&A service for Ask PetLife AI.
 * 
 * IMPORTANT RESPONSIBLE AI SECURITY:
 * - Runs strictly server-side.
 * - Grounded ONLY in the currently authenticated pet profile and healthEvents.
 * - Never invents medications, diagnoses, vets, hospitals, or unrecorded facts.
 * - Explicitly handles missing records using pet.name dynamically.
 */
export const askPetAi = async ({ pet, healthEvents, question }, explicitApiKey = null) => {
  if (!pet || typeof pet !== 'object') {
    throw new Error('Invalid request: pet data must be provided.');
  }

  if (!question || typeof question !== 'string' || question.trim() === '') {
    throw new Error('Invalid request: question must be a non-empty string.');
  }

  const apiKey = explicitApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  const petName = pet.name || 'My Pet';
  const species = pet.species || 'Pet';
  const breed = pet.breed ? `(${pet.breed})` : '';
  const age = pet.age !== undefined && pet.age !== null ? `${pet.age} years old` : 'Unknown age';
  
  const currWeight = pet.currentWeight !== undefined && pet.currentWeight !== null && pet.currentWeight !== '' ? `${pet.currentWeight} ${pet.weightUnit || 'kg'}` : 'Not recorded';
  const prevWeight = pet.previousWeight !== undefined && pet.previousWeight !== null && pet.previousWeight !== '' ? `${pet.previousWeight} ${pet.weightUnit || 'kg'}` : 'Not recorded';

  // Chronological Event Sorting
  const sortedEvents = (healthEvents && Array.isArray(healthEvents))
    ? [...healthEvents].sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0))
    : [];

  const eventsListText = sortedEvents.length > 0
    ? sortedEvents.map((evt, idx) => {
        const detailsStr = evt.details || evt.subtitle || 'No details provided';
        const severityStr = evt.severity ? `[Severity: ${evt.severity}]` : '';
        const categoryStr = evt.category || evt.type || 'General Health';
        const locStr = evt.location ? `| Location: ${evt.location}` : '';
        const provStr = evt.provider ? `| Provider: ${evt.provider}` : '';
        return `${idx + 1}. Date: ${evt.date || evt.displayDate || 'Unknown'} | Category: ${categoryStr} | Title: "${evt.title || 'Event'}" ${severityStr} ${locStr} ${provStr} | Details: ${detailsStr}`;
      }).join('\n')
    : 'No health events are currently recorded in the timeline.';

  const prompt = `
You are a responsible, empathetic assistant for PetLife AI.
Your goal is to answer the user's question about their pet based ONLY on the documented patient record and timeline events provided below.

CRITICAL RESPONSIBLE AI & GROUNDING RULES:
1. STRICT DATA GROUNDING:
   - Base your answer ONLY on the patient record and health timeline below.
   - NEVER INVENT medications, diagnoses, doctor/vet names, hospital names, symptoms, recovery status, or events that are not explicitly present in the data below.

2. MISSING DATA RESPONSE:
   - If the requested information (e.g., medication, veterinarian, specific test result, or symptom) is NOT present in the recorded health data below, explicitly state:
     "I don't have that information in ${petName}'s recorded health data."
   - Always refer to the pet by name ("${petName}").

3. NO DIAGNOSIS OR PRESCRIPTION:
   - If the question asks for a medical diagnosis or treatment plan, explain that the available records do not establish a diagnosis and recommend consulting a qualified veterinarian.
   - NEVER prescribe medication, recommend dosage changes, or attempt to diagnose diseases.

4. WEIGHT & FACTUAL ANSWERS:
   - If asked about weight, use recorded values: Current Weight = ${currWeight}, Previous Baseline Weight = ${prevWeight}.
   - Keep answers clear, friendly, and concise.

5. EXACT REQUIRED DISCLAIMER:
   - The 'disclaimer' field MUST be exactly: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."

PATIENT RECORD:
- Name: ${petName}
- Species: ${species} ${breed}
- Age: ${age}
- Current Weight: ${currWeight}
- Previous Baseline Weight: ${prevWeight}

DOCUMENTED HEALTH TIMELINE (${sortedEvents.length} events logged):
${eventsListText}

USER QUESTION:
"${question.trim()}"

Generate a JSON object matching the schema.
`.trim();

  const ai = new GoogleGenAI({ apiKey });
  const candidateModels = ['gemini-3.6-flash', 'gemini-2.5-flash-lite', 'gemini-3.5-flash'];

  let response = null;
  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              answer: { type: 'STRING', description: 'Grounded, conversational answer based ONLY on recorded pet data.' },
              disclaimer: { type: 'STRING', description: 'Required non-diagnostic disclaimer.' }
            },
            required: ['answer', 'disclaimer']
          }
        }
      });
      if (response && response.text) break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!response || !response.text) {
    const cleanErrorMsg = lastError?.message ? lastError.message.replace(/key=[^&\s]+/gi, 'key=REDACTED') : 'Gemini Q&A service error.';
    console.error('[Ask AI Server Error]:', cleanErrorMsg);
    throw new Error(`Gemini Q&A Error: ${cleanErrorMsg}`);
  }

  try {
    const parsed = JSON.parse(response.text.trim());
    return {
      answer: parsed.answer || `I couldn't find specific details regarding that question in ${petName}'s recorded health data.`,
      disclaimer: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."
    };
  } catch {
    return {
      answer: response.text.trim(),
      disclaimer: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."
    };
  }
};
