import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import PetCard from '../components/pet/PetCard';
import HealthEventCard from '../components/health/HealthEventCard';
import AIStoryCard from '../components/health/AIStoryCard';
import ReminderCard, { getReminderDateBadge } from '../components/reminders/ReminderCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Plus, Calendar, Sparkles, MessageSquareHeart, TrendingDown, ArrowRight, Bell, CheckCircle2, Circle } from 'lucide-react';

export const Home = () => {
  const { pet, events, aiStory, reminders, toggleReminder } = usePet();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const recentEvents = events.slice(0, 4);
  const upcomingReminders = (reminders || []).filter(r => !r.completed).slice(0, 3);

  if (!pet) {
    return (
      <div className="pb-24 max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold shadow-soft">
            <Plus className="w-8 h-8 text-emerald-600 stroke-[3px]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Start your pet's health story</h2>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
              Add your pet to begin tracking health records.
            </p>
          </div>
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/create-profile')}
            className="shadow-emerald-600/30 px-8 py-3.5 font-bold"
          >
            Create Pet Profile
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24 space-y-6">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Column (2 Cols on Desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Pet Card Header */}
          <PetCard pet={pet} showEdit={true} />

          {/* 2. AI Story Preview Card */}
          <AIStoryCard story={aiStory} petName={pet?.name} compact={true} />

          {/* 3. Recent Health Events Feed */}
          <div className="space-y-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Health Events</h3>
                <p className="text-xs text-slate-500 font-medium">Chronological records for {pet?.name}</p>
              </div>
              <button
                onClick={() => navigate('/timeline')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-xl"
              >
                <span>View All ({events.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 pt-2">
              {recentEvents.map(event => (
                <HealthEventCard
                  key={event.id}
                  event={event}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column (1 Col on Desktop) */}
        <div className="space-y-6">
          {/* Prominent "+ Add Health Event" Banner CTA */}
          <div className="bg-amber-100/80 border border-amber-200 rounded-3xl p-5 shadow-soft space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
                <Plus className="w-6 h-6 stroke-[3px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Health Event</h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">Log symptoms, vet visits, meds, or weight</p>
              </div>
            </div>

            <Button
              fullWidth
              size="md"
              variant="primary"
              onClick={() => navigate('/add-event')}
              className="shadow-emerald-600/20 py-3"
            >
              <span>+ Add Health Event</span>
            </Button>
          </div>

          {/* Upcoming Reminders Widget */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Bell className="w-4 h-4 text-amber-700" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Upcoming Reminders</h3>
              </div>
              <button
                onClick={() => navigate('/reminders')}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {upcomingReminders.length === 0 ? (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/60 text-center space-y-1">
                <p className="text-xs font-semibold text-slate-700">No upcoming reminders</p>
                <button
                  onClick={() => navigate('/reminders')}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  + Add care reminder
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {upcomingReminders.map(rem => {
                  const dateBadge = getReminderDateBadge(rem.date, rem.completed);
                  return (
                    <div
                      key={rem.id}
                      className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <button
                          onClick={() => toggleReminder && toggleReminder(rem.id)}
                          className="text-slate-400 hover:text-emerald-600 shrink-0"
                        >
                          <Circle className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-slate-800 truncate">{rem.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${dateBadge.className}`}>
                        {dateBadge.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Health Alert Widget */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800">Weight Metric Monitored</p>
                <p className="text-xs text-slate-500 font-medium">12.1 kg (Previous 12.8 kg logged)</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/insights')}
              className="w-full py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-emerald-700 flex items-center justify-center gap-1 border border-slate-200/60"
            >
              <span>View Insights & Trends</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Action Shortcuts Grid */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Navigation</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => navigate('/timeline')}
                className="bg-slate-50 hover:bg-emerald-50 p-3 rounded-2xl border border-slate-200/70 text-center transition-all group flex flex-col items-center"
              >
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 mb-1 group-hover:scale-110 transition-transform">
                  <Calendar className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-bold text-slate-800">Timeline</p>
              </button>

              <button
                onClick={() => navigate('/insights')}
                className="bg-slate-50 hover:bg-teal-50 p-3 rounded-2xl border border-slate-200/70 text-center transition-all group flex flex-col items-center"
              >
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700 mb-1 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-bold text-slate-800">Insights</p>
              </button>

              <button
                onClick={() => navigate('/ask-ai')}
                className="bg-slate-50 hover:bg-violet-50 p-3 rounded-2xl border border-slate-200/70 text-center transition-all group flex flex-col items-center"
              >
                <div className="p-2 rounded-xl bg-violet-100 text-violet-700 mb-1 group-hover:scale-110 transition-transform">
                  <MessageSquareHeart className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-bold text-slate-800">Ask AI</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title={selectedEvent?.title}
        subtitle={selectedEvent?.displayDate}
      >
        {selectedEvent && (
          <div className="space-y-3 text-slate-700">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-xs">
              <span className="font-bold text-amber-900">Category: </span>
              <span>{selectedEvent.category}</span>
            </div>

            <p className="text-sm leading-relaxed">{selectedEvent.details}</p>

            {selectedEvent.provider && (
              <p className="text-xs font-medium text-slate-500">Provider: {selectedEvent.provider}</p>
            )}

            <div className="pt-2 flex justify-end gap-2">
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  const evtId = selectedEvent.id;
                  setSelectedEvent(null);
                  navigate(`/event/${evtId}`);
                }}
              >
                View Full Event Page
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
