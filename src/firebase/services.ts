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
import { ContactSubmission, Project, SubmissionStatus } from '../types';
import { initialProjects } from '../data/initialData';

const LOCAL_SUBMISSIONS_KEY = 'tanovax_contact_submissions';
const LOCAL_PROJECTS_KEY = 'tanovax_custom_projects';

// Helper for local storage submissions
const getLocalSubmissions = (): ContactSubmission[] => {
  try {
    const data = localStorage.getItem(LOCAL_SUBMISSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLocalSubmissions = (items: ContactSubmission[]) => {
  try {
    localStorage.setItem(LOCAL_SUBMISSIONS_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
};

// Helper for local storage projects
const getLocalProjects = (): Project[] => {
  try {
    const custom = localStorage.getItem(LOCAL_PROJECTS_KEY);
    const parsedCustom: Project[] = custom ? JSON.parse(custom) : [];
    // Combine initial projects with any custom created ones
    const combined = [...initialProjects];
    parsedCustom.forEach(c => {
      const idx = combined.findIndex(p => p.id === c.id);
      if (idx >= 0) {
        combined[idx] = c;
      } else {
        combined.unshift(c);
      }
    });
    return combined;
  } catch {
    return initialProjects;
  }
};

const saveLocalProjects = (projects: Project[]) => {
  try {
    // Only store modified or non-initial projects in localStorage
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to localStorage:', err);
  }
};

// ==========================================
// CONTACT SUBMISSIONS
// ==========================================
export const submitContactForm = async (data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string }> => {
  const newSubmission: ContactSubmission = {
    ...data,
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    createdAt: new Date().toISOString(),
    status: 'New'
  };

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
      console.warn('Firebase write failed, using local storage fallback:', err);
    }
  }

  // Fallback storage
  const current = getLocalSubmissions();
  current.unshift(newSubmission);
  saveLocalSubmissions(current);
  return { success: true, id: newSubmission.id };
};

export const getContactSubmissions = async (): Promise<ContactSubmission[]> => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const docs: ContactSubmission[] = [];
      snapshot.forEach(docSnap => {
        const d = docSnap.data();
        docs.push({
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
      return docs;
    } catch (err) {
      console.warn('Firebase query failed, reading local submissions:', err);
    }
  }

  return getLocalSubmissions();
};

export const updateSubmissionStatus = async (id: string, status: SubmissionStatus): Promise<boolean> => {
  if (isFirebaseConfigured && !id.startsWith('sub_')) {
    try {
      const docRef = doc(db, 'contact_submissions', id);
      await updateDoc(docRef, { status });
      return true;
    } catch (err) {
      console.warn('Firebase update failed, falling back to local storage update:', err);
    }
  }

  const list = getLocalSubmissions();
  const index = list.findIndex(item => item.id === id);
  if (index >= 0) {
    list[index].status = status;
    saveLocalSubmissions(list);
    return true;
  }
  return false;
};

// ==========================================
// PROJECTS API
// ==========================================
export const fetchProjects = async (): Promise<Project[]> => {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const firestoreProjects: Project[] = [];
        snapshot.forEach(docSnap => {
          const d = docSnap.data();
          firestoreProjects.push({
            id: docSnap.id,
            title: d.title,
            slug: d.slug,
            category: d.category,
            description: d.description,
            overview: d.overview,
            businessProblem: d.businessProblem,
            solution: d.solution,
            features: d.features || [],
            technologies: d.technologies || [],
            images: d.images || [],
            projectStatus: d.projectStatus || 'Demo Project',
            published: d.published !== undefined ? d.published : true,
            createdAt: d.createdAt || new Date().toISOString(),
            objective: d.objective || ''
          });
        });
        return firestoreProjects;
      }
    } catch (err) {
      console.warn('Firebase fetch projects failed, returning local set:', err);
    }
  }

  return getLocalProjects();
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
  const projects = await fetchProjects();
  return projects.find(p => p.slug === slug) || null;
};

export const saveProjectRecord = async (projectData: Partial<Project>): Promise<Project> => {
  const slug = projectData.slug || (projectData.title ? projectData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'project-' + Date.now());
  
  const fullProject: Project = {
    id: projectData.id || 'proj_' + Date.now(),
    title: projectData.title || 'Untitled Project',
    slug,
    category: projectData.category || 'Business Application',
    description: projectData.description || '',
    overview: projectData.overview || '',
    businessProblem: projectData.businessProblem || '',
    solution: projectData.solution || '',
    features: projectData.features || [],
    technologies: projectData.technologies || [],
    images: projectData.images && projectData.images.length > 0 ? projectData.images : ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'],
    projectStatus: projectData.projectStatus || 'Concept Project',
    published: projectData.published !== undefined ? projectData.published : true,
    createdAt: projectData.createdAt || new Date().toISOString().split('T')[0],
    objective: projectData.objective || 'Provide digital transformation solution.'
  };

  if (isFirebaseConfigured && !fullProject.id.startsWith('proj_')) {
    try {
      const docRef = doc(db, 'projects', fullProject.id);
      await updateDoc(docRef, { ...fullProject });
      return fullProject;
    } catch (err) {
      console.warn('Firebase save project failed:', err);
    }
  }

  // Local storage save
  const current = getLocalProjects();
  const idx = current.findIndex(p => p.id === fullProject.id || p.slug === fullProject.slug);
  if (idx >= 0) {
    current[idx] = fullProject;
  } else {
    current.unshift(fullProject);
  }
  saveLocalProjects(current);
  return fullProject;
};

export const deleteProjectRecord = async (id: string): Promise<boolean> => {
  if (isFirebaseConfigured && !id.startsWith('proj_')) {
    try {
      await deleteDoc(doc(db, 'projects', id));
      return true;
    } catch (err) {
      console.warn('Firebase delete project failed:', err);
    }
  }

  const current = getLocalProjects();
  const updated = current.filter(p => p.id !== id);
  saveLocalProjects(updated);
  return true;
};
