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

/**
 * Zustand store for managing categories.
 * Persists category data to local storage using `persist` middleware.
 */
export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: initialCategories,

      /**
       * Adds a new category to the store.
       * The ID is auto-generated using a timestamp and a random number.
       * @param categoryData - An object containing the category details.
       *                     It can be for 'revenu' (name, type) or 'depense' (name, type, pillar).
       */
      addCategory: (categoryData) => {
        // ID generation: Uses timestamp and random number. For high-concurrency scenarios, UUID might be more robust.
        const newCategory: Category = {
          id: `cat-${Date.now()}-${Math.random()}`,
          ...categoryData,
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },
      
      /**
       * Deletes a category from the store by its ID.
       * @param categoryId - The ID of the category to delete.
       */
      deleteCategory: (categoryId) => {
        set((state) => ({
          categories: state.categories.filter(
            (category) => category.id !== categoryId
          ),
        }));
      },

      /**
       * Updates an existing category in the store.
       * If the category type is changed to 'revenu', its pillar is set to undefined.
       * @param id - The ID of the category to update.
       * @param data - An object containing the partial category data to update.
       */
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