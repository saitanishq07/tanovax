export type ServiceCategory = 'WEBSITE DEVELOPMENT' | 'BUSINESS APPLICATIONS';

export interface ServiceItem {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  iconName: string;
  features: string[];
  suitableFor: string[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: 'Website' | 'Business Application' | 'Hospitality / Website' | 'Real Estate / Website';
  description: string;
  overview: string;
  businessProblem: string;
  solution: string;
  features: string[];
  technologies: string[];
  images: string[];
  projectStatus: 'Concept Project' | 'Demo Project';
  published: boolean;
  createdAt: string;
  objective: string;
}

export type SubmissionStatus = 'New' | 'Contacted' | 'In Discussion' | 'Proposal Sent' | 'Converted' | 'Closed';

export interface ContactSubmission {
  id: string;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  createdAt: string;
  status: SubmissionStatus;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
  details: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteSettings {
  whatsappMessage: string;
  whatsappNumber: string;
}
