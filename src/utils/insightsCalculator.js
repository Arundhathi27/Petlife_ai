/**
 * Pure deterministic calculations for PetLife AI Health Insights.
 * 
 * IMPORTANT:
 * - 100% deterministic (no Gemini API required).
 * - Grounded ONLY in provided pet object and healthEvents array.
 * - Zero fake/invented medical data or demo names.
 * - Enforces neutral, non-diagnostic wording (no "healthy", "unhealthy", "normal", "abnormal", "warning", "danger").
 */

export const calculateHealthInsights = (pet, events = []) => {
  const petName = pet?.name || 'your pet';
  
  // 1. Weight Analysis
  const currWeight = pet?.currentWeight !== undefined && pet?.currentWeight !== null && pet?.currentWeight !== '' && !isNaN(parseFloat(pet?.currentWeight))
    ? parseFloat(pet.currentWeight)
    : null;
    
  const prevWeight = pet?.previousWeight !== undefined && pet?.previousWeight !== null && pet?.previousWeight !== '' && !isNaN(parseFloat(pet?.previousWeight))
    ? parseFloat(pet.previousWeight)
    : null;

  let weightInsight = null;
  if (currWeight !== null && prevWeight !== null && prevWeight > 0) {
    const diff = parseFloat((currWeight - prevWeight).toFixed(2));
    const pct = parseFloat(((diff / prevWeight) * 100).toFixed(1));
    const unit = pet?.weightUnit || 'kg';
    
    weightInsight = {
      id: 'insight_weight',
      title: 'Recorded Weight Changed',
      description: `Recorded weight changed from ${prevWeight} ${unit} to ${currWeight} ${unit} (${diff > 0 ? '+' : ''}${diff} ${unit} / ${pct > 0 ? '+' : ''}${pct}%).`,
      previousWeight: prevWeight,
      currentWeight: currWeight,
      difference: diff,
      percentage: pct,
      unit
    };
  } else if (currWeight !== null) {
    weightInsight = {
      id: 'insight_weight_single',
      title: 'Recorded Current Weight',
      description: `Current weight recorded at ${currWeight} ${pet?.weightUnit || 'kg'}. (No previous baseline recorded)`,
      currentWeight: currWeight,
      unit: pet?.weightUnit || 'kg'
    };
  }

  // 2. Chronological Events & Category Breakdown
  const sortedEvents = Array.isArray(events)
    ? [...events].sort((a, b) => new Date(a.date || a.createdAt || 0) - new Date(b.date || b.createdAt || 0))
    : [];

  const totalEvents = sortedEvents.length;

  // Extract unique categories present in events
  const categoryMap = {
    symptom: 'symptoms',
    vaccination: 'vaccinations',
    vet_visit: 'vet visits',
    medication: 'medications',
    weight: 'weight updates',
    lab_result: 'lab results',
    general: 'general notes'
  };

  const rawCategories = [...new Set(sortedEvents.map(e => e.type || e.category).filter(Boolean))];
  const formattedCategories = rawCategories.map(c => categoryMap[c.toLowerCase()] || c.toLowerCase());

  let categorySummaryText = '';
  if (formattedCategories.length === 1) {
    categorySummaryText = `Recent records include ${formattedCategories[0]}.`;
  } else if (formattedCategories.length === 2) {
    categorySummaryText = `Recent records include ${formattedCategories[0]} and ${formattedCategories[1]}.`;
  } else if (formattedCategories.length > 2) {
    const last = formattedCategories.pop();
    categorySummaryText = `Recent records include ${formattedCategories.join(', ')}, and ${last}.`;
  }

  // 3. Repeated Event Detection
  // Group events by normalized title or category
  const counts = {};
  const sampleEventMap = {};

  sortedEvents.forEach(evt => {
    const titleKey = (evt.title || evt.category || evt.type || 'Event').trim().toLowerCase();
    counts[titleKey] = (counts[titleKey] || 0) + 1;
    if (!sampleEventMap[titleKey]) {
      sampleEventMap[titleKey] = evt.title || evt.category || 'Health Event';
    }
  });

  const repeatedInsights = [];
  const repeatedPatterns = [];

  Object.entries(counts).forEach(([key, count]) => {
    if (count > 1) {
      const displayTitle = sampleEventMap[key];
      repeatedInsights.push({
        id: `repeated_${key}`,
        title: 'Repeated event recorded',
        description: `"${displayTitle}" was recorded ${count} times in the recent timeline.`,
        count,
        eventTitle: displayTitle
      });

      repeatedPatterns.push(
        `Repeated ${displayTitle.toLowerCase()}-related events were recorded recently. Continue recording future episodes and consider contacting a qualified veterinarian if the symptom continues, recurs, or worsens.`
      );
    }
  });

  // 4. Patterns to Monitor List
  const patternsToMonitor = [...repeatedPatterns];

  if (weightInsight && weightInsight.difference !== undefined) {
    patternsToMonitor.push(
      'A recorded weight change was observed. Continue recording future weights to understand the trend over time.'
    );
  }

  if (patternsToMonitor.length === 0 && totalEvents > 0) {
    patternsToMonitor.push(
      `Continue keeping ${petName}'s health timeline updated as new events or observations occur.`
    );
  }

  // 5. Responsible Care Statement
  const responsibleCareText = `Continue keeping ${petName}'s health records updated. If a recorded symptom continues, recurs, or worsens, consider contacting a qualified veterinarian.`;

  return {
    petName,
    totalEvents,
    weightInsight,
    categorySummaryText,
    repeatedInsights,
    patternsToMonitor,
    responsibleCareText,
    hasData: totalEvents > 0 || weightInsight !== null
  };
};
