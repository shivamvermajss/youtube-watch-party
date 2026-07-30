import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Users } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-indigo-400 font-bold text-xl hover:text-indigo-300 transition-colors">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
            <Tv className="w-6 h-6" />
          </div>
          <span>WatchParty</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/room/demo"
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Demo Room</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
