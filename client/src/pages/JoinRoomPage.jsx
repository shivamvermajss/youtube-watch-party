import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { joinRoomApi } from '../services/api.js';
import { saveUserData, getUserData } from '../utils/helpers.js';
import { LogIn, Users, AlertCircle } from 'lucide-react';

export const JoinRoomPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = getUserData();
    if (saved.username) {
      setUsername(saved.username);
    }
  }, []);

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedCode = roomCode.trim().toUpperCase();
    const trimmedName = username.trim();

    if (!trimmedCode) {
      setError('Please enter a room code.');
      return;
    }

    if (!trimmedName) {
      setError('Please enter a display name.');
      return;
    }

    try {
      setLoading(true);
      const res = await joinRoomApi(trimmedCode, trimmedName);

      if (res.success && res.data?.roomId) {
        saveUserData(trimmedName, res.data.roomId);
        navigate(`/room/${res.data.roomId}`);
      } else {
        setError(res.message || 'Failed to join room. Please check the room code.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to join room. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4 border border-indigo-500/20">
          <Users className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Join Watch Party
        </h1>
        <p className="mt-2 text-slate-400">
          Enter an existing room code to join your friends.
        </p>
      </div>

      <Card title="Join Room" subtitle="Enter your details to enter the room">
        <form onSubmit={handleJoinRoom} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Room Code"
            placeholder="Enter 6-character room code"
            value={roomCode}
            onChange={(e) => {
              setRoomCode(e.target.value.toUpperCase());
              if (error) setError('');
            }}
            required
            disabled={loading}
          />

          <Input
            label="Your Display Name"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError('');
            }}
            required
            disabled={loading}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <Loader size="sm" text="Joining Room..." />
            ) : (
              <>
                <LogIn className="w-5 h-5 mr-2" />
                Join Room
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default JoinRoomPage;
