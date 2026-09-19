import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign Up function
  const signUp = (email, password) => {
    if (!auth) throw new Error("Firebase Authentication is not configured.");
    return createUserWithEmailAndPassword(auth, (email || '').trim(), password);
  };

  // Login function
  const login = (email, password) => {
    if (!auth) throw new Error("Firebase Authentication is not configured.");
    return signInWithEmailAndPassword(auth, (email || '').trim(), password);
  };

  // Password Reset function
  const resetPassword = (email) => {
    if (!auth) throw new Error("Firebase Authentication is not configured.");
    return sendPasswordResetEmail(auth, (email || '').trim());
  };

  // Logout function
  const logout = () => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  };

  // Listen to Firebase Auth state changes for session persistence
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    try {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user);
        setLoading(false);
      }, (err) => {
        console.warn("Auth state change warning:", err);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn("Auth subscription error:", err);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      signUp,
      login,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
