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
  MapPin,
  User,
  Tag
} from 'lucide-react';

export const TimelineItem = ({ event, isLast = false, onSelect }) => {
  if (!event) return null;

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

  const nodeColor = {
    vaccination: 'bg-emerald-500 text-white shadow-emerald-500/30',
    symptom: 'bg-rose-500 text-white shadow-rose-500/30',
    vet_visit: 'bg-teal-500 text-white shadow-teal-500/30',
    medication: 'bg-amber-500 text-white shadow-amber-500/30',
    weight: 'bg-blue-500 text-white shadow-blue-500/30',
    lab_result: 'bg-violet-500 text-white shadow-violet-500/30',
  }[event.type] || 'bg-slate-500 text-white';

  return (
    <div className="relative flex gap-4 group">
      {/* Vertical connector line */}
      {!isLast && (
        <span 
          className="absolute left-5 top-10 bottom-0 w-0.5 bg-amber-200/70 -translate-x-1/2 group-hover:bg-emerald-300 transition-colors" 
          aria-hidden="true" 
        />
      )}

      {/* Timeline Node Icon */}
      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-2xl ${nodeColor} shadow-md shrink-0 ring-4 ring-[#FAF7F2]`}>
        <IconComponent className="w-5 h-5" />
      </div>

      {/* Timeline Content Body */}
      <div 
        onClick={() => onSelect && onSelect(event)}
        className="flex-1 bg-white rounded-2xl p-4 mb-6 border border-slate-200/70 shadow-soft hover:shadow-card hover:border-slate-300 transition-all duration-200 cursor-pointer"
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
            {event.displayDate}
          </span>

          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            {event.category}
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-800 mt-2 group-hover:text-emerald-700 transition-colors">
          {event.title}
        </h3>

        {event.subtitle && (
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {event.subtitle}
          </p>
        )}

        {event.details && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3 bg-amber-50/30 p-2.5 rounded-xl border border-amber-100/50">
            {event.details}
          </p>
        )}

        {/* Metadata snippets */}
        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium flex-wrap">
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              {event.location}
            </span>
          )}
          {event.provider && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3 text-slate-400" />
              {event.provider}
            </span>
          )}
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
          <span>View event details & AI context</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
