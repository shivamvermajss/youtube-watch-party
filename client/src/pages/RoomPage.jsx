import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { getRoomApi } from '../services/api.js';
import { Users, Play, Copy, Check, AlertCircle, Crown, Home } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        setError('');
        const res = await getRoomApi(roomId);
        if (res.success && res.data) {
          setRoom(res.data);
        } else {
          setError(res.message || 'Room not found.');
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message || 'Failed to load room details.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  const handleCopyCode = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room code:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading room details..." />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="max-w-md mx-auto py-12 text-center">
        <Card className="border-rose-500/30">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Room Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">{error || 'The requested watch party room does not exist.'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/">
              <Button variant="primary" className="w-full sm:w-auto">
                <Home className="w-4 h-4 mr-2" />
                Create Room
              </Button>
            </Link>
            <Link to="/join">
              <Button variant="secondary" className="w-full sm:w-auto">
                Join Another Room
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const participants = room.participants || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Room Code
            </span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider">{room.roomId}</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">Share this code with your friends to watch together.</p>
        </div>
        <Button
          onClick={handleCopyCode}
          variant={copied ? 'outline' : 'secondary'}
          size="sm"
          className="self-start sm:self-auto min-w-[120px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              <span>Copy Code</span>
            </>
          )}
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

        {/* Sidebar / Participants */}
        <div className="space-y-4">
          <Card
            title={`Participants (${participants.length})`}
            headerAction={<Users className="w-5 h-5 text-indigo-400" />}
          >
            <div className="space-y-3">
              {participants.map((participant, index) => {
                const isHost = participant.role === 'Host';
                return (
                  <div
                    key={participant.socketId || index}
                    className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-800/80"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                          isHost ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-1.5">
                          {participant.username}
                          {isHost && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {isHost ? 'Room Admin' : 'Participant'}
                        </p>
                      </div>
                    </div>
                    {isHost && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Host
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
