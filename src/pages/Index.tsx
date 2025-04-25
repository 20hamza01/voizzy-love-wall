
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Simple redirect to the dashboard route
  // The AuthenticatedRoutes component will handle auth checking
  return <Navigate to="/dashboard" replace />;
};

export default Index;
