import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import Button from '../components/common/Button';

export const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative overflow-hidden">
      {/* Ambient decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -mr-32 -mt-32" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -ml-32" />

      {/* Header Splash */}
      <div className="pt-4 relative z-10 text-center md:text-left max-w-3xl">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-600/30">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">PetLife AI</h1>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Health Timeline</p>
          </div>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Your pet's health story, organized by AI.
        </h2>
        <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed max-w-2xl">
          Track vet visits, symptoms, medications, and weight logs in one clear chronological timeline with intelligent AI health insights.
        </p>
      </div>

      {/* Feature Highlights Grid (1 col on mobile, 3 cols on desktop) */}
      <div className="my-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative z-10">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700 shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Chronological Timeline</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Keep all vaccinations, vet notes, and symptom logs organized in order.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-violet-100 text-violet-700 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">AI Health Story</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Understand what changed, identify trends, and get personalized recommendations.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Responsible Action</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">Clear advice on when to monitor at home versus scheduling a vet checkup.</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pb-6 space-y-4 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 max-w-xl">
          <Button
            fullWidth
            size="lg"
            variant="primary"
            onClick={() => navigate('/')}
            className="shadow-lg shadow-emerald-600/30 text-base py-4"
          >
            <span>Explore Demo Pet (Luna)</span>
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>

          <Button
            fullWidth
            size="lg"
            variant="outline"
            onClick={() => navigate('/create-profile')}
            className="text-base py-4"
          >
            <span>Create New Pet Profile</span>
          </Button>
        </div>

        <p className="text-xs text-slate-400 font-medium pt-2">
          PetLife AI Code-a-Thon Demo • Built for pet parents
        </p>
      </div>
    </div>
  );
};

export default Welcome;
