import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layout/MainLayout.jsx';
import PortfolioPage from '../../pages/Portfolio/Portfolio.jsx';
import LoginPage from '../../pages/Login/Login.jsx';
import OwnerWorkspace from '../../pages/OwnerWorkspace/OwnerWorkspace.jsx';
import ProtectedRoute from '../../components/routing/ProtectedRoute.jsx';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<PortfolioPage />} />
        <Route
          path="admin"
          element={(
            <ProtectedRoute requiresOwner>
              <OwnerWorkspace />
            </ProtectedRoute>
          )}
        />
      </Route>
      <Route path="login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
