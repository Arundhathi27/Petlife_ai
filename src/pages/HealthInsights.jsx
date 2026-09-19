import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import { calculateHealthInsights } from '../utils/insightsCalculator';
import Button from '../components/common/Button';
import { 
  Sparkles, 
  Scale, 
  Activity, 
  Repeat, 
  Eye, 
  Heart, 
  Plus, 
  MessageSquare,
  AlertCircle 
} from 'lucide-react';

export const HealthInsights = () => {
  const { pet, events } = usePet();
  const navigate = useNavigate();

  const insightsData = calculateHealthInsights(pet, events);
  const { 
    petName, 
    totalEvents, 
    weightInsight, 
    categorySummaryText, 
    repeatedInsights, 
    patternsToMonitor, 
    responsibleCareText,
    hasData 
  } = insightsData;

  return (
    <div className="pb-24 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-teal-800 via-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-card space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-teal-500/25 border border-teal-400/30 text-amber-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Health Insights</h2>
            <p className="text-xs sm:text-sm text-teal-100 font-medium">Neutral, record-based observations for {petName}</p>
          </div>
        </div>
      </div>

      {/* Main Insights Content */}
      {!hasData ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-soft text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
            <Activity className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No health patterns to review yet.</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              Add health events over time and PetLife will help you spot meaningful changes in {petName}'s timeline.
            </p>
          </div>
          <div className="pt-2">
            <Button variant="primary" onClick={() => navigate('/add-event')}>
              <Plus className="w-4 h-4 mr-1.5" />
              Add Health Event
            </Button>
          </div>
        </div>
      ) : (
        /* Active Insights Layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Column: Recorded Weight & Recent Activity */}
          <div className="space-y-6">
            
            {/* 1. Recorded Weight Card */}
            {weightInsight && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
                      <Scale className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{weightInsight.title}</h3>
                      <p className="text-xs text-slate-500">
                        {weightInsight.previousWeight ? `Baseline ${weightInsight.previousWeight} ${weightInsight.unit} • ` : ''}Current {weightInsight.currentWeight} {weightInsight.unit}
                      </p>
                    </div>
                  </div>
                  {weightInsight.difference !== undefined && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                      {weightInsight.difference > 0 ? '+' : ''}{weightInsight.difference} {weightInsight.unit}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 leading-relaxed font-medium">
                  {weightInsight.description}
                </p>
              </div>
            )}

            {/* 2. Recent Activity & Categories */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-emerald-100 text-emerald-700">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Recent Activity</h3>
                  <p className="text-xs text-slate-500">{totalEvents} health event{totalEvents === 1 ? '' : 's'} recorded in timeline</p>
                </div>
              </div>

              {categorySummaryText && (
                <p className="text-xs text-slate-600 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100/60 leading-relaxed font-medium">
                  {categorySummaryText}
                </p>
              )}
            </div>

            {/* 3. Repeated Events Card */}
            {repeatedInsights.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-rose-100 text-rose-700">
                    <Repeat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Repeated Events</h3>
                    <p className="text-xs text-slate-500">Multiple entries for similar events</p>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {repeatedInsights.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-slate-700 space-y-1">
                      <span className="font-bold text-rose-900 block">{item.title}</span>
                      <p className="leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Patterns to Monitor & Responsible Care */}
          <div className="space-y-6">

            {/* 4. Patterns to Monitor */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Patterns to Monitor</h3>
                  <p className="text-xs text-slate-500">Observed timeline trends for {petName}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {patternsToMonitor.map((pattern, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{pattern}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Responsible Care Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-teal-100 text-teal-800">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Responsible Care</h3>
                  <p className="text-xs text-slate-500">Wellness & record-keeping guidelines</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 bg-teal-50/50 p-4 rounded-2xl border border-teal-100/60 leading-relaxed font-medium">
                {responsibleCareText}
              </p>

              <div className="pt-1 flex items-center justify-between gap-3">
                <Button variant="secondary" onClick={() => navigate('/ask-ai')} className="w-full text-xs">
                  <MessageSquare className="w-4 h-4 mr-1.5 text-violet-600" />
                  Ask AI About {petName}
                </Button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default HealthInsights;
