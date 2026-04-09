import { RouterProvider } from 'react-router';
import { router } from './routes';
import { ProjectProvider } from './context/ProjectContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <RouterProvider router={router} />
        <Toaster />
      </ProjectProvider>
    </AuthProvider>
  );
}