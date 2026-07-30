import React from 'react';

export const Card = ({ children, title, subtitle, className = '', headerAction }) => {
  return (
    <div className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="mb-6 flex items-start justify-between">
          <div>
            {title && <h3 className="text-xl font-bold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
