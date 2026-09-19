import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import { 
  Syringe, 
  AlertCircle, 
  Stethoscope, 
  Pill, 
  Scale, 
  FileText, 
  HeartPulse, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  ArrowLeft,
  Share2,
  DollarSign,
  Edit3,
  Trash2,
  Check,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

export const EventDetails = () => {
  const { id } = useParams();
  const { events, pet, updateHealthEvent, deleteHealthEvent } = usePet();
  const navigate = useNavigate();

  const event = events.find(e => e.id === id) || events[0];

  // Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Edit Modal
  const [editFormData, setEditFormData] = useState({
    title: event ? event.title : '',
    date: event ? event.date || '' : '',
    severity: event ? event.severity || 'low' : 'low',
    details: event ? event.details || '' : '',
    location: event ? event.location || '' : '',
    provider: event ? event.provider || '' : '',
  });

  if (!event) {
    return (
      <div className="py-12 p-6 text-center max-w-md mx-auto">
        <p className="text-slate-600 font-semibold">Event record not found.</p>
        <Button onClick={() => navigate('/timeline')} className="mt-4">Back to Timeline</Button>
      </div>
    );
  }

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

  // Dynamic AI contextual analysis generator for event details
  const getAIEventContext = (evt) => {
    if (evt.type === 'symptom') {
      return {
        importance: "Monitored Event Log",
        explanation: `Vomiting recorded on ${evt.displayDate} marked the start of recent digestive-related records. In Golden Retrievers, sudden digestive symptoms often warrant dietary observation or veterinary consultation.`,
        recommendation: "Ensure fresh water availability. If symptoms recur, consult Dr. Jenkins at Oakwood Pet Hospital."
      };
    } else if (evt.type === 'vet_visit') {
      return {
        importance: "Clinical Record Logged",
        explanation: `Dr. Jenkins conducted a physical examination regarding her recent digestive-related records. Abdominal palpation was unremarkable.`,
        recommendation: "Follow prescribed feeding notes until gastrointestinal balance is re-established."
      };
    } else if (evt.type === 'medication') {
      return {
        importance: "Active Treatment Record",
        explanation: `The 5-day medication course was prescribed following her veterinary checkup on Sep 12.`,
        recommendation: "Administer 1 tablet daily with meals as directed by Dr. Jenkins."
      };
    } else if (evt.type === 'weight') {
      return {
        importance: "Metric Correlation Log",
        explanation: `Luna's recorded weight of ${evt.weight || 12.1} kg reflects a 0.7 kg change from her 12.8 kg baseline. This metric change correlates with recent digestive-related records and subsequent events.`,
        recommendation: "Track daily kibble intake and re-weigh Luna in 14 days."
      };
    }
    return {
      importance: "Preventive Care Record",
      explanation: `Routine health event logged for ${pet?.name || 'Luna'}. Vaccination provides active protection against common pathogens.`,
      recommendation: "Maintain digital records for routine grooming and boarding checkups."
    };
  };

  const aiContext = getAIEventContext(event);

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    const d = new Date(editFormData.date);
    const formattedDisplayDate = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

    await updateHealthEvent(event.id, {
      title: editFormData.title,
      date: editFormData.date,
      displayDate: formattedDisplayDate,
      severity: editFormData.severity,
      details: editFormData.details,
      location: editFormData.location,
      provider: editFormData.provider,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setShowEditModal(false);
    }, 600);
  };

  const handleDelete = async () => {
    await deleteHealthEvent(event.id);
    setShowDeleteModal(false);
    navigate('/timeline');
  };

  return (
    <div className="pb-24 max-w-5xl mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/timeline')}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Timeline</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditFormData({
                title: event.title,
                date: event.date || '',
                severity: event.severity || 'low',
                details: event.details || '',
                location: event.location || '',
                provider: event.provider || '',
              });
              setShowEditModal(true);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/80 shadow-sm hover:bg-slate-50 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-emerald-600" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 px-3.5 py-2.5 rounded-2xl border border-rose-200/80 shadow-sm hover:bg-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            <span>Delete</span>
          </button>

          <button
            onClick={() => alert(`Shared record: ${event.title} for ${pet?.name}`)}
            className="p-2.5 rounded-2xl bg-white text-slate-600 border border-slate-200/80 shadow-sm hover:bg-slate-50 transition-colors"
            title="Share Record"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Main Event Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-100 text-emerald-800 shrink-0 shadow-sm">
              <IconComponent className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                {event.category}
              </span>
              <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{event.title}</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 mt-1">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{event.displayDate}, 2026</span>
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Event Details & Notes</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{event.details}</p>
          </div>

          {/* Metadata Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            {event.location && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Location</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {event.location}
                </span>
              </div>
            )}

            {event.provider && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Provider</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-1">
                  <User className="w-4 h-4 text-slate-400" />
                  {event.provider}
                </span>
              </div>
            )}

            {event.name && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Medication</span>
                <span className="font-bold text-amber-900 mt-1 block">{event.name} ({event.duration})</span>
              </div>
            )}

            {event.cost && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-semibold block uppercase">Visit Cost</span>
                <span className="font-bold text-emerald-800 flex items-center gap-1 mt-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  {event.cost}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* AI Context Analysis Box */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-violet-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-card space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-violet-400/20 text-amber-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">PetLife AI Context Analysis</h3>
                <p className="text-xs text-violet-200">{aiContext.importance}</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-violet-100 leading-relaxed bg-white/10 p-4 rounded-2xl border border-white/10">
              {aiContext.explanation}
            </p>

            <div className="p-4 rounded-2xl bg-amber-400/20 border border-amber-300/30 text-xs sm:text-sm text-amber-100">
              <span className="font-bold text-amber-300 block mb-0.5">PetLife Recommendation:</span>
              <span>{aiContext.recommendation}</span>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            variant="outline"
            onClick={() => navigate('/ask-ai')}
            className="py-4"
          >
            Ask PetLife AI about this event
          </Button>
        </div>
      </div>

      {/* Edit Health Event Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Health Event"
        subtitle={`Update details for ${event.title}`}
      >
        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 mb-3">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Health event updated in Firestore!</span>
          </div>
        )}

        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Input
            label="Title / Headline"
            id="title"
            value={editFormData.title}
            onChange={handleEditChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Date"
              id="date"
              type="date"
              value={editFormData.date}
              onChange={handleEditChange}
              required
            />

            <div className="space-y-1.5">
              <label htmlFor="severity" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 pl-0.5">
                Severity
              </label>
              <select
                id="severity"
                value={editFormData.severity}
                onChange={handleEditChange}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="low">Low / Normal</option>
                <option value="moderate">Moderate</option>
                <option value="high">Severe</option>
              </select>
            </div>
          </div>

          <Input
            label="Location / Vet Clinic"
            id="location"
            value={editFormData.location}
            onChange={handleEditChange}
          />

          <Input
            label="Provider / Vet"
            id="provider"
            value={editFormData.provider}
            onChange={handleEditChange}
          />

          <Input
            label="Details & Notes"
            id="details"
            type="textarea"
            value={editFormData.details}
            onChange={handleEditChange}
            required
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEditModal(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Health Event?"
        subtitle="This action will permanently remove this record from your timeline."
      >
        <div className="space-y-4 text-slate-700 text-xs sm:text-sm">
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-snug">
              Are you sure you want to delete <span className="font-bold">"{event.title}"</span>? This will sync with your Cloud Firestore records.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="w-1/2"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="w-1/2"
            >
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default EventDetails;
