
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { TaskList } from './pages/TaskList';
import { Wallet } from './pages/Wallet';
import { Login, Register } from './pages/Auth';
import { AdminTaskManagement } from './pages/AdminTaskManagement';
import { AdminRequests } from './pages/AdminRequests';
import { AdminWithdrawals } from './pages/AdminWithdrawals';
import { AdminUsers } from './pages/AdminUsers';
import { AdminSettings } from './pages/AdminSettings';
import { UserRequests } from './pages/UserRequests';
import { UserRole } from './types';

const ProtectedRoute: React.FC<{ children: React.ReactNode, role?: UserRole }> = ({ children, role }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) return <Navigate to="/login" />;
  if (role && currentUser.role !== role) return <Navigate to="/" />;
  
  return <Layout>{children}</Layout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  if (currentUser) return <Navigate to={currentUser.role === UserRole.ADMIN ? "/admin" : "/"} />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      
      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><UserRequests /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><div className="p-8 text-center">Profile Page Coming Soon</div></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role={UserRole.ADMIN}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/tasks" element={<ProtectedRoute role={UserRole.ADMIN}><AdminTaskManagement /></ProtectedRoute>} />
      <Route path="/admin/requests" element={<ProtectedRoute role={UserRole.ADMIN}><AdminRequests /></ProtectedRoute>} />
      <Route path="/admin/withdrawals" element={<ProtectedRoute role={UserRole.ADMIN}><AdminWithdrawals /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role={UserRole.ADMIN}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role={UserRole.ADMIN}><AdminSettings /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
};

export default App;
