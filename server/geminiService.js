import { GoogleGenAI } from '@google/genai';

/**
 * Server-only Gemini service for PetLife AI Health Story.
 * 
 * IMPORTANT RESPONSIBLE AI SECURITY:
 * - Runs strictly server-side.
 * - Performs deterministic JavaScript calculations (weight diff, %, chronological ordering).
 * - Enforces non-diagnostic, cautious language.
 * - Never invents measurements, symptoms, or medical instructions.
 */

export const generatePetSummary = async ({ pet, healthEvents }, explicitApiKey = null) => {
  if (!pet || typeof pet !== 'object') {
    throw new Error('Invalid request: pet data must be provided.');
  }

  // --- 1. DETERMINISTIC JAVASCRIPT CALCULATIONS ---

  // Weight Analysis
  const currWeight = pet.currentWeight !== undefined && pet.currentWeight !== null && pet.currentWeight !== '' ? parseFloat(pet.currentWeight) : null;
  const prevWeight = pet.previousWeight !== undefined && pet.previousWeight !== null && pet.previousWeight !== '' ? parseFloat(pet.previousWeight) : null;

  let weightAnalysisText = 'No weight history comparison recorded.';
  let weightAnalysisObj = null;

  if (currWeight !== null && prevWeight !== null && prevWeight > 0) {
    const absChange = parseFloat((currWeight - prevWeight).toFixed(2));
    const pctChange = parseFloat(((absChange / prevWeight) * 100).toFixed(1));
    const direction = absChange > 0.05 ? 'increased' : (absChange < -0.05 ? 'decreased' : 'no meaningful change');

    weightAnalysisObj = {
      currentWeight: `${currWeight} ${pet.weightUnit || 'kg'}`,
      previousWeight: `${prevWeight} ${pet.weightUnit || 'kg'}`,
      absoluteChange: `${absChange > 0 ? '+' : ''}${absChange} ${pet.weightUnit || 'kg'}`,
      percentageChange: `${pctChange > 0 ? '+' : ''}${pctChange}%`,
      direction
    };

    weightAnalysisText = `Factual Calculated Weight Analysis:
- Current Weight: ${weightAnalysisObj.currentWeight}
- Previous Baseline Weight: ${weightAnalysisObj.previousWeight}
- Exact Weight Difference: ${weightAnalysisObj.absoluteChange} (${weightAnalysisObj.percentageChange})
- Trend Direction: ${weightAnalysisObj.direction}`;
  } else if (currWeight !== null) {
    weightAnalysisText = `Factual Weight: Current weight is ${currWeight} ${pet.weightUnit || 'kg'} (no previous baseline recorded).`;
  }

  // Chronological Event Sorting
  const sortedEvents = (healthEvents && Array.isArray(healthEvents))
    ? [...healthEvents].sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0))
    : [];

  const petName = pet.name || 'My Pet';
  const species = pet.species || 'Pet';
  const breed = pet.breed ? `(${pet.breed})` : '';
  const age = pet.age !== undefined && pet.age !== null ? `${pet.age} years old` : '';

  // --- 2. EMPTY / INSUFFICIENT DATA GUARD ---
  if (sortedEvents.length === 0) {
    return {
      summary: `There are currently no health events recorded in ${petName}'s timeline. Add health updates or vet visits to build a detailed AI Health Story.`,
      whatHappened: [
        `No timeline events have been logged for ${petName} yet.`
      ],
      whatChanged: weightAnalysisObj ? [
        `Recorded current weight: ${weightAnalysisObj.currentWeight}.`
      ] : [
        "No baseline data or timeline changes available yet."
      ],
      patternsToMonitor: [
        "No health patterns identified due to lack of recorded events."
      ],
      suggestedNextSteps: [
        `Log ${petName}'s recent vaccinations, vet visits, or weight updates using the Add Event feature.`,
        "Maintain routine health records to track wellness trends over time."
      ],
      disclaimer: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."
    };
  }

  const apiKey = explicitApiKey || process.env.GEMINI_API_KEY || '';

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Format events timeline for prompt
  const eventsListText = sortedEvents.map((evt, idx) => {
    const detailsStr = evt.details || evt.subtitle || 'No details provided';
    const severityStr = evt.severity ? `[Severity: ${evt.severity}]` : '';
    const categoryStr = evt.category || evt.type || 'General Health';
    return `${idx + 1}. Date: ${evt.date || evt.displayDate || 'Unknown'} | Category: ${categoryStr} | Title: "${evt.title || 'Event'}" ${severityStr} | Details: ${detailsStr}`;
  }).join('\n');

  // --- 3. PROMPT & RESPONSIBLE AI CONSTRAINTS ---
  const prompt = `
You are a responsible, empathetic pet health assistant for PetLife AI.
Your task is to analyze the documented pet health records and pre-calculated facts below, and generate a structured AI Health Story.

CRITICAL RESPONSIBLE AI CONSTRAINTS:
1. RECORDED FACTS ONLY (whatHappened):
   - Every item in 'whatHappened' MUST come strictly from the documented health timeline below.
   - NEVER INVENT hospital names, vet names, doctor names, medication names, diet changes, recovery status, test results, diagnoses, or dates that are not explicitly stated in the input records.

2. CALCULATED FACTS ONLY (whatChanged):
   - 'whatChanged' MUST describe ONLY changes explicitly present in the data (e.g., weight change of ${weightAnalysisObj ? weightAnalysisObj.absoluteChange : 'N/A'}).
   - DO NOT invent unrecorded diet transitions, unrecorded recovery milestones, or unrecorded measurements.

3. STRICT GROUNDED OBSERVATIONS (patternsToMonitor):
   - Frame items in 'patternsToMonitor' as neutral observations based strictly on the recorded events.
   - DO NOT mention unrecorded symptoms or unrecorded metrics (such as appetite, hydration, water intake, or lethargy) UNLESS those specific words exist in the recorded input timeline below.
   - DO NOT invent arbitrary monitoring timelines (e.g., "for 7-14 days").

4. RESPONSIBLE NEXT STEPS (suggestedNextSteps):
   - 'suggestedNextSteps' must be cautious and grounded ONLY in the recorded events (e.g. "Consider contacting a qualified veterinarian if recorded symptoms recur or worsen").
   - DO NOT suggest monitoring unrecorded symptoms (such as appetite, hydration, or lethargy).
   - NEVER diagnose diseases, claim symptoms are caused by specific diseases, prescribe medication, recommend changing dosages, or tell the owner to stop medication.

5. EXACT DISCLAIMER:
   - The 'disclaimer' field MUST be exactly: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."

PATIENT RECORD:
- Name: ${petName}
- Species: ${species} ${breed}
- Age: ${age}
${weightAnalysisText}

CHRONOLOGICAL HEALTH TIMELINE (${sortedEvents.length} records):
${eventsListText}

Generate the JSON response following the schema strictly.
`.trim();

  // --- 4. GEMINI API CALL WITH STRUCTURED RESPONSE SCHEMA ---
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
              summary: { type: 'STRING', description: 'Brief 2-3 sentence overview summarizing recorded health status.' },
              whatHappened: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Key factual events that occurred in chronological order based ONLY on provided records.'
              },
              whatChanged: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Specific health or weight changes detected across the documented timeline.'
              },
              patternsToMonitor: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Neutral observations or wellness trends based on documented symptoms.'
              },
              suggestedNextSteps: {
                type: 'ARRAY',
                items: { type: 'STRING' },
                description: 'Responsible, actionable owner steps (e.g., follow vet advice, monitor symptoms).'
              },
              disclaimer: { type: 'STRING', description: 'Required non-diagnostic medical disclaimer.' }
            },
            required: ['summary', 'whatHappened', 'whatChanged', 'patternsToMonitor', 'suggestedNextSteps', 'disclaimer']
          }
        }
      });
      if (response && response.text) break;
    } catch (err) {
      lastError = err;
    }
  }

  try {
    if (!response || !response.text) {
      throw lastError || new Error('Empty response received from Gemini API.');
    }

    const responseText = response.text ? response.text.trim() : '';

    if (!responseText) {
      throw new Error('Empty response received from Gemini API.');
    }

    let parsed = JSON.parse(responseText);

    // --- 5. SERVER-SIDE VALIDATION & FALLBACK SANITIZATION ---
    const sanitizeList = (arr, defaultItem) => {
      if (!Array.isArray(arr) || arr.length === 0) return [defaultItem];
      return arr.map(item => String(item).trim()).filter(Boolean);
    };

    const finalStory = {
      summary: parsed.summary || `Health story generated from ${petName}'s ${sortedEvents.length} recorded events.`,
      whatHappened: sanitizeList(parsed.whatHappened, `Documented events include ${sortedEvents.length} logged health updates.`),
      whatChanged: sanitizeList(parsed.whatChanged, weightAnalysisObj ? `Weight change of ${weightAnalysisObj.absoluteChange} observed.` : "No major changes logged."),
      patternsToMonitor: sanitizeList(parsed.patternsToMonitor, "Continue monitoring overall wellness and documented symptoms."),
      suggestedNextSteps: sanitizeList(parsed.suggestedNextSteps, "Follow up with your veterinarian if symptoms persist or if you have questions."),
      disclaimer: "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."
    };

    return finalStory;
  } catch (err) {
    const cleanErrorMsg = err.message ? err.message.replace(/key=[^&\s]+/gi, 'key=REDACTED') : 'Gemini API execution error.';
    console.error('[Gemini Server Service Error]:', cleanErrorMsg);
    throw new Error(`Gemini API Error: ${cleanErrorMsg}`);
  }
};
