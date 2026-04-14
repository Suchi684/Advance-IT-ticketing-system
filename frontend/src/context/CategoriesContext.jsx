import { createContext, useContext, useState, useEffect } from 'react';
import { getCategories } from '../services/categoryService';
import { useAuth } from './AuthContext';

const CategoriesContext = createContext(null);

export const useCategories = () => useContext(CategoriesContext);

export function CategoriesProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const { isAuthenticated } = useAuth();

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
    }
  }, [isAuthenticated]);

  return (
    <CategoriesContext.Provider value={{ categories, refreshCategories: fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  );
}
