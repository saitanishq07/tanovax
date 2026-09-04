import React from 'react';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { processSteps } from '../data/initialData';
import { ArrowRight, CheckCircle2, Search, FileCode2, Palette, Code2, ShieldCheck, Rocket } from 'lucide-react';

export const ProcessPage: React.FC = () => {
  const getStepIcon = (step: string) => {
    const props = { className: 'w-6 h-6 text-brand-400' };
    switch (step) {
      case '01': return <Search {...props} />;
      case '02': return <FileCode2 {...props} />;
      case '03': return <Palette {...props} />;
      case '04': return <Code2 {...props} />;
      case '05': return <ShieldCheck {...props} />;
      case '06': return <Rocket {...props} />;
      default: return <Search {...props} />;
    }
  };

  return (
    <Layout
      title="Our Process | Digital Solutions for Businesses | TanovaX"
      description="Learn about TanovaX's 6-step structured software development process: Understand, Plan, Design, Develop, Test, and Launch."
    >
      {/* Header */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Methodology</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Our 6-Step Software Delivery Process
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              A structured approach that guarantees clear communication, high code quality, and predictable project milestones.
            </p>
          </div>
        </div>
      </section>

      {/* Step Breakdown List */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {processSteps.map((stepItem) => (
            <Card key={stepItem.step} hoverEffect={false} className="p-8 border-slate-800 relative">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center shrink-0">
                    {getStepIcon(stepItem.step)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-brand-400">PHASE {stepItem.step}</span>
                      <h2 className="text-2xl font-bold text-slate-100">{stepItem.title}</h2>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed">
                      {stepItem.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-800/80">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Key Activities & Deliverables</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {stepItem.details.map((detail, dIdx) => (
                    <div key={dIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Process Callout */}
      <section className="py-16 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-100">Ready to start Phase 01?</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Schedule an initial consultation to discuss your business requirements and map out your project roadmap.
          </p>
          <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
            Start a Project Discussion
          </Button>
        </div>
      </section>
    </Layout>
  );
};
