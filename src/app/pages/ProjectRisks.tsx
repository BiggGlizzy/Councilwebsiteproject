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
import { ArrowLeft, AlertTriangle, Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';
import type { Risk } from '../types/project';

export function ProjectRisks() {
  const { id } = useParams();
  const { getProject, updateProject } = useProjects();
  const { addAuditLog } = useAudit();
  const project = getProject(id || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    likelihood: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    impact: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical',
    mitigation: '',
    status: 'Open' as 'Open' | 'Mitigated' | 'Closed',
    owner: '',
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.mitigation || !formData.owner) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (editingRisk) {
      // Update existing risk
      const updatedRisks = project.risks?.map(r =>
        r.id === editingRisk.id ? { ...r, ...formData } : r
      );
      updateProject(id || '', { risks: updatedRisks });

      addAuditLog({
        action: 'Updated',
        entityType: 'Risk',
        entityId: editingRisk.id,
        entityName: formData.title,
        description: `Updated risk "${formData.title}" in ${project.name}`,
      });

      toast.success('Risk updated successfully!');
    } else {
      // Add new risk
      const newRisk: Risk = {
        id: `r-${Date.now()}`,
        ...formData,
        dateIdentified: new Date().toISOString().split('T')[0],
      };

      updateProject(id || '', { risks: [...project.risks, newRisk] });

      addAuditLog({
        action: 'Created',
        entityType: 'Risk',
        entityId: newRisk.id,
        entityName: newRisk.title,
        description: `Added risk "${newRisk.title}" to ${project.name}`,
      });

      toast.success('Risk added successfully!');
    }

    // Reset form
    setFormData({
      title: '',
      description: '',
      likelihood: 'Medium',
      impact: 'Medium',
      mitigation: '',
      status: 'Open',
      owner: '',
    });
    setEditingRisk(null);
    setIsDialogOpen(false);
  };

  const openAddDialog = () => {
    setEditingRisk(null);
    setFormData({
      title: '',
      description: '',
      likelihood: 'Medium',
      impact: 'Medium',
      mitigation: '',
      status: 'Open',
      owner: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (risk: Risk) => {
    setEditingRisk(risk);
    setFormData({
      title: risk.title,
      description: risk.description,
      likelihood: risk.likelihood,
      impact: risk.impact,
      mitigation: risk.mitigation,
      status: risk.status,
      owner: risk.owner,
    });
    setIsDialogOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-orange-100 text-orange-800';
      case 'Mitigated':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link to={`/projects/${id}`}>
            <Button variant="ghost" size="icon" className="mt-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Project Risks</h2>
            <p className="text-gray-600 mt-2">{project.name}</p>
          </div>
        </div>
        <Button
          onClick={openAddDialog}
          className="text-white hover:opacity-90"
          style={{ backgroundColor: 'var(--council-orange)' }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Risk
        </Button>
      </div>

      {/* Risks List */}
      <Card style={{ backgroundColor: 'var(--council-orange-light)' }} className="border-[var(--council-orange)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" style={{ color: 'var(--council-orange)' }} />
            All Risks ({project.risks?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {project.risks?.length || 0 > 0 ? (
            <div className="space-y-4">
              {project.risks?.map(risk => (
                <div key={risk.id} className={`p-4 border rounded-lg bg-white ${getSeverityColor(risk.impact)}`}>
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
                    <Button
                      onClick={() => openEditDialog(risk)}
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No risks identified for this project</p>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Risk Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRisk ? 'Edit Risk' : 'Add New Risk'}</DialogTitle>
            <DialogDescription>
              {editingRisk ? 'Update the risk details below' : 'Add a new risk to track for this project'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Risk Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Budget Overrun"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the risk in detail"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="likelihood">Likelihood *</Label>
                  <Select
                    value={formData.likelihood}
                    onValueChange={(value) => handleInputChange('likelihood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="impact">Impact *</Label>
                  <Select
                    value={formData.impact}
                    onValueChange={(value) => handleInputChange('impact', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mitigation">Mitigation Strategy *</Label>
                <Textarea
                  id="mitigation"
                  placeholder="Describe how this risk will be mitigated"
                  value={formData.mitigation}
                  onChange={(e) => handleInputChange('mitigation', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Mitigated">Mitigated</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="owner">Risk Owner *</Label>
                  <Input
                    id="owner"
                    placeholder="e.g., John Smith"
                    value={formData.owner}
                    onChange={(e) => handleInputChange('owner', e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--council-orange)' }}
              >
                {editingRisk ? 'Update Risk' : 'Add Risk'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
