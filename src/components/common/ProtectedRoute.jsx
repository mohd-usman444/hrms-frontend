import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from './Spinner';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { getUserForRole, loading } = useAuth();

  if (loading) return <Spinner />;

  const user = getUserForRole(allowedRole);

  if (!user) {
    return <Navigate to={`/${allowedRole}/signin`} replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return children;
};

export default ProtectedRoute;
