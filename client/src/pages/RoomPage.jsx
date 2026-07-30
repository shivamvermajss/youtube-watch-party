import React from 'react';
import { useParams } from 'react-router-dom';
import { PlayerPlaceholder } from '../components/PlayerPlaceholder.jsx';
import { ParticipantListPlaceholder } from '../components/ParticipantListPlaceholder.jsx';
import { Copy } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white">Watch Room</h2>
          <p className="text-sm text-slate-400">Room Code: <span className="font-mono text-indigo-400 font-semibold">{roomId}</span></p>
        </div>
        <button
          onClick={handleCopyCode}
          className="self-start sm:self-auto flex items-center space-x-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm transition-colors"
        >
          <Copy className="w-4 h-4" />
          <span>Copy Room Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlayerPlaceholder />
        </div>
        <div>
          <ParticipantListPlaceholder />
        </div>
      </div>
    </div>
  );
};
