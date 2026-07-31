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
      {participants.length === 0 ? (
        <div className="text-center py-8 space-y-2">
          <Users className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-sm text-slate-400">No participants in room yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
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
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  isCurrentUser
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/70 border-slate-800/90 hover:bg-slate-800/80 hover:border-slate-700/80 hover:shadow-xl'
                }`}
              >
                {/* TOP SECTION: User Avatar, Name & Role Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    {/* Avatar */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-white text-base shadow-md shrink-0 transition-transform duration-300 hover:scale-105 ${
                        isHost
                          ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 shadow-amber-500/30 ring-2 ring-amber-500/30'
                          : isModerator
                          ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 shadow-blue-500/30 ring-2 ring-blue-500/30'
                          : 'bg-gradient-to-tr from-slate-700 to-slate-600 ring-2 ring-slate-700/30'
                      }`}
                    >
                      {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                    </div>

                    {/* User Info */}
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-base font-bold text-white truncate leading-tight">
                          {participant.username}
                        </p>
                        {isCurrentUser && (
                          <span className="shrink-0 text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                            You
                          </span>
                        )}
                      </div>

                      {/* Role Badge */}
                      <div className="flex items-center">
                        {isHost && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 border border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10">
                            <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            Host
                          </span>
                        )}

                        {isModerator && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/10 border border-blue-500/40 text-blue-300 shadow-sm shadow-blue-500/10">
                            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                            Moderator
                          </span>
                        )}

                        {isParticipant && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800/90 border border-slate-700/80 text-slate-300">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Participant
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: Host Action Controls */}
                {isCurrentHost && !isHost && (
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2 w-full">
                    {isParticipant && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAssignRole(participant.username, 'Moderator')}
                        className="flex-1 text-xs py-2 px-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:text-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
                        title="Promote to Moderator"
                      >
                        <UserPlus className="w-4 h-4 mr-1.5 text-indigo-400" />
                        Assign Moderator
                      </Button>
                    )}

                    {isModerator && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAssignRole(participant.username, 'Participant')}
                        className="flex-1 text-xs py-2 px-3 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 text-slate-300 hover:text-white font-semibold transition-all duration-200 hover:-translate-y-0.5"
                        title="Demote to Participant"
                      >
                        <UserMinus className="w-4 h-4 mr-1.5 text-amber-400" />
                        Remove Moderator
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveParticipant(participant.username)}
                      className="flex-1 text-xs py-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold shadow-md shadow-rose-600/20 border border-rose-500/30 hover:scale-[1.02] transition-all duration-200"
                      title="Remove User from Room"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      Remove User
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default ParticipantList;
