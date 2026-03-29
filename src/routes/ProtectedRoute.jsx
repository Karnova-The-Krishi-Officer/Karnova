import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ roles }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles?.length && !roles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'officer' ? '/officer' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
