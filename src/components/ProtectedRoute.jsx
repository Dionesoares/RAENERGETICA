import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-slate-50">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement, requiredRole }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked, authError } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError?.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === "admin") return <Navigate to="/admin" replace />;
    if (user?.role === "technician") return <Navigate to="/tecnico" replace />;
    return unauthenticatedElement;
  }

  return <Outlet />;
}
