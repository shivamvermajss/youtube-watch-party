import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 py-6 text-center text-sm text-slate-500">
      <div className="max-w-7xl mx-auto px-4">
        <p>YouTube Watch Party &copy; {new Date().getFullYear()} — Real-time Video Synchronization</p>
      </div>
    </footer>
  );
};

export default Footer;
