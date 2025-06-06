import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from'../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => 
{
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default PrivateRoute;
