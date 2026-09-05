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

// Legacy Submission Interface (preserved for compatibility)
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

// --- LEAD MANAGEMENT TYPES ---
export type LeadStatus = 
  | 'NEW'
  | 'CONTACTED'
  | 'REQUIREMENT RECEIVED'
  | 'PROPOSAL SENT'
  | 'NEGOTIATION'
  | 'WON'
  | 'LOST';

export type LeadSource = 
  | 'Website'
  | 'WhatsApp'
  | 'Referral'
  | 'LinkedIn'
  | 'Instagram'
  | 'Facebook'
  | 'Google'
  | 'Other';

export type ProjectTimeline = 
  | 'Urgent'
  | 'Within 1 Month'
  | '1–3 Months'
  | '3+ Months'
  | 'Flexible';

export interface LeadNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  companyName?: string;
  phone: string;
  email: string;
  serviceInterested: string;
  budgetRange: string;
  projectTimeline: ProjectTimeline | string;
  messageRequirement: string;
  leadSource: LeadSource | string;
  status: LeadStatus;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  followUpDate?: string;
  notes: LeadNote[];
}

// --- QUOTATION & PROPOSAL TYPES ---
export type QuotationStatus = 
  | 'Draft'
  | 'Sent'
  | 'Viewed'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export interface QuotationLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number; // percentage e.g. 18
  taxAmount: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string; // e.g. TNX-QUO-2026-001
  date: string;
  validUntil: string;
  clientName: string;
  companyName?: string;
  email: string;
  phone: string;
  clientAddress?: string;
  projectName: string;
  projectDescription?: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  totalDiscount: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  paymentTerms: string;
  deliveryTimeline: string;
  notes?: string;
  termsAndConditions: string;
  status: QuotationStatus;
  leadId?: string;
  createdAt: string;
  updatedAt: string;
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
