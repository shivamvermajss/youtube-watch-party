import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { PlayerPlaceholder } from '../components/PlayerPlaceholder.jsx';
import YouTubePlayer from '../components/YouTubePlayer.jsx';
import HostVideoControls from '../components/HostVideoControls.jsx';
import { getRoomApi } from '../services/api.js';
import socket from '../services/socketService.js';
import { getUserData } from '../utils/helpers.js';
import { Users, Copy, Check, AlertCircle, Crown, Home, Wifi, WifiOff } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketConnecting, setSocketConnecting] = useState(true);
  const [socketError, setSocketError] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 1. Initial Room Details Fetch via REST API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        setError('');
        const res = await getRoomApi(roomId);
        if (res.success && res.data) {
          setRoom(res.data);
          if (res.data.currentVideoId) {
            setCurrentVideoId(res.data.currentVideoId);
          }
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

  // 2. Real-time Socket.IO Connection & Events
  useEffect(() => {
    if (!roomId) return;

    const { username: localUsername } = getUserData();

    if (!localUsername) {
      setSocketError('Display name not found. Please join room with a valid username.');
      setSocketConnecting(false);
      return;
    }

    setSocketConnecting(true);
    setSocketError('');

    // Connect socket if not currently connected
    if (!socket.connected) {
      socket.connect();
    }

    const joinPayload = {
      roomId,
      username: localUsername,
    };

    const handleConnect = () => {
      socket.emit('join-room', joinPayload);
    };

    if (socket.connected) {
      handleConnect();
    } else {
      socket.on('connect', handleConnect);
    }

    // Event: room-joined
    const handleRoomJoined = (data) => {
      setSocketConnecting(false);
      setSocketError('');
      if (data?.success && data?.room) {
        setRoom(data.room);
        if (data.room.currentVideoId) {
          setCurrentVideoId(data.room.currentVideoId);
        }
      }
    };

    // Event: user-joined
    const handleUserJoined = (data) => {
      if (data?.room) {
        setRoom(data.room);
      }
    };

    // Event: user-left
    const handleUserLeft = (data) => {
      if (data?.room) {
        setRoom(data.room);
      }
    };

    // Socket Errors & Disconnection
    const handleSocketError = (err) => {
      setSocketConnecting(false);
      setSocketError(err?.message || 'Socket room error.');
    };

    const handleConnectError = () => {
      setSocketConnecting(false);
      setSocketError('Failed to connect to real-time server.');
    };

    const handleDisconnect = (reason) => {
      if (reason === 'io server disconnect' || reason === 'transport close') {
        setSocketError('Disconnected from watch party server.');
      }
    };

    // Attach listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('error', handleSocketError);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    // Clean up on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('room-joined', handleRoomJoined);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('error', handleSocketError);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);

      socket.emit('leave-room');
      socket.disconnect();
    };
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

  const handleVideoLoaded = (videoId, updatedRoom) => {
    setCurrentVideoId(videoId);
    if (updatedRoom) {
      setRoom(updatedRoom);
    } else {
      setRoom((prev) => (prev ? { ...prev, currentVideoId: videoId } : prev));
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
  const { username: localUsername } = getUserData();
  const currentParticipant = participants.find(
    (p) => p.username?.toLowerCase() === localUsername?.toLowerCase()
  );
  const isHost = currentParticipant?.role === 'Host';

  return (
    <div className="space-y-6">
      {/* Socket Error Alert */}
      {socketError && (
        <div className="flex items-center space-x-2 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-400 text-sm shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium">{socketError}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              Room Code
            </span>
            <h2 className="text-2xl font-bold text-white font-mono tracking-wider">{room.roomId}</h2>
            {socketConnecting ? (
              <span className="inline-flex items-center text-xs text-amber-400 font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                <Loader size="sm" />
                <span className="ml-1">Connecting...</span>
              </span>
            ) : socketError ? (
              <span className="inline-flex items-center text-xs text-rose-400 font-medium px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </span>
            ) : (
              <span className="inline-flex items-center text-xs text-emerald-400 font-medium px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400">Share this code with your friends to watch together in real time.</p>
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
        {/* Main Player Area & Host Controls */}
        <div className="lg:col-span-2 space-y-4">
          {currentVideoId ? (
            <YouTubePlayer videoId={currentVideoId} />
          ) : (
            <PlayerPlaceholder />
          )}

          {isHost && (
            <HostVideoControls
              roomId={room.roomId}
              onVideoLoaded={handleVideoLoaded}
            />
          )}

          <Card
            title="Now Playing"
            subtitle={currentVideoId ? `Video ID: ${currentVideoId}` : 'No video currently playing'}
          >
            <p className="text-sm text-slate-400">
              {currentVideoId
                ? 'Video loaded into player.'
                : 'Host can paste a YouTube URL to load video for all participants.'}
            </p>
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
                const participantIsHost = participant.role === 'Host';
                const isCurrentUser = participant.username?.toLowerCase() === localUsername?.toLowerCase();
                return (
                  <div
                    key={participant.socketId || index}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      isCurrentUser
                        ? 'bg-indigo-950/30 border-indigo-500/30'
                        : 'bg-slate-800/50 border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs ${
                          participantIsHost ? 'bg-indigo-600' : 'bg-slate-700'
                        }`}
                      >
                        {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white flex items-center gap-1.5">
                          {participant.username}
                          {isCurrentUser && <span className="text-[10px] text-indigo-400 font-normal">(You)</span>}
                          {participantIsHost && <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {participantIsHost ? 'Room Admin' : 'Participant'}
                        </p>
                      </div>
                    </div>
                    {participantIsHost && (
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
