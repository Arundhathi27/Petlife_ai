import React, { createContext, useContext, useState, useEffect } from 'react';
import { deleteField } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { 
  INITIAL_PET_DATA, 
  INITIAL_HEALTH_EVENTS, 
  INITIAL_AI_STORY, 
  INITIAL_INSIGHTS 
} from '../data/initialData';
import {
  getPets,
  getHealthEvents,
  createPet as createPetService,
  updatePet as updatePetService,
  createHealthEvent,
  updateHealthEvent as updateHealthEventService,
  deleteHealthEvent as deleteHealthEventService,
  createReminder,
  getReminders,
  updateReminder as updateReminderService,
  deleteReminder as deleteReminderService,
  initializeUserLunaData,
  resetUserLunaData
} from '../services/firestoreService';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const { currentUser, loading: authLoading } = useAuth();

  const [pet, setPet] = useState(null);
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [remindersLoading, setRemindersLoading] = useState(false);
  const [aiStory, setAiStory] = useState(null);
  const [insights, setInsights] = useState(INITIAL_INSIGHTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);

  // Dynamically initialize chat messages whenever currentUser, pet, or events change
  useEffect(() => {
    if (currentUser) {
      const petName = pet?.name || 'your pet';
      let welcomeText = `Hi! I'm your PetLife AI assistant. `;
      
      if (!pet) {
        welcomeText += `Create a pet profile to start tracking health events and asking questions.`;
      } else if (events && events.length > 0) {
        welcomeText += `I've reviewed ${petName}'s available health timeline (${events.length} event${events.length === 1 ? '' : 's'} logged). How can I help you understand your pet's records today?`;
      } else {
        welcomeText += `I'm ready to answer questions about ${petName}. Log your pet's first health event to enable timeline analysis.`;
      }

      setChatMessages([
        {
          id: 'msg_welcome',
          sender: 'ai',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else {
      setChatMessages([
        {
          id: 'msg_guest',
          sender: 'ai',
          text: "Hi! Please sign in to view your pet's health timeline and ask AI questions.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [currentUser?.uid, pet?.id, events?.length]);

  // Chat message helper using current user's pet data
  const sendChatMessage = (text) => {
    const userMsg = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const petName = pet?.name || 'your pet';
      let aiResponseText = ``;

      if (!pet) {
        aiResponseText = `Please create a pet profile first so I can assist you with your pet's records.`;
      } else {
        const lowerText = text.toLowerCase();

        if (lowerText.includes('weight')) {
          if (pet.currentWeight) {
            aiResponseText = `According to ${petName}'s records, current weight is ${pet.currentWeight} ${pet.weightUnit || 'kg'}` +
              (pet.previousWeight ? ` (previous baseline: ${pet.previousWeight} ${pet.weightUnit || 'kg'}).` : `.`);
          } else {
            aiResponseText = `No weight metrics are currently recorded for ${petName}. You can update weight in the pet profile.`;
          }
        } else if (lowerText.includes('vaccine') || lowerText.includes('vaccination') || lowerText.includes('rabies')) {
          const vaxEvents = (events || []).filter(e => e.type === 'vaccination' || (e.category && e.category.toLowerCase().includes('vaccin')) || (e.title && e.title.toLowerCase().includes('vaccin')));
          if (vaxEvents.length > 0) {
            const latestVax = vaxEvents[0];
            aiResponseText = `${petName} has ${vaxEvents.length} recorded vaccination(s). Latest: "${latestVax.title}" logged on ${latestVax.displayDate || latestVax.date}.`;
          } else {
            aiResponseText = `No vaccination records are currently logged in ${petName}'s timeline.`;
          }
        } else if (lowerText.includes('vet') || lowerText.includes('doctor') || lowerText.includes('clinic')) {
          const vetEvents = (events || []).filter(e => e.type === 'vet_visit' || (e.category && e.category.toLowerCase().includes('vet')) || (e.title && e.title.toLowerCase().includes('vet')));
          if (vetEvents.length > 0) {
            const latestVet = vetEvents[0];
            aiResponseText = `${petName}'s latest recorded vet visit was "${latestVet.title}" on ${latestVet.displayDate || latestVet.date}.${latestVet.details ? ` Details: ${latestVet.details}` : ''}`;
          } else {
            aiResponseText = `No veterinary visits are currently logged in ${petName}'s timeline.`;
          }
        } else {
          if (events && events.length > 0) {
            aiResponseText = `I've checked ${petName}'s ${events.length} recorded timeline event(s). Regarding "${text}": Always monitor ${petName} closely, follow your veterinarian's advice, and contact a qualified veterinarian if symptoms recur or cause concern.`;
          } else {
            aiResponseText = `There are currently no health events logged in ${petName}'s timeline. Add health events to enable detailed record analysis!`;
          }
        }
      }

      const aiMsg = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  // Load user data from Firestore whenever currentUser or authLoading changes
  useEffect(() => {
    let isMounted = true;

    // Do not attempt Firestore loading until Firebase Auth resolves session
    if (authLoading) {
      setLoading(true);
      return;
    }

    const loadFirestoreData = async () => {
      if (!currentUser) {
        setPet(null);
        setEvents([]);
        setReminders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(`[PetContext] Loading Firestore data for authenticated UID: ${currentUser.uid}`);

        // Load Pets from Firestore for authenticated user
        const userPets = await getPets(currentUser.uid);
        let activePet = null;

        if (userPets && userPets.length > 0) {
          activePet = userPets[0];
        }

        // Load Health Events & Reminders from Firestore for active pet
        let userEvents = [];
        let userReminders = [];
        if (activePet && activePet.id) {
          userEvents = await getHealthEvents(currentUser.uid, activePet.id);
          userReminders = await getReminders(currentUser.uid, activePet.id);
          console.log(`[PetContext] Loaded ${userEvents.length} events, ${userReminders.length} reminders from Firestore for petId: ${activePet.id}`);
        }

        if (isMounted) {
          setPet(activePet);
          setEvents(userEvents);
          setReminders(userReminders);
        }
      } catch (err) {
        console.error('[PetContext] Error loading data from Firestore:', err);
        if (isMounted) {
          setError(err.message || 'Failed to load data from Firestore.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFirestoreData();

    return () => {
      isMounted = false;
    };
  }, [currentUser, authLoading]);

  // Create Pet Profile directly in Firestore
  const createPet = async (petData) => {
    if (!currentUser) throw new Error("User must be authenticated to create a pet profile.");

    const newPetId = petData.id || `pet_${Date.now()}`;
    const payload = {
      id: newPetId,
      name: petData.name || 'My Pet',
      species: petData.species || 'Dog',
      breed: petData.breed ? petData.breed.trim() : '',
      weightUnit: petData.weightUnit || 'kg',
      microchipId: petData.microchipId ? petData.microchipId.trim() : '',
      allergies: petData.allergies || [],
      conditions: petData.conditions || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (petData.age !== undefined && petData.age !== null && petData.age !== '' && !isNaN(parseFloat(petData.age))) {
      payload.age = parseFloat(petData.age);
    }
    if (petData.currentWeight !== undefined && petData.currentWeight !== null && petData.currentWeight !== '' && !isNaN(parseFloat(petData.currentWeight))) {
      payload.currentWeight = parseFloat(petData.currentWeight);
    }
    if (petData.previousWeight !== undefined && petData.previousWeight !== null && petData.previousWeight !== '' && !isNaN(parseFloat(petData.previousWeight))) {
      payload.previousWeight = parseFloat(petData.previousWeight);
    }
    if (petData.photoUrl && petData.photoUrl.trim() !== '') {
      payload.photoUrl = petData.photoUrl.trim();
    }

    console.log(`[Firestore Write Request] users/${currentUser.uid}/pets/${newPetId}`);
    const savedPet = await createPetService(currentUser.uid, payload);
    setPet(savedPet);
    setEvents([]);
    return savedPet;
  };

  // Add Health Event directly to Firestore & React State
  const addHealthEvent = async (newEventData) => {
    if (!currentUser) {
      throw new Error("User must be logged in to save health events to Firestore.");
    }

    if (!pet?.id) {
      throw new Error("You must create a pet profile before adding health events.");
    }

    const activePetId = pet.id;
    const eventId = `evt_${Date.now()}`;

    const eventPayload = {
      id: eventId,
      date: newEventData.date || new Date().toISOString().split('T')[0],
      displayDate: newEventData.displayDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      type: newEventData.type || 'general',
      category: newEventData.category || 'General Health',
      title: newEventData.title || 'Health Update',
      subtitle: newEventData.subtitle || (newEventData.details ? newEventData.details.substring(0, 30) + '...' : newEventData.category || ''),
      details: newEventData.details || '',
      severity: newEventData.severity || 'low',
      status: 'active',
      tags: [newEventData.category || 'Event'],
      ...newEventData
    };

    if (!eventPayload.location || typeof eventPayload.location !== 'string' || eventPayload.location.trim() === '') {
      delete eventPayload.location;
    } else {
      eventPayload.location = eventPayload.location.trim();
    }

    if (!eventPayload.provider || typeof eventPayload.provider !== 'string' || eventPayload.provider.trim() === '') {
      delete eventPayload.provider;
    } else {
      eventPayload.provider = eventPayload.provider.trim();
    }

    console.log(`[Firestore Write Request] users/${currentUser.uid}/pets/${activePetId}/healthEvents/${eventId}`);

    // Save doc to Firestore - throws if failed
    const savedEvent = await createHealthEvent(currentUser.uid, activePetId, eventPayload);

    // Handle weight metric sync
    if (newEventData.type === 'weight' && newEventData.weight !== undefined) {
      const updatedWeightData = {
        previousWeight: pet?.currentWeight || parseFloat(newEventData.weight),
        currentWeight: parseFloat(newEventData.weight)
      };
      await updatePetService(currentUser.uid, activePetId, updatedWeightData);
      setPet(prev => ({ ...prev, ...updatedWeightData }));
    }

    // Update React state strictly AFTER Firestore confirms write success
    setEvents(prev => [savedEvent, ...prev.filter(e => e.id !== savedEvent.id)]);
    return savedEvent;
  };

  // Update Health Event in Firestore & State
  const updateHealthEvent = async (eventId, updatedData) => {
    if (!currentUser || !pet?.id) return;
    await updateHealthEventService(currentUser.uid, pet.id, eventId, updatedData);
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updatedData } : e));
  };

  // Delete Health Event in Firestore & State
  const deleteHealthEvent = async (eventId) => {
    if (!currentUser || !pet?.id) return;
    await deleteHealthEventService(currentUser.uid, pet.id, eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  // --- REMINDER CRUD HANDLERS ---

  const addReminder = async (reminderData) => {
    if (!currentUser) {
      throw new Error("User must be logged in to create reminders.");
    }
    if (!pet?.id) {
      throw new Error("You must create a pet profile before adding reminders.");
    }

    const payload = {
      title: reminderData.title ? reminderData.title.trim() : 'Reminder',
      type: reminderData.type || 'Other care',
      date: reminderData.date || new Date().toISOString().split('T')[0],
      notes: reminderData.notes ? reminderData.notes.trim() : '',
      completed: false,
      ...reminderData
    };

    console.log(`[Firestore Write Request] users/${currentUser.uid}/pets/${pet.id}/reminders`);
    const savedReminder = await createReminder(currentUser.uid, pet.id, payload);
    setReminders(prev => [...prev.filter(r => r.id !== savedReminder.id), savedReminder].sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0)));
    return savedReminder;
  };

  const updateReminder = async (reminderId, updatedData) => {
    if (!currentUser || !pet?.id) return;
    await updateReminderService(currentUser.uid, pet.id, reminderId, updatedData);
    setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, ...updatedData, updatedAt: new Date().toISOString() } : r));
  };

  const deleteReminder = async (reminderId) => {
    if (!currentUser || !pet?.id) return;
    await deleteReminderService(currentUser.uid, pet.id, reminderId);
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const toggleReminder = async (reminderId) => {
    if (!currentUser || !pet?.id) return;
    const target = reminders.find(r => r.id === reminderId);
    if (!target) return;
    const nextCompleted = !target.completed;
    await updateReminderService(currentUser.uid, pet.id, reminderId, { completed: nextCompleted });
    setReminders(prev => prev.map(r => r.id === reminderId ? { ...r, completed: nextCompleted, updatedAt: new Date().toISOString() } : r));
  };

  // Update or Create Pet Profile in Firestore & State
  const updatePetProfile = async (updatedFields) => {
    if (!currentUser) throw new Error("User must be authenticated.");

    const fieldsToUpdate = { ...updatedFields };

    // Handle photoUrl deletion if cleared
    if ('photoUrl' in fieldsToUpdate && (!fieldsToUpdate.photoUrl || typeof fieldsToUpdate.photoUrl !== 'string' || fieldsToUpdate.photoUrl.trim() === '')) {
      fieldsToUpdate.photoUrl = deleteField();
    } else if (fieldsToUpdate.photoUrl && typeof fieldsToUpdate.photoUrl === 'string') {
      fieldsToUpdate.photoUrl = fieldsToUpdate.photoUrl.trim();
    }

    // Handle previousWeight deletion if cleared
    if ('previousWeight' in fieldsToUpdate && (fieldsToUpdate.previousWeight === '' || fieldsToUpdate.previousWeight === undefined || fieldsToUpdate.previousWeight === null || isNaN(parseFloat(fieldsToUpdate.previousWeight)))) {
      fieldsToUpdate.previousWeight = deleteField();
    } else if (fieldsToUpdate.previousWeight !== undefined && fieldsToUpdate.previousWeight !== '' && !isNaN(parseFloat(fieldsToUpdate.previousWeight))) {
      fieldsToUpdate.previousWeight = parseFloat(fieldsToUpdate.previousWeight);
    }

    // Handle currentWeight deletion if cleared
    if ('currentWeight' in fieldsToUpdate && (fieldsToUpdate.currentWeight === '' || fieldsToUpdate.currentWeight === undefined || fieldsToUpdate.currentWeight === null || isNaN(parseFloat(fieldsToUpdate.currentWeight)))) {
      fieldsToUpdate.currentWeight = deleteField();
    } else if (fieldsToUpdate.currentWeight !== undefined && fieldsToUpdate.currentWeight !== '' && !isNaN(parseFloat(fieldsToUpdate.currentWeight))) {
      fieldsToUpdate.currentWeight = parseFloat(fieldsToUpdate.currentWeight);
    }

    // Handle age deletion if cleared
    if ('age' in fieldsToUpdate && (fieldsToUpdate.age === '' || fieldsToUpdate.age === undefined || fieldsToUpdate.age === null || isNaN(parseFloat(fieldsToUpdate.age)))) {
      fieldsToUpdate.age = deleteField();
    } else if (fieldsToUpdate.age !== undefined && fieldsToUpdate.age !== '' && !isNaN(parseFloat(fieldsToUpdate.age))) {
      fieldsToUpdate.age = parseFloat(fieldsToUpdate.age);
    }

    if (pet && pet.id) {
      const updatedPet = await updatePetService(currentUser.uid, pet.id, fieldsToUpdate);
      setPet(prev => {
        const nextPet = { ...prev, ...updatedPet };
        if (fieldsToUpdate.photoUrl === deleteField()) delete nextPet.photoUrl;
        if (fieldsToUpdate.previousWeight === deleteField()) delete nextPet.previousWeight;
        if (fieldsToUpdate.currentWeight === deleteField()) delete nextPet.currentWeight;
        if (fieldsToUpdate.age === deleteField()) delete nextPet.age;
        return nextPet;
      });
      return updatedPet;
    } else {
      return await createPet(updatedFields);
    }
  };

  // Explicit User Action: Reset Demo Data in Firestore & State
  const resetDemoData = async () => {
    if (currentUser) {
      try {
        setLoading(true);
        setError(null);
        await resetUserLunaData(currentUser.uid);
        const userPets = await getPets(currentUser.uid);
        const activePet = userPets[0] || INITIAL_PET_DATA;
        const userEvents = await getHealthEvents(currentUser.uid, activePet.id);
        setPet(activePet);
        setEvents(userEvents);
      } catch (err) {
        console.error('Error resetting demo data in Firestore:', err);
        setError(err.message || 'Failed to reset demo data in Firestore.');
      } finally {
        setLoading(false);
      }
    } else {
      setPet(INITIAL_PET_DATA);
      setEvents(INITIAL_HEALTH_EVENTS);
    }

    setAiStory(null);
    setInsights([]);
  };

  const [aiStoryLoading, setAiStoryLoading] = useState(false);
  const [aiStoryError, setAiStoryError] = useState(null);

  const fetchAiStory = async (options = {}) => {
    const { forceRefresh = false } = options;

    if (!currentUser || !pet) {
      setAiStory(null);
      setAiStoryLoading(false);
      return null;
    }

    if (aiStory && !forceRefresh) {
      return aiStory;
    }

    try {
      setAiStoryLoading(true);
      setAiStoryError(null);

      const payload = {
        pet: {
          id: pet.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
          age: pet.age,
          currentWeight: pet.currentWeight,
          previousWeight: pet.previousWeight,
          weightUnit: pet.weightUnit || 'kg'
        },
        healthEvents: (events || []).map(evt => {
          const item = {
            id: evt.id,
            date: evt.date || evt.displayDate,
            displayDate: evt.displayDate,
            type: evt.type || evt.category,
            category: evt.category,
            title: evt.title,
            subtitle: evt.subtitle,
            details: evt.details,
            severity: evt.severity
          };
          if (evt.location && typeof evt.location === 'string' && evt.location.trim()) {
            item.location = evt.location.trim();
          }
          if (evt.provider && typeof evt.provider === 'string' && evt.provider.trim()) {
            item.provider = evt.provider.trim();
          }
          return item;
        })
      };

      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to fetch AI story');
      }

      const data = await response.json();
      setAiStory(data);
      return data;
    } catch (err) {
      console.error('[PetContext] Error loading AI Health Story:', err.message);
      setAiStoryError(err.message || "We couldn't generate the health story right now. Please try again.");
      return null;
    } finally {
      setAiStoryLoading(false);
    }
  };

  return (
    <PetContext.Provider value={{
      pet,
      events,
      reminders,
      remindersLoading,
      aiStory,
      aiStoryLoading,
      aiStoryError,
      fetchAiStory,
      insights,
      loading,
      error,
      chatMessages,
      createPet,
      createPetProfile: createPet,
      addHealthEvent,
      updateHealthEvent,
      deleteHealthEvent,
      addReminder,
      updateReminder,
      deleteReminder,
      toggleReminder,
      updatePetProfile,
      resetDemoData,
      sendChatMessage
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet must be used within a PetProvider');
  }
  return context;
};
