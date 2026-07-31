import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { PlayerPlaceholder } from '../components/PlayerPlaceholder.jsx';
import YouTubePlayer from '../components/YouTubePlayer.jsx';
import HostVideoControls from '../components/HostVideoControls.jsx';
import ParticipantList from '../components/ParticipantList.jsx';
import { getRoomApi } from '../services/api.js';
import socket from '../services/socketService.js';
import { getUserData } from '../utils/helpers.js';
import { canControlPlayback } from '../utils/permissions.js';
import { AlertCircle, Home, Wifi, WifiOff, Copy, Check } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [socketConnecting, setSocketConnecting] = useState(true);
  const [socketError, setSocketError] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const playerRef = useRef(null);
  const isSyncingRef = useRef(false);
  const initialAppliedRef = useRef(false);
  const lastTimeRef = useRef(0);
  const pendingPlaybackStateRef = useRef(null);

  const applyRoomPlaybackState = (roomData, player) => {
    if (!roomData || !player) return;

    const { currentTime, isPlaying } = roomData;

    isSyncingRef.current = true;

    try {
      if (typeof currentTime === "number" && currentTime > 0) {
        player.seekTo(currentTime, true);
      }

      setTimeout(() => {
        try {
          if (isPlaying) {
            player.playVideo();
            setTimeout(() => { isSyncingRef.current = false; }, 300);
          } else {
            player.playVideo();
            setTimeout(() => {
              player.pauseVideo();
              isSyncingRef.current = false;
            }, 400);
          }
        } catch (e) {
          isSyncingRef.current = false;
        }
      }, 300);

    } catch (err) {
      console.error(err);
      isSyncingRef.current = false;
    }
  };

  const applyPendingPlaybackState = () => {
    if (!playerRef.current || !pendingPlaybackStateRef.current) return;

    const { currentTime, isPlaying } = pendingPlaybackStateRef.current;

    isSyncingRef.current = true;

    try {
      if (
        typeof currentTime === "number" &&
        typeof playerRef.current.seekTo === "function"
      ) {
        playerRef.current.seekTo(currentTime, true);
      }

      setTimeout(() => {
        try {
          if (!playerRef.current) return;

          if (isPlaying) {
            playerRef.current.playVideo();

            setTimeout(() => {
              const state = playerRef.current?.getPlayerState?.();

              if (state !== 1) {
                playerRef.current.playVideo();
              }

              isSyncingRef.current = false;
              pendingPlaybackStateRef.current = null;
            }, 500);

          } else {
            playerRef.current.playVideo();
            setTimeout(() => {
              playerRef.current.pauseVideo();
              isSyncingRef.current = false;
              pendingPlaybackStateRef.current = null;
            }, 400);
          }
        } catch (err) {
          console.error(err);
          isSyncingRef.current = false;
        }
      }, 500);

    } catch (err) {
      console.error(err);
      isSyncingRef.current = false;
    }
  };

  // 1. Initial Room Details Fetch via REST API
  useEffect(() => {
    const fetchRoomDetails = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        setError('');
        const res = await getRoomApi(roomId);
        if (res.success && res.data) {
          const { username: localUsername } = getUserData();
          const isRemoved =
            Array.isArray(res.data.removedParticipants) &&
            res.data.removedParticipants.some(
              (name) => name.toLowerCase() === localUsername?.toLowerCase()
            );

          if (isRemoved) {
            setRoom(null);
            setError('You have been removed from this room by the host.');
            return;
          }

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

  // 2. Real-time Socket.IO Connection & Event Listeners
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
      setSocketError("");

      if (data?.success && data?.room) {
        initialAppliedRef.current = false;
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

    // Event: role-assigned
    const handleRoleAssigned = (data) => {
      if (data?.participants) {
        setRoom((prev) => (prev ? { ...prev, participants: data.participants } : prev));
      } else if (data?.room) {
        setRoom(data.room);
      }
    };

    // Event: participant-removed
    const handleParticipantRemoved = (data) => {
      const { username: currentUsername } = getUserData();
      if (data?.username?.toLowerCase() === currentUsername?.toLowerCase()) {
        setSocketError('You have been removed from the room by the host.');
        setRoom(null);
        setError('You have been removed from this room by the host.');
        return;
      }
      if (data?.participants) {
        setRoom((prev) => (prev ? { ...prev, participants: data.participants } : prev));
      } else if (data?.room) {
        setRoom(data.room);
      }
    };

    // Event: room-access-denied
    const handleRoomAccessDenied = (data) => {
      const msg = data?.message || 'You have been removed from this room by the host.';
      setSocketConnecting(false);
      setSocketError(msg);
      setRoom(null);
      setError(msg);
    };

    // Event: request-playback-state (Host receives this when a new participant joins/refreshes)
    const handleRequestPlaybackState = (data) => {
      if (!data?.requesterSocketId) return;

      const curTime = playerRef.current?.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
      const playerState = playerRef.current?.getPlayerState ? playerRef.current.getPlayerState() : -1;
      const isPlaying = playerState === 1;

      socket.emit('playback-state', {
        roomId,
        requesterSocketId: data.requesterSocketId,
        currentVideoId,
        currentTime: curTime,
        isPlaying,
      });
    };

    const handleSyncPlaybackState = (data) => {
      if (!data) return;

      const {
        currentVideoId: syncVideoId,
        currentTime,
        isPlaying,
      } = data;

      pendingPlaybackStateRef.current = {
        currentTime,
        isPlaying,
      };

      initialAppliedRef.current = false;

      if (syncVideoId && syncVideoId !== currentVideoId) {
        setCurrentVideoId(syncVideoId);
        return;
      }

      applyPendingPlaybackState();
    };

    // Event: video-changed
    const handleVideoChanged = (data) => {
      if (!data?.videoId) return;

      pendingPlaybackStateRef.current = {
        currentTime: data.currentTime || 0,
        isPlaying: data.isPlaying,
      };

      initialAppliedRef.current = false;
      setCurrentVideoId(data.videoId);
    };

    // Event: sync-play
    const handleSyncPlay = (data) => {
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        isSyncingRef.current = true;
        try {
          if (data?.currentTime !== undefined && typeof playerRef.current.seekTo === 'function') {
            const curTime = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
            if (Math.abs(curTime - data.currentTime) >= 1.0) {
              playerRef.current.seekTo(data.currentTime, true);
            }
          }
          playerRef.current.playVideo();
        } catch (err) {
          console.error('Failed to sync play video:', err);
        }
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 500);
      }
    };

    // Event: sync-pause
    const handleSyncPause = (data) => {
      if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
        isSyncingRef.current = true;
        try {
          if (data?.currentTime !== undefined && typeof playerRef.current.seekTo === 'function') {
            const curTime = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
            if (Math.abs(curTime - data.currentTime) >= 1.0) {
              playerRef.current.seekTo(data.currentTime, true);
            }
          }
          playerRef.current.pauseVideo();
        } catch (err) {
          console.error('Failed to sync pause video:', err);
        }
        setTimeout(() => {
          isSyncingRef.current = false;
        }, 500);
      }
    };

    // Event: sync-seek
    const handleSyncSeek = (data) => {
      if (!data || data.currentTime === undefined) return;
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        const curTime = playerRef.current.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
        if (Math.abs(curTime - data.currentTime) >= 1.0) {
          isSyncingRef.current = true;
          try {
            playerRef.current.seekTo(data.currentTime, true);
            if (data.isPlaying) {
              playerRef.current.playVideo();
            } else {
              playerRef.current.pauseVideo();
            }
          } catch (err) {
            console.error('Failed to sync seek:', err);
          }
          setTimeout(() => {
            isSyncingRef.current = false;
          }, 500);
        }
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
    socket.on('role-assigned', handleRoleAssigned);
    socket.on('participant-removed', handleParticipantRemoved);
    socket.on('room-access-denied', handleRoomAccessDenied);
    socket.on('request-playback-state', handleRequestPlaybackState);
    socket.on('sync-playback-state', handleSyncPlaybackState);
    socket.on('video-changed', handleVideoChanged);
    socket.on('sync-play', handleSyncPlay);
    socket.on('sync-pause', handleSyncPause);
    socket.on('sync-seek', handleSyncSeek);
    socket.on('error', handleSocketError);
    socket.on('connect_error', handleConnectError);
    socket.on('disconnect', handleDisconnect);

    // Clean up on unmount
    return () => {
      socket.off('connect', handleConnect);
      socket.off('room-joined', handleRoomJoined);
      socket.off('user-joined', handleUserJoined);
      socket.off('user-left', handleUserLeft);
      socket.off('role-assigned', handleRoleAssigned);
      socket.off('participant-removed', handleParticipantRemoved);
      socket.off('room-access-denied', handleRoomAccessDenied);
      socket.off('request-playback-state', handleRequestPlaybackState);
      socket.off('sync-playback-state', handleSyncPlaybackState);
      socket.off('video-changed', handleVideoChanged);
      socket.off('sync-play', handleSyncPlay);
      socket.off('sync-pause', handleSyncPause);
      socket.off('sync-seek', handleSyncSeek);
      socket.off('error', handleSocketError);
      socket.off('connect_error', handleConnectError);
      socket.off('disconnect', handleDisconnect);

      socket.emit('leave-room');
      socket.disconnect();
    };
  }, [roomId]);

  const participants = room?.participants || [];
  const { username: localUsername } = getUserData();
  const currentParticipant = participants.find(
    (p) => p.username?.toLowerCase() === localUsername?.toLowerCase()
  );
  const isHost = currentParticipant?.role === 'Host';
  const canControl = canControlPlayback(currentParticipant?.role);

  // 3. Host Playback Heartbeat & Seek Detection (every 2.5 seconds)
  useEffect(() => {
    if (!isHost || !roomId) return;
    const { username: localUsername } = getUserData();

    const intervalId = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;

      try {
        const currentTime = playerRef.current.getCurrentTime();
        const playerState = playerRef.current.getPlayerState ? playerRef.current.getPlayerState() : -1;
        const isPlaying = playerState === 1;

        const diff = Math.abs(currentTime - lastTimeRef.current);
        if (diff > 1.5 && !isSyncingRef.current) {
          socket.emit('host-seek', {
            roomId,
            username: localUsername,
            currentTime,
          });
        }

        lastTimeRef.current = currentTime;

        socket.emit('playback-state-update', {
          roomId,
          username: localUsername,
          currentTime,
          isPlaying,
        });
      } catch (err) {
        // Player might not be ready yet
      }
    }, 2500);

    return () => clearInterval(intervalId);
  }, [isHost, roomId]);

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
    initialAppliedRef.current = false;
    if (updatedRoom) {
      setRoom(updatedRoom);
    } else {
      setRoom((prev) => (prev ? { ...prev, currentVideoId: videoId, currentTime: 0, isPlaying: true } : prev));
    }
    const { username: localUsername } = getUserData();
    socket.emit('host-video-change', {
      roomId,
      username: localUsername,
      videoId,
      currentTime: 0,
      isPlaying: true,
    });
  };

  // YouTube Player Event Handlers
  const handlePlayerReady = (event) => {
    playerRef.current = event.target;

    if (pendingPlaybackStateRef.current) {
      applyPendingPlaybackState();
      initialAppliedRef.current = true;
      return;
    }

    if (room && !initialAppliedRef.current) {
      applyRoomPlaybackState(room, event.target);
      initialAppliedRef.current = true;
    }
  };

  const handlePlayerPlay = () => {
    if (isSyncingRef.current) return;

    if (!canControl) {
      isSyncingRef.current = true;
      playerRef.current?.pauseVideo();

      setTimeout(() => {
        isSyncingRef.current = false;
      }, 300);

      return;
    }

    const curTime = playerRef.current?.getCurrentTime
      ? playerRef.current.getCurrentTime()
      : 0;

    socket.emit("host-play", {
      roomId,
      username: localUsername,
      currentTime: curTime,
    });
  };

  const handlePlayerPause = () => {
    if (isSyncingRef.current) return;
    if (canControl) {
      const curTime = playerRef.current?.getCurrentTime ? playerRef.current.getCurrentTime() : 0;
      socket.emit('host-pause', { roomId, username: localUsername, currentTime: curTime });
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
          <h2 className="text-xl font-bold text-white mb-2">
            {error?.includes('removed') ? 'Access Denied' : 'Room Not Found'}
          </h2>
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
        {/* Main Player Area & Host/Moderator Controls */}
        <div className="lg:col-span-2 space-y-4">
          {currentVideoId ? (
            <YouTubePlayer
              videoId={currentVideoId}
              onReady={handlePlayerReady}
              onPlay={handlePlayerPlay}
              onPause={handlePlayerPause}
            />
          ) : (
            <PlayerPlaceholder />
          )}

          {canControl && (
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
                : 'Host and Moderators can paste a YouTube URL to load video for all participants.'}
            </p>
          </Card>
        </div>

        {/* Sidebar / Participants */}
        <div className="space-y-4">
          <ParticipantList
            roomId={room.roomId}
            participants={participants}
            localUsername={localUsername}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomPage;