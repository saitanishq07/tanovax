import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { 
  getLeads,
  saveLeadRecord,
  deleteLeadRecord,
  addNoteToLead,
  getQuotations,
  saveQuotationRecord,
  deleteQuotationRecord,
  fetchProjects, 
  saveProjectRecord, 
  deleteProjectRecord,
  fetchSiteSettings,
  saveSiteSettings,
  DEFAULT_SITE_SETTINGS,
  formatINR
} from '../firebase/services';
import { 
  Lead, 
  LeadStatus, 
  LeadSource, 
  Quotation, 
  QuotationStatus, 
  QuotationLineItem,
  Project, 
  SiteSettings 
} from '../types';
import { BrandLogo } from '../components/common/BrandLogo';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { QuotationPreviewModal } from '../components/admin/QuotationPreviewModal';
import { 
  LogOut, 
  Users, 
  FileText, 
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
  CheckCircle,
  LayoutDashboard,
  Search,
  ArrowUpRight,
  Printer,
  Copy,
  TrendingUp,
  Award
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'leads' | 'quotations' | 'projects' | 'settings'>('dashboard');

  // Master Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Settings state
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Dashboard Filters
  const [dashboardTimeFilter, setDashboardTimeFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // Lead Filters & Selected State
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState<string>('All');
  const [leadSourceFilter, setLeadSourceFilter] = useState<string>('All');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Lead Modal & Note States
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Quotation Filters & States
  const [quotationSearch, setQuotationSearch] = useState('');
  const [quotationStatusFilter, setQuotationStatusFilter] = useState<string>('All');
  const [selectedQuotationForPreview, setSelectedQuotationForPreview] = useState<Quotation | null>(null);
  const [quotationModalOpen, setQuotationModalOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Partial<Quotation> | null>(null);

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
    const [fetchedLeads, fetchedQuotations, fetchedProjects, fetchedSettings] = await Promise.all([
      getLeads(),
      getQuotations(),
      fetchProjects(),
      fetchSiteSettings()
    ]);
    setLeads(fetchedLeads);
    setQuotations(fetchedQuotations);
    setProjects(fetchedProjects);
    setSiteSettings(fetchedSettings);

    // Keep selected lead updated if active
    if (selectedLead) {
      const refreshed = fetchedLeads.find(l => l.id === selectedLead.id);
      if (refreshed) setSelectedLead(refreshed);
    }
    setLoading(false);
  };

  // --- LEAD HANDLERS ---
  const handleLeadStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    await saveLeadRecord({ id: leadId, status: newStatus });
    loadData();
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead?.fullName) return;
    await saveLeadRecord(editingLead as any);
    setLeadModalOpen(false);
    setEditingLead(null);
    loadData();
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead record?')) {
      await deleteLeadRecord(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      loadData();
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;
    await addNoteToLead(selectedLead.id, newNoteText);
    setNewNoteText('');
    loadData();
  };

  const handleCreateQuotationFromLead = (lead: Lead) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + 15);

    setEditingQuotation({
      leadId: lead.id,
      clientName: lead.fullName,
      companyName: lead.companyName || '',
      email: lead.email,
      phone: lead.phone,
      projectName: lead.serviceInterested || 'Web / Application Project',
      projectDescription: lead.messageRequirement || '',
      date: todayStr,
      validUntil: validUntilDate.toISOString().split('T')[0],
      deliveryTimeline: lead.projectTimeline || '2–4 Weeks',
      paymentTerms: '50% advance upon project kickoff, 50% upon final delivery.',
      termsAndConditions: '1. Quotation valid for 15 days.\n2. Includes 30 days post-launch technical support.',
      status: 'Draft',
      taxRate: 18,
      lineItems: [
        {
          id: 'item_1',
          description: `${lead.serviceInterested || 'Custom Software Development'} Service`,
          quantity: 1,
          unitPrice: 40000,
          discount: 0,
          taxRate: 18,
          taxAmount: 7200,
          total: 47200
        }
      ]
    });
    setQuotationModalOpen(true);
  };

  // --- QUOTATION HANDLERS ---
  const handleSaveQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuotation?.clientName || !editingQuotation.projectName) return;
    await saveQuotationRecord(editingQuotation);
    setQuotationModalOpen(false);
    setEditingQuotation(null);
    loadData();
  };

  const handleDeleteQuotation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      await deleteQuotationRecord(id);
      loadData();
    }
  };

  const handleDuplicateQuotation = async (quo: Quotation) => {
    const copy = {
      ...quo,
      id: undefined,
      quotationNumber: undefined,
      date: new Date().toISOString().split('T')[0],
      status: 'Draft' as QuotationStatus
    };
    await saveQuotationRecord(copy);
    loadData();
  };

  const handleQuotationStatusChange = async (quoId: string, status: QuotationStatus) => {
    await saveQuotationRecord({ id: quoId, status });
    loadData();
  };

  // --- PROJECT HANDLERS ---
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
    await saveProjectRecord({ ...project, published: !project.published });
    loadData();
  };

  // --- SITE SETTINGS HANDLERS ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    await saveSiteSettings(siteSettings);
    setSavingSettings(false);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 4000);
  };

  // --- FILTERED LEADS COMPUTATION ---
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.fullName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.companyName && l.companyName.toLowerCase().includes(leadSearch.toLowerCase())) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.phone.includes(leadSearch) ||
      l.serviceInterested.toLowerCase().includes(leadSearch.toLowerCase());

    const matchesStatus = leadStatusFilter === 'All' || l.status === leadStatusFilter;
    const matchesSource = leadSourceFilter === 'All' || l.leadSource === leadSourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // --- FILTERED QUOTATIONS COMPUTATION ---
  const filteredQuotations = quotations.filter(q => {
    const matchesSearch = 
      q.quotationNumber.toLowerCase().includes(quotationSearch.toLowerCase()) ||
      q.clientName.toLowerCase().includes(quotationSearch.toLowerCase()) ||
      (q.companyName && q.companyName.toLowerCase().includes(quotationSearch.toLowerCase())) ||
      q.projectName.toLowerCase().includes(quotationSearch.toLowerCase());

    const matchesStatus = quotationStatusFilter === 'All' || q.status === quotationStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // --- DASHBOARD STATS COMPUTATION ---
  const now = new Date();
  const filterByTime = (dateStr: string) => {
    if (dashboardTimeFilter === 'all') return true;
    const d = new Date(dateStr);
    if (dashboardTimeFilter === 'today') {
      return d.toDateString() === now.toDateString();
    }
    if (dashboardTimeFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return d >= oneWeekAgo;
    }
    if (dashboardTimeFilter === 'month') {
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    return true;
  };

  const timeFilteredLeads = leads.filter(l => filterByTime(l.createdAt));
  const timeFilteredQuotations = quotations.filter(q => filterByTime(q.createdAt));

  const totalLeads = timeFilteredLeads.length;
  const newLeadsCount = timeFilteredLeads.filter(l => l.status === 'NEW').length;
  const activeLeadsCount = timeFilteredLeads.filter(l => 
    ['CONTACTED', 'REQUIREMENT RECEIVED', 'PROPOSAL SENT', 'NEGOTIATION'].includes(l.status)
  ).length;
  const wonLeadsCount = timeFilteredLeads.filter(l => l.status === 'WON').length;

  const totalQuotationsCount = timeFilteredQuotations.length;
  const pendingQuotations = timeFilteredQuotations.filter(q => ['Draft', 'Sent', 'Viewed'].includes(q.status));
  const acceptedQuotations = timeFilteredQuotations.filter(q => q.status === 'Accepted');

  const acceptedQuotationValue = acceptedQuotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);
  const totalQuotationValue = timeFilteredQuotations.reduce((sum, q) => sum + (q.grandTotal || 0), 0);

  // Pipeline counts breakdown
  const pipelineCounts = {
    NEW: timeFilteredLeads.filter(l => l.status === 'NEW').length,
    CONTACTED: timeFilteredLeads.filter(l => l.status === 'CONTACTED').length,
    'REQUIREMENT RECEIVED': timeFilteredLeads.filter(l => l.status === 'REQUIREMENT RECEIVED').length,
    'PROPOSAL SENT': timeFilteredLeads.filter(l => l.status === 'PROPOSAL SENT').length,
    NEGOTIATION: timeFilteredLeads.filter(l => l.status === 'NEGOTIATION').length,
    WON: timeFilteredLeads.filter(l => l.status === 'WON').length,
    LOST: timeFilteredLeads.filter(l => l.status === 'LOST').length
  };

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case 'NEW': return 'brand';
      case 'CONTACTED': return 'slate';
      case 'REQUIREMENT RECEIVED': return 'slate';
      case 'PROPOSAL SENT': return 'slate';
      case 'NEGOTIATION': return 'slate';
      case 'WON': return 'status';
      case 'LOST': return 'slate';
      default: return 'slate';
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 flex flex-col font-sans">
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BrandLogo />
          <span className="px-2.5 py-0.5 rounded-md bg-brand-500/20 text-brand-400 border border-brand-500/30 text-xs font-semibold">
            Executive Admin Portal
          </span>
        </div>
        <div className="flex items-center gap-3">
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
        <div className="flex border-b border-slate-800 gap-2 sm:gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Executive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'leads'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Lead Management ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotations')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'quotations'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quotations & Proposals ({quotations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'projects'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-2 text-sm font-semibold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
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
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Header Toolbar & Time Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-slate-100">TanovaX Business Overview</h2>
                <p className="text-xs text-slate-400">Real-time statistics for leads, sales pipeline, and proposals</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {(['today', 'week', 'month', 'all'] as const).map(tf => (
                    <button
                      key={tf}
                      onClick={() => setDashboardTimeFilter(tf)}
                      className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                        dashboardTimeFilter === tf
                          ? 'bg-brand-500/20 text-brand-400 font-bold border border-brand-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {tf === 'all' ? 'All Time' : tf === 'week' ? 'This Week' : tf === 'month' ? 'This Month' : 'Today'}
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    setEditingLead({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      serviceInterested: 'Website Development',
                      budgetRange: '₹25,000 – ₹50,000',
                      projectTimeline: 'Within 1 Month',
                      messageRequirement: '',
                      leadSource: 'Website',
                      status: 'NEW'
                    });
                    setLeadModalOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  + New Lead
                </Button>
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Total Enquiries</span>
                  <Users className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-3xl font-extrabold text-slate-100">{totalLeads}</div>
                <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span><strong className="text-brand-400">{newLeadsCount}</strong> NEW</span>
                  <span><strong className="text-emerald-400">{wonLeadsCount}</strong> WON</span>
                </div>
              </Card>

              <Card className="p-5 border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Active Pipeline</span>
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-blue-400">{activeLeadsCount}</div>
                <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/80">
                  Leads in discussions & negotiations
                </div>
              </Card>

              <Card className="p-5 border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Total Quotations</span>
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">{totalQuotationsCount}</div>
                <div className="text-xs text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span><strong className="text-slate-200">{pendingQuotations.length}</strong> Pending</span>
                  <span><strong className="text-emerald-400">{acceptedQuotations.length}</strong> Accepted</span>
                </div>
              </Card>

              <Card className="p-5 border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                  <span>Pipeline Quotation Value</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {formatINR(totalQuotationValue)}
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                  Accepted: <strong className="text-emerald-400">{formatINR(acceptedQuotationValue)}</strong>
                </div>
              </Card>
            </div>

            {/* Lead Pipeline Visual Distribution */}
            <Card className="p-6 border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                Lead Pipeline Stages
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(pipelineCounts).map(([stage, count]) => (
                  <div key={stage} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 text-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight block truncate">
                      {stage}
                    </span>
                    <span className={`text-xl font-extrabold block ${
                      stage === 'WON' ? 'text-emerald-400' : stage === 'NEW' ? 'text-brand-400' : 'text-slate-200'
                    }`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tables Grid: Recent Leads & Recent Quotations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Leads Table */}
              <Card className="p-6 border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-200 text-base">Recent Leads</h3>
                  <button
                    onClick={() => setActiveTab('leads')}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                  >
                    View All Leads <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {timeFilteredLeads.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No leads recorded for selected period.</p>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {timeFilteredLeads.slice(0, 5).map(lead => (
                      <div key={lead.id} className="py-3 flex items-center justify-between text-xs gap-3">
                        <div>
                          <div className="font-bold text-slate-100">{lead.fullName}</div>
                          <div className="text-slate-400">{lead.serviceInterested} • <span className="text-brand-400">{lead.leadSource}</span></div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={getStatusBadgeVariant(lead.status)} className="text-[10px]">
                            {lead.status}
                          </Badge>
                          <div className="text-[10px] text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Recent Quotations Table */}
              <Card className="p-6 border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-200 text-base">Recent Proposals & Quotations</h3>
                  <button
                    onClick={() => setActiveTab('quotations')}
                    className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1"
                  >
                    View All Quotations <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {timeFilteredQuotations.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No quotations generated yet.</p>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {timeFilteredQuotations.slice(0, 5).map(quo => (
                      <div key={quo.id} className="py-3 flex items-center justify-between text-xs gap-3">
                        <div>
                          <div className="font-bold text-slate-100">{quo.quotationNumber} — {quo.clientName}</div>
                          <div className="text-slate-400">{quo.projectName}</div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="font-bold text-emerald-400 font-mono">{formatINR(quo.grandTotal)}</div>
                          <Badge variant="slate" className="text-[10px]">
                            {quo.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: LEAD MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search leads by name, email, phone, company, or service..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-500"
                >
                  <option value="All">All Statuses ({leads.length})</option>
                  <option value="NEW">NEW</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="REQUIREMENT RECEIVED">REQUIREMENT RECEIVED</option>
                  <option value="PROPOSAL SENT">PROPOSAL SENT</option>
                  <option value="NEGOTIATION">NEGOTIATION</option>
                  <option value="WON">WON</option>
                  <option value="LOST">LOST</option>
                </select>

                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-500"
                >
                  <option value="All">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Google">Google</option>
                  <option value="Other">Other</option>
                </select>

                <Button
                  onClick={() => {
                    setEditingLead({
                      fullName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      serviceInterested: 'Website Development',
                      budgetRange: '₹25,000 – ₹50,000',
                      projectTimeline: 'Within 1 Month',
                      messageRequirement: '',
                      leadSource: 'Website',
                      status: 'NEW'
                    });
                    setLeadModalOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  + Add Lead
                </Button>
              </div>
            </div>

            {/* Main Lead Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Leads List */}
              <div className="lg:col-span-2 space-y-4">
                {loading ? (
                  <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-brand-400" />
                    <span>Loading leads...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <Card className="p-12 text-center border-dashed border-slate-800">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-300">No leads found</h3>
                    <p className="text-sm text-slate-500 mt-1">Leads captured via website contact form or added manually will appear here.</p>
                  </Card>
                ) : (
                  filteredLeads.map(lead => (
                    <Card
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className={`p-5 cursor-pointer border transition-all ${
                        selectedLead?.id === lead.id
                          ? 'border-brand-500 bg-slate-900'
                          : 'border-slate-800 hover:border-slate-700 bg-slate-900/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-100">{lead.fullName}</h3>
                            {lead.companyName && (
                              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                                {lead.companyName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{lead.email} • {lead.phone}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant={getStatusBadgeVariant(lead.status)}>
                            {lead.status}
                          </Badge>
                          <span className="text-[10px] text-brand-400 font-semibold bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                            Source: {lead.leadSource}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                        <span><strong>Service:</strong> {lead.serviceInterested}</span>
                        <span><strong>Budget:</strong> {lead.budgetRange}</span>
                        <span>{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>

              {/* Right Col: Selected Lead Detail Drawer */}
              <div className="lg:col-span-1">
                {selectedLead ? (
                  <Card className="p-6 border-slate-800 sticky top-24 space-y-6 max-h-[85vh] overflow-y-auto">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="font-bold text-lg text-slate-100">{selectedLead.fullName}</h3>
                        <p className="text-xs text-slate-400">{selectedLead.companyName || 'Individual Client'}</p>
                      </div>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Status Changer */}
                    <div>
                      <span className="text-slate-500 font-semibold text-[10px] uppercase tracking-wider block mb-1">
                        Change Lead Pipeline Status
                      </span>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleLeadStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs outline-none focus:border-brand-500 font-bold"
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="REQUIREMENT RECEIVED">REQUIREMENT RECEIVED</option>
                        <option value="PROPOSAL SENT">PROPOSAL SENT</option>
                        <option value="NEGOTIATION">NEGOTIATION</option>
                        <option value="WON">WON</option>
                        <option value="LOST">LOST</option>
                      </select>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={() => handleCreateQuotationFromLead(selectedLead)}
                        variant="primary"
                        size="sm"
                        className="w-full text-xs"
                        icon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Create Quotation
                      </Button>

                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Hi ${selectedLead.fullName}, regarding your enquiry with TanovaX for ${selectedLead.serviceInterested}...`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 rounded-xl text-center font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>

                    {/* Details Breakdown */}
                    <div className="space-y-3 text-xs border-t border-slate-800 pt-3">
                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block">Contact Info</span>
                        <p className="text-slate-200 font-medium">{selectedLead.email || 'No Email'}</p>
                        <p className="text-slate-200 font-medium">{selectedLead.phone || 'No Phone'}</p>
                      </div>

                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block">Service & Budget</span>
                        <p className="text-brand-400 font-bold">{selectedLead.serviceInterested}</p>
                        <p className="text-slate-300">Budget: {selectedLead.budgetRange}</p>
                        <p className="text-slate-400 text-[11px]">Timeline: {selectedLead.projectTimeline}</p>
                      </div>

                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block">Requirement / Message</span>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto mt-1">
                          {selectedLead.messageRequirement || 'No message recorded.'}
                        </div>
                      </div>

                      {/* Follow-up date setter */}
                      <div>
                        <span className="text-slate-500 font-semibold uppercase text-[10px] block mb-1">Follow-up Date</span>
                        <input
                          type="date"
                          value={selectedLead.followUpDate || ''}
                          onChange={(e) => saveLeadRecord({ id: selectedLead.id, followUpDate: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-slate-200 text-xs outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    {/* Notes Section */}
                    <div className="border-t border-slate-800 pt-4 space-y-3">
                      <span className="text-slate-400 font-bold text-xs uppercase tracking-wider block">
                        Lead Notes ({selectedLead.notes?.length || 0})
                      </span>

                      <form onSubmit={handleAddNote} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a follow-up note..."
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
                        />
                        <Button type="submit" variant="secondary" size="sm">
                          Add Note
                        </Button>
                      </form>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedLead.notes && selectedLead.notes.length > 0 ? (
                          selectedLead.notes.map(n => (
                            <div key={n.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                              <p className="text-slate-300">{n.content}</p>
                              <div className="text-[10px] text-slate-500 flex justify-between">
                                <span>By {n.createdBy}</span>
                                <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-500">No notes added yet.</p>
                        )}
                      </div>
                    </div>

                    {/* Edit & Delete Actions */}
                    <div className="pt-4 border-t border-slate-800 flex justify-between gap-2">
                      <Button
                        onClick={() => {
                          setEditingLead(selectedLead);
                          setLeadModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                        icon={<Edit3 className="w-3.5 h-3.5" />}
                      >
                        Edit Lead
                      </Button>

                      <Button
                        onClick={() => handleDeleteLead(selectedLead.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:bg-red-500/10 hover:text-red-300"
                        icon={<Trash2 className="w-3.5 h-3.5" />}
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <Card className="p-8 text-center border-slate-800 text-slate-500 text-xs">
                    Select a lead from the list to view full details, add notes, update follow-up date, or generate a quotation.
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: QUOTATIONS & PROPOSALS */}
        {/* ==================================================== */}
        {activeTab === 'quotations' && (
          <div className="space-y-6">
            {/* Header & Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search quotations by quotation number, client name, company, or project..."
                  value={quotationSearch}
                  onChange={(e) => setQuotationSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={quotationStatusFilter}
                  onChange={(e) => setQuotationStatusFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none focus:border-brand-500"
                >
                  <option value="All">All Statuses ({quotations.length})</option>
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Viewed">Viewed</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Expired">Expired</option>
                </select>

                <Button
                  onClick={() => {
                    const todayStr = new Date().toISOString().split('T')[0];
                    const validUntilDate = new Date();
                    validUntilDate.setDate(validUntilDate.getDate() + 15);

                    setEditingQuotation({
                      clientName: '',
                      companyName: '',
                      email: '',
                      phone: '',
                      projectName: '',
                      projectDescription: '',
                      date: todayStr,
                      validUntil: validUntilDate.toISOString().split('T')[0],
                      deliveryTimeline: '2–3 Weeks',
                      paymentTerms: '50% advance upon project kickoff, 50% upon delivery.',
                      termsAndConditions: '1. Quotation valid for 15 days.\n2. Includes 30 days post-launch support.',
                      status: 'Draft',
                      taxRate: 18,
                      lineItems: [
                        {
                          id: 'item_1',
                          description: 'Custom Web / Application Development',
                          quantity: 1,
                          unitPrice: 35000,
                          discount: 0,
                          taxRate: 18,
                          taxAmount: 6300,
                          total: 41300
                        }
                      ]
                    });
                    setQuotationModalOpen(true);
                  }}
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                >
                  + Create Quotation
                </Button>
              </div>
            </div>

            {/* Quotations List Table */}
            {loading ? (
              <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-brand-400" />
                <span>Loading proposals & quotations...</span>
              </div>
            ) : filteredQuotations.length === 0 ? (
              <Card className="p-12 text-center border-dashed border-slate-800">
                <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-300">No quotations found</h3>
                <p className="text-sm text-slate-500 mt-1">Create professional proposals for your leads to send itemized pricing.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredQuotations.map(quo => (
                  <Card key={quo.id} className="p-5 border-slate-800 space-y-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-mono font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                            {quo.quotationNumber}
                          </span>
                          <h4 className="font-bold text-slate-100 text-base mt-1.5">{quo.clientName}</h4>
                          {quo.companyName && <p className="text-xs text-slate-400">{quo.companyName}</p>}
                        </div>

                        <select
                          value={quo.status}
                          onChange={(e) => handleQuotationStatusChange(quo.id, e.target.value as QuotationStatus)}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-200 outline-none font-bold"
                        >
                          <option value="Draft">Draft</option>
                          <option value="Sent">Sent</option>
                          <option value="Viewed">Viewed</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Expired">Expired</option>
                        </select>
                      </div>

                      <div className="text-xs text-slate-300">
                        <strong className="text-slate-400 block text-[10px] uppercase">Project Name</strong>
                        <span>{quo.projectName}</span>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase block">Grand Total</span>
                          <span className="text-lg font-bold font-mono text-emerald-400">{formatINR(quo.grandTotal)}</span>
                        </div>
                        <div className="text-right text-[10px] text-slate-500">
                          <div>Date: {quo.date}</div>
                          <div>Valid: {quo.validUntil}</div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                      <Button
                        onClick={() => setSelectedQuotationForPreview(quo)}
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        icon={<Printer className="w-3.5 h-3.5" />}
                      >
                        Print / PDF
                      </Button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingQuotation(quo);
                            setQuotationModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                          title="Edit Quotation"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDuplicateQuotation(quo)}
                          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
                          title="Duplicate Quotation"
                        >
                          <Copy className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeleteQuotation(quo.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
                          title="Delete Quotation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: PROJECTS MANAGEMENT */}
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
        {/* TAB 5: WHATSAPP & SITE SETTINGS */}
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

      {/* ==================================================== */}
      {/* MODAL 1: LEAD ADD / EDIT MODAL */}
      {/* ==================================================== */}
      {leadModalOpen && editingLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingLead.id ? 'Edit Lead Record' : 'Add New Business Lead'}
              </h3>
              <button
                onClick={() => {
                  setLeadModalOpen(false);
                  setEditingLead(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingLead.fullName || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, fullName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingLead.companyName || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, companyName: e.target.value })}
                    placeholder="e.g. Apex Enterprises"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={editingLead.email || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    placeholder="rahul@company.com"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={editingLead.phone || ''}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Service Interested</label>
                  <input
                    type="text"
                    value={editingLead.serviceInterested || 'Website Development'}
                    onChange={(e) => setEditingLead({ ...editingLead, serviceInterested: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Budget Range</label>
                  <select
                    value={editingLead.budgetRange || '₹25,000 – ₹50,000'}
                    onChange={(e) => setEditingLead({ ...editingLead, budgetRange: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  >
                    <option value="Under ₹25,000">Under ₹25,000</option>
                    <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                    <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                    <option value="₹1,00,000+">₹1,00,000+</option>
                    <option value="Not Sure">Not Sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Lead Source</label>
                  <select
                    value={editingLead.leadSource || 'Website'}
                    onChange={(e) => setEditingLead({ ...editingLead, leadSource: e.target.value as LeadSource })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  >
                    <option value="Website">Website</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Google">Google</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 uppercase font-semibold mb-1">Requirement / Message</label>
                <textarea
                  rows={3}
                  value={editingLead.messageRequirement || ''}
                  onChange={(e) => setEditingLead({ ...editingLead, messageRequirement: e.target.value })}
                  placeholder="Details of what the client requires..."
                  className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setLeadModalOpen(false);
                    setEditingLead(null);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Lead Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: QUOTATION CREATE / EDIT MODAL */}
      {/* ==================================================== */}
      {quotationModalOpen && editingQuotation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="font-bold text-lg text-slate-100">
                {editingQuotation.id ? `Edit Proposal ${editingQuotation.quotationNumber}` : 'Generate New Proposal / Quotation'}
              </h3>
              <button
                onClick={() => {
                  setQuotationModalOpen(false);
                  setEditingQuotation(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuotation} className="space-y-6 text-xs">
              {/* Client Header Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={editingQuotation.clientName || ''}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, clientName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Company Name</label>
                  <input
                    type="text"
                    value={editingQuotation.companyName || ''}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, companyName: e.target.value })}
                    placeholder="e.g. Apex Corp"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={editingQuotation.email || ''}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingQuotation.phone || ''}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={editingQuotation.projectName || ''}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, projectName: e.target.value })}
                    placeholder="Website Development"
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-semibold mb-1">Tax / GST %</label>
                  <input
                    type="number"
                    value={editingQuotation.taxRate !== undefined ? editingQuotation.taxRate : 18}
                    onChange={(e) => setEditingQuotation({ ...editingQuotation, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-100 outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Dynamic Line Items Editor */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-200 font-bold uppercase text-xs">Itemized Deliverables & Pricing</span>
                  <button
                    type="button"
                    onClick={() => {
                      const items = editingQuotation.lineItems || [];
                      const newItem: QuotationLineItem = {
                        id: 'item_' + Date.now(),
                        description: 'Custom Service Module',
                        quantity: 1,
                        unitPrice: 10000,
                        discount: 0,
                        taxRate: editingQuotation.taxRate || 18,
                        taxAmount: 1800,
                        total: 11800
                      };
                      setEditingQuotation({ ...editingQuotation, lineItems: [...items, newItem] });
                    }}
                    className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    + Add Line Item
                  </button>
                </div>

                {editingQuotation.lineItems?.map((item, idx) => (
                  <div key={item.id || idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="Description (e.g. CRM System Development)"
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...(editingQuotation.lineItems || [])];
                          updated[idx].description = e.target.value;
                          setEditingQuotation({ ...editingQuotation, lineItems: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => {
                          const updated = [...(editingQuotation.lineItems || [])];
                          updated[idx].quantity = parseInt(e.target.value) || 1;
                          setEditingQuotation({ ...editingQuotation, lineItems: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs text-center"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Unit Price"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updated = [...(editingQuotation.lineItems || [])];
                          updated[idx].unitPrice = parseFloat(e.target.value) || 0;
                          setEditingQuotation({ ...editingQuotation, lineItems: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs text-right"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Discount"
                        value={item.discount || 0}
                        onChange={(e) => {
                          const updated = [...(editingQuotation.lineItems || [])];
                          updated[idx].discount = parseFloat(e.target.value) || 0;
                          setEditingQuotation({ ...editingQuotation, lineItems: updated });
                        }}
                        className="w-full p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 text-xs text-right text-emerald-400"
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (editingQuotation.lineItems || []).filter((_, i) => i !== idx);
                          setEditingQuotation({ ...editingQuotation, lineItems: updated });
                        }}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setQuotationModalOpen(false);
                    setEditingQuotation(null);
                  }}
                  variant="ghost"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Save Proposal / Quotation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: PROJECT ADD / EDIT MODAL */}
      {/* ==================================================== */}
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

      {/* ==================================================== */}
      {/* MODAL 4: QUOTATION PREVIEW / PRINT MODAL */}
      {/* ==================================================== */}
      {selectedQuotationForPreview && (
        <QuotationPreviewModal
          quotation={selectedQuotationForPreview}
          onClose={() => setSelectedQuotationForPreview(null)}
        />
      )}
    </div>
  );
};
