import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import TimelineItem from '../components/health/TimelineItem';
import Button from '../components/common/Button';
import { Plus, Filter, Calendar } from 'lucide-react';

export const HealthTimeline = () => {
  const { events, pet } = usePet();
  const navigate = useNavigate();
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'symptom', label: 'Symptoms' },
    { id: 'vet_visit', label: 'Vet Visits' },
    { id: 'medication', label: 'Medications' },
    { id: 'vaccination', label: 'Vaccinations' },
    { id: 'weight', label: 'Weight Logs' },
  ];

  const filteredEvents = events.filter(evt => {
    if (filterCategory === 'all') return true;
    return evt.type === filterCategory;
  });

  return (
    <div className="pb-24 w-full max-w-4xl mx-auto space-y-6">
      {/* Timeline Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-5 sm:p-6 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-emerald-200 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
            <Calendar className="w-4 h-4" />
            <span>Health History</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white sm:whitespace-nowrap">{pet?.name || 'Luna'}'s Timeline</h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium sm:whitespace-nowrap">
            {filteredEvents.length} chronological health events logged
          </p>
        </div>

        <Button
          size="md"
          variant="secondary"
          onClick={() => navigate('/add-event')}
          className="shrink-0 font-bold shadow-md text-xs sm:text-sm px-4 py-2.5 whitespace-nowrap self-start sm:self-center"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3px]" />
          <span>Add Health Event</span>
        </Button>
      </div>

      {/* Filter Category Chips (Wrap cleanly on desktop/tablet) */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-soft flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-slate-400 pr-2 text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4" />
          <span>Filter:</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Chronological Timeline Feed */}
      <div className="pt-2 px-1">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <p className="text-base font-bold text-slate-700">No events found in this category.</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Try selecting another filter or add a new event.</p>
            <Button
              size="md"
              variant="primary"
              onClick={() => navigate('/add-event')}
              className="mt-4"
            >
              Add Event
            </Button>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <TimelineItem
              key={event.id}
              event={event}
              isLast={index === filteredEvents.length - 1}
              onSelect={(evt) => navigate(`/event/${evt.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HealthTimeline;
