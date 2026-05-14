import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAudit } from '../context/AuditContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Layers, Plus, FileText, Upload, Download } from 'lucide-react';
import { toast } from 'sonner';
import type { Stage, Document } from '../types/project';

export function ProjectStages() {
  const { id } = useParams();
  const { getProject, addStage, addDocument } = useProjects();
  const { addAuditLog } = useAudit();
  const project = getProject(id || '');
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
  const [stageFormData, setStageFormData] = useState({
    name: '',
    description: '',
    phase: 'Initiation' as 'Initiation' | 'Planning' | 'Delivery' | 'Closure',
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed',
    startDate: '',
    endDate: '',
  });
  const [docFormData, setDocFormData] = useState({
    name: '',
    type: 'PDF' as 'PDF' | 'Word' | 'Excel' | 'Other',
    size: '',
  });

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

  const handleStageInputChange = (field: string, value: string) => {
    setStageFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDocInputChange = (field: string, value: string) => {
    setDocFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!stageFormData.name || !stageFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      ...stageFormData,
      documents: [],
    };

    addStage(id || '', newStage);

    addAuditLog({
      action: 'Created',
      entityType: 'Stage',
      entityId: newStage.id,
      entityName: newStage.name,
      description: `Added stage "${newStage.name}" to ${project.name}`,
    });

    toast.success('Stage added successfully!');

    setStageFormData({
      name: '',
      description: '',
      phase: 'Initiation',
      status: 'Not Started',
      startDate: '',
      endDate: '',
    });
    setIsStageDialogOpen(false);
  };

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedStage || !docFormData.name || !docFormData.size) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      ...docFormData,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    addDocument(id || '', selectedStage.id, newDoc);

    addAuditLog({
      action: 'Created',
      entityType: 'Document',
      entityId: newDoc.id,
      entityName: newDoc.name,
      description: `Uploaded document "${newDoc.name}" to stage "${selectedStage.name}" in ${project.name}`,
    });

    toast.success('Document added successfully!');

    setDocFormData({
      name: '',
      type: 'PDF',
      size: '',
    });
    setSelectedStage(null);
    setIsDocDialogOpen(false);
  };

  const openAddDocDialog = (stage: Stage) => {
    setSelectedStage(stage);
    setDocFormData({
      name: '',
      type: 'PDF',
      size: '',
    });
    setIsDocDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Initiation':
        return 'var(--council-purple)';
      case 'Planning':
        return 'var(--council-blue)';
      case 'Delivery':
        return 'var(--council-orange)';
      case 'Closure':
        return 'var(--council-green)';
      default:
        return '#9CA3AF';
    }
  };

  const getDocTypeIcon = (type: string) => {
    return <FileText className="w-4 h-4" />;
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
            <h2 className="text-3xl font-bold text-gray-900">Stages & Documentation</h2>
            <p className="text-gray-600 mt-2">{project.name}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsStageDialogOpen(true)}
          className="text-white hover:opacity-90"
          style={{ backgroundColor: 'var(--council-purple)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Stage
        </Button>
      </div>

      {/* Stages List */}
      <Card style={{ backgroundColor: 'var(--council-purple-light)' }} className="border-[var(--council-purple)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: 'var(--council-purple)' }} />
            All Stages ({project.stages?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(project.stages?.length || 0) > 0 ? (
            <div className="space-y-4">
              {project.stages?.map(stage => (
                <div key={stage.id} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold">{stage.name}</h4>
                        <Badge className={getStatusColor(stage.status)}>{stage.status}</Badge>
                        <Badge className="text-white" style={{ backgroundColor: getPhaseColor(stage.phase) }}>
                          {stage.phase}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{stage.description}</p>
                      {(stage.startDate || stage.endDate) && (
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          {stage.startDate && <div>Start: {stage.startDate}</div>}
                          {stage.endDate && <div>End: {stage.endDate}</div>}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => openAddDocDialog(stage)}
                      variant="outline"
                      size="sm"
                      className="gap-1"
                    >
                      <Upload className="w-4 h-4" />
                      Add Document
                    </Button>
                  </div>

                  {/* Documents List */}
                  {stage.documents.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h5 className="font-medium text-sm mb-3">Documents ({stage.documents.length})</h5>
                      <div className="space-y-2">
                        {stage.documents.map(doc => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                          >
                            <div className="flex items-center gap-3">
                              {getDocTypeIcon(doc.type)}
                              <div>
                                <p className="font-medium text-sm">{doc.name}</p>
                                <p className="text-xs text-gray-500">
                                  {doc.type} • {doc.size} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                                </p>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No stages created for this project</p>
          )}
        </CardContent>
      </Card>

      {/* Add Stage Dialog */}
      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Stage</DialogTitle>
            <DialogDescription>
              Create a new stage for this project
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleStageSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Stage Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Idea and Planning"
                  value={stageFormData.name}
                  onChange={(e) => handleStageInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe this stage"
                  value={stageFormData.description}
                  onChange={(e) => handleStageInputChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phase">Phase *</Label>
                  <Select
                    value={stageFormData.phase}
                    onValueChange={(value) => handleStageInputChange('phase', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Initiation">Initiation</SelectItem>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Delivery">Delivery</SelectItem>
                      <SelectItem value="Closure">Closure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={stageFormData.status}
                    onValueChange={(value) => handleStageInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={stageFormData.startDate}
                    onChange={(e) => handleStageInputChange('startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={stageFormData.endDate}
                    onChange={(e) => handleStageInputChange('endDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsStageDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--council-purple)' }}
              >
                Add Stage
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Document</DialogTitle>
            <DialogDescription>
              Upload a document to {selectedStage?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDocSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="docName">Document Name *</Label>
                <Input
                  id="docName"
                  placeholder="e.g., Project Plan v1.2"
                  value={docFormData.name}
                  onChange={(e) => handleDocInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docType">Document Type *</Label>
                <Select
                  value={docFormData.type}
                  onValueChange={(value) => handleDocInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="Word">Word</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="size">File Size *</Label>
                <Input
                  id="size"
                  placeholder="e.g., 2.5 MB"
                  value={docFormData.size}
                  onChange={(e) => handleDocInputChange('size', e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDocDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--council-purple)' }}
              >
                Add Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
