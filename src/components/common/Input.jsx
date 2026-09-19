import React from 'react';

export const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-xs font-semibold uppercase tracking-wider text-slate-600 pl-0.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative rounded-2xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        {type === 'textarea' ? (
          <textarea
            id={inputId}
            rows={3}
            className={`w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 ${
              Icon ? 'pl-11' : ''
            } ${error ? 'border-rose-400 ring-1 ring-rose-400' : ''} ${className}`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            id={inputId}
            className={`w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 appearance-none ${
              Icon ? 'pl-11' : ''
            } ${error ? 'border-rose-400 ring-1 ring-rose-400' : ''} ${className}`}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            className={`w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition-all duration-200 ${
              Icon ? 'pl-11' : ''
            } ${error ? 'border-rose-400 ring-1 ring-rose-400' : ''} ${className}`}
            {...props}
          />
        )}
      </div>

      {error && <p className="text-xs text-rose-500 pl-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500 pl-1">{helperText}</p>}
    </div>
  );
};

export default Input;
