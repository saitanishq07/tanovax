import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppFloatingCTA } from '../common/WhatsAppFloatingCTA';
import { MetaSEO } from '../common/MetaSEO';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title, description }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 selection:bg-brand-500 selection:text-slate-950">
      <MetaSEO title={title} description={description} />
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <WhatsAppFloatingCTA />
      <Footer />
    </div>
  );
};
