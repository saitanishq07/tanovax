import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ServiceCard } from '../components/services/ServiceCard';
import { servicesData } from '../data/initialData';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const websiteServices = servicesData.filter(s => s.category === 'WEBSITE DEVELOPMENT');
  const appServices = servicesData.filter(s => s.category === 'BUSINESS APPLICATIONS');

  const targetCustomers = [
    'Small businesses & regional enterprises',
    'Startups & emerging tech founders',
    'Real-estate developers & property agencies',
    'Restaurants, cafes, hotels & boutique resorts',
    'Independent professionals & consultants',
    'Companies currently using Excel or manual paper processes',
    'Businesses in need of a custom CRM or billing system',
    'Organizations seeking live operational dashboards or customer portals'
  ];

  return (
    <Layout
      title="Services & Capabilities"
      description="Explore TanovaX web development and custom business application services. Business websites, CRMs, billing, inventory, dashboards, and client portals."
    >
      {/* Page Header */}
      <section className="py-16 lg:py-24 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Our Capabilities</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Websites & Business Applications
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              We design and engineer digital solutions across two major categories to solve real operational and sales challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Target Customers Section */}
      <section className="py-12 bg-slate-950/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-6">
            <h2 className="text-xl font-bold text-slate-100">Designed for Growing Businesses & Organizations</h2>
            <p className="text-slate-400 text-sm mt-1">Our solutions are built specifically for:</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {targetCustomers.map((cust, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300 font-medium leading-snug">{cust}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category 1: Website Development */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest font-mono">CATEGORY 01</span>
            <h2 className="text-3xl font-extrabold text-slate-100 mt-1">WEBSITE DEVELOPMENT</h2>
            <p className="text-slate-400 text-sm mt-2">
              High-converting, responsive websites engineered to build credibility and generate inbound business inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {websiteServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Category 2: Business Applications */}
      <section className="py-20 bg-slate-950/60 border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="border-b border-slate-800 pb-6">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest font-mono">CATEGORY 02</span>
            <h2 className="text-3xl font-extrabold text-slate-100 mt-1">BUSINESS APPLICATIONS</h2>
            <p className="text-slate-400 text-sm mt-2">
              Custom internal software systems that replace manual spreadsheets with streamlined digital workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {appServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Specific Solution CTA */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-10 border-brand-500/40 bg-gradient-to-r from-slate-900 via-dark-card to-slate-900 text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">Have something specific in mind?</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Whether you need a custom integration, specialized billing module, or unique operational tool, we can build it.
            </p>
            <div>
              <Button to="/contact" variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Tell Us About Your Project
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </Layout>
  );
};
