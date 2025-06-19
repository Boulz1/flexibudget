import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category, Pillar } from '../types';

const initialCategories: Category[] = [
  // ... (données initiales inchangées)
  { id: 'cat-d-1', name: 'Loyer', type: 'depense', pillar: 'Besoins' },
  { id: 'cat-d-2', name: 'Courses', type: 'depense', pillar: 'Besoins' },
  { id: 'cat-d-3', name: 'Restaurant', type: 'depense', pillar: 'Envies' },
  { id: 'cat-d-4', name: 'Livret A', type: 'depense', pillar: 'Épargne' },
  { id: 'cat-r-1', name: 'Salaire', type: 'revenu' },
  { id: 'cat-r-2', name: 'Ventes en ligne', type: 'revenu' },
];

// L'interface mise à jour avec l'action "update"
interface CategoryState {
  categories: Category[];
  addCategory: (data: { name: string; type: 'revenu' } | { name: string; type: 'depense'; pillar: Pillar }) => void;
  deleteCategory: (categoryId: string) => void;
  updateCategory: (id: string, data: Partial<Omit<Category, 'id'>>) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: initialCategories,

      addCategory: (categoryData) => {
        const newCategory: Category = {
          id: `cat-${Date.now()}-${Math.random()}`,
          ...categoryData,
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      deleteCategory: (categoryId) => {
        set((state) => ({
          categories: state.categories.filter(
            (category) => category.id !== categoryId
          ),
        }));
      },

      // --- Logique de mise à jour ajoutée ---
      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((category) =>
            category.id === id
              ? { ...category, ...data, pillar: data.type === 'revenu' ? undefined : data.pillar }
              : category
          ),
        }));
      },
    }),
    {
      name: 'flexibudget-categories-storage',
    }
  )
);