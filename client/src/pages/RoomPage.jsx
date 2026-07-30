import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import { Users, Play, Copy } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Room
            </span>
            <h2 className="text-xl font-bold text-white font-mono">{roomId || 'ROOM_ID'}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Share this code with your friends to watch together.</p>
        </div>
        <Button variant="secondary" size="sm" className="self-start sm:self-auto">
          <Copy className="w-4 h-4 mr-2" />
          Copy Code
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Player Area Placeholder */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="aspect-video flex flex-col items-center justify-center bg-slate-950 border-dashed border-slate-800">
            <div className="p-4 bg-indigo-600/10 rounded-full text-indigo-400 mb-3">
              <Play className="w-10 h-10" />
            </div>
            <p className="text-slate-400 font-medium">YouTube Video Player Placeholder</p>
            <p className="text-xs text-slate-500 mt-1">Video playback integration will be added in future phases.</p>
          </Card>

          <Card title="Now Playing" subtitle="No video currently playing">
            <p className="text-sm text-slate-400">Host can paste a YouTube URL to load video for all participants.</p>
          </Card>
        </div>

        {/* Sidebar / Participants Placeholder */}
        <div className="space-y-4">
          <Card title="Participants" headerAction={<Users className="w-5 h-5 text-indigo-400" />}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                    H
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Host (You)</p>
                    <p className="text-[10px] text-indigo-400">Room Admin</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
