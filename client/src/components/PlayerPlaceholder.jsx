import React from 'react';
import { Play } from 'lucide-react';

export const PlayerPlaceholder = () => {
  return (
    <div className="w-full aspect-video bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-xl">
      <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
        <Play className="w-8 h-8 fill-current ml-1" />
      </div>
      <h3 className="text-lg font-semibold text-slate-200">YouTube Player Container</h3>
      <p className="text-sm text-slate-400 max-w-md mt-1">
        Player component placeholder. Real-time video player synchronization will be implemented in future phases.
      </p>
    </div>
  );
};
