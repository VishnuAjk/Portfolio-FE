import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const ProtectedRoute = ({ children, requiresOwner = false }) => {
  const { isAuthenticated, canEdit, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <p role="status" style={{ margin: '6rem auto', textAlign: 'center', color: '#475569' }}>
        Checking owner session…
      </p>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiresOwner && !canEdit) {
    return <Navigate to="/" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiresOwner: PropTypes.bool,
};

export default ProtectedRoute;
