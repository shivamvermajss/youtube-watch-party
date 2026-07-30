import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Tv, PlusCircle, LogIn } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 text-indigo-400 font-bold text-xl hover:text-indigo-300 transition-colors">
          <div className="p-2 bg-indigo-600/20 rounded-lg text-indigo-400">
            <Tv className="w-6 h-6" />
          </div>
          <span className="tracking-tight text-white">Watch<span className="text-indigo-400">Party</span></span>
        </Link>
        <nav className="flex items-center space-x-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Room</span>
          </NavLink>
          <NavLink
            to="/join"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                isActive
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <LogIn className="w-4 h-4" />
            <span>Join Room</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
