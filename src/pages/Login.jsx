import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, Mail, Lock, LogIn, AlertCircle, CheckCircle, RefreshCw, KeyRound, ArrowLeft } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export const Login = () => {
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [resetEmail, setResetEmail] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError('');
    if (successMsg) setSuccessMsg('');
  };

  const getFriendlyErrorMessage = (err) => {
    if (!err) return 'An error occurred. Please try again.';
    const code = err.code || '';
    const message = err.message || '';

    switch (code) {
      case 'auth/user-not-found':
        return 'No account found with this email address. Please check your email or sign up.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please check your login credentials.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address format.';
      case 'auth/missing-email':
        return 'Please enter your email address.';
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        // Expose code & message if unhandled
        if (code) return `Firebase error (${code}): ${message || 'Please check input.'}`;
        return message || 'An error occurred. Please try again.';
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const cleanEmail = (formData.email || '').trim();
    if (!cleanEmail || !formData.password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setError('');
      setSuccessMsg('');
      setLoading(true);
      await login(cleanEmail, formData.password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = (resetEmail || formData.email || '').trim();

    if (!targetEmail) {
      setError('Please enter your email address to receive password reset instructions.');
      return;
    }

    try {
      setError('');
      setSuccessMsg('');
      setLoading(true);
      await resetPassword(targetEmail);
      setSuccessMsg('Password reset email sent. Check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(getFriendlyErrorMessage(err));
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
            {isResetMode ? <KeyRound className="w-7 h-7" /> : <Heart className="w-7 h-7 fill-white" />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {isResetMode ? 'Reset Your Password' : 'Welcome Back'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {isResetMode 
              ? 'Enter your account email to receive a password reset link' 
              : "Log in to access Luna's PetLife AI Health Timeline"}
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-start gap-2.5 animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Notification Banner */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-2.5 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode 1: Standard Login Form */}
        {!isResetMode ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
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

            <div>
              <Input
                label="Password"
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                icon={Lock}
              />
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(formData.email);
                    setError('');
                    setSuccessMsg('');
                    setIsResetMode(true);
                  }}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

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
                  <span>Logging in...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  <span>Log In</span>
                </span>
              )}
            </Button>
          </form>
        ) : (
          /* Mode 2: Password Reset Request Form */
          <form onSubmit={handleResetSubmit} className="space-y-4">
            <Input
              label="Account Email Address"
              id="resetEmail"
              type="email"
              placeholder="petparent@example.com"
              value={resetEmail}
              onChange={(e) => {
                setResetEmail(e.target.value);
                if (error) setError('');
                if (successMsg) setSuccessMsg('');
              }}
              required
              icon={Mail}
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
                  <span>Sending Reset Email...</span>
                </span>
              ) : (
                <span>Send Reset Email</span>
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setSuccessMsg('');
                setIsResetMode(false);
              }}
              className="w-full text-center text-xs font-bold text-slate-600 hover:text-slate-800 py-2 flex items-center justify-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Login</span>
            </button>
          </form>
        )}

        {/* Footer Navigation Links */}
        <div className="pt-2 text-center text-xs sm:text-sm text-slate-600 space-y-2">
          <p>
            {"Don't have an account yet? "}
            <Link to="/signup" className="font-bold text-emerald-700 hover:underline">
              Create an Account
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

export default Login;
