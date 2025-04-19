import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiLock } from 'react-icons/fi';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function UserSignUp() {
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Register as a regular user
      await register(formData, 'user');
      
      // Auto-login after registration
      await login(formData.phone, formData.password);
      
      // Redirect to home page
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">User Registration</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border rounded-lg p-3">
          <FiUser className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="flex-1 outline-none"
            required
          />
        </div>
        
        <div className="flex items-center border rounded-lg p-3">
          <FiPhone className="text-gray-400 mr-2" />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="flex-1 outline-none"
            required
          />
        </div>
        
        <div className="flex items-center border rounded-lg p-3">
          <FiLock className="text-gray-400 mr-2" />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="flex-1 outline-none"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <p>Already registered? <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link></p>
      </div>
    </div>
  );
}