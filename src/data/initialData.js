export const INITIAL_PET_DATA = {
  id: 'pet_luna_1',
  name: 'Luna',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 4, // 4 years
  gender: 'Female',
  birthDate: '2022-04-12',
  currentWeight: 12.1,
  previousWeight: 12.8,
  weightUnit: 'kg',
  photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
  microchipId: '985141002349102',
  vetName: 'Dr. Sarah Jenkins (Oakwood Pet Hospital)',
  allergies: ['None reported'],
  conditions: ['Recent digestive-related records logged'],
  createdAt: '2026-08-01',
};

export const INITIAL_HEALTH_EVENTS = [
  {
    id: 'evt_1',
    date: '2026-08-25',
    displayDate: 'August 25',
    type: 'vaccination',
    category: 'Vaccination',
    title: 'Rabies Vaccination',
    subtitle: 'Annual Rabies Booster',
    details: 'Administered 1-Year Rabies vaccine by Dr. Jenkins. No immediate reaction observed. Next booster due Aug 2027.',
    severity: 'low',
    location: 'Oakwood Pet Hospital',
    provider: 'Dr. Sarah Jenkins',
    iconName: 'Syringe',
    status: 'completed',
    tags: ['Preventive', 'Vaccine', 'Routine'],
  },
  {
    id: 'evt_2',
    date: '2026-09-10',
    displayDate: 'September 10',
    type: 'symptom',
    category: 'Symptom',
    title: 'Symptom - Vomiting',
    subtitle: 'Digestive Upset Logged',
    details: 'Vomited twice after dinner. Appeared lethargic afterwards but drank fresh water.',
    severity: 'moderate',
    notes: 'Monitored food intake. Withheld kibble for 12 hours as advised by nurse phone line.',
    iconName: 'AlertCircle',
    status: 'resolved',
    tags: ['Digestive', 'Symptom', 'Moderate'],
  },
  {
    id: 'evt_3',
    date: '2026-09-12',
    displayDate: 'September 12',
    type: 'vet_visit',
    category: 'Vet Visit',
    title: 'Vet Visit',
    subtitle: 'Digestive Symptoms Consultation',
    details: 'Veterinary visit related to digestive symptoms (vomiting on Sep 10). Physical exam normal, abdomen soft, no fever.',
    severity: 'low',
    location: 'Oakwood Pet Hospital',
    provider: 'Dr. Sarah Jenkins',
    cost: '$85.00',
    iconName: 'Stethoscope',
    status: 'completed',
    tags: ['Checkup', 'Digestive', 'Doctor'],
  },
  {
    id: 'evt_4',
    date: '2026-09-12',
    displayDate: 'September 12',
    type: 'medication',
    category: 'Medication',
    title: 'Medication prescribed',
    subtitle: 'Example medication (5-day course)',
    details: 'Prescribed medication for 5 days following vet visit. Give 1 tablet daily with bland meal.',
    name: 'Example medication',
    duration: '5 days',
    dosage: '1 tablet daily',
    severity: 'low',
    iconName: 'Pill',
    status: 'active',
    tags: ['Rx', 'Treatment', '5 Days'],
  },
  {
    id: 'evt_5',
    date: '2026-09-20',
    displayDate: 'September 20',
    type: 'weight',
    category: 'Weight',
    title: 'Weight Record',
    subtitle: 'Recorded 12.1 kg (-0.7 kg change)',
    details: 'Current weight: 12.1 kg. Previous recorded weight: 12.8 kg.',
    weight: 12.1,
    previousWeight: 12.8,
    unit: 'kg',
    change: -0.7,
    severity: 'moderate',
    iconName: 'Scale',
    status: 'recorded',
    tags: ['Weight', 'Metric', 'Monitored'],
  }
];

export const INITIAL_AI_STORY = {
  summary: "Luna's record timeline tracks recent digestive-related records and subsequent events, alongside routine preventive vaccinations.",
  narrative: `In late August (Aug 25), Luna received her routine Rabies booster at Oakwood Pet Hospital.

On September 10, Luna experienced moderate digestive symptoms (vomiting twice post-dinner). Following a recommended vet checkup on September 12, Dr. Jenkins prescribed a 5-day medication course.

On September 20, Luna's weight was recorded at 12.1 kg, reflecting a 0.7 kg change from her previous recorded weight of 12.8 kg. This metric change correlates with her recent digestive-related records and subsequent events.`,
  keyTakeaways: [
    "Rabies vaccination is up-to-date (administered Aug 25).",
    "Digestive-related symptoms logged on Sep 10 followed by vet consultation on Sep 12.",
    "Medication course (5 days) prescribed post-visit.",
    "Weight change of 0.7 kg logged on Sep 20 for routine monitoring."
  ],
  recommendedAction: "Monitor Luna's daily appetite and consult Dr. Jenkins for routine weigh-in follow-ups."
};

export const INITIAL_INSIGHTS = [
  {
    id: 'ins_1',
    title: 'Weight Metric Change',
    category: 'Weight Metric',
    type: 'warning',
    impact: 'Monitored',
    icon: 'TrendingDown',
    description: 'Luna logged 12.1 kg (down from 12.8 kg) following her recent digestive-related records on Sep 10.',
    actionableTip: 'Re-weigh Luna in 14 days and share logs with Dr. Jenkins during routine checkups.'
  },
  {
    id: 'ins_2',
    title: 'Vaccination Coverage',
    category: 'Preventive Care',
    type: 'success',
    impact: 'Protected',
    icon: 'ShieldCheck',
    description: 'Rabies vaccination administered on Aug 25 is active and documented.',
    actionableTip: 'No action needed. Next routine booster scheduled for August 2027.'
  },
  {
    id: 'ins_3',
    title: 'Recent Care Timeline',
    category: 'Timeline Pattern',
    type: 'info',
    impact: 'Documented',
    icon: 'CheckCircle2',
    description: 'Vet visit and 5-day medication course documented following Sep 10 symptom log.',
    actionableTip: 'Keep recording daily appetite and energy levels in the health timeline.'
  }
];

export const SUGGESTED_AI_QUESTIONS = [
  "What is logged regarding Luna's 0.7 kg weight change?",
  "When is Luna due for her next routine vaccine checkup?",
  "What diet notes were recorded during her vet visit?",
  "How do I log new health events for Luna?"
];
