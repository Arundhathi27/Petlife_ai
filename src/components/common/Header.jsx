import React from 'react';
import { useNavigate, useLocation, NavLink } from 'react-router-dom';
import { 
  Heart, 
  Sparkles, 
  ChevronLeft, 
  Plus, 
  Home, 
  Calendar, 
  MessageSquareHeart, 
  User,
  Bell
} from 'lucide-react';
import { usePet } from '../../context/PetContext';

export const Header = () => {
  const { pet } = usePet();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const showBack = !isHome && location.pathname !== '/welcome';

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/timeline', label: 'Timeline', icon: Calendar },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/insights', label: 'Insights', icon: Sparkles },
    { to: '/ask-ai', label: 'Ask AI', icon: MessageSquareHeart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-amber-200/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Pet Context */}
        <div className="flex items-center gap-3 shrink-0">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="lg:hidden p-1.5 rounded-xl bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
              title="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5.5 h-5.5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-lg text-slate-900 tracking-tight leading-none">PetLife AI</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900 uppercase tracking-wider">
                  Health
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                {pet ? `${pet.name}'s Health Timeline` : 'Pet Care Timeline'}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Links (Only on Desktop >= 1024px) */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `
                  flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all
                  ${isActive 
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/ai-story')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-100/80 hover:bg-violet-200/80 text-violet-800 text-xs font-bold border border-violet-200/60 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
            <span className="hidden sm:inline">AI Story</span>
          </button>

          <button
            onClick={() => navigate('/add-event')}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-600/30 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            <span>Add Health Event</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
