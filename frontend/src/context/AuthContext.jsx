import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('devmate_user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('devmate_user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful login
      const userData = {
        id: 'user123',
        name: 'Test User',
        email,
        role: 'participant',
        skills: ['React', 'Node.js', 'MongoDB'],
        avatar: 'https://i.pravatar.cc/150?u=user123'
      };
      
      setCurrentUser(userData);
      localStorage.setItem('devmate_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (name, email, password, role) => {
    setLoading(true);
    setError('');
    
    try {
      // This would be replaced with an actual API call
      // For now, we'll simulate a successful registration
      const userData = {
        id: 'user' + Math.floor(Math.random() * 1000),
        name,
        email,
        role,
        skills: [],
        avatar: `https://i.pravatar.cc/150?u=${email}`
      };
      
      setCurrentUser(userData);
      localStorage.setItem('devmate_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('devmate_user');
  };

  // Update profile function
  const updateProfile = (userData) => {
    setCurrentUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('devmate_user', JSON.stringify({ ...currentUser, ...userData }));
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
    isParticipant: currentUser?.role === 'participant',
    isOrganizer: currentUser?.role === 'organizer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
