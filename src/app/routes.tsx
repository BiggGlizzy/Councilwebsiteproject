import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/ProjectList';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import { Login } from './pages/Login';
import { PortfolioDashboard } from './pages/PortfolioDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: 'portfolio', Component: PortfolioDashboard },
      { path: 'projects', Component: ProjectList },
      { path: 'projects/create', Component: CreateProject },
      { path: 'projects/:id', Component: ProjectDetails },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
