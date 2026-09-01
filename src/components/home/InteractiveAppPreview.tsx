import React, { useState } from 'react';
import { Layout, Database, ShieldCheck, BarChart2, CheckCircle, Search, TrendingUp, Users, FileText } from 'lucide-react';

export const InteractiveAppPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'website' | 'crm' | 'dashboard'>('website');

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Window Title Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-brand-500/80" />
          <div className="w-3 h-3 rounded-full bg-brand-400/80" />
          <div className="w-3 h-3 rounded-full bg-brand-300/80" />
        </div>
        <div className="flex items-center bg-slate-900 px-3 py-1 rounded-md border border-slate-800 text-xs text-slate-400 font-mono gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          tanovax-platform.app
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
          <span>SSL 256-Bit</span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="bg-slate-900/50 border-b border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('website')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'website'
              ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Website Preview</span>
        </button>
        <button
          onClick={() => setActiveTab('crm')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'crm'
              ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Custom CRM Workflow</span>
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'dashboard'
              ? 'bg-brand-500/20 text-brand-400 border border-brand-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Business Analytics</span>
        </button>
      </div>

      {/* Interactive Mockup Workspace */}
      <div className="p-6 min-h-[320px] bg-dark-bg/60">
        {activeTab === 'website' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-bold text-xs">
                  TX
                </div>
                <div className="space-y-1">
                  <div className="h-3 w-32 bg-slate-700 rounded" />
                  <div className="h-2 w-20 bg-slate-800 rounded" />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="h-7 w-20 bg-brand-500/20 rounded border border-brand-500/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="md:col-span-2 p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="h-4 w-3/4 bg-slate-700 rounded" />
                <div className="h-3 w-full bg-slate-800 rounded" />
                <div className="h-3 w-5/6 bg-slate-800 rounded" />
                <div className="pt-2 flex gap-3">
                  <div className="h-8 w-28 bg-brand-500 rounded-lg flex items-center justify-center text-slate-950 font-bold text-xs">
                    View Catalog
                  </div>
                  <div className="h-8 w-24 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center text-slate-300 text-xs">
                    Contact Us
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/90 border border-brand-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-brand-400">Live Lead Capture</span>
                  <CheckCircle className="w-4 h-4 text-brand-400" />
                </div>
                <div className="h-7 bg-slate-950 rounded border border-slate-800 px-2 text-[10px] text-slate-400 flex items-center">
                  Name: Client Prospect
                </div>
                <div className="h-7 bg-slate-950 rounded border border-slate-800 px-2 text-[10px] text-slate-400 flex items-center">
                  Requirement: Web App
                </div>
                <div className="h-7 bg-brand-500 text-slate-950 text-xs font-bold rounded flex items-center justify-center">
                  Submit Inquiry
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'crm' && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-200">Sales Pipeline Board</span>
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" />
                <span className="text-slate-500">Filter Leads...</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* Column 1 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-800">
                  <span>NEW LEADS</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">3</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Horizon Real Estate</div>
                  <div className="text-[10px] text-brand-400">Project Website Inquiry</div>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Nexus Logistics</div>
                  <div className="text-[10px] text-brand-300">Inventory Software</div>
                </div>
              </div>

              {/* Column 2 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-800">
                  <span>IN DISCUSSION</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">2</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-brand-500/40 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Apex Medical Corp</div>
                  <div className="text-[10px] text-brand-400">Custom Billing Portal</div>
                </div>
              </div>

              {/* Column 3 */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 pb-1 border-b border-slate-800">
                  <span>PROPOSAL SENT</span>
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">1</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-brand-400/50 space-y-1">
                  <div className="text-xs font-semibold text-slate-200">Grand Hotel & Spa</div>
                  <div className="text-[10px] text-brand-300">Booking Web Portal</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Monthly Enquiries</span>
                  <TrendingUp className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-lg font-bold text-white">+48</div>
                <div className="text-[10px] text-brand-400">+24% from last month</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Active Clients</span>
                  <Users className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-lg font-bold text-white">18</div>
                <div className="text-[10px] text-brand-400">100% SLA uptime</div>
              </div>
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Invoices Issued</span>
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <div className="text-lg font-bold text-white">142</div>
                <div className="text-[10px] text-brand-300">Automated PDF sync</div>
              </div>
            </div>

            {/* Visual Bar chart graphic matching brand teal */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Business Activity Metrics</span>
                <span className="text-brand-400 font-mono">LIVE INSIGHTS</span>
              </div>
              <div className="h-20 flex items-end justify-between gap-3 pt-4 border-b border-slate-800 pb-2">
                <div className="w-full bg-slate-800 rounded-t h-[40%]" />
                <div className="w-full bg-slate-800 rounded-t h-[60%]" />
                <div className="w-full bg-brand-500/40 rounded-t h-[75%]" />
                <div className="w-full bg-brand-500 rounded-t h-[95%]" />
                <div className="w-full bg-slate-800 rounded-t h-[70%]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
