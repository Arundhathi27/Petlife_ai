import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import { 
  Syringe, 
  AlertCircle, 
  Stethoscope, 
  Pill, 
  Scale, 
  FileText, 
  HeartPulse, 
  Calendar as CalendarIcon,
  Check,
  MapPin,
  User
} from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const AddHealthEvent = () => {
  const { addHealthEvent, pet } = usePet();
  const navigate = useNavigate();

  const [eventType, setEventType] = useState('vet_visit');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    displayDate: 'Today',
    severity: 'low',
    details: '',
    location: '',
    provider: '',
    medicationName: '',
    duration: '',
    weight: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const eventTypes = [
    { id: 'vet_visit', label: 'Vet Visit', category: 'Vet Visit', icon: Stethoscope, color: 'bg-teal-500' },
    { id: 'symptom', label: 'Symptom', category: 'Symptom', icon: AlertCircle, color: 'bg-rose-500' },
    { id: 'medication', label: 'Medication', category: 'Medication', icon: Pill, color: 'bg-amber-500' },
    { id: 'vaccination', label: 'Vaccination', category: 'Vaccination', icon: Syringe, color: 'bg-emerald-500' },
    { id: 'weight', label: 'Weight', category: 'Weight', icon: Scale, color: 'bg-blue-500' },
    { id: 'lab_result', label: 'Lab Result', category: 'Lab Result', icon: FileText, color: 'bg-violet-500' },
    { id: 'general', label: 'General Note', category: 'General', icon: HeartPulse, color: 'bg-slate-500' },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);

    try {
      const selectedMeta = eventTypes.find(t => t.id === eventType);
      
      let titleToUse = formData.title;
      if (!titleToUse) {
        if (eventType === 'symptom') titleToUse = 'Symptom Logged';
        else if (eventType === 'vet_visit') titleToUse = 'Veterinary Consultation';
        else if (eventType === 'medication') titleToUse = formData.medicationName ? `Medication: ${formData.medicationName}` : 'Prescribed Medication';
        else if (eventType === 'vaccination') titleToUse = 'Vaccination Administered';
        else if (eventType === 'weight') titleToUse = `Weight Logged (${formData.weight || pet?.currentWeight} kg)`;
        else titleToUse = 'Health Note';
      }

      const d = new Date(formData.date);
      const formattedDisplayDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

      const payload = {
        type: eventType,
        category: selectedMeta?.category || 'General Health',
        title: titleToUse,
        subtitle: formData.medicationName ? `${formData.medicationName} (${formData.duration || 'Short course'})` : selectedMeta?.category,
        date: formData.date,
        displayDate: formattedDisplayDate,
        details: formData.details || '',
        severity: formData.severity || 'low',
      };

      if (formData.location && formData.location.trim() !== '') {
        payload.location = formData.location.trim();
      }

      if (formData.provider && formData.provider.trim() !== '') {
        payload.provider = formData.provider.trim();
      }

      if (formData.weight !== '' && formData.weight !== undefined && !isNaN(parseFloat(formData.weight))) {
        payload.weight = parseFloat(formData.weight);
      }

      if (formData.duration) {
        payload.duration = formData.duration;
      }

      if (formData.medicationName) {
        payload.name = formData.medicationName;
      }

      await addHealthEvent(payload);

      setSubmitted(true);
      setTimeout(() => {
        navigate('/timeline');
      }, 600);
    } catch (err) {
      console.error('Error saving health event to Firestore:', err);
      setErrorMsg(err.message || 'Failed to save health event to Firestore. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="pb-3 border-b border-slate-100">
          <h2 className="text-2xl font-extrabold text-slate-900">Add Health Event</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Record a new health log for {pet?.name || 'Luna'}</p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {submitted && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Event saved to health timeline! Redirecting...</span>
          </div>
        )}

        {/* Event Type Grid Selector (3 cols on mobile, 7 cols on tablet/desktop) */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Select Event Type *
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {eventTypes.map((item) => {
              const Icon = item.icon;
              const isSelected = eventType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setEventType(item.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200/80 bg-slate-50/50 text-slate-600 font-medium hover:bg-slate-100/70'
                  }`}
                >
                  <div className={`p-2 rounded-xl text-white ${item.color} shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] leading-tight">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Title / Event Headline"
            id="title"
            placeholder={
              eventType === 'symptom' ? 'e.g. Mild Vomiting post-dinner' :
              eventType === 'medication' ? 'e.g. Prescribed medication' :
              eventType === 'vaccination' ? 'e.g. Rabies Booster' :
              'e.g. Regular Checkup'
            }
            value={formData.title}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date"
              id="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              icon={CalendarIcon}
            />

            {eventType === 'symptom' ? (
              <div className="space-y-1.5">
                <label htmlFor="severity" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 pl-0.5">
                  Severity
                </label>
                <select
                  id="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="low">Mild / Low</option>
                  <option value="moderate">Moderate</option>
                  <option value="high">Severe</option>
                </select>
              </div>
            ) : (
              <Input
                label="Provider / Doctor"
                id="provider"
                placeholder="Dr. Jenkins"
                value={formData.provider}
                onChange={handleChange}
                icon={User}
              />
            )}
          </div>

          {/* Conditional Fields based on Event Type */}
          {eventType === 'medication' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
              <Input
                label="Medication Name"
                id="medicationName"
                placeholder="e.g. Example medication"
                value={formData.medicationName}
                onChange={handleChange}
              />
              <Input
                label="Duration / Frequency"
                id="duration"
                placeholder="e.g. 5 days"
                value={formData.duration}
                onChange={handleChange}
              />
            </div>
          )}

          {eventType === 'weight' && (
            <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200/60">
              <Input
                label="Recorded Weight (kg)"
                id="weight"
                type="number"
                step="0.1"
                placeholder="e.g. 12.1"
                value={formData.weight}
                onChange={handleChange}
                icon={Scale}
                helperText={`Previous weight was ${pet?.currentWeight || 12.1} kg`}
              />
            </div>
          )}

          <Input
            label="Location / Vet Clinic"
            id="location"
            placeholder="e.g. Oakwood Pet Hospital"
            value={formData.location}
            onChange={handleChange}
            icon={MapPin}
          />

          <Input
            label="Details & Notes"
            id="details"
            type="textarea"
            placeholder="Describe what happened, observations, or instructions..."
            value={formData.details}
            onChange={handleChange}
            required
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="px-8 shadow-emerald-600/30"
            >
              Save Event
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHealthEvent;
