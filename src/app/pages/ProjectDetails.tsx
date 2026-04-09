import { useParams, Link } from 'react-router';
import { useProjects } from '../context/ProjectContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Building2, 
  DollarSign,
  AlertTriangle,
  AlertCircle,
  FileText,
  Target,
  Milestone
} from 'lucide-react';

export function ProjectDetails() {
  const { id } = useParams();
  const { getProject } = useProjects();
  const project = getProject(id || '');

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

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
            <Badge className={getSeverityColor(project.priority)}>
              {project.priority} Priority
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
      </div>

      {/* Project Overview Card */}
      <Card>
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
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Active Risks</p>
                <p className="font-semibold text-orange-600">{project.risks.filter(r => r.status === 'Open').length} / {project.risks.length}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="font-semibold text-red-600">{project.issues.filter(i => i.status === 'Open').length} / {project.issues.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="risks">Risks ({project.risks.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({project.issues.length})</TabsTrigger>
          <TabsTrigger value="scope">Scope Changes ({project.scopeChanges.length})</TabsTrigger>
          <TabsTrigger value="benefits">Benefits ({project.benefits.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({project.grantMilestones.length})</TabsTrigger>
        </TabsList>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Project Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.risks.length > 0 ? (
                <div className="space-y-4">
                  {project.risks.map(risk => (
                    <div key={risk.id} className={`p-4 border rounded-lg ${getSeverityColor(risk.impact)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{risk.title}</h4>
                            <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{risk.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Likelihood: </span>
                              <Badge variant="outline" className={getSeverityColor(risk.likelihood)}>
                                {risk.likelihood}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Impact: </span>
                              <Badge variant="outline" className={getSeverityColor(risk.impact)}>
                                {risk.impact}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Owner: </span>
                              {risk.owner}
                            </div>
                            <div>
                              <span className="font-medium">Identified: </span>
                              {risk.dateIdentified}
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded border">
                            <p className="text-sm font-medium">Mitigation Strategy:</p>
                            <p className="text-sm mt-1">{risk.mitigation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No risks identified for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Project Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.issues.length > 0 ? (
                <div className="space-y-4">
                  {project.issues.map(issue => (
                    <div key={issue.id} className={`p-4 border rounded-lg ${getSeverityColor(issue.priority)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{issue.title}</h4>
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge variant="outline" className={getSeverityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{issue.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Assigned To: </span>
                              {issue.assignedTo}
                            </div>
                            <div>
                              <span className="font-medium">Date Raised: </span>
                              {issue.dateRaised}
                            </div>
                            {issue.dateResolved && (
                              <div>
                                <span className="font-medium">Date Resolved: </span>
                                {issue.dateResolved}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No issues logged for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scope Changes Tab */}
        <TabsContent value="scope" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Scope Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.scopeChanges.length > 0 ? (
                <div className="space-y-4">
                  {project.scopeChanges.map(change => (
                    <div key={change.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{change.title}</h4>
                            <Badge className={getStatusColor(change.status)}>{change.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{change.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Requested By: </span>
                              {change.requestedBy}
                            </div>
                            <div>
                              <span className="font-medium">Date Requested: </span>
                              {change.dateRequested}
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium mb-2">Impact Assessment:</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Overall Impact:</span> {change.impact}</p>
                              {change.costImpact && <p><span className="font-medium">Cost Impact:</span> {change.costImpact}</p>}
                              {change.timelineImpact && <p><span className="font-medium">Timeline Impact:</span> {change.timelineImpact}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No scope changes requested for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Project Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.benefits.length > 0 ? (
                <div className="space-y-4">
                  {project.benefits.map(benefit => (
                    <div key={benefit.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{benefit.title}</h4>
                            <Badge className={getStatusColor(benefit.status)}>{benefit.status}</Badge>
                            <Badge variant="outline">{benefit.category}</Badge>
                          </div>
                          <p className="text-sm mt-2">{benefit.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div className="p-3 bg-blue-50 rounded">
                              <p className="text-sm font-medium text-blue-900">Target Value</p>
                              <p className="text-sm text-blue-700 mt-1">{benefit.targetValue}</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded">
                              <p className="text-sm font-medium text-green-900">Current Value</p>
                              <p className="text-sm text-green-700 mt-1">{benefit.currentValue}</p>
                            </div>
                          </div>
                          {benefit.measurementDate && (
                            <p className="text-sm text-gray-600 mt-2">
                              Last Measured: {benefit.measurementDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No benefits defined for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grant Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Milestone className="w-5 h-5" />
                Grant Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.grantMilestones.length > 0 ? (
                <div className="space-y-4">
                  {project.grantMilestones.map(milestone => (
                    <div key={milestone.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{milestone.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Due Date: </span>
                              {milestone.dueDate}
                            </div>
                            <div>
                              <span className="font-medium">Grant Amount: </span>
                              <span className="text-green-700 font-semibold">{milestone.grantAmount}</span>
                            </div>
                            {milestone.completionDate && (
                              <div>
                                <span className="font-medium">Completed: </span>
                                {milestone.completionDate}
                              </div>
                            )}
                          </div>
                          {milestone.deliverables.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm font-medium mb-2">Deliverables:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {milestone.deliverables.map((deliverable, index) => (
                                  <li key={index}>{deliverable}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No grant milestones defined for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
