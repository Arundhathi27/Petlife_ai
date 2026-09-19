import React from 'react';
import { 
  Syringe, 
  AlertCircle, 
  Stethoscope, 
  Pill, 
  Scale, 
  FileText, 
  HeartPulse,
  ChevronRight,
  Clock
} from 'lucide-react';

export const HealthEventCard = ({ event, onClick, compact = false }) => {
  if (!event) return null;

  // Icon selector based on type or iconName
  const getIcon = (type) => {
    switch (type) {
      case 'vaccination': return Syringe;
      case 'symptom': return AlertCircle;
      case 'vet_visit': return Stethoscope;
      case 'medication': return Pill;
      case 'weight': return Scale;
      case 'lab_result': return FileText;
      default: return HeartPulse;
    }
  };

  const IconComponent = getIcon(event.type);

  // Styling maps for event categories
  const categoryStyles = {
    vaccination: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100 text-emerald-700' },
    symptom: { bg: 'bg-rose-50 text-rose-700 border-rose-200', iconBg: 'bg-rose-100 text-rose-700' },
    vet_visit: { bg: 'bg-teal-50 text-teal-700 border-teal-200', iconBg: 'bg-teal-100 text-teal-700' },
    medication: { bg: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'bg-amber-100 text-amber-700' },
    weight: { bg: 'bg-blue-50 text-blue-700 border-blue-200', iconBg: 'bg-blue-100 text-blue-700' },
    lab_result: { bg: 'bg-violet-50 text-violet-700 border-violet-200', iconBg: 'bg-violet-100 text-violet-700' },
  };

  const currentStyle = categoryStyles[event.type] || categoryStyles.vaccination;

  return (
    <div
      onClick={onClick}
      className={`group relative bg-white rounded-2xl p-4 border border-slate-200/80 shadow-soft hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl ${currentStyle.iconBg} shrink-0 mt-0.5 shadow-sm`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                {event.title}
              </h3>
              {event.severity === 'moderate' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 uppercase">
                  Moderate
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{event.displayDate}</span>
              {event.duration && <span>• {event.duration}</span>}
            </p>

            {event.details && !compact && (
              <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50/80 p-2 rounded-xl border border-slate-100">
                {event.details}
              </p>
            )}

            {/* Tags */}
            {event.tags && event.tags.length > 0 && !compact && (
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                {event.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-slate-400 group-hover:text-emerald-600 transition-colors shrink-0 self-center">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default HealthEventCard;
