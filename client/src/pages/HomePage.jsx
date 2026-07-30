import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Plus, LogIn } from 'lucide-react';
import { generateRandomRoomCode } from '../utils/helpers.js';

export const HomePage = () => {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = (e) => {
    e.preventDefault();
    const newCode = generateRandomRoomCode();
    navigate(`/room/${newCode}`);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (roomCode.trim()) {
      navigate(`/room/${roomCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-6 border border-indigo-500/20">
        <Tv className="w-12 h-12" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl">
        Watch YouTube Videos Together in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">Real Time</span>
      </h1>
      <p className="mt-4 text-lg text-slate-400 max-w-xl">
        Create a watch party room, invite friends, and enjoy perfectly synchronized video playback.
      </p>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <button
          onClick={handleCreateRoom}
          className="flex items-center justify-center space-x-2 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Room</span>
        </button>

        <form onSubmit={handleJoinRoom} className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
            >
              <LogIn className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
