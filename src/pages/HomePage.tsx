import React from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InteractiveAppPreview } from '../components/home/InteractiveAppPreview';
import { servicesData, initialProjects, processSteps, trustPillars, faqsData } from '../data/initialData';
import { ServiceCard } from '../components/services/ServiceCard';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { siteConfig } from '../config/siteConfig';

import { fetchSiteSettings, DEFAULT_SITE_SETTINGS } from '../firebase/services';
import { SiteSettings } from '../types';

export const HomePage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const [settings, setSettings] = React.useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  React.useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  const websiteServices = servicesData.filter(s => s.category === 'WEBSITE DEVELOPMENT');
  const appServices = servicesData.filter(s => s.category === 'BUSINESS APPLICATIONS');

  const cleanWhatsappNumber = (settings.whatsappNumber || siteConfig.whatsappNumber).replace(/[^0-9+]/g, '');
  const homepageWhatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    settings.whatsappMessage || 'Hello TanovaX team! I am interested in starting a project for my business.'
  )}`;

  return (
    <Layout
      title="TanovaX | Web, Apps & Business Solutions"
      description="TanovaX designs and develops modern websites and custom business applications that help businesses operate, grow and connect with their customers."
    >
      {/* ================================================= */}
      {/* 1. HERO SECTION */}
      {/* ================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-semibold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>{siteConfig.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
              Digital Solutions Built <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-brand-300 to-brand-500">
                Around Your Business
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed max-w-3xl mx-auto">
              {siteConfig.heroSubtext}
            </p>

            {/* Hero Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                to="/contact"
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-5 h-5" />}
              >
                Start a Project
              </Button>
              <Button
                to="/work"
                variant="secondary"
                size="lg"
              >
                View Our Work
              </Button>
            </div>
          </div>

          {/* Visual UI Graphics Representation */}
          <InteractiveAppPreview />
        </div>
      </section>

      {/* ================================================= */}
      {/* 2. TRUST / VALUE PROPOSITION SECTION */}
      {/* ================================================= */}
      <section className="py-20 bg-slate-950/60 border-y border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Why TanovaX</span>
            <h2 className="text-3xl font-bold text-slate-100">Engineered for Business Impact</h2>
            <p className="text-slate-400 text-sm">
              We eliminate non-essential complexity and build software designed to streamline operations and drive business growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPillars.map((pillar, idx) => (
              <Card key={idx} className="space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-3xl font-extrabold text-brand-400/40 font-mono block mb-2">
                    {pillar.number}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100">{pillar.title}</h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 3. SERVICES SECTION SUMMARY */}
      {/* ================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Core Capabilities</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">Websites & Custom Applications</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                From high-converting brand websites to tailored CRMs and business management software.
              </p>
            </div>
            <Button to="/services" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Explore All Services
            </Button>
          </div>

          {/* Category 1 Preview */}
          <div className="space-y-6 mb-16">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-brand-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-200">Website Development</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {websiteServices.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          {/* Category 2 Preview */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-brand-500 rounded-full" />
              <h3 className="text-xl font-bold text-slate-200">Business Applications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appServices.slice(0, 3).map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

          {/* Specific Requirement Callout CTA */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-dark-card to-slate-900 border border-brand-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-slate-100">Have something specific in mind?</h3>
              <p className="text-slate-400 text-sm">
                We build fully customized solutions tailored around your unique daily workflow.
              </p>
            </div>
            <Button to="/contact" variant="primary" icon={<ArrowRight className="w-4 h-4" />}>
              Tell Us About Your Project
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 4. WORK / PORTFOLIO SECTION */}
      {/* ================================================= */}
      <section className="py-24 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="space-y-3">
              <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Portfolio Showcase</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">Concept & Demo Solutions</h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Explore example projects built to demonstrate our architecture, user interface design, and functional capabilities.
              </p>
            </div>
            <Button to="/work" variant="secondary" icon={<ArrowRight className="w-4 h-4" />}>
              View All Work
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {initialProjects.slice(0, 6).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 5. PROCESS SECTION */}
      {/* ================================================= */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">How We Work</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100">Structured Delivery Process</h2>
            <p className="text-slate-400 text-sm">
              Our 6-phase engineering workflow guarantees clarity, speed, and continuous alignment from initial idea to deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <Card key={step.step} className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                    <span className="text-2xl font-black text-brand-400 font-mono">{step.step}</span>
                    <Badge variant="brand">{step.title}</Badge>
                  </div>
                  <p className="text-slate-200 font-medium text-sm mb-3">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((d, i) => (
                      <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button to="/process" variant="outline" icon={<ArrowRight className="w-4 h-4" />}>
              Read Detailed Process Breakdown
            </Button>
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      {/* ================================================= */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 space-y-3">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-bold text-slate-100">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">
              Answers to common queries about working with TanovaX.
            </p>
          </div>

          <div className="space-y-4">
            {faqsData.map((faq, idx) => (
              <Card
                key={idx}
                hoverEffect={false}
                className="cursor-pointer transition-all border-slate-800"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-bold text-slate-100 text-base">{faq.question}</h3>
                  <div className="p-1 rounded-lg bg-slate-900 text-slate-400">
                    {openFaq === idx ? <ChevronUp className="w-5 h-5 text-brand-400" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
                {openFaq === idx && (
                  <p className="text-slate-300 text-sm mt-3 pt-3 border-t border-slate-800/80 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================= */}
      {/* 7. FINAL CTA BANNER */}
      {/* ================================================= */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-b from-dark-card to-slate-950 p-10 sm:p-14 border border-brand-500/40 text-center space-y-6 shadow-2xl relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Let's Build Together</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Ready to Upgrade Your Business Technology?
            </h2>
            <p className="text-slate-300 text-base max-w-2xl mx-auto">
              Tell us what you want to build. We'll analyze your requirements and help you architect the right website or custom application solution.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Start a Project
              </Button>
              <Button
                href={homepageWhatsappUrl}
                variant="secondary"
                size="lg"
                icon={<MessageSquare className="w-5 h-5 text-emerald-400" />}
              >
                WhatsApp Inquiry
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
