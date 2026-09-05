import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  setDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { 
  ContactSubmission, 
  Project, 
  SiteSettings, 
  Lead, 
  LeadStatus, 
  LeadNote,
  Quotation,
  QuotationLineItem
} from '../types';
import { initialProjects } from '../data/initialData';

// LocalStorage Keys
const SUBMISSIONS_KEY = 'tanovax_contact_submissions';
const LEADS_KEY = 'tanovax_leads';
const QUOTATIONS_KEY = 'tanovax_quotations';
const PROJECTS_KEY = 'tanovax_custom_projects';
const SETTINGS_KEY = 'tanovax_site_settings';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  whatsappMessage: 'Hello TanovaX team! I am interested in starting a project for my business.',
  whatsappNumber: '+916300699087'
};

// --- CURRENCY & NUMBER HELPER ---
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount || 0);
};

// --- LOCAL STORAGE HELPERS ---
const getLocalLeads = (): Lead[] => {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local leads', e);
    return [];
  }
};

const saveLocalLeads = (leads: Lead[]) => {
  try {
    localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error('Error saving local leads', e);
  }
};

const getLocalQuotations = (): Quotation[] => {
  try {
    const raw = localStorage.getItem(QUOTATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local quotations', e);
    return [];
  }
};

const saveLocalQuotations = (quotations: Quotation[]) => {
  try {
    localStorage.setItem(QUOTATIONS_KEY, JSON.stringify(quotations));
  } catch (e) {
    console.error('Error saving local quotations', e);
  }
};

const getLocalProjects = (): Project[] => {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : initialProjects;
  } catch (e) {
    return initialProjects;
  }
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Error saving local projects', e);
  }
};

// Helper for Legacy Submissions
const getLocalSubmissions = (): ContactSubmission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Helper to convert legacy ContactSubmission to Lead model
const mapSubmissionToLead = (sub: ContactSubmission): Lead => {
  let mappedStatus: LeadStatus = 'NEW';
  if (sub.status === 'Contacted') mappedStatus = 'CONTACTED';
  else if (sub.status === 'In Discussion') mappedStatus = 'REQUIREMENT RECEIVED';
  else if (sub.status === 'Proposal Sent') mappedStatus = 'PROPOSAL SENT';
  else if (sub.status === 'Converted') mappedStatus = 'WON';
  else if (sub.status === 'Closed') mappedStatus = 'LOST';

  return {
    id: sub.id,
    fullName: sub.name || 'Website Visitor',
    companyName: sub.companyName || '',
    email: sub.email || '',
    phone: sub.phone || '',
    serviceInterested: sub.service || 'Website Development',
    budgetRange: sub.budget || '₹25,000 – ₹50,000',
    projectTimeline: 'Flexible',
    messageRequirement: sub.message || '',
    leadSource: 'Website',
    status: mappedStatus,
    createdAt: sub.createdAt || new Date().toISOString(),
    updatedAt: sub.createdAt || new Date().toISOString(),
    notes: []
  };
};

// --- LEAD MANAGEMENT SERVICES ---

export const submitLead = async (
  data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'notes'>
): Promise<{ success: boolean; id: string }> => {
  const now = new Date().toISOString();
  const newLead: Lead = {
    ...data,
    id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    createdAt: now,
    updatedAt: now,
    notes: []
  };

  // 1. Save locally for instant offline resilience
  const currentLocal = getLocalLeads();
  currentLocal.unshift(newLead);
  saveLocalLeads(currentLocal);

  // 2. Save to Firebase Firestore if configured
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'leads'), {
        fullName: data.fullName,
        companyName: data.companyName || '',
        phone: data.phone,
        email: data.email,
        serviceInterested: data.serviceInterested,
        budgetRange: data.budgetRange,
        projectTimeline: data.projectTimeline || 'Flexible',
        messageRequirement: data.messageRequirement,
        leadSource: data.leadSource || 'Website',
        status: data.status || 'NEW',
        assignedTo: data.assignedTo || 'Unassigned',
        followUpDate: data.followUpDate || '',
        createdAt: now,
        updatedAt: now,
        notes: []
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firebase write lead failed (falling back to local storage):', err);
    }
  }

  return { success: true, id: newLead.id };
};

// Legacy Contact Submission API wrapper (uses submitLead under the hood)
export const submitContactForm = async (
  data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'> & { projectTimeline?: string }
): Promise<{ success: boolean; id: string }> => {
  return submitLead({
    fullName: data.name,
    companyName: data.companyName,
    email: data.email,
    phone: data.phone,
    serviceInterested: data.service,
    budgetRange: data.budget,
    projectTimeline: data.projectTimeline || 'Flexible',
    messageRequirement: data.message,
    leadSource: 'Website',
    status: 'NEW'
  });
};

export const getLeads = async (): Promise<Lead[]> => {
  const localLeads = getLocalLeads();
  const legacyLocal = getLocalSubmissions().map(mapSubmissionToLead);

  const mergedMap = new Map<string, Lead>();
  legacyLocal.forEach(l => mergedMap.set(l.id, l));
  localLeads.forEach(l => mergedMap.set(l.id, l));

  if (isFirebaseConfigured) {
    try {
      // Fetch Firestore leads
      const qLeads = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
      const snapLeads = await getDocs(qLeads);
      snapLeads.forEach(docSnap => {
        const d = docSnap.data();
        mergedMap.set(docSnap.id, {
          id: docSnap.id,
          fullName: d.fullName || d.name || 'Website Visitor',
          companyName: d.companyName || '',
          email: d.email || '',
          phone: d.phone || '',
          serviceInterested: d.serviceInterested || d.service || 'Website Development',
          budgetRange: d.budgetRange || d.budget || '₹25,000 – ₹50,000',
          projectTimeline: d.projectTimeline || 'Flexible',
          messageRequirement: d.messageRequirement || d.message || '',
          leadSource: d.leadSource || 'Website',
          status: (d.status as LeadStatus) || 'NEW',
          assignedTo: d.assignedTo || '',
          followUpDate: d.followUpDate || '',
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || d.createdAt || new Date().toISOString(),
          notes: d.notes || []
        });
      });

      // Also check legacy contact_submissions collection if any exist
      try {
        const qLegacy = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
        const snapLegacy = await getDocs(qLegacy);
        snapLegacy.forEach(docSnap => {
          if (!mergedMap.has(docSnap.id)) {
            const d = docSnap.data() as any;
            const mapped = mapSubmissionToLead({
              id: docSnap.id,
              name: d.name || '',
              companyName: d.companyName || '',
              email: d.email || '',
              phone: d.phone || '',
              service: d.service || '',
              budget: d.budget || '',
              message: d.message || '',
              createdAt: d.createdAt || new Date().toISOString(),
              status: d.status || 'New'
            });
            mergedMap.set(docSnap.id, mapped);
          }
        });
      } catch (e) {
        // Ignored if collection doesn't exist
      }
    } catch (err) {
      console.warn('Firebase read leads failed, using local storage:', err);
    }
  }

  const result = Array.from(mergedMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return result;
};

export const saveLeadRecord = async (leadData: Partial<Lead> & { id: string }): Promise<Lead> => {
  const currentLocal = getLocalLeads();
  const existingIdx = currentLocal.findIndex(l => l.id === leadData.id);
  const now = new Date().toISOString();

  let updatedLead: Lead;
  if (existingIdx >= 0) {
    updatedLead = {
      ...currentLocal[existingIdx],
      ...leadData,
      updatedAt: now
    };
    currentLocal[existingIdx] = updatedLead;
  } else {
    updatedLead = {
      id: leadData.id,
      fullName: leadData.fullName || 'Lead',
      companyName: leadData.companyName || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      serviceInterested: leadData.serviceInterested || 'Website Development',
      budgetRange: leadData.budgetRange || '₹25,000 – ₹50,000',
      projectTimeline: leadData.projectTimeline || 'Flexible',
      messageRequirement: leadData.messageRequirement || '',
      leadSource: leadData.leadSource || 'Website',
      status: leadData.status || 'NEW',
      assignedTo: leadData.assignedTo || '',
      followUpDate: leadData.followUpDate || '',
      notes: leadData.notes || [],
      createdAt: leadData.createdAt || now,
      updatedAt: now
    };
    currentLocal.unshift(updatedLead);
  }

  saveLocalLeads(currentLocal);

  if (isFirebaseConfigured && !leadData.id.startsWith('lead_') && !leadData.id.startsWith('sub_')) {
    try {
      const docRef = doc(db, 'leads', leadData.id);
      await updateDoc(docRef, { ...leadData, updatedAt: now });
    } catch (err) {
      console.warn('Firebase save lead failed:', err);
    }
  }

  return updatedLead;
};

export const addNoteToLead = async (leadId: string, content: string, createdBy: string = 'Admin'): Promise<LeadNote> => {
  const note: LeadNote = {
    id: 'note_' + Date.now(),
    content: content.trim(),
    createdBy,
    createdAt: new Date().toISOString()
  };

  const leads = await getLeads();
  const targetLead = leads.find(l => l.id === leadId);
  if (targetLead) {
    const updatedNotes = [note, ...(targetLead.notes || [])];
    await saveLeadRecord({ id: leadId, notes: updatedNotes });
  }

  return note;
};

export const deleteLeadRecord = async (id: string): Promise<boolean> => {
  const currentLocal = getLocalLeads();
  const filtered = currentLocal.filter(l => l.id !== id);
  saveLocalLeads(filtered);

  if (isFirebaseConfigured && !id.startsWith('lead_') && !id.startsWith('sub_')) {
    try {
      const docRef = doc(db, 'leads', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firebase delete lead failed:', err);
    }
  }

  return true;
};

// Legacy Contact Submissions API support
export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const leads = await getLeads();
  return leads.map(l => ({
    id: l.id,
    name: l.fullName,
    companyName: l.companyName,
    email: l.email,
    phone: l.phone,
    service: l.serviceInterested,
    budget: l.budgetRange,
    message: l.messageRequirement,
    createdAt: l.createdAt,
    status: l.status === 'NEW' ? 'New' : l.status === 'WON' ? 'Converted' : 'In Discussion'
  }));
};

export const updateSubmissionStatus = async (id: string, status: any): Promise<boolean> => {
  let mappedStatus: LeadStatus = 'NEW';
  if (status === 'New' || status === 'NEW') mappedStatus = 'NEW';
  else if (status === 'Contacted' || status === 'CONTACTED') mappedStatus = 'CONTACTED';
  else if (status === 'In Discussion' || status === 'REQUIREMENT RECEIVED') mappedStatus = 'REQUIREMENT RECEIVED';
  else if (status === 'Proposal Sent' || status === 'PROPOSAL SENT') mappedStatus = 'PROPOSAL SENT';
  else if (status === 'Converted' || status === 'WON') mappedStatus = 'WON';
  else if (status === 'Closed' || status === 'LOST') mappedStatus = 'LOST';

  await saveLeadRecord({ id, status: mappedStatus });
  return true;
};

// --- TRACK WHATSAPP ENQUIRY CLICK ---
export const trackWhatsAppClick = async (serviceName?: string): Promise<void> => {
  try {
    await submitLead({
      fullName: 'WhatsApp Inquiry Visitor',
      companyName: 'Not specified',
      phone: 'Pending WhatsApp Contact',
      email: 'pending_whatsapp@tanovax.com',
      serviceInterested: serviceName || 'General Enquiry',
      budgetRange: 'Not Sure',
      projectTimeline: 'Flexible',
      messageRequirement: `Visitor clicked "Chat on WhatsApp" CTA button for service: ${serviceName || 'General'}.`,
      leadSource: 'WhatsApp',
      status: 'NEW'
    });
  } catch (e) {
    console.warn('Error tracking WhatsApp click', e);
  }
};

// --- QUOTATION / PROPOSAL SERVICES ---

export const calculateQuotationTotals = (
  lineItems: QuotationLineItem[],
  taxRate: number = 18
) => {
  let subtotal = 0;
  let totalDiscount = 0;

  const processedItems = lineItems.map(item => {
    const itemSubtotal = (item.quantity || 1) * (item.unitPrice || 0);
    const itemDiscount = item.discount || 0;
    const netItem = Math.max(0, itemSubtotal - itemDiscount);
    const itemTax = Math.round((netItem * (taxRate / 100)) * 100) / 100;
    const itemTotal = netItem + itemTax;

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;

    return {
      ...item,
      taxRate,
      taxAmount: itemTax,
      total: itemTotal
    };
  });

  const netSubtotal = Math.max(0, subtotal - totalDiscount);
  const taxAmount = Math.round((netSubtotal * (taxRate / 100)) * 100) / 100;
  const grandTotal = netSubtotal + taxAmount;

  return {
    lineItems: processedItems,
    subtotal,
    totalDiscount,
    taxRate,
    taxAmount,
    grandTotal
  };
};

export const getQuotations = async (): Promise<Quotation[]> => {
  const localQuotations = getLocalQuotations();

  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'quotations'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const cloudDocs: Quotation[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        cloudDocs.push({
          id: docSnap.id,
          quotationNumber: d.quotationNumber || `TNX-QUO-${docSnap.id.substring(0, 5).toUpperCase()}`,
          date: d.date || new Date().toISOString().split('T')[0],
          validUntil: d.validUntil || '',
          clientName: d.clientName || '',
          companyName: d.companyName || '',
          email: d.email || '',
          phone: d.phone || '',
          clientAddress: d.clientAddress || '',
          projectName: d.projectName || '',
          projectDescription: d.projectDescription || '',
          lineItems: d.lineItems || [],
          subtotal: d.subtotal || 0,
          totalDiscount: d.totalDiscount || 0,
          taxRate: d.taxRate !== undefined ? d.taxRate : 18,
          taxAmount: d.taxAmount || 0,
          grandTotal: d.grandTotal || 0,
          paymentTerms: d.paymentTerms || '50% advance upon project confirmation, 50% upon delivery.',
          deliveryTimeline: d.deliveryTimeline || '2–3 Weeks',
          notes: d.notes || '',
          termsAndConditions: d.termsAndConditions || '1. Quotation valid for 15 days from issue date.\n2. Standard warranty of 30 days post-deployment included.',
          status: d.status || 'Draft',
          leadId: d.leadId || '',
          createdAt: d.createdAt || new Date().toISOString(),
          updatedAt: d.updatedAt || new Date().toISOString()
        });
      });

      const map = new Map<string, Quotation>();
      localQuotations.forEach(q => map.set(q.id, q));
      cloudDocs.forEach(q => map.set(q.id, q));

      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return merged;
    } catch (err) {
      console.warn('Firebase read quotations failed, using local storage:', err);
    }
  }

  return localQuotations;
};

export const saveQuotationRecord = async (quotationData: Partial<Quotation>): Promise<Quotation> => {
  const now = new Date().toISOString();
  const todayStr = new Date().toISOString().split('T')[0];
  const nextMonthDate = new Date();
  nextMonthDate.setDate(nextMonthDate.getDate() + 15);
  const validUntilStr = nextMonthDate.toISOString().split('T')[0];

  const allQuotations = await getQuotations();
  const id = quotationData.id || 'quo_' + Date.now();
  
  // Generate quotation number if missing
  let quoNum = quotationData.quotationNumber;
  if (!quoNum) {
    const year = new Date().getFullYear();
    const count = allQuotations.length + 1;
    quoNum = `TNX-QUO-${year}-${String(count).padStart(3, '0')}`;
  }

  const lineItems = quotationData.lineItems || [];
  const taxRate = quotationData.taxRate !== undefined ? quotationData.taxRate : 18;
  const calculated = calculateQuotationTotals(lineItems, taxRate);

  const fullQuotation: Quotation = {
    id,
    quotationNumber: quoNum,
    date: quotationData.date || todayStr,
    validUntil: quotationData.validUntil || validUntilStr,
    clientName: quotationData.clientName || 'Valued Client',
    companyName: quotationData.companyName || '',
    email: quotationData.email || '',
    phone: quotationData.phone || '',
    clientAddress: quotationData.clientAddress || '',
    projectName: quotationData.projectName || 'Web / Application Development',
    projectDescription: quotationData.projectDescription || '',
    lineItems: calculated.lineItems,
    subtotal: calculated.subtotal,
    totalDiscount: calculated.totalDiscount,
    taxRate: calculated.taxRate,
    taxAmount: calculated.taxAmount,
    grandTotal: calculated.grandTotal,
    paymentTerms: quotationData.paymentTerms || '50% advance upon project kickoff, 50% upon final sign-off and deployment.',
    deliveryTimeline: quotationData.deliveryTimeline || '2–4 Weeks from receipt of initial design approval',
    notes: quotationData.notes || 'Thank you for choosing TanovaX. We look forward to delivering exceptional value for your business.',
    termsAndConditions: quotationData.termsAndConditions || '1. Quotation valid for 15 days from date of issue.\n2. Any additional custom requirements outside the agreed scope will be quoted separately.\n3. 30-day post-launch technical support is included.',
    status: quotationData.status || 'Draft',
    leadId: quotationData.leadId || '',
    createdAt: quotationData.createdAt || now,
    updatedAt: now
  };

  // Local storage update
  const currentLocal = getLocalQuotations();
  const existingIdx = currentLocal.findIndex(q => q.id === id);
  if (existingIdx >= 0) {
    currentLocal[existingIdx] = fullQuotation;
  } else {
    currentLocal.unshift(fullQuotation);
  }
  saveLocalQuotations(currentLocal);

  // Firebase update
  if (isFirebaseConfigured) {
    try {
      if (quotationData.id && !quotationData.id.startsWith('quo_')) {
        const docRef = doc(db, 'quotations', quotationData.id);
        await updateDoc(docRef, fullQuotation as any);
      } else {
        const docRef = await addDoc(collection(db, 'quotations'), fullQuotation);
        fullQuotation.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firebase save quotation failed:', err);
    }
  }

  return fullQuotation;
};

export const deleteQuotationRecord = async (id: string): Promise<boolean> => {
  const currentLocal = getLocalQuotations();
  const filtered = currentLocal.filter(q => q.id !== id);
  saveLocalQuotations(filtered);

  if (isFirebaseConfigured && !id.startsWith('quo_')) {
    try {
      const docRef = doc(db, 'quotations', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firebase delete quotation failed:', err);
    }
  }

  return true;
};

// --- PROJECT MANAGEMENT SERVICES ---

export const fetchProjects = async (): Promise<Project[]> => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const docs: Project[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          docs.push({
            id: docSnap.id,
            slug: d.slug || docSnap.id,
            title: d.title || '',
            category: d.category || 'Website',
            projectStatus: d.projectStatus || 'Demo Project',
            description: d.description || '',
            overview: d.overview || '',
            businessProblem: d.businessProblem || '',
            solution: d.solution || '',
            features: d.features || [],
            technologies: d.technologies || [],
            images: d.images || [],
            published: d.published !== undefined ? d.published : true,
            createdAt: d.createdAt || new Date().toISOString(),
            objective: d.objective || ''
          });
        });
        return docs;
      }
    } catch (err) {
      console.warn('Firebase read projects failed, falling back to local/default:', err);
    }
  }

  return getLocalProjects();
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
  const all = await fetchProjects();
  return all.find(p => p.slug === slug) || null;
};

export const saveProjectRecord = async (projectData: Partial<Project>): Promise<Project> => {
  const id = projectData.id || 'proj_' + Date.now();
  const fullProject: Project = {
    id,
    title: projectData.title || 'Untitled Project',
    slug: projectData.slug || ('proj-' + Date.now()),
    category: projectData.category || 'Website',
    description: projectData.description || '',
    overview: projectData.overview || '',
    businessProblem: projectData.businessProblem || '',
    solution: projectData.solution || '',
    features: projectData.features || [],
    technologies: projectData.technologies || [],
    images: projectData.images || [],
    projectStatus: projectData.projectStatus || 'Demo Project',
    published: projectData.published !== undefined ? projectData.published : true,
    createdAt: projectData.createdAt || new Date().toISOString(),
    objective: projectData.objective || ''
  };

  const currentLocal = getLocalProjects();
  const existingIdx = currentLocal.findIndex(p => p.id === id);
  if (existingIdx >= 0) {
    currentLocal[existingIdx] = fullProject;
  } else {
    currentLocal.unshift(fullProject);
  }
  saveLocalProjects(currentLocal);

  if (isFirebaseConfigured) {
    try {
      if (projectData.id && !projectData.id.startsWith('proj_')) {
        const docRef = doc(db, 'projects', projectData.id);
        await updateDoc(docRef, projectData);
      } else {
        const docRef = await addDoc(collection(db, 'projects'), projectData);
        fullProject.id = docRef.id;
      }
    } catch (err) {
      console.warn('Firebase save project failed:', err);
    }
  }

  return fullProject;
};

export const deleteProjectRecord = async (id: string): Promise<boolean> => {
  const currentLocal = getLocalProjects();
  const filtered = currentLocal.filter(p => p.id !== id);
  saveLocalProjects(filtered);

  if (isFirebaseConfigured && !id.startsWith('proj_')) {
    try {
      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firebase delete project failed:', err);
    }
  }

  return true;
};

// --- SITE SETTINGS SERVICES ---

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'site');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          whatsappMessage: data.whatsappMessage || DEFAULT_SITE_SETTINGS.whatsappMessage,
          whatsappNumber: data.whatsappNumber || DEFAULT_SITE_SETTINGS.whatsappNumber
        };
      }
    } catch (err) {
      console.warn('Firebase fetch settings failed, using local/default:', err);
    }
  }

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_SITE_SETTINGS;
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
};

export const saveSiteSettings = async (settings: SiteSettings): Promise<SiteSettings> => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings to local storage', e);
  }

  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, settings, { merge: true });
    } catch (err) {
      console.warn('Firebase save settings failed:', err);
    }
  }

  return settings;
};
