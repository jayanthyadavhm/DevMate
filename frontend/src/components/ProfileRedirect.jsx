import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProfileRedirect = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const userId = currentUser.id || currentUser._id;
      if (userId) {
        navigate(`/profile/${userId}`, { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [currentUser, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your profile...</p>
      </div>
    </div>
  );
};

export default ProfileRedirect;
