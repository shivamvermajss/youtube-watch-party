import React from 'react';

export const PlayerSkeleton = () => {
  return (
    <div className="w-full aspect-video bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 animate-pulse shadow-2xl relative overflow-hidden">
      <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50" />
      <div className="w-48 h-5 bg-slate-800/80 rounded-lg" />
      <div className="w-64 h-4 bg-slate-800/60 rounded-md" />
    </div>
  );
};

export const ParticipantSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 animate-pulse flex items-center justify-between gap-3"
        >
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-11 h-11 rounded-full bg-slate-800/80 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="w-28 h-4 bg-slate-800/80 rounded-md" />
              <div className="w-16 h-3.5 bg-slate-800/60 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const PlaybackInfoSkeleton = () => {
  return (
    <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4 animate-pulse">
      <div className="w-32 h-5 bg-slate-800/80 rounded-md" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
          <div className="w-16 h-3 bg-slate-800/60 rounded" />
          <div className="w-24 h-4 bg-slate-800/80 rounded" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
          <div className="w-24 h-3 bg-slate-800/60 rounded" />
          <div className="w-20 h-4 bg-slate-800/80 rounded" />
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 space-y-2">
          <div className="w-16 h-3 bg-slate-800/60 rounded" />
          <div className="w-16 h-4 bg-slate-800/80 rounded" />
        </div>
      </div>
    </div>
  );
};

export const RoomSkeleton = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto py-4">
      {/* Header Skeleton */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 animate-pulse flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-20 h-6 bg-slate-800/80 rounded-full" />
            <div className="w-32 h-8 bg-slate-800/80 rounded-xl" />
            <div className="w-24 h-6 bg-slate-800/80 rounded-full" />
          </div>
          <div className="w-64 h-3.5 bg-slate-800/60 rounded" />
        </div>
        <div className="w-28 h-9 bg-slate-800/80 rounded-xl shrink-0" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <PlayerSkeleton />
          <PlaybackInfoSkeleton />
        </div>
        <div className="space-y-4">
          <div className="p-6 bg-slate-900/80 border border-slate-800/80 rounded-2xl space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-32 h-5 bg-slate-800/80 rounded" />
              <div className="w-5 h-5 bg-slate-800/80 rounded-full" />
            </div>
            <ParticipantSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  PlayerSkeleton,
  ParticipantSkeleton,
  PlaybackInfoSkeleton,
  RoomSkeleton,
};
