import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoomProvider } from './context/RoomContextPlaceholder.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';

export function App() {
  return (
    <BrowserRouter>
      <RoomProvider>
        <AppRoutes />
      </RoomProvider>
    </BrowserRouter>
  );
}

export default App;
