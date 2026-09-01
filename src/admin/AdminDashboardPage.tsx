import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  getContactSubmissions, 
  updateSubmissionStatus, 
  fetchProjects, 
  saveProjectRecord, 
  deleteProjectRecord 
} from '../firebase/services';
import { ContactSubmission, Project, SubmissionStatus } from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  LogOut, 
  Inbox, 
  FolderKanban, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  X, 
  RefreshCw
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'submissions' | 'projects'>('submissions');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [submissionFilter, setSubmissionFilter] = useState<string>('All');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // Project Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    const subs = await getContactSubmissions();
    const projs = await fetchProjects();
    setSubmissions(subs);
    setProjects(projs);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: SubmissionStatus) => {
    await updateSubmissionStatus(id, newStatus);
    setSubmissions(prev =>
      prev.map(s => (s.id === id ? { ...s, status: newStatus } : s))
    );
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission(prev => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.title) return;

    await saveProjectRecord(editingProject);
    setProjectModalOpen(false);
    setEditingProject(null);
    loadData();
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProjectRecord(id);
      loadData();
    }
  };

  const handleTogglePublish = async (project: Project) => {
    await saveProjectRecord({
      ...project,
      published: !project.published
    });
    loadData();
  };

  const filteredSubmissions = submissions.filter(s => {
    if (submissionFilter === 'All') return true;
    return s.status === submissionFilter;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <BrandLogo size="sm" />
          <span className="text-xs px-2.5 py-1 rounded bg-brand-500/20 text-brand-400 font-mono font-bold">
            ADMIN PANEL
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={loadData}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          <Button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            variant="ghost"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
          >
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 gap-4">
          <button
            onClick={() => setActiveTab('submissions')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'submissions'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Project Enquiries ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'projects'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Projects ({projects.length})</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: SUBMISSIONS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Filter Status:</span>
                <select
                  value={submissionFilter}
                  onChange={(e) => setSubmissionFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
                >
                  <option value="All">All Statuses ({submissions.length})</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div className="text-xs text-slate-400">
                Showing <strong className="text-slate-200">{filteredSubmissions.length}</strong> enquiries
              </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-dark-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Client / Company</th>
                      <th className="p-4">Service</th>
                      <th className="p-4">Budget</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredSubmissions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No project enquiries found for this status.
                        </td>
                      </tr>
                    ) : (
                      filteredSubmissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 text-slate-400 font-mono whitespace-nowrap">
                            {new Date(sub.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-100">{sub.name}</div>
                            {sub.companyName && (
                              <div className="text-[11px] text-slate-400">{sub.companyName}</div>
                            )}
                          </td>
                          <td className="p-4 text-brand-300 font-medium whitespace-nowrap">
                            {sub.service}
                          </td>
                          <td className="p-4 whitespace-nowrap font-mono text-slate-400">
                            {sub.budget}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            <select
                              value={sub.status}
                              onChange={(e) => handleStatusChange(sub.id, e.target.value as SubmissionStatus)}
                              className="bg-slate-950 border border-slate-800 text-xs font-semibold rounded-lg px-2.5 py-1 text-slate-200 outline-none focus:border-brand-500"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Discussion">In Discussion</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="Converted">Converted</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => setSelectedSubmission(sub)}
                              className="px-3 py-1 bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 rounded-lg text-xs font-semibold transition-colors"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PROJECTS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-100">Showcase & Case Study Projects</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    title: '',
                    slug: '',
                    category: 'Business Application',
                    description: '',
                    overview: '',
                    businessProblem: '',
                    solution: '',
                    features: ['Feature 1', 'Feature 2'],
                    technologies: ['React', 'TypeScript', 'Tailwind CSS'],
                    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
                    projectStatus: 'Concept Project',
                    published: true,
                    objective: 'Custom business objective.'
                  });
                  setProjectModalOpen(true);
                }}
                variant="primary"
                size="sm"
                icon={<Plus className="w-4 h-4" />}
              >
                Add New Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <Card key={proj.id} className="p-5 flex flex-col justify-between space-y-4 border-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant={proj.projectStatus === 'Concept Project' ? 'concept' : 'demo'}>
                        {proj.projectStatus}
                      </Badge>
                      <button
                        onClick={() => handleTogglePublish(proj)}
                        className={`text-xs font-semibold flex items-center gap-1 px-2 py-0.5 rounded border ${
                          proj.published
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {proj.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{proj.published ? 'Published' : 'Draft'}</span>
                      </button>
                    </div>

                    <h3 className="font-bold text-lg text-slate-100">{proj.title}</h3>
                    <p className="text-slate-400 text-xs line-clamp-2">{proj.description}</p>
                    <div className="text-[11px] font-mono text-brand-400">{proj.category}</div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setProjectModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                        aria-label="Edit project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 rounded-lg transition-colors border border-red-500/20"
                        aria-label="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <a
                      href={`/projects/${proj.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-400 font-semibold hover:underline"
                    >
                      Preview Page →
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* SUBMISSION DETAIL MODAL */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-brand-400">ENQUIRY DETAILS</span>
                <h3 className="text-xl font-bold text-slate-100">{selectedSubmission.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Company</span>
                  <span className="text-slate-200 font-medium">{selectedSubmission.companyName || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Date Submitted</span>
                  <span className="text-slate-200 font-medium">{new Date(selectedSubmission.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Email</span>
                  <a href={`mailto:${selectedSubmission.email}`} className="text-brand-400 font-medium hover:underline">
                    {selectedSubmission.email}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Phone</span>
                  <a href={`tel:${selectedSubmission.phone}`} className="text-brand-400 font-medium hover:underline">
                    {selectedSubmission.phone}
                  </a>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Service</span>
                  <span className="text-slate-200 font-medium">{selectedSubmission.service}</span>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Budget</span>
                  <span className="text-slate-200 font-medium">{selectedSubmission.budget}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold block mb-1">Project Requirements</span>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedSubmission.message}
                </div>
              </div>

              <div>
                <span className="text-slate-500 uppercase font-semibold block mb-1">Update Status</span>
                <select
                  value={selectedSubmission.status}
                  onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as SubmissionStatus)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-semibold outline-none focus:border-brand-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Discussion">In Discussion</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <Button onClick={() => setSelectedSubmission(null)} variant="secondary" size="sm">
                Close Modal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT ADD / EDIT MODAL */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-card border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold text-slate-100">
                {editingProject.id ? 'Edit Project' : 'Create New Project Case Study'}
              </h3>
              <button
                onClick={() => {
                  setProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. Business CRM System"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category || 'Business Application'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  >
                    <option value="Website">Website</option>
                    <option value="Business Application">Business Application</option>
                    <option value="Hospitality / Website">Hospitality / Website</option>
                    <option value="Real Estate / Website">Real Estate / Website</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Short 1-2 sentence overview for cards"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Full Overview</label>
                <textarea
                  rows={3}
                  value={editingProject.overview || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                  placeholder="Detailed project summary"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Business Problem</label>
                  <textarea
                    rows={3}
                    value={editingProject.businessProblem || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, businessProblem: e.target.value })}
                    placeholder="Problem the business was facing..."
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Proposed Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="How the software solves it..."
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Status Label</label>
                  <select
                    value={editingProject.projectStatus || 'Concept Project'}
                    onChange={(e) => setEditingProject({ ...editingProject, projectStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  >
                    <option value="Concept Project">Concept Project</option>
                    <option value="Demo Project">Demo Project</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Image URL</label>
                  <input
                    type="text"
                    value={editingProject.images?.[0] || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Project Objective</label>
                <input
                  type="text"
                  value={editingProject.objective || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, objective: e.target.value })}
                  placeholder="Objective statement (no fake numerical metrics)"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Project Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
