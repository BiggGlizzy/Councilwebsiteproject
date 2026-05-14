import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAudit } from '../context/AuditContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import type { Approval } from '../types/project';

export function ProjectApprovals() {
  const { id } = useParams();
  const { getProject, updateApproval } = useProjects();
  const { addAuditLog, addNotification } = useAudit();
  const { user } = useAuth();
  const project = getProject(id || '');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState<'Approved' | 'Rejected'>('Approved');
  const [comments, setComments] = useState('');

  const isAdmin = user?.role === 'Admin';

  if (!project) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-12">Project not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const openProcessDialog = (approval: Approval, action: 'Approved' | 'Rejected') => {
    setSelectedApproval(approval);
    setProcessingAction(action);
    setComments('');
    setIsProcessDialogOpen(true);
  };

  const handleProcess = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedApproval) return;

    updateApproval(id || '', selectedApproval.id, {
      status: processingAction,
      approvedBy: user?.name,
      approvedAt: new Date().toISOString().split('T')[0],
      comments,
    });

    addAuditLog({
      action: processingAction === 'Approved' ? 'Approved' : 'Rejected',
      entityType: 'Approval',
      entityId: selectedApproval.id,
      entityName: selectedApproval.stage,
      description: `${processingAction} approval for "${selectedApproval.stage}" in ${project.name}`,
    });

    addNotification({
      type: 'Status Change',
      projectId: project.id,
      projectName: project.name,
      message: `Approval for "${selectedApproval.stage}" has been ${processingAction.toLowerCase()}`,
      relatedEntity: 'Approval',
      relatedEntityId: selectedApproval.id,
    });

    toast.success(`Approval ${processingAction.toLowerCase()} successfully!`);
    setIsProcessDialogOpen(false);
    setSelectedApproval(null);
    setComments('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to={`/projects/${id}`}>
            <Button variant="ghost" size="icon" className="mt-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Approvals</h2>
            <p className="text-gray-600 mt-2">{project.name}</p>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
            All Approvals ({project.approvals?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(project.approvals?.length || 0) > 0 ? (
            <div className="space-y-4">
              {project.approvals?.map(approval => (
                <div key={approval.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        {getStatusIcon(approval.status)}
                        <h4 className="font-semibold">{approval.stage}</h4>
                        <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Requested by: </span>
                          {approval.requestedBy}
                        </div>
                        <div>
                          <span className="font-medium">Requested on: </span>
                          {approval.requestedAt}
                        </div>

                        {approval.approvedBy && (
                          <>
                            <div>
                              <span className="font-medium">Processed by: </span>
                              {approval.approvedBy}
                            </div>
                            <div>
                              <span className="font-medium">Processed on: </span>
                              {approval.approvedAt}
                            </div>
                          </>
                        )}
                      </div>

                      {approval.comments && (
                        <div className="mt-3 p-3 bg-gray-50 rounded border">
                          <p className="text-sm font-medium">Comments:</p>
                          <p className="text-sm mt-1">{approval.comments}</p>
                        </div>
                      )}
                    </div>

                    {approval.status === 'Pending' && isAdmin && (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => openProcessDialog(approval, 'Approved')}
                          size="sm"
                          className="text-white hover:opacity-90"
                          style={{ backgroundColor: 'var(--council-green)' }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => openProcessDialog(approval, 'Rejected')}
                          size="sm"
                          variant="destructive"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No approvals for this project</p>
          )}
        </CardContent>
      </Card>

      {/* Process Approval Dialog */}
      <Dialog open={isProcessDialogOpen} onOpenChange={setIsProcessDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {processingAction === 'Approved' ? 'Approve' : 'Reject'} Approval
            </DialogTitle>
            <DialogDescription>
              {processingAction === 'Approved'
                ? 'Approve this stage to allow the project to proceed'
                : 'Reject this approval request with comments'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProcess}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Stage: </span>
                  {selectedApproval?.stage}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Requested by: </span>
                  {selectedApproval?.requestedBy}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Comments {processingAction === 'Rejected' && '*'}
                </label>
                <Textarea
                  placeholder={processingAction === 'Approved'
                    ? 'Optional comments...'
                    : 'Please provide a reason for rejection...'}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  required={processingAction === 'Rejected'}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProcessDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white hover:opacity-90"
                style={{
                  backgroundColor: processingAction === 'Approved'
                    ? 'var(--council-green)'
                    : 'var(--destructive)'
                }}
              >
                {processingAction === 'Approved' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
