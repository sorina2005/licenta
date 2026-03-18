import React from 'react';
import RegisterPage from './pages/RegisterPage';
import { CssBaseline } from '@mui/material';

function App() {
  return (
      <>
        <CssBaseline /> {/* Reseteaza stilurile browserului */}
        <RegisterPage />
      </>
  );
}

export default App;