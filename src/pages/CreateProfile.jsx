import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePet } from '../context/PetContext';
import { Dog, Scale, Calendar, Heart, Shield, Check } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const CreateProfile = () => {
  const { pet, createPet, updatePetProfile } = usePet();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: pet?.name || '',
    species: pet?.species || 'Dog',
    breed: pet?.breed || '',
    age: pet && pet.age !== undefined && pet.age !== null ? pet.age : '',
    currentWeight: pet && pet.currentWeight !== undefined && pet.currentWeight !== null ? pet.currentWeight : '',
    previousWeight: pet && pet.previousWeight !== undefined && pet.previousWeight !== null ? pet.previousWeight : '',
    weightUnit: pet?.weightUnit || 'kg',
    photoUrl: pet?.photoUrl || '',
    microchipId: pet?.microchipId || '',
    allergies: pet && pet.allergies ? pet.allergies.join(', ') : '',
    conditions: pet && pet.conditions ? pet.conditions.join(', ') : '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);

    try {
      const petPayload = {
        name: formData.name || 'My Pet',
        species: formData.species || 'Dog',
        breed: formData.breed ? formData.breed.trim() : '',
        age: formData.age !== '' && !isNaN(parseFloat(formData.age)) ? parseFloat(formData.age) : '',
        currentWeight: formData.currentWeight !== '' && !isNaN(parseFloat(formData.currentWeight)) ? parseFloat(formData.currentWeight) : '',
        previousWeight: formData.previousWeight !== '' && !isNaN(parseFloat(formData.previousWeight)) ? parseFloat(formData.previousWeight) : '',
        weightUnit: formData.weightUnit || 'kg',
        photoUrl: formData.photoUrl ? formData.photoUrl.trim() : '',
        microchipId: formData.microchipId ? formData.microchipId.trim() : '',
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        conditions: formData.conditions ? formData.conditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      };

      if (pet && pet.id) {
        await updatePetProfile(petPayload);
      } else {
        await createPet(petPayload);
      }

      setSavedSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      console.error('Error saving pet profile:', err);
      setErrorMsg(err.message || 'Failed to save pet profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-24 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold shrink-0">
            <Dog className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">{pet ? 'Edit Pet Profile' : 'Create Pet Profile'}</h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">Add or update your pet's core health information</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <span>{errorMsg}</span>
          </div>
        )}

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fade-in">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Pet profile saved successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Pet Name *"
              id="name"
              placeholder="e.g. Luna or Milo"
              value={formData.name}
              onChange={handleChange}
              required
              icon={Heart}
            />

            <Input
              label="Breed"
              id="breed"
              placeholder="e.g. Golden Retriever"
              value={formData.breed}
              onChange={handleChange}
              icon={Dog}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="species" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 pl-0.5">
                Species *
              </label>
              <select
                id="species"
                value={formData.species}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:ring-2 focus:ring-emerald-500 text-sm"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Input
              label="Age (Years)"
              id="age"
              type="number"
              step="0.5"
              placeholder="e.g. 4"
              value={formData.age}
              onChange={handleChange}
              icon={Calendar}
            />

            <Input
              label="Current Weight"
              id="currentWeight"
              type="number"
              step="0.1"
              placeholder="12.1"
              value={formData.currentWeight}
              onChange={handleChange}
              icon={Scale}
            />

            <Input
              label="Previous Weight (Optional)"
              id="previousWeight"
              type="number"
              step="0.1"
              placeholder="12.8"
              value={formData.previousWeight}
              onChange={handleChange}
              icon={Scale}
            />
          </div>

          <Input
            label="Photo URL (Optional)"
            id="photoUrl"
            type="url"
            placeholder="https://example.com/pet-photo.jpg"
            value={formData.photoUrl}
            onChange={handleChange}
          />

          <Input
            label="Microchip ID (Optional)"
            id="microchipId"
            placeholder="e.g. 985141002349102"
            value={formData.microchipId}
            onChange={handleChange}
            icon={Shield}
          />

          <Input
            label="Known Allergies"
            id="allergies"
            placeholder="e.g. Chicken, Flea bites, None"
            value={formData.allergies}
            onChange={handleChange}
            helperText="Separate multiple allergies with commas"
          />

          <Input
            label="Current Health Conditions / Notes"
            id="conditions"
            type="textarea"
            placeholder="e.g. Mild gastroenteritis (recovering)"
            value={formData.conditions}
            onChange={handleChange}
          />

          <div className="pt-4 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="px-6"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="px-8 shadow-emerald-600/30"
            >
              {isSaving ? 'Saving...' : 'Save Pet Profile'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProfile;
