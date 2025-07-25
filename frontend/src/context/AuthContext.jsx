import { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/apiServices';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('devmate_token');
      const storedUser = localStorage.getItem('devmate_user');
      
      if (token && storedUser) {
        try {
          // First set user from localStorage for immediate UI update
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          
          // Then verify token is still valid by fetching user profile
          const user = await authAPI.getProfile();
          setCurrentUser(user);
          // Update localStorage with fresh user data
          localStorage.setItem('devmate_user', JSON.stringify(user));
        } catch (err) {
          console.error('Token validation failed:', err);
          localStorage.removeItem('devmate_token');
          localStorage.removeItem('devmate_user');
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await authAPI.login(email, password);
      const { user, token } = data;
      
      // Store token and user data
      localStorage.setItem('devmate_token', token);
      localStorage.setItem('devmate_user', JSON.stringify(user));
      setCurrentUser(user);
      
      return user;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password, role = 'user') => {
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.register(username, email, password, role);
      const { user, token } = data;
      localStorage.setItem('devmate_token', token);
      localStorage.setItem('devmate_user', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    clearAuthState();
  };

  // Update profile function
  const updateProfile = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    localStorage.setItem('devmate_user', JSON.stringify(updatedUser));
  };

  // Clear auth state completely
  const clearAuthState = () => {
    setCurrentUser(null);
    localStorage.removeItem('devmate_token');
    localStorage.removeItem('devmate_user');
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isParticipant: currentUser?.role === 'user',
    isOrganizer: currentUser?.role === 'organizer',
    role: currentUser?.role,
    id: currentUser?.id || currentUser?._id
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
