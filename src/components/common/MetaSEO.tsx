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
  canonicalPath = ''
}) => {
  const fullTitle = title ? `${title} | ${siteConfig.companyName}` : `${siteConfig.companyName} | ${siteConfig.tagline}`;
  const fullUrl = `${siteConfig.websiteUrl}${canonicalPath}`;

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

    // Update OG title & description
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

  }, [fullTitle, description, fullUrl, keywords]);

  return null;
};
