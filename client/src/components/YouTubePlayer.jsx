import React from 'react';
import YouTube from 'react-youtube';

export const YouTubePlayer = ({ videoId }) => {
  if (!videoId) return null;

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
    },
  };

  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      <YouTube
        videoId={videoId}
        opts={opts}
        className="w-full h-full aspect-video"
        iframeClassName="w-full h-full"
      />
    </div>
  );
};

export default YouTubePlayer;
