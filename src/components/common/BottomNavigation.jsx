import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Sparkles, MessageSquareHeart, User, Bell } from 'lucide-react';

export const BottomNavigation = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/timeline', label: 'Timeline', icon: Calendar },
    { to: '/reminders', label: 'Reminders', icon: Bell },
    { to: '/insights', label: 'Insights', icon: Sparkles },
    { to: '/ask-ai', label: 'Ask AI', icon: MessageSquareHeart },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg shadow-amber-900/10">
      <div className="flex items-center justify-around px-2 py-2 max-w-md md:max-w-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `
                flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 min-w-[60px]
                ${isActive 
                  ? 'text-emerald-700 font-bold bg-emerald-50 scale-105 shadow-sm shadow-emerald-900/5' 
                  : 'text-slate-600 font-medium hover:text-slate-800 hover:bg-slate-50'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'stroke-[2.5px] scale-110' : 'stroke-[1.75px]'}`} />
                  <span className="text-[11px] tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
