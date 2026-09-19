import React from 'react';
import { Sparkles, Calendar, TrendingUp, Activity, CheckCircle, ArrowRight, ShieldAlert, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIStoryCard = ({ story, petName = 'My Pet', compact = false }) => {
  const navigate = useNavigate();

  if (!story) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-950 text-white p-5 sm:p-6 shadow-card border border-violet-700/40 space-y-4">
      {/* AI Glow backdrop */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-violet-500/20 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-violet-500/25 border border-violet-400/30 backdrop-blur-md text-violet-200">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white tracking-tight">AI Health Story</h3>
            <p className="text-[11px] text-violet-200 font-medium">Synthesized for {petName}</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-violet-500/30 text-violet-200 border border-violet-400/40 uppercase tracking-wider backdrop-blur-md">
          Live AI Brief
        </span>
      </div>

      {/* 1. Summary */}
      <div className="relative z-10 p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-md space-y-1">
        <h4 className="text-[11px] font-bold text-violet-200 uppercase tracking-wider">Summary</h4>
        <p className="text-xs text-violet-100 leading-relaxed font-medium">
          {story.summary}
        </p>
      </div>

      {/* Full Sections when not compact */}
      {!compact && (
        <div className="relative z-10 space-y-3.5">
          {/* 2. What happened */}
          {story.whatHappened && story.whatHappened.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-violet-200">
                <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">What happened</h4>
              </div>
              <ul className="space-y-1.5 pl-1">
                {story.whatHappened.map((item, idx) => (
                  <li key={idx} className="text-xs text-violet-100 leading-snug flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 3. What changed */}
          {story.whatChanged && story.whatChanged.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-violet-200">
                <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">What changed</h4>
              </div>
              <ul className="space-y-1.5 pl-1">
                {story.whatChanged.map((item, idx) => (
                  <li key={idx} className="text-xs text-violet-100 leading-snug flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Patterns to monitor */}
          {story.patternsToMonitor && story.patternsToMonitor.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-violet-200">
                <Activity className="w-4 h-4 text-violet-300 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Patterns to monitor</h4>
              </div>
              <ul className="space-y-1.5 pl-1">
                {story.patternsToMonitor.map((item, idx) => (
                  <li key={idx} className="text-xs text-violet-100 leading-snug flex items-start gap-2">
                    <span className="text-violet-300 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 5. Suggested next steps */}
          {story.suggestedNextSteps && story.suggestedNextSteps.length > 0 && (
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 backdrop-blur-md space-y-2">
              <div className="flex items-center gap-2 text-violet-200">
                <CheckCircle className="w-4 h-4 text-teal-300 shrink-0" />
                <h4 className="text-xs font-bold uppercase tracking-wider">Suggested next steps</h4>
              </div>
              <ul className="space-y-1.5 pl-1">
                {story.suggestedNextSteps.map((item, idx) => (
                  <li key={idx} className="text-xs text-violet-100 leading-snug flex items-start gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 6. Important note / disclaimer */}
          <div className="p-3.5 rounded-2xl bg-amber-400/15 border border-amber-400/30 backdrop-blur-md flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">Important note / disclaimer</h5>
              <p className="text-xs text-amber-100 leading-relaxed font-normal">
                {story.disclaimer || "PetLife AI provides informational insights based on the records you provide. It does not diagnose or replace veterinary care."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Action for Compact view */}
      {compact && (
        <button
          onClick={() => navigate('/ai-story')}
          className="relative z-10 w-full mt-2 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <span>Read Full Health Story</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default AIStoryCard;
