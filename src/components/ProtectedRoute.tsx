import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  const userRole = user?.role ? user.role.toLowerCase() : '';

  if (!isAuthenticated) {
    // If not authenticated, redirect to landing page
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.map(r => r.toLowerCase()).includes(userRole)) {
    // If authenticated but role not allowed, redirect to default authenticated route
    if (userRole === 'safeguard') {
      return <Navigate to="/safeguard-dashboard" replace />;
    }
    if (userRole === 'parent') {
      return <Navigate to="/parent-dashboard" replace />;
    }
    if (userRole === 'student') {
      return <Navigate to="/student-dashboard" replace />;
    }
    if (userRole === 'regional_admin' || userRole === 'regionaladmin' || userRole === 'superadmin') {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Render the child routes
  return <Outlet />;
}
