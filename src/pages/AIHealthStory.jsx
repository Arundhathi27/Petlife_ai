import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import AIStoryCard from '../components/health/AIStoryCard';
import Button from '../components/common/Button';
import { Sparkles, ArrowLeft, MessageSquareHeart, Calendar, RefreshCw, AlertTriangle } from 'lucide-react';

export const AIHealthStory = () => {
  const { aiStory, aiStoryLoading, aiStoryError, fetchAiStory, pet, events } = usePet();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAiStory();
  }, [pet?.id]);

  const petName = pet?.name || 'your pet';

  return (
    <div className="pb-24 max-w-4xl mx-auto space-y-6">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchAiStory({ forceRefresh: true })}
            disabled={aiStoryLoading}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-2 rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${aiStoryLoading ? 'animate-spin' : ''}`} />
            <span>Refresh AI Health Story</span>
          </button>

          <div className="flex items-center gap-1.5 text-xs font-bold text-violet-800 bg-violet-100 px-3.5 py-2 rounded-full border border-violet-200">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>AI Health Story</span>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {aiStoryLoading && (
        <div className="bg-gradient-to-br from-violet-900 via-indigo-900 to-purple-950 rounded-3xl p-8 border border-violet-700/40 text-white text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/25 border border-violet-400/30 flex items-center justify-center mx-auto text-amber-300 animate-pulse">
            <Sparkles className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Building {petName}'s health story...</h3>
            <p className="text-xs text-violet-200 mt-1">Analyzing timeline records and weight metrics via Gemini AI</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!aiStoryLoading && aiStoryError && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-rose-900">Health Story Generation Issue</h3>
            <p className="text-xs text-rose-700 mt-1">{aiStoryError}</p>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => fetchAiStory({ forceRefresh: true })}
            className="font-bold"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Generation</span>
          </Button>
        </div>
      )}

      {/* Main AI Story Component */}
      {!aiStoryLoading && !aiStoryError && aiStory && (
        <AIStoryCard story={aiStory} petName={pet?.name} compact={false} />
      )}

      {/* Timeline Breakdown Map */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <div>
            <h3 className="text-base font-bold text-slate-900">Timeline Events Synthesized</h3>
            <p className="text-xs text-slate-500">Chronological records included in this AI Health Brief ({events.length} total)</p>
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">No health events recorded yet for {petName}.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate(`/event/${evt.id}`)}
                className="p-3.5 rounded-2xl bg-amber-50/40 hover:bg-amber-100/60 border border-amber-100 transition-colors flex items-center justify-between cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">{evt.displayDate || evt.date}</span>
                  <span className="text-xs font-bold text-slate-800">{evt.title}</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                  {evt.category || evt.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Banner */}
      <div className="p-5 bg-violet-100/70 rounded-3xl border border-violet-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-violet-900">Have questions about {petName}'s records?</h4>
          <p className="text-xs text-violet-700 mt-0.5">Ask PetLife AI for instant medical context.</p>
        </div>

        <Button
          size="md"
          variant="accent"
          onClick={() => navigate('/ask-ai')}
          className="shrink-0 font-bold"
        >
          <MessageSquareHeart className="w-4 h-4" />
          <span>Ask AI Assistant</span>
        </Button>
      </div>
    </div>
  );
};

export default AIHealthStory;
