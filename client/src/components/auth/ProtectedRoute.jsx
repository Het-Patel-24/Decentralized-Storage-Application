import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, account }) => {
  if (!account) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
