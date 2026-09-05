import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  getContactSubmissions, 
  updateSubmissionStatus, 
  fetchProjects, 
  saveProjectRecord, 
  deleteProjectRecord,
  fetchSiteSettings,
  saveSiteSettings,
  DEFAULT_SITE_SETTINGS
} from '../firebase/services';
import { ContactSubmission, Project, SubmissionStatus, SiteSettings } from '../types';
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
  RefreshCw,
  Settings,
  MessageSquare,
  Save,
  CheckCircle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'submissions' | 'projects' | 'settings'>('submissions');
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Settings states
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

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
    const settings = await fetchSiteSettings();
    setSubmissions(subs);
    setProjects(projs);
    setSiteSettings(settings);
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

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    await saveSiteSettings(siteSettings);
    setSavingSettings(false);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 4000);
  };

  const filteredSubmissions = submissions.filter(s => {
    if (submissionFilter === 'All') return true;
    return s.status === submissionFilter;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="px-2.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold">
            Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button onClick={loadData} variant="ghost" size="sm" icon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}>
            Sync Data
          </Button>
          <Button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            variant="secondary"
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
        <div className="flex border-b border-slate-800 gap-6">
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

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>WhatsApp & Site Settings</span>
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

            {/* Submissions Table / Cards */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-brand-400" />
                <span>Loading project enquiries...</span>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-slate-800">
                <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No project enquiries found</h3>
                <p className="text-sm text-slate-500 mt-1">Enquiries submitted via "Start a Project" will appear here.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Submissions List */}
                <div className="lg:col-span-2 space-y-4">
                  {filteredSubmissions.map((sub) => (
                    <Card
                      key={sub.id}
                      onClick={() => setSelectedSubmission(sub)}
                      className={`p-5 cursor-pointer border transition-all ${
                        selectedSubmission?.id === sub.id
                          ? 'border-brand-500 bg-slate-900'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-100">{sub.name}</h3>
                            {sub.companyName && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {sub.companyName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{sub.email} • {sub.phone}</p>
                        </div>
                        <Badge
                          variant={
                            sub.status === 'New'
                              ? 'brand'
                              : sub.status === 'Converted'
                              ? 'status'
                              : 'slate'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span><strong>Service:</strong> {sub.service}</span>
                        <span><strong>Budget:</strong> {sub.budget}</span>
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Right Col: Selected Submission Detail Drawer */}
                <div className="lg:col-span-1">
                  {selectedSubmission ? (
                    <Card className="p-6 border-slate-800 sticky top-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <h3 className="font-bold text-lg text-slate-100">{selectedSubmission.name}</h3>
                          <p className="text-xs text-slate-400">{selectedSubmission.companyName || 'Individual'}</p>
                        </div>
                        <button
                          onClick={() => setSelectedSubmission(null)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs">
                        <div>
                          <span className="text-slate-500 font-semibold uppercase block">Update Status</span>
                          <select
                            value={selectedSubmission.status}
                            onChange={(e) => handleStatusChange(selectedSubmission.id, e.target.value as SubmissionStatus)}
                            className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs outline-none focus:border-brand-500"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Discussion">In Discussion</option>
                            <option value="Proposal Sent">Proposal Sent</option>
                            <option value="Converted">Converted</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div className="space-y-2 pt-2 border-t border-slate-800">
                          <div>
                            <span className="text-slate-500 font-semibold uppercase block">Contact Details</span>
                            <p className="text-slate-200 font-medium">{selectedSubmission.email}</p>
                            <p className="text-slate-200 font-medium">{selectedSubmission.phone}</p>
                          </div>

                          <div>
                            <span className="text-slate-500 font-semibold uppercase block">Requested Service</span>
                            <p className="text-slate-200 font-semibold text-sm text-brand-400">{selectedSubmission.service}</p>
                          </div>

                          <div>
                            <span className="text-slate-500 font-semibold uppercase block">Estimated Budget</span>
                            <p className="text-slate-200 font-medium">{selectedSubmission.budget}</p>
                          </div>

                          <div>
                            <span className="text-slate-500 font-semibold uppercase block">Submitted At</span>
                            <p className="text-slate-400">{new Date(selectedSubmission.createdAt).toLocaleString()}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 space-y-1.5">
                          <span className="text-slate-500 font-semibold uppercase block">Project Description</span>
                          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                            {selectedSubmission.message}
                          </div>
                        </div>

                        <div className="pt-4 flex gap-2">
                          <a
                            href={`mailto:${selectedSubmission.email}`}
                            className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-center font-semibold transition-colors"
                          >
                            Reply via Email
                          </a>
                          <a
                            href={`https://wa.me/${selectedSubmission.phone.replace(/[^0-9+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center font-semibold transition-colors flex items-center justify-center"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </div>
                    </Card>
                  ) : (
                    <Card className="p-8 text-center border-slate-800 text-slate-500 text-xs">
                      Select an enquiry from the list to view detailed message and update lead status.
                    </Card>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PROJECTS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <h3 className="font-bold text-slate-100">Project Portfolio & Concepts</h3>
                <p className="text-xs text-slate-400">Manage showcase software concepts displayed on /work and project details.</p>
              </div>
              <Button
                onClick={() => {
                  setEditingProject({
                    title: '',
                    slug: '',
                    category: 'Website',
                    description: '',
                    overview: '',
                    businessProblem: '',
                    solution: '',
                    features: [],
                    technologies: [],
                    images: [],
                    projectStatus: 'Demo Project',
                    published: true,
                    objective: ''
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

            {loading ? (
              <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-brand-400" />
                <span>Loading projects...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="p-5 border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="slate" className="mb-1 text-[10px]">
                            {project.category}
                          </Badge>
                          <h4 className="font-bold text-slate-100 text-base">{project.title}</h4>
                        </div>
                        <button
                          onClick={() => handleTogglePublish(project)}
                          className={`p-1.5 rounded-lg border text-xs transition-colors ${
                            project.published
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                          }`}
                          title={project.published ? 'Published (Click to Unpublish)' : 'Draft (Click to Publish)'}
                        >
                          {project.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {project.technologies?.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Button
                        onClick={() => {
                          setEditingProject(project);
                          setProjectModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteProject(project.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: WHATSAPP & SITE SETTINGS */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <Card className="p-6 border-slate-800 space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-100">WhatsApp Inquiry Settings</h2>
                  <p className="text-xs text-slate-400">Configure default pre-filled WhatsApp message & contact number for site visitors</p>
                </div>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    WhatsApp Phone Number
                  </label>
                  <input
                    type="text"
                    value={siteSettings.whatsappNumber}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                    placeholder="+916300699087"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">Include country code (e.g. +916300699087)</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Pre-Filled WhatsApp Message
                  </label>
                  <textarea
                    rows={4}
                    value={siteSettings.whatsappMessage}
                    onChange={(e) => setSiteSettings(prev => ({ ...prev, whatsappMessage: e.target.value }))}
                    placeholder="Hello TanovaX team! I am interested in starting a project for my business."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    This message will automatically open in WhatsApp when a user clicks any "Chat on WhatsApp" or "WhatsApp Inquiry" button across the website.
                  </p>
                </div>

                {/* Live Preview Box */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Live WhatsApp Link Preview</span>
                  <p className="text-xs text-slate-400 font-mono break-all select-all">
                    https://wa.me/{siteSettings.whatsappNumber.replace(/[^0-9+]/g, '')}?text={encodeURIComponent(siteSettings.whatsappMessage)}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={savingSettings}
                    className="bg-emerald-600 hover:bg-emerald-500"
                    icon={savingSettings ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  >
                    {savingSettings ? 'Saving Settings...' : 'Save WhatsApp Settings'}
                  </Button>

                  {settingsSavedToast && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl">
                      <CheckCircle className="w-4 h-4" />
                      <span>WhatsApp settings updated successfully!</span>
                    </div>
                  )}
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>

      {/* Project Add/Edit Modal */}
      {projectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingProject.id ? 'Edit Project Record' : 'Create New Project Record'}
              </h3>
              <button
                onClick={() => {
                  setProjectModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. Healthcare Patient Portal CRM"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Category</label>
                  <select
                    value={editingProject.category || 'Website'}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  >
                    <option value="Website">Website</option>
                    <option value="Business Application">Business Application</option>
                    <option value="Hospitality / Website">Hospitality / Website</option>
                    <option value="Real Estate / Website">Real Estate / Website</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Status</label>
                  <select
                    value={editingProject.projectStatus || 'Demo Project'}
                    onChange={(e) => setEditingProject({ ...editingProject, projectStatus: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  >
                    <option value="Demo Project">Demo Project</option>
                    <option value="Concept Project">Concept Project</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingProject.description || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  placeholder="Brief 2-line summary for project cards"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Overview</label>
                <textarea
                  rows={3}
                  value={editingProject.overview || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, overview: e.target.value })}
                  placeholder="Detailed project overview"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Business Problem</label>
                  <textarea
                    rows={3}
                    value={editingProject.businessProblem || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, businessProblem: e.target.value })}
                    placeholder="Challenges faced by the client"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Solution</label>
                  <textarea
                    rows={3}
                    value={editingProject.solution || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, solution: e.target.value })}
                    placeholder="How TanovaX solved the problem"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Key Features (Comma Separated)</label>
                <input
                  type="text"
                  value={editingProject.features?.join(', ') || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, features: e.target.value.split(',').map(s => s.trim()) })}
                  placeholder="Patient Intake, Appointment Scheduling, Billing"
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Technologies (Comma Separated)</label>
                  <input
                    type="text"
                    value={editingProject.technologies?.join(', ') || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, technologies: e.target.value.split(',').map(s => s.trim()) })}
                    placeholder="React, TypeScript, Firebase"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Image URL</label>
                  <input
                    type="text"
                    value={editingProject.images?.[0] || ''}
                    onChange={(e) => setEditingProject({ ...editingProject, images: [e.target.value] })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
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
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
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
