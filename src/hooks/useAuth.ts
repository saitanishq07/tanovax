import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

const LOCAL_ADMIN_AUTH_KEY = 'tanovax_admin_logged_in';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_ADMIN_AUTH_KEY) === 'true';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setLoading(true);
    if (isFirebaseConfigured) {
      try {
        await signInWithEmailAndPassword(auth, email, pass);
        setLoading(false);
        return true;
      } catch (err) {
        console.warn('Firebase auth failed:', err);
      }
    }

    // Demo authentication fallback
    if (email === 'admin@tanovax.com' && pass === 'adminpassword') {
      localStorage.setItem(LOCAL_ADMIN_AUTH_KEY, 'true');
      setIsLocalAdmin(true);
      setLoading(false);
      return true;
    }

    setLoading(false);
    return false;
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.removeItem(LOCAL_ADMIN_AUTH_KEY);
    setIsLocalAdmin(false);
    setUser(null);
  };

  const isAuthenticated = Boolean(user || isLocalAdmin);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout
  };
};
