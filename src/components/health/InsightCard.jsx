import React from 'react';
import { TrendingDown, ShieldCheck, CheckCircle2, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';

export const InsightCard = ({ insight, onClick }) => {
  if (!insight) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return TrendingDown;
      case 'success': return ShieldCheck;
      case 'info': return CheckCircle2;
      default: return AlertTriangle;
    }
  };

  const IconComponent = getIcon(insight.type);

  const styleMap = {
    warning: {
      bg: 'bg-amber-50/80',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100 text-amber-800',
      tag: 'bg-amber-100 text-amber-900 border-amber-300/60',
    },
    success: {
      bg: 'bg-emerald-50/80',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-800',
      tag: 'bg-emerald-100 text-emerald-900 border-emerald-300/60',
    },
    info: {
      bg: 'bg-teal-50/80',
      border: 'border-teal-200',
      iconBg: 'bg-teal-100 text-teal-800',
      tag: 'bg-teal-100 text-teal-900 border-teal-300/60',
    },
  };

  const currentStyle = styleMap[insight.type] || styleMap.info;

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl p-4 border ${currentStyle.border} ${currentStyle.bg} shadow-soft hover:shadow-card transition-all duration-200 cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`p-2.5 rounded-2xl ${currentStyle.iconBg} shrink-0 mt-0.5 shadow-sm`}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${currentStyle.tag}`}>
                {insight.category}
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {insight.impact}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 mt-1">
              {insight.title}
            </h3>

            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {insight.description}
            </p>

            {insight.actionableTip && (
              <div className="mt-3 p-2.5 rounded-2xl bg-white/90 border border-slate-200/80 flex items-start gap-2 shadow-sm">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900">PetLife Recommendation: </span>
                  {insight.actionableTip}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-slate-400 shrink-0 self-center">
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default InsightCard;
