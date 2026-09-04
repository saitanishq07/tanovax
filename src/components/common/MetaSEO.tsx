import React, { useEffect } from 'react';
import { siteConfig } from '../../config/siteConfig';

interface MetaSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalPath?: string;
}

export const MetaSEO: React.FC<MetaSEOProps> = ({
  title,
  description = siteConfig.heroSubtext,
  keywords,
  canonicalPath
}) => {
  const fullTitle = title 
    ? (title.includes('TanovaX') ? title : `${title} | ${siteConfig.companyName}`) 
    : `${siteConfig.companyName} | ${siteConfig.tagline}`;
  const currentPath = canonicalPath !== undefined ? canonicalPath : (typeof window !== 'undefined' ? window.location.pathname : '');
  const fullUrl = `${siteConfig.websiteUrl}${currentPath === '/' ? '' : currentPath}`;

  useEffect(() => {
    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', fullUrl);

    // Update OG title, description & url
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', fullUrl);

  }, [fullTitle, description, fullUrl, keywords]);

  return null;
};
