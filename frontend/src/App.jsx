import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/auth/SignIn';
import CatererSignUp from './pages/auth/CatererSignUp';
import UserSignUp from './pages/auth/UserSignUp';
import { AuthProvider } from './context/AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup/caterer" element={<CatererSignUp />} />
        <Route path="/signup/user" element={<UserSignUp />} />
        {/* Add your other routes here */}
      </Routes>
    </AuthProvider>
  );
}

export default App;