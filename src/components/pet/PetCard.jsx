import React from 'react';
import { Dog, Scale, Calendar, ShieldCheck, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PetCard = ({ pet, showEdit = false, compact = false }) => {
  const navigate = useNavigate();

  if (!pet) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 shadow-card shadow-emerald-950/20 border border-emerald-500/30">
      {/* Soft background glow circles */}
      <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
      <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            {pet.photoUrl ? (
              <img
                src={pet.photoUrl}
                alt={pet.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/80 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/80 flex items-center justify-center text-white shadow-md">
                <Dog className="w-8 h-8" />
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-400 text-emerald-950 ring-2 ring-emerald-700 shadow-sm">
              <Dog className="w-3.5 h-3.5" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight text-white">{pet.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/20 text-white backdrop-blur-md">
                {pet.species}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 font-medium mt-0.5">
              {pet.breed} • {pet.age} years old
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-200 mt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Up-to-date on Rabies vax</span>
            </div>
          </div>
        </div>

        {showEdit && (
          <button
            onClick={() => navigate('/create-profile')}
            className="p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white backdrop-blur-md transition-all border border-white/20 shadow-sm active:scale-95"
            title="Edit Pet Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Stats Bar */}
      {!compact && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3.5 border-t border-white/15">
          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-md flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-200">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">Current Weight</p>
              <p className="text-sm font-bold text-white">
                {pet.currentWeight} {pet.weightUnit || 'kg'}
                {pet.previousWeight && (
                  <span className="text-[11px] font-normal text-amber-200 ml-1">
                    (prev {pet.previousWeight} {pet.weightUnit || 'kg'})
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-2.5 backdrop-blur-md flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-400/20 text-teal-200">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-100 uppercase tracking-wider font-semibold">Last Vet Visit</p>
              <p className="text-sm font-bold text-white">Sept 12, 2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetCard;
