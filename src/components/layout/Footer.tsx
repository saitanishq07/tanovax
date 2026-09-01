import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Linkedin, Instagram, Github, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { siteConfig } from '../../config/siteConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Brand & Overview Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="lg" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              TanovaX is a digital solutions brand focused on building modern websites and custom business applications for startups, service businesses, and growing enterprises.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={siteConfig.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors">Our Services</Link>
              </li>
              <li>
                <Link to="/work" className="hover:text-brand-400 transition-colors">Work / Portfolio</Link>
              </li>
              <li>
                <Link to="/process" className="hover:text-brand-400 transition-colors">Our Process</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">Solutions</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services#business-websites" className="hover:text-brand-400 transition-colors">Business Websites</Link>
              </li>
              <li>
                <Link to="/services#crm" className="hover:text-brand-400 transition-colors">Custom CRM</Link>
              </li>
              <li>
                <Link to="/services#billing" className="hover:text-brand-400 transition-colors">Billing Systems</Link>
              </li>
              <li>
                <Link to="/services#inventory" className="hover:text-brand-400 transition-colors">Inventory Software</Link>
              </li>
              <li>
                <Link to="/services#dashboards" className="hover:text-brand-400 transition-colors">Business Dashboards</Link>
              </li>
              <li>
                <Link to="/services#customer-portals" className="hover:text-brand-400 transition-colors">Customer Portals</Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact Column */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-semibold text-sm uppercase tracking-wider">Direct Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                  <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                  <span className="truncate">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-brand-400 transition-colors">
                  <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                  <span>{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${siteConfig.whatsappNumber.replace(/[^0-9+]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-brand-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>WhatsApp Direct</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {siteConfig.companyName}. All rights reserved. Built with modern web performance.</p>
          <div className="flex items-center gap-6">
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
