import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import { homeRoutes } from './utils/homeRoutes';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

import AdminDashboard from './pages/admin/AdminDashboard';
import UsersList from './pages/admin/UsersList';
import UserDetails from './pages/admin/UserDetails';
import AddUser from './pages/admin/AddUser';
import StoresList from './pages/admin/StoresList';
import AddStore from './pages/admin/AddStore';

import UserStoreList from './pages/user/UserStoreList';
import ChangePassword from './pages/user/ChangePassword';

import OwnerDashboard from './pages/owner/OwnerDashboard';

function AppRoutes() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const home = isAuthenticated ? homeRoutes[user?.role] || '/login' : '/login';

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={home} /> : <LoginPage />} />
        <Route path="/signup" element={isAuthenticated ? <Navigate to={home} /> : <SignupPage />} />

        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><UsersList /></ProtectedRoute>} />
        <Route path="/admin/users/add" element={<ProtectedRoute roles={['admin']}><AddUser /></ProtectedRoute>} />
        <Route path="/admin/users/:id" element={<ProtectedRoute roles={['admin']}><UserDetails /></ProtectedRoute>} />
        <Route path="/admin/stores" element={<ProtectedRoute roles={['admin']}><StoresList /></ProtectedRoute>} />
        <Route path="/admin/stores/add" element={<ProtectedRoute roles={['admin']}><AddStore /></ProtectedRoute>} />

        <Route path="/stores" element={<ProtectedRoute roles={['user']}><UserStoreList /></ProtectedRoute>} />

        <Route path="/owner" element={<ProtectedRoute roles={['owner']}><OwnerDashboard /></ProtectedRoute>} />

        <Route path="/change-password" element={<ProtectedRoute roles={['user', 'owner']}><ChangePassword /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to={home} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
