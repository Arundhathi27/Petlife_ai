import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const CATEGORIES = [
  'Vaccination',
  'Vet follow-up',
  'General check-up',
  'Grooming',
  'Medication',
  'Other care'
];

export const ReminderForm = ({ initialData, onSave, onCancel, isSubmitting = false }) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Vaccination');
  const [date, setDate] = useState(todayStr);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'Vaccination');
      setDate(initialData.date || todayStr);
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setType('Vaccination');
      setDate(todayStr);
      setNotes('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a title for the reminder.');
      return;
    }
    if (!date) {
      setError('Please select a valid date.');
      return;
    }

    setError('');
    onSave({
      title: title.trim(),
      type,
      date,
      notes: notes.trim()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* Reminder Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Reminder Title <span className="text-rose-500">*</span>
        </label>
        <Input
          type="text"
          placeholder="e.g. Annual Rabies Booster, Grooming Appointment"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Type & Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Care Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-2xl border border-slate-200/80 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Date <span className="text-rose-500">*</span>
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      {/* Optional Notes */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          rows={3}
          placeholder="e.g. Bring vaccination record card, fast 8 hours prior"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200/80 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Reminder' : 'Create Reminder'}
        </Button>
      </div>
    </form>
  );
};

export default ReminderForm;
