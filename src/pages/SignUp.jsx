import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, UserPlus, AlertCircle, RefreshCw } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const SignUp = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError('');
  };

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists. Please log in.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address format.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/network-request-failed':
        return 'Network error. Please verify your internet connection.';
      default:
        return 'Could not create account. Please verify your details and try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please check your password inputs.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await signUp(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Sign up error:', err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center py-8 px-4 sm:px-6 max-w-md sm:max-w-lg mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
            <Heart className="w-7 h-7 fill-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Pet Parent Account</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">Join PetLife AI to manage pet health timelines</p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            id="email"
            type="email"
            placeholder="petparent@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
          />

          <Input
            label="Password (min 6 characters)"
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            icon={Lock}
          />

          <Input
            label="Confirm Password"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={Lock}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            disabled={loading}
            className="shadow-emerald-600/30 py-3.5 text-base font-bold"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                <span>Create Account</span>
              </span>
            )}
          </Button>
        </form>

        {/* Footer Navigation Links */}
        <div className="pt-2 text-center text-xs sm:text-sm text-slate-600 space-y-2">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-emerald-700 hover:underline">
              Log In Instead
            </Link>
          </p>
          <p>
            <Link to="/welcome" className="text-slate-400 hover:text-slate-600">
              ← Back to Welcome Page
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
