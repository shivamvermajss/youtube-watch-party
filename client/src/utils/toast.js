import toast from 'react-hot-toast';

/**
 * Custom Toast Notifications for YouTube Watch Party
 */
export const notify = {
  success: (msg) =>
    toast.success(msg, {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.15)',
      },
    }),

  error: (msg) =>
    toast.error(msg, {
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(244, 63, 94, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(244, 63, 94, 0.15)',
      },
    }),

  info: (msg) =>
    toast(msg, {
      icon: 'ℹ️',
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(99, 102, 241, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.15)',
      },
    }),

  crown: (msg) =>
    toast(msg, {
      icon: '👑',
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(245, 158, 11, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.15)',
      },
    }),

  shield: (msg) =>
    toast(msg, {
      icon: '🛡️',
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.15)',
      },
    }),

  video: (msg) =>
    toast(msg, {
      icon: '🎬',
      style: {
        background: '#0f172a',
        color: '#f8fafc',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow: '0 10px 25px -5px rgba(168, 85, 247, 0.15)',
      },
    }),
};

export default notify;
