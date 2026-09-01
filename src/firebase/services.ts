import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './config';
import { ContactSubmission, Project } from '../types';
import { initialProjects } from '../data/initialData';

// LocalStorage Keys
const SUBMISSIONS_KEY = 'tanovax_contact_submissions';
const PROJECTS_KEY = 'tanovax_custom_projects';

// Helper for Local Storage Submissions
const getLocalSubmissions = (): ContactSubmission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading local submissions', e);
    return [];
  }
};

const saveLocalSubmissions = (subs: ContactSubmission[]) => {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Error saving local submissions', e);
  }
};

// Helper for Local Storage Projects
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

// --- CONTACT SUBMISSION SERVICES ---

export const submitContactForm = async (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> => {
  const newSubmission: ContactSubmission = {
    ...data,
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
    status: 'New'
  };

  // Always save locally first for instant resilience
  const currentLocal = getLocalSubmissions();
  currentLocal.unshift(newSubmission);
  saveLocalSubmissions(currentLocal);

  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, 'contact_submissions'), {
        name: data.name,
        companyName: data.companyName || '',
        email: data.email,
        phone: data.phone,
        service: data.service,
        budget: data.budget,
        message: data.message,
        createdAt: new Date().toISOString(),
        status: 'New'
      });
      return { success: true, id: docRef.id };
    } catch (err) {
      console.warn('Firebase write failed (falling back to local storage):', err);
    }
  }

  return { success: true, id: newSubmission.id };
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  const localList = getLocalSubmissions();
  
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const cloudDocs: ContactSubmission[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        cloudDocs.push({
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
      });

      // Merge cloud and local uniquely by ID/email+timestamp
      const combined = [...cloudDocs];
      localList.forEach(loc => {
        if (!combined.some(c => c.id === loc.id || (c.email === loc.email && c.createdAt === loc.createdAt))) {
          combined.push(loc);
        }
      });
      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.warn('Firebase read failed, using local storage fallback:', err);
    }
  }

  return localList;
};

export const updateSubmissionStatus = async (id: string, status: ContactSubmission['status']): Promise<boolean> => {
  const current = getLocalSubmissions();
  const updated = current.map(item => item.id === id ? { ...item, status } : item);
  saveLocalSubmissions(updated);

  if (isFirebaseConfigured && !id.startsWith('sub_')) {
    try {
      const docRef = doc(db, 'contact_submissions', id);
      await updateDoc(docRef, { status });
    } catch (err) {
      console.warn('Firebase update status failed:', err);
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
