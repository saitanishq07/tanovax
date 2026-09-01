import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2, Workflow, Eye, UserCheck, ShieldCheck, Code, Layers } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <Layout
      title="About Us"
      description="Learn about TanovaX — a digital solutions brand focused on building modern websites and custom business applications for companies and growing startups."
    >
      {/* Hero */}
      <section className="py-16 lg:py-24 relative border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">About TanovaX</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Software Solutions Designed Around Your Daily Operations
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              TANOVAX is a digital solutions brand focused on building modern websites and custom business applications.
            </p>
          </div>
        </div>
      </section>

      {/* Transformation Journey Section */}
      <section className="py-20 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Digital Evolution</span>
            <h2 className="text-3xl font-bold text-slate-100">How We Transform Business Operations</h2>
            <p className="text-slate-400 text-sm">
              We help traditional and growing businesses transition from fragmented tools to modern digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <Card className="space-y-3 text-center border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-400 uppercase font-semibold">STAGE 01</span>
              <h3 className="text-lg font-bold text-slate-100">Manual Processes</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Reliance on Excel spreadsheets, paper invoices, and manual task tracking.
              </p>
            </Card>

            <Card className="space-y-3 text-center border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/15 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/30">
                <Workflow className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-400 uppercase font-semibold">STAGE 02</span>
              <h3 className="text-lg font-bold text-slate-100">Digital Workflows</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Custom CRMs, billing systems, and inventory web portals built around actual work patterns.
              </p>
            </Card>

            <Card className="space-y-3 text-center border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mx-auto border border-brand-500/40">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-400 uppercase font-semibold">STAGE 03</span>
              <h3 className="text-lg font-bold text-slate-100">Better Visibility</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Real-time operational dashboards, financial summaries, and team performance metrics.
              </p>
            </Card>

            <Card className="space-y-3 text-center border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-brand-500/30 text-brand-300 flex items-center justify-center mx-auto border border-brand-500/50">
                <UserCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono text-brand-300 uppercase font-semibold">STAGE 04</span>
              <h3 className="text-lg font-bold text-slate-100">Customer Experience</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Self-service portals, fast enquiry responses, and transparent client communication.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Sections */}
      <section className="py-20 space-y-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Who We Are</span>
              <h2 className="text-3xl font-bold text-slate-100">A Professional Digital Solutions Brand</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                TanovaX was created to provide high-quality, reliable, and scalable web engineering for companies, startups, and service businesses.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Rather than delivering standard boilerplate templates, we work directly with business stakeholders to understand their core operational requirements and craft digital products that deliver long-term value.
              </p>
            </div>
            <Card className="p-8 space-y-4 border-brand-500/30">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
                Our Commitment to Quality
              </h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>No fake claims or false statistical representations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Transparent development timelines and milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span>Modular code structure for future scalability</span>
                </li>
              </ul>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">What We Build</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                We build fast, secure websites and specialized internal software applications including:
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Business, Corporate, Real Estate & Hospitality Websites</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Custom CRMs & Sales Lead Pipelines</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Billing & PDF Invoice Management Applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Inventory & Stock Tracking Systems</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Employee HR Directories & Attendance Dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand-400 rounded-full" />
                  <span>Executive Analytics & Customer Self-Service Portals</span>
                </li>
              </ul>
            </Card>

            <Card className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">How We Think</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Software should make daily work easier, not harder. Our engineering philosophy centers around clarity and usability:
              </p>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <strong className="text-slate-200 shrink-0">Simplicity:</strong>
                  <span>Complex business data should be presented with clean, clear UI layouts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <strong className="text-slate-200 shrink-0">Reliability:</strong>
                  <span>Built on modern battle-tested technologies like React, TypeScript, and Firebase.</span>
                </li>
                <li className="flex items-start gap-2">
                  <strong className="text-slate-200 shrink-0">Responsiveness:</strong>
                  <span>Every digital tool we build works effortlessly across desktops, tablets, and phones.</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-100">Ready to Partner with TanovaX?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Discuss your upcoming project with us and discover how a custom digital solution can optimize your business.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Start a Project with TanovaX
          </Button>
        </div>
      </section>
    </Layout>
  );
};
