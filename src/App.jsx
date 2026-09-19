import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PetProvider } from './context/PetContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/common/Header';
import BottomNavigation from './components/common/BottomNavigation';
import ProtectedRoute from './components/common/ProtectedRoute';

// Screen Imports
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import CreateProfile from './pages/CreateProfile';
import Home from './pages/Home';
import AddHealthEvent from './pages/AddHealthEvent';
import HealthTimeline from './pages/HealthTimeline';
import EventDetails from './pages/EventDetails';
import AIHealthStory from './pages/AIHealthStory';
import HealthInsights from './pages/HealthInsights';
import AskPetLifeAI from './pages/AskPetLifeAI';
import PetProfile from './pages/PetProfile';
import Reminders from './pages/Reminders';

function AppLayout() {
  const location = useLocation();
  const hideNav = location.pathname === '/welcome' || location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-[#FAF7F2] antialiased font-sans flex flex-col justify-between text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      {/* Global Application Shell Header */}
      {!hideNav && <Header />}

      {/* Main Responsive Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <Routes>
          {/* Public Unauthenticated Routes */}
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Application Routes */}
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/timeline" element={<ProtectedRoute><HealthTimeline /></ProtectedRoute>} />
          <Route path="/add-event" element={<ProtectedRoute><AddHealthEvent /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/ai-story" element={<ProtectedRoute><AIHealthStory /></ProtectedRoute>} />
          <Route path="/insights" element={<ProtectedRoute><HealthInsights /></ProtectedRoute>} />
          <Route path="/ask-ai" element={<ProtectedRoute><AskPetLifeAI /></ProtectedRoute>} />
          <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><PetProfile /></ProtectedRoute>} />
          <Route path="/create-profile" element={<ProtectedRoute><CreateProfile /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Mobile-Only Bottom Navigation */}
      {!hideNav && <BottomNavigation />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <PetProvider>
        <Router>
          <AppLayout />
        </Router>
      </PetProvider>
    </AuthProvider>
  );
}

export default App;
