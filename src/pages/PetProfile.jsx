import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import { useAuth } from '../context/AuthContext';
import PetCard from '../components/pet/PetCard';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { 
  Dog, 
  Shield, 
  Phone, 
  MapPin, 
  RotateCcw, 
  Edit3, 
  CheckCircle,
  LogOut,
  UserCheck
} from 'lucide-react';

export const PetProfile = () => {
  const { pet, resetDemoData } = usePet();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setResetSuccess(true);
    setShowResetModal(false);
    setTimeout(() => {
      setResetSuccess(false);
    }, 2500);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto space-y-6">
      {/* 1. Main Pet Header Card */}
      <PetCard pet={pet} showEdit={true} />

      {resetSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span>Demo data reset to Luna's baseline records!</span>
        </div>
      )}

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
        {/* Left Column: Digital Medical ID & Auth Account */}
        <div className="space-y-6">
          {/* Digital Medical ID Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Shield className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800">Digital Medical ID</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                Verified Pet Parent
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Microchip ID</span>
                <span className="font-mono font-bold text-slate-800">{pet?.microchipId || '985141002349102'}</span>
              </div>

              <div className="bg-amber-50/50 p-3 rounded-2xl border border-amber-100">
                <span className="text-[10px] font-semibold text-slate-400 block uppercase">Rabies Tag</span>
                <span className="font-mono font-bold text-slate-800">#RAB-2026-901</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 block uppercase">Known Health Conditions</span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {pet?.conditions && pet.conditions.length > 0 
                  ? pet.conditions.join(', ') 
                  : 'Mild gastroenteritis (recovering from Sep 10)'
                }
              </p>
            </div>
          </div>

          {/* Account Authentication & Logout Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-6 h-6 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800">Account & Session</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                Active Session
              </span>
            </div>

            {currentUser && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Logged In As</span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 break-all">{currentUser.email}</span>
              </div>
            )}

            <Button
              fullWidth
              variant="danger"
              onClick={handleLogout}
              className="justify-center text-xs sm:text-sm font-bold py-3 shadow-rose-600/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of PetLife AI</span>
            </Button>
          </div>
        </div>

        {/* Right Column: Veterinary Contact & Demo Controls */}
        <div className="space-y-6">
          {/* Clinic Contact */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800">Veterinary Care Contact</h3>

            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-teal-900">{pet?.vetName || 'Not specified'}</span>
                {pet?.vetName && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Primary</span>}
              </div>

              {pet?.vetName ? (
                <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Veterinary Care Contact</span>
                </p>
              ) : (
                <p className="text-xs text-slate-500 italic">No primary veterinarian specified yet in pet profile.</p>
              )}
            </div>
          </div>

          {/* Preferences & Reset Controls */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-slate-800">App Preferences & Demo Controls</h3>

            <div className="space-y-3">
              <Button
                fullWidth
                variant="outline"
                onClick={() => navigate('/create-profile')}
                className="justify-start text-xs sm:text-sm font-semibold py-3"
              >
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <span>Edit {pet?.name || 'Luna'}'s Profile</span>
              </Button>

              <Button
                fullWidth
                variant="danger"
                onClick={() => setShowResetModal(true)}
                className="justify-start text-xs sm:text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 shadow-none py-3"
              >
                <RotateCcw className="w-4 h-4 text-rose-600" />
                <span>Reset Demo Data (Luna Baseline)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Demo Data?"
        subtitle="This will restore Luna's initial demo records."
      >
        <div className="space-y-4 text-slate-700 text-xs sm:text-sm">
          <p>
            Are you sure you want to reset all health events and pet details back to the initial Code-a-Thon baseline for Luna?
          </p>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowResetModal(false)}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleReset}
              className="w-1/2"
            >
              Reset Data
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PetProfile;
