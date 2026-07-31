import React from 'react';
import Card from './Card.jsx';
import Button from './Button.jsx';
import { Users, Crown, ShieldCheck, User, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import socket from '../services/socketService.js';

export const ParticipantList = ({ roomId, participants = [], localUsername = '' }) => {
  const currentParticipant = participants.find(
    (p) => p.username?.toLowerCase() === localUsername?.toLowerCase()
  );
  const isCurrentHost = currentParticipant?.role === 'Host';

  const handleAssignRole = (targetUsername, role) => {
    socket.emit('assign-role', {
      roomId,
      targetUsername,
      role,
      username: localUsername,
    });
  };

  const handleRemoveParticipant = (targetUsername) => {
    socket.emit('remove-participant', {
      roomId,
      targetUsername,
      username: localUsername,
    });
  };

  return (
    <Card
      title={`Participants (${participants.length})`}
      headerAction={<Users className="w-5 h-5 text-indigo-400" />}
    >
      <div className="space-y-3">
        {participants.map((participant, index) => {
          const role = participant.role || 'Participant';
          const isHost = role === 'Host';
          const isModerator = role === 'Moderator';
          const isParticipant = role === 'Participant';
          const isCurrentUser =
            participant.username?.toLowerCase() === localUsername?.toLowerCase();

          return (
            <div
              key={participant.socketId || participant.username || index}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                isCurrentUser
                  ? 'bg-indigo-950/40 border-indigo-500/40 shadow-sm shadow-indigo-500/5'
                  : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-700/80'
              }`}
            >
              {/* User Avatar & Info */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-inner transition-transform duration-200 hover:scale-105 ${
                    isHost
                      ? 'bg-gradient-to-tr from-amber-600 to-yellow-500 shadow-amber-500/20'
                      : isModerator
                      ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 shadow-blue-500/20'
                      : 'bg-slate-700'
                  }`}
                >
                  {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <span>{participant.username}</span>
                    {isCurrentUser && (
                      <span className="text-[11px] text-indigo-400 font-normal">(You)</span>
                    )}
                  </p>

                  {/* Premium Role Badge */}
                  <div className="flex items-center gap-1">
                    {isHost && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 shadow-sm">
                        <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                        Host
                      </span>
                    )}

                    {isModerator && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300 shadow-sm">
                        <ShieldCheck className="w-3 h-3 text-blue-400" />
                        Moderator
                      </span>
                    )}

                    {isParticipant && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 border border-slate-700 text-slate-300">
                        <User className="w-3 h-3 text-slate-400" />
                        Participant
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons for Host */}
              {isCurrentHost && !isHost && (
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {isParticipant && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleAssignRole(participant.username, 'Moderator')}
                      className="text-xs py-1 px-2.5 bg-blue-600/20 hover:bg-blue-600/30 border-blue-500/30 text-blue-300 hover:text-white"
                      title="Promote to Moderator"
                    >
                      <UserPlus className="w-3.5 h-3.5 mr-1 text-blue-400" />
                      Assign Moderator
                    </Button>
                  )}

                  {isModerator && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssignRole(participant.username, 'Participant')}
                      className="text-xs py-1 px-2.5 border-slate-600/60 hover:bg-slate-700/50 text-slate-300"
                      title="Demote to Participant"
                    >
                      <UserMinus className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      Remove Moderator
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleRemoveParticipant(participant.username)}
                    className="text-xs py-1 px-2.5 bg-rose-600/20 hover:bg-rose-600/30 border-rose-500/30 text-rose-300 hover:text-white"
                    title="Remove User from Room"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Remove User
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default ParticipantList;
