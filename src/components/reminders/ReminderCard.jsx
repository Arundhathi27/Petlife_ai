import React from 'react';
import { Calendar, CheckCircle2, Circle, Pencil, Trash2, Bell } from 'lucide-react';

const TYPE_STYLES = {
  'Vaccination': 'bg-blue-100 text-blue-800 border-blue-200',
  'Vet follow-up': 'bg-purple-100 text-purple-800 border-purple-200',
  'General check-up': 'bg-emerald-100 text-emerald-800 border-emerald-200',
  'Grooming': 'bg-rose-100 text-rose-800 border-rose-200',
  'Medication': 'bg-amber-100 text-amber-800 border-amber-200',
  'Other care': 'bg-slate-100 text-slate-800 border-slate-200',
};

export const getReminderDateBadge = (dateStr, completed) => {
  if (!dateStr) return { text: 'No date', className: 'bg-slate-100 text-slate-600' };

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  if (dateStr === todayStr) {
    return { text: 'Today', className: completed ? 'bg-slate-100 text-slate-600' : 'bg-amber-500 text-white font-bold' };
  }
  if (dateStr === tomorrowStr) {
    return { text: 'Tomorrow', className: completed ? 'bg-slate-100 text-slate-600' : 'bg-emerald-600 text-white font-bold' };
  }
  if (dateStr < todayStr && !completed) {
    return { text: 'Overdue', className: 'bg-rose-500 text-white font-bold' };
  }

  // Format date readable
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const formatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return { text: formatted, className: 'bg-slate-100 text-slate-700 font-medium' };
  } catch (e) {
    return { text: dateStr, className: 'bg-slate-100 text-slate-700 font-medium' };
  }
};

export const ReminderCard = ({ reminder, onToggle, onEdit, onDelete }) => {
  const { id, title, type, date, notes, completed } = reminder;
  const dateBadge = getReminderDateBadge(date, completed);
  const typeStyle = TYPE_STYLES[type] || TYPE_STYLES['Other care'];

  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      completed 
        ? 'bg-slate-50/80 border-slate-200/80 opacity-75' 
        : 'bg-white border-slate-200/90 shadow-soft hover:shadow-md'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Completion Toggle Checkbox */}
          <button
            onClick={() => onToggle && onToggle(id)}
            className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
            title={completed ? "Mark as incomplete" : "Mark as completed"}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
            ) : (
              <Circle className="w-5 h-5 text-slate-400 hover:text-emerald-600" />
            )}
          </button>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${typeStyle}`}>
                {type || 'Care'}
              </span>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full ${dateBadge.className}`}>
                {dateBadge.text}
              </span>
            </div>

            <h4 className={`text-sm font-bold text-slate-900 truncate ${completed ? 'line-through text-slate-400' : ''}`}>
              {title}
            </h4>

            {notes && (
              <p className={`text-xs ${completed ? 'text-slate-400' : 'text-slate-600'} line-clamp-2`}>
                {notes}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(reminder)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Edit reminder"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete reminder"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReminderCard;
