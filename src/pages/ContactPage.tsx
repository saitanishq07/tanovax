import React from 'react';
import { Layout } from '../components/layout/Layout';
import { ContactForm } from '../components/contact/ContactForm';
import { Card } from '../components/ui/Card';
import { Mail, Phone, MessageSquare, Clock, MapPin } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';

export const ContactPage: React.FC = () => {
  return (
    <Layout
      title="Contact Us | Start a Project"
      description="Have a project in mind? Tell us what you want to build. Contact TanovaX via form, email, phone, or WhatsApp."
    >
      {/* Page Header */}
      <section className="py-16 lg:py-20 border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-brand-400 text-xs font-semibold uppercase tracking-widest">Get In Touch</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-100 leading-tight">
              Have a project in mind?
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Tell us what you want to build. We'll understand your requirements and help you plan the right solution.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Contact Info Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left 2 Cols: Interactive Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-slate-100">Send Project Enquiry</h2>
              <ContactForm />
            </div>

            {/* Right Col: Direct Channels */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-100">Direct Channels</h2>

              {/* WhatsApp Card */}
              <Card className="p-6 border-emerald-500/30 bg-emerald-950/20 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">WhatsApp Inquiry</h3>
                    <p className="text-xs text-slate-400">Instant direct chat response</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Prefer instant messaging? Reach out directly on WhatsApp to start a conversation.
                </p>
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(
                    'Hello TanovaX team! I am interested in starting a project.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </Card>

              {/* Contact Details Card */}
              <Card className="p-6 space-y-4 border-slate-800">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Email</span>
                    <a href={`mailto:${siteConfig.email}`} className="text-slate-200 text-sm font-semibold hover:text-brand-400 transition-colors">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                  <Phone className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Phone</span>
                    <a href={`tel:${siteConfig.phone}`} className="text-slate-200 text-sm font-semibold hover:text-brand-400 transition-colors">
                      {siteConfig.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                  <Clock className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Response Time</span>
                    <span className="text-slate-300 text-xs">Within 12 to 24 Business Hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-slate-800">
                  <MapPin className="w-5 h-5 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs text-slate-400 block font-semibold uppercase">Location</span>
                    <span className="text-slate-300 text-xs">{siteConfig.location}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};
