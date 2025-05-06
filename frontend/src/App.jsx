import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SignIn from './pages/auth/SignIn';
import CatererSignUp from './pages/auth/CatererSignUp';
import UserSignUp from './pages/auth/UserSignUp';
import { AuthProvider } from './context/AuthContext.jsx';
import MyRecipes from './pages/MyRecipes';
import RecipeDetail from './pages/RecipeDetail';
import EditRecipe from './pages/EditRecipe';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* Add a default route to solve the "No routes matched location" warning */}
        <Route path="/" element={<Navigate to="/my-recipes" replace />} />
        
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup/caterer" element={<CatererSignUp />} />
        <Route path="/signup/user" element={<UserSignUp />} />
        <Route path="/my-recipes" element={<MyRecipes />} />
        {/* Important: More specific routes need to come before less specific ones */}
        <Route path="/my-recipes/edit/:id" element={<EditRecipe />} />
        <Route path="/my-recipes/:id" element={<RecipeDetail />} />
        {/* Add your other routes here */}
      </Routes>
    </AuthProvider>
  );
}

export default App;