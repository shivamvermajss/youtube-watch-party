import React, { useState } from 'react';
import Card from '../components/Card.jsx';
import Input from '../components/Input.jsx';
import Button from '../components/Button.jsx';
import { LogIn, Users } from 'lucide-react';

export const JoinRoomPage = () => {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');

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
        <div className="space-y-4">
          <Input
            label="Room Code"
            placeholder="Enter 6-character room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
          />

          <Input
            label="Your Display Name"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <Button variant="primary" size="lg" className="w-full">
            <LogIn className="w-5 h-5 mr-2" />
            Join Room
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default JoinRoomPage;
