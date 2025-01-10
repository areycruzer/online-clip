import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  Bars3Icon, 
  XMarkIcon,
  SparklesIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 dark:bg-dark-200/80 backdrop-blur-sm shadow-lg dark:shadow-dark-lg border-b-2 border-primary-100 dark:border-dark-300 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center text-lg sm:text-xl font-bold theme-text hover:scale-105 transition-all duration-300"
            >
              <SparklesIcon className="h-8 w-8 mr-2 fun-icon" />
              ✨ Magic Clipboard
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="fun-icon p-2 rounded-full text-yellow-500 dark:text-blue-400 hover:text-yellow-600 dark:hover:text-blue-500 focus:outline-none transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="fun-button inline-flex items-center"
                  >
                    <StarIcon className="h-5 w-5 mr-1" />
                    Magic Admin ✨
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="fun-button"
                >
                  Goodbye 👋
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="fun-button"
              >
                Enter Magic Portal ✨
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleTheme}
              className="fun-icon p-2 rounded-full text-yellow-500 dark:text-blue-400 hover:text-yellow-600 dark:hover:text-blue-500 focus:outline-none"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="fun-icon ml-2 p-2 rounded-full text-primary-500 hover:text-primary-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white/90 dark:bg-dark-200/90 backdrop-blur-sm border-t-2 border-primary-100 dark:border-dark-300">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="fun-button block w-full text-center mb-2"
                  >
                    <StarIcon className="h-5 w-5 inline mr-1" />
                    Magic Admin ✨
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="fun-button block w-full"
                >
                  Goodbye 👋
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="fun-button block w-full text-center"
              >
                Enter Magic Portal ✨
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 