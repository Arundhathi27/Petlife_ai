import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderForm from '../components/reminders/ReminderForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Bell, Plus, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';

export const Reminders = () => {
  const { pet, reminders, remindersLoading, addReminder, updateReminder, deleteReminder, toggleReminder } = usePet();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed' | 'all'
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  if (!pet) {
    return (
      <div className="pb-24 max-w-xl mx-auto py-12 text-center space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center font-bold shadow-soft">
            <Bell className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">Pet Care Reminders</h2>
            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">
              Please create a pet profile first to manage vaccinations, vet follow-ups, and grooming reminders.
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

  const upcomingReminders = (reminders || []).filter(r => !r.completed);
  const completedReminders = (reminders || []).filter(r => r.completed);

  const displayedReminders = activeTab === 'upcoming' 
    ? upcomingReminders 
    : activeTab === 'completed' 
      ? completedReminders 
      : reminders || [];

  const handleSaveReminder = async (formData) => {
    try {
      setIsSubmitting(true);
      if (editingReminder) {
        await updateReminder(editingReminder.id, formData);
      } else {
        await addReminder(formData);
      }
      setIsFormOpen(false);
      setEditingReminder(null);
    } catch (err) {
      console.error('Error saving reminder:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      setDeletingId(null);
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  return (
    <div className="pb-24 space-y-6 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-100 text-amber-800 shrink-0">
            <Bell className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Care Reminders</h1>
            <p className="text-xs text-slate-500 font-medium">Keep track of {pet.name}'s upcoming health and care tasks</p>
          </div>
        </div>

        <Button
          size="md"
          variant="primary"
          onClick={() => {
            setEditingReminder(null);
            setIsFormOpen(true);
          }}
          className="shadow-emerald-600/20 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[3px]" />
          <span>Add Reminder</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Upcoming ({upcomingReminders.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Completed ({completedReminders.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'all'
                ? 'bg-emerald-600 text-white shadow-soft'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({reminders?.length || 0})
          </button>
        </div>
      </div>

      {/* Reminders List */}
      {remindersLoading ? (
        <div className="py-12 text-center text-slate-400 font-medium text-sm">
          Loading reminders...
        </div>
      ) : displayedReminders.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-soft text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {activeTab === 'completed' ? 'No completed reminders' : 'No care reminders set yet'}
          </h3>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            {activeTab === 'completed'
              ? 'Reminders you mark as completed will show up here.'
              : `Add a reminder to stay on top of ${pet.name}'s vaccinations, vet follow-ups, grooming, and medications.`}
          </p>
          {activeTab !== 'completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingReminder(null);
                setIsFormOpen(true);
              }}
              className="mt-2"
            >
              + Create First Reminder
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedReminders.map(reminder => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggle={toggleReminder}
              onEdit={(rem) => {
                setEditingReminder(rem);
                setIsFormOpen(true);
              }}
              onDelete={(id) => setDeletingId(id)}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingReminder(null);
        }}
        title={editingReminder ? 'Edit Care Reminder' : 'Add Care Reminder'}
        subtitle={`Keep track of ${pet.name}'s care schedule`}
      >
        <ReminderForm
          initialData={editingReminder}
          onSave={handleSaveReminder}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingReminder(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        title="Delete Reminder?"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-slate-600">
            Are you sure you want to remove this reminder from {pet.name}'s schedule?
          </p>
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDeletingId(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => handleDelete(deletingId)}
              className="bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reminders;
