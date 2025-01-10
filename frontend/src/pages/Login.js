import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { SparklesIcon, StarIcon } from '@heroicons/react/24/outline';

const Login = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-24 h-24 md:w-32 md:h-32 bg-primary-500/20 rounded-full blur-xl animate-blob"></div>
        <div className="absolute top-1/4 -right-4 w-32 h-32 md:w-40 md:h-40 bg-pink-500/20 rounded-full blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 md:w-36 md:h-36 bg-purple-500/20 rounded-full blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4">
          <StarIcon className="h-4 w-4 text-yellow-400 animate-pulse" />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <StarIcon className="h-3 w-3 text-yellow-400 animate-ping" />
        </div>
        <div className="absolute bottom-1/4 left-1/5">
          <StarIcon className="h-5 w-5 text-yellow-400 animate-bounce" />
        </div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="relative">
          <SparklesIcon className="h-12 w-12 mx-auto text-primary-500 animate-spin-slow" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Enter Password to Access Clipboard
          </h2>
          {/* Decorative line */}
          <div className="mt-4 flex justify-center">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-primary-500 to-transparent rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-300">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-xl relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="relative group">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <div className="absolute inset-0 rounded-xl border border-primary-500 scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-300 hover:scale-[1.02]"
              >
                {isLoading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  <SparklesIcon className="h-5 w-5 mr-2" />
                )}
                Access Clipboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 