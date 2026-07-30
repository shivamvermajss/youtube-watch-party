import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-7xl font-extrabold text-indigo-500">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-slate-200">Page Not Found</h2>
      <p className="mt-2 text-slate-400">The requested page does not exist or has been moved.</p>
      <Link
        to="/"
        className="mt-6 flex items-center space-x-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
      >
        <Home className="w-4 h-4" />
        <span>Return Home</span>
      </Link>
    </div>
  );
};
