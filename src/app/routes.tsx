import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './Layout';
import { Dashboard } from './pages/Dashboard';
import { ProjectList } from './pages/ProjectList';
import { CreateProject } from './pages/CreateProject';
import { ProjectDetails } from './pages/ProjectDetails';
import { ProjectDetailsFolders } from './pages/ProjectDetailsFolders';
import { ProjectRisks } from './pages/ProjectRisks';
import { ProjectStages } from './pages/ProjectStages';
import { ProjectApprovals } from './pages/ProjectApprovals';
import { Login } from './pages/Login';
import { PortfolioDashboard } from './pages/PortfolioDashboard';
import { AuditLogs } from './pages/AuditLogs';
import { Notifications } from './pages/Notifications';
import { PublicUpdates } from './pages/PublicUpdates';
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
      { path: 'projects/new', Component: CreateProject },
      { path: 'projects/:id', Component: ProjectDetailsFolders },
      { path: 'projects/:id/details', Component: ProjectDetails },
      { path: 'projects/:id/risks', Component: ProjectRisks },
      { path: 'projects/:id/stages', Component: ProjectStages },
      { path: 'projects/:id/approvals', Component: ProjectApprovals },
      { path: 'audit-logs', Component: AuditLogs },
      { path: 'notifications', Component: Notifications },
      { path: 'public-updates', Component: PublicUpdates },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);