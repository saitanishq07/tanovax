import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { fetchSiteSettings, DEFAULT_SITE_SETTINGS } from '../../firebase/services';
import { SiteSettings } from '../../types';

export const WhatsAppFloatingCTA: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    fetchSiteSettings().then(setSettings);
  }, []);

  const cleanNumber = (settings.whatsappNumber || siteConfig.whatsappNumber).replace(/[^0-9+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
    settings.whatsappMessage || 'Hello TanovaX team! I am interested in starting a project for my business.'
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with TanovaX on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-900/40 transition-all duration-300 hover:scale-105 group border border-emerald-400/30"
    >
      <div className="relative">
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
      </div>
      <span className="text-sm font-semibold hidden md:inline group-hover:inline transition-all">
        Chat on WhatsApp
      </span>
    </a>
  );
};
