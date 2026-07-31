import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Tv, PlusCircle, LogIn } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50 shadow-lg shadow-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-3 text-indigo-400 font-bold text-xl hover:opacity-90 transition-opacity group"
        >
          <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <Tv className="w-5 h-5" />
          </div>
          <span className="tracking-tight text-white font-extrabold text-lg sm:text-xl">
            Watch<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Party</span>
          </span>
        </Link>

        <nav className="flex items-center space-x-2 sm:space-x-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`
            }
          >
            <PlusCircle className="w-4 h-4 text-indigo-400" />
            <span>Create Room</span>
          </NavLink>

          <NavLink
            to="/join"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
              }`
            }
          >
            <LogIn className="w-4 h-4 text-purple-400" />
            <span>Join Room</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
