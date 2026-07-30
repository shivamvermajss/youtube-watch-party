import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import Loader from '../components/Loader.jsx';
import { createRoomApi } from '../services/api.js';
import { saveUserData, getUserData } from '../utils/helpers.js';
import { Tv, Plus, Sparkles, AlertCircle } from 'lucide-react';

export const HomePage = () => {
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

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = username.trim();
    if (!trimmedName) {
      setError('Please enter a display name.');
      return;
    }

    try {
      setLoading(true);
      const res = await createRoomApi(trimmedName);

      if (res.success && res.data?.roomId) {
        const createdRoomId = res.data.roomId;
        saveUserData(trimmedName, createdRoomId);
        navigate(`/room/${createdRoomId}`);
      } else {
        setError(res.message || 'Failed to create room. Please try again.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Server error. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 mb-4 border border-indigo-500/20">
          <Tv className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Create Watch Party Room
        </h1>
        <p className="mt-2 text-slate-400">
          Start a new room and invite your friends to watch YouTube videos together.
        </p>
      </div>

      <Card title="Room Details" subtitle="Set up your watch party session">
        <form onSubmit={handleCreateRoom} className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <Input
            label="Your Display Name"
            placeholder="Enter your name (e.g., Alex)"
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
              <Loader size="sm" text="Creating Room..." />
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create New Room
              </>
            )}
          </Button>

          <div className="pt-2 text-center text-xs text-slate-500 flex items-center justify-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Room code will be generated automatically</span>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default HomePage;
