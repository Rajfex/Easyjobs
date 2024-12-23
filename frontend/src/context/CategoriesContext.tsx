import { createContext, useContext, useEffect, useState } from "react";
import { getAllCategories } from "../api";
import { Category } from "../types";

interface CategoriesContextType {
    categories: Category[];
}


const CategoriesContext = createContext<CategoriesContextType | null>(null);


export const CategoriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
            const response = await getAllCategories();
            setCategories(response.data);
          } catch (error) {
            console.error('Error fetching categories:', error);
          }
        };
        fetchCategories();
      }, []);

    return (
        <CategoriesContext.Provider value={{ categories }}>
          {children}
        </CategoriesContext.Provider>
      );
}

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error('useCategories must be used within an CategoriesProvider');
  }
  return context;
};