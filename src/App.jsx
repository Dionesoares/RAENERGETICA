import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import AdminLogin from '@/pages/AdminLogin';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminFinancial from '@/pages/AdminFinancial';
import AdminClients from '@/pages/AdminClients';
import AdminContracts from '@/pages/AdminContracts';
import AdminProducts from '@/pages/AdminProducts';
import AdminBanners from '@/pages/AdminBanners';
import AdminTechnicians from '@/pages/AdminTechnicians';
import AdminServiceReports from '@/pages/AdminServiceReports';
import AdminUsers from '@/pages/AdminUsers';
import TecnicoLogin from '@/pages/TecnicoLogin';
import TecnicoLayout from '@/components/tecnico/TecnicoLayout';
import TecnicoChamados from '@/pages/TecnicoChamados';
import TecnicoReports from '@/pages/TecnicoReports';

const AuthenticatedApp = () => {
  const { authError, navigateToLogin } = useAuth();

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute requiredRole="admin" unauthenticatedElement={<Navigate to="/admin/login" replace />} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="financeiro" element={<AdminFinancial />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="contratos" element={<AdminContracts />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="banners" element={<AdminBanners />} />
          <Route path="tecnicos" element={<AdminTechnicians />} />
          <Route path="relatorios" element={<AdminServiceReports />} />
          <Route path="usuarios" element={<AdminUsers />} />
        </Route>
      </Route>
      <Route path="/tecnico/login" element={<TecnicoLogin />} />
      <Route element={<ProtectedRoute requiredRole="technician" unauthenticatedElement={<Navigate to="/tecnico/login" replace />} />}>
        <Route path="/tecnico" element={<TecnicoLayout />}>
          <Route index element={<TecnicoChamados />} />
          <Route path="relatorios" element={<TecnicoReports />} />
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
