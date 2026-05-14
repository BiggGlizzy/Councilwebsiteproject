import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAudit } from '../context/AuditContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  ArrowLeft,
  Calendar,
  User,
  Building2,
  DollarSign,
  Layers,
  Folder,
  FolderOpen,
  Plus
} from 'lucide-react';

export function ProjectDetailsFolders() {
  const { id } = useParams();
  const { getProject } = useProjects();
  const project = getProject(id || '');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-12">Project not found</p>
            <div className="flex justify-center">
              <Link to="/projects">
                <Button>Back to Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Achieved':
        return 'bg-green-100 text-green-800';
      case 'Planning':
      case 'In Progress':
      case 'Not Started':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Open':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Mitigated':
      case 'Resolved':
      case 'Approved':
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseBackgroundColor = (phase: string) => {
    switch (phase) {
      case 'Initiation':
        return '#7A298F';
      case 'Planning':
        return '#006FB9';
      case 'Delivery':
        return '#F4721E';
      case 'Closure':
        return '#50B66D';
      default:
        return '#9CA3AF';
    }
  };

  const folders = [
    { id: 'stages', name: 'Stages & Documentation', count: project.stages?.length || 0, color: 'var(--council-purple)', bgColor: 'var(--council-purple-light)' },
    { id: 'approvals', name: 'Approvals', count: project.approvals?.length || 0, color: 'var(--council-blue)', bgColor: 'var(--council-blue-light)' },
    { id: 'risks', name: 'Risks', count: project.risks?.length || 0, color: 'var(--council-orange)', bgColor: 'var(--council-orange-light)' },
    { id: 'issues', name: 'Issues', count: project.issues?.length || 0, color: '#DC2626', bgColor: '#FEF2F2' },
    { id: 'scope', name: 'Scope Changes', count: project.scopeChanges?.length || 0, color: 'var(--council-purple)', bgColor: 'var(--council-purple-light)' },
    { id: 'benefits', name: 'Benefits', count: project.benefits?.length || 0, color: 'var(--council-green)', bgColor: 'var(--council-green-light)' },
    { id: 'milestones', name: 'Grant Milestones', count: project.grantMilestones?.length || 0, color: 'var(--council-blue)', bgColor: 'var(--council-blue-light)' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon" className="mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority} Priority
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
      </div>

      {/* Project Phase Indicator */}
      <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
            <span>Current Phase: {project.phase}</span>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Project Overview Card */}
      <Card style={{ backgroundColor: 'var(--council-green-light)' }}>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-semibold text-gray-900">{project.startDate} to {project.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">{project.budget}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Project Manager</p>
                <p className="font-semibold text-gray-900">{project.projectManager}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{project.department}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Folder Grid */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Project Folders</h3>
        <p className="text-gray-600 mb-6">Click on a folder to view and manage its contents</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {folders.map(folder => {
            const isAvailable = folder.id === 'risks' || folder.id === 'stages' || folder.id === 'approvals';
            return isAvailable ? (
              <Link key={folder.id} to={`/projects/${id}/${folder.id}`}>
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer h-full"
                  style={{ backgroundColor: folder.bgColor, borderColor: folder.color }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: folder.color }}
                      >
                        <Folder className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{folder.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {folder.count} {folder.count === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Link key={folder.id} to={`/projects/${id}/details`} state={{ tab: folder.id }}>
                <Card
                  className="hover:shadow-lg transition-all cursor-pointer h-full"
                  style={{ backgroundColor: folder.bgColor, borderColor: folder.color }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: folder.color }}
                      >
                        <Folder className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{folder.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {folder.count} {folder.count === 1 ? 'item' : 'items'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">(View in details)</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
