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
        <div className="space-y-3.5">
          {participants.map((participant, index) => {
            const role = participant.role || 'Participant';
            const isHost = role === 'Host';
            const isModerator = role === 'Moderator';
            const isParticipant = role === 'Participant';
            const isCurrentUser =
              participant.username?.toLowerCase() === localUsername?.toLowerCase();

            // Card styling strategy:
            // Host: Subtle gold border, soft amber glow, premium badge.
            // Moderator: Blue accent border, subtle blue glow, moderator badge.
            // Participant: Neutral slate styling.
            // Current User: Indigo ring highlight.
            let cardStyle =
              'p-4 rounded-2xl border transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-indigo-500/40 ';

            if (isHost) {
              cardStyle +=
                'bg-gradient-to-r from-amber-950/25 via-slate-900/90 to-slate-900/90 border-amber-500/40 shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 hover:border-amber-500/60 hover:-translate-y-0.5';
            } else if (isModerator) {
              cardStyle +=
                'bg-gradient-to-r from-blue-950/25 via-slate-900/90 to-slate-900/90 border-blue-500/35 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:border-blue-500/60 hover:-translate-y-0.5';
            } else {
              cardStyle +=
                'bg-slate-900/70 border-slate-800/90 hover:bg-slate-800/80 hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5';
            }

            if (isCurrentUser) {
              cardStyle += ' ring-1 ring-indigo-500/40';
            }

            return (
              <div
                key={participant.socketId || participant.username || index}
                className={cardStyle}
              >
                {/* TOP SECTION: User Avatar, Name & Role Badge */}
                <div className="flex items-center gap-3.5">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg shadow-md shrink-0 transition-transform duration-200 hover:scale-105 select-none ${
                      isHost
                        ? 'bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 shadow-amber-500/30 ring-2 ring-amber-500/40'
                        : isModerator
                        ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-blue-500/30 ring-2 ring-blue-500/40'
                        : 'bg-gradient-to-tr from-slate-700 to-slate-600 text-slate-200 ring-2 ring-slate-700/40'
                    }`}
                  >
                    {participant.username ? participant.username.charAt(0).toUpperCase() : 'U'}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    {/* Line 1: Larger Username & "You" Badge */}
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-base sm:text-lg font-bold text-white truncate leading-tight tracking-tight">
                        {participant.username}
                      </p>
                      {isCurrentUser && (
                        <span className="shrink-0 text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-500/30">
                          You
                        </span>
                      )}
                    </div>

                    {/* Line 2: Role Badge below username */}
                    <div className="flex items-center mt-1">
                      {isHost && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/35 text-amber-300 shadow-sm shadow-amber-500/10">
                          <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          Host
                        </span>
                      )}

                      {isModerator && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/35 text-blue-300 shadow-sm shadow-blue-500/10">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                          Moderator
                        </span>
                      )}

                      {isParticipant && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800/90 border border-slate-700/80 text-slate-300">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Participant
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* BOTTOM SECTION: Admin Host Action Controls */}
                {isCurrentHost && !isHost && (
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-col sm:flex-row flex-wrap gap-2 w-full items-stretch">
                    {isParticipant && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAssignRole(participant.username, 'Moderator')}
                        className="flex-1 min-w-[130px] text-xs py-2 px-3 bg-indigo-950/30 hover:bg-indigo-900/50 text-indigo-300 hover:text-white border border-indigo-500/40 hover:border-indigo-400 font-semibold rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-indigo-500/50 hover:-translate-y-0.5"
                        title="Promote to Moderator"
                        aria-label={`Promote ${participant.username} to Moderator`}
                      >
                        <UserPlus className="w-4 h-4 mr-1.5 text-indigo-400 shrink-0" />
                        Assign Moderator
                      </Button>
                    )}

                    {isModerator && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleAssignRole(participant.username, 'Participant')}
                        className="flex-1 min-w-[130px] text-xs py-2 px-3 bg-blue-950/30 hover:bg-blue-900/50 text-blue-300 hover:text-white border border-blue-500/40 hover:border-blue-400 font-semibold rounded-xl shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 hover:-translate-y-0.5"
                        title="Demote to Participant"
                        aria-label={`Demote ${participant.username} to Participant`}
                      >
                        <UserMinus className="w-4 h-4 mr-1.5 text-blue-400 shrink-0" />
                        Remove Moderator
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleRemoveParticipant(participant.username)}
                      className="flex-1 min-w-[110px] text-xs py-2 px-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold shadow-md shadow-rose-600/20 border border-rose-500/40 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-rose-500/50 hover:-translate-y-0.5"
                      title="Remove User from Room"
                      aria-label={`Remove ${participant.username} from room`}
                    >
                      <Trash2 className="w-4 h-4 mr-1.5 shrink-0" />
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
