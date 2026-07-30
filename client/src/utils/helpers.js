/**
 * Reusable Helper Functions
 */

export const generateRandomRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const saveUserData = (username, roomId) => {
  if (username) localStorage.setItem('username', username.trim());
  if (roomId) localStorage.setItem('roomId', roomId.trim());
};

export const getUserData = () => ({
  username: localStorage.getItem('username') || '',
  roomId: localStorage.getItem('roomId') || '',
});
