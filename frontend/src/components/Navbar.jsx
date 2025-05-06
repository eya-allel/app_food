import React, { useState } from 'react';
import { FiSearch, FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [authMenuOpen, setAuthMenuOpen] = useState(false);
  const [signUpChoice, setSignUpChoice] = useState(false);
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const toggleAuthMenu = () => {
    setAuthMenuOpen(!authMenuOpen);
    setSignUpChoice(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setAuthMenuOpen(false);
    setSignUpChoice(false);
  };

  const handleLogout = () => {
    logout();
    setAuthMenuOpen(false);
    navigate('/');
  };

  // Determine which navigation links to show based on user role
  const getNavLinks = () => {
    if (currentUser && currentUser.role === 'caterer') {
      return [
        { name: "Recipes", path: "/recipes" },
        { name: "My Recipes", path: "/my-recipes" },
        { name: "Orders", path: "/caterer-orders" }
      ];
    } else {
      return [
        { name: "Recipes", path: "/recipes" },
        { name: "Order Food", path: "/order-food" },
        { name: "Caterers", path: "/caterers" }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo - Redirige vers l'accueil */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-[2.75rem] font-light font-['Helvetica_Now_Display'] tracking-tight
                      text-gray-500 hover:text-gray-700 transition-colors duration-500
                      relative group">
              <span className="relative z-10">Recetti</span>
              <span className="absolute -bottom-1 left-0 h-[1px] w-0 
                            bg-gradient-to-r from-gray-400 to-gray-600
                            group-hover:w-full transition-all duration-700 ease-out"></span>
            </span>
          </div>

          {/* Navigation Links - Now Dynamic Based on User Role */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((item, idx) => (
              <a 
                key={idx} 
                onClick={() => navigate(item.path)} 
                className="text-lg font-medium text-gray-700 hover:text-amber-600 
                          transition-all duration-300 relative group cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 
                               bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Icon Group */}
          <div className="flex items-center space-x-6 relative">
            <button className="p-2 group relative">
              <FiSearch className="text-xl text-gray-500 group-hover:text-amber-600 transition-colors duration-300" />
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-amber-500 transform -translate-x-1/2 transition-all duration-300 group-hover:w-4/5"></span>
            </button>

            {/* Only show shopping cart for regular users */}
            {(!currentUser || currentUser.role !== 'caterer') && (
              <button className="p-2 group relative">
                <FiShoppingCart className="text-xl text-gray-500 group-hover:text-amber-600 transition-colors duration-300" />
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-amber-500 transform -translate-x-1/2 transition-all duration-300 group-hover:w-4/5"></span>
              </button>
            )}

            <button onClick={toggleAuthMenu} className="p-2 group relative">
              <FiUser className="text-xl text-gray-500 group-hover:text-amber-600 transition-colors duration-300" />
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-amber-500 transform -translate-x-1/2 transition-all duration-300 group-hover:w-4/5"></span>
            </button>

            {/* Auth Menu */}
            {authMenuOpen && (
              <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-4 w-56 z-50 space-y-2">
                {currentUser ? (
                  <>
                    <div className="px-3 py-2 text-gray-700 font-medium">
                      {currentUser.username}
                      {currentUser.role === 'caterer' && (
                        <p className="text-sm text-amber-600 font-normal">{currentUser.businessName}</p>
                      )}
                    </div>
                    <button
                      className="w-full flex items-center text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
                      onClick={handleLogout}
                    >
                      <FiLogOut className="mr-2" /> Sign Out
                    </button>
                  </>
                ) : (
                  !signUpChoice ? (
                    <>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => handleNavigation('/signin')}
                      >
                        Sign In
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => setSignUpChoice(true)}
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm">Sign up as:</p>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => handleNavigation('/signup/user')}
                      >
                        Regular User
                      </button>
                      <button
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-gray-700"
                        onClick={() => handleNavigation('/signup/caterer')}
                      >
                        Caterer
                      </button>
                      <button
                        className="text-sm text-amber-600 hover:underline mt-2"
                        onClick={() => setSignUpChoice(false)}
                      >
                        ← Back
                      </button>
                    </>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}