import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bars3Icon, XMarkIcon, UserCircleIcon, BellIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`
        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150
        ${isActive 
          ? 'text-primary-600 bg-primary-50'
          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
        }
      `}
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentUser, logout, isAuthenticated, id } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav 
      className={`
        fixed w-full z-50 transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200/50
        ${isScrolled ? 'py-2' : 'py-4'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                DevMate
              </span>
            </Link>
            {isAuthenticated && currentUser?.role && (
              <span className="ml-2 text-xs text-gray-500 font-semibold uppercase tracking-widest">{currentUser.role}</span>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated && currentUser?.role === 'user' && <NavLink to="/dashboard">Dashboard</NavLink>}
            {isAuthenticated && currentUser?.role === 'user' && <NavLink to="/hackathons">Hackathons</NavLink>}
            {isAuthenticated && currentUser?.role === 'user' && <NavLink to="/find-teammates">Find Teammates</NavLink>}
            {isAuthenticated && currentUser?.role === 'user' && <NavLink to="/projects">Projects</NavLink>}
            {isAuthenticated && currentUser?.role === 'organizer' && <NavLink to="/organiser">Organiser Dashboard</NavLink>}
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-1.5 rounded-full text-gray-700 hover:bg-gray-100 relative">
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>

                {/* User Menu */}
                <div className="relative" tabIndex={0} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsMenuOpen(false); }}>
                  <button
                    className="flex items-center space-x-1 p-1.5 rounded-full hover:bg-gray-100"
                    onClick={() => setIsMenuOpen((open) => !open)}
                    aria-haspopup="true"
                    aria-expanded={isMenuOpen}
                  >
                    {currentUser.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={currentUser.avatar}
                        alt={currentUser.name}
                      />
                    ) : (
                      <UserCircleIcon className="h-8 w-8 text-gray-700" />
                    )}
                  </button>
                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2">
                        <p className="text-sm text-gray-500">Signed in as</p>
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <div className="border-t border-gray-100" />
                      {currentUser?.role === 'organizer' ? (
                        <Link
                          to="/organiser"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Organiser Panel
                        </Link>
                      ) : (
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to={`/profile/${id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Your Profile
                      </Link>
                      <Link
                        to="/profile/edit"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Settings
                      </Link>
                      <div className="border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  to="/login"
                  variant="outline"
                  size="sm"
                >
                  Log in
                </Button>
                <Button
                  to="/register"
                  variant="primary"
                  size="sm"
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t">
            {isAuthenticated && currentUser?.role === 'user' && (
              <>
                <NavLink to="/hackathons">Hackathons</NavLink>
                <NavLink to="/find-teammates">Find Teammates</NavLink>
                <NavLink to="/projects">Projects</NavLink>
              </>
            )}
            {isAuthenticated && currentUser?.role === 'organizer' && (
              <NavLink to="/organiser">Organiser Panel</NavLink>
            )}
          </div>

          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {currentUser.avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={currentUser.avatar}
                      alt={currentUser.name}
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-700" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {currentUser.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    {currentUser.email}
                  </div>
                </div>
                <button className="ml-auto p-1.5 rounded-full text-gray-700 hover:bg-gray-200 relative">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
                </button>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {currentUser?.role === 'organizer' ? (
                  <Link
                    to="/organiser"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Organiser Panel
                  </Link>
                ) : (
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to={`/profile/${id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </Link>
                <Link
                  to="/profile/edit"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border-t space-y-2">
              <Button
                to="/login"
                variant="outline"
                className="w-full"
              >
                Log in
              </Button>
              <Button
                to="/register"
                variant="primary"
                className="w-full"
              >
                Sign up
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
