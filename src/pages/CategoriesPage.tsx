import { useState } from 'react';
import { useCategoryStore } from '../stores/categoryStore';
import CategoryColumn from '../components/CategoryColumn';
import Modal from '../components/Modal';
import AddCategoryForm from '../components/AddCategoryForm';
import type { Category } from '../types';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const { categories: allCategories, deleteCategory } = useCategoryStore();
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenEditModal = (category: Category) => {
    setEditingCategory(category);
  };
  
  const handleOpenAddModal = () => {
    setEditingCategory({} as Category);
  };

  const handleCloseModal = () => {
    setEditingCategory(null);
  };

  const handleDeleteWithToast = (categoryId: string) => {
    deleteCategory(categoryId);
    toast.error('Catégorie supprimée.');
  };

  const incomeCategories = allCategories.filter(c => c.type === 'revenu');
  const needsCategories = allCategories.filter(c => c.pillar === 'Besoins');
  const wantsCategories = allCategories.filter(c => c.pillar === 'Envies');
  const savingsCategories = allCategories.filter(c => c.pillar === 'Épargne');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestion des Catégories</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
        >
          + Ajouter une catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CategoryColumn title="Revenus" categories={incomeCategories} className="bg-brand-revenu/50" onDelete={handleDeleteWithToast} onEdit={handleOpenEditModal} />
        <CategoryColumn title="Besoins" categories={needsCategories} className="bg-brand-besoins/50" onDelete={handleDeleteWithToast} onEdit={handleOpenEditModal} />
        <CategoryColumn title="Envies" categories={wantsCategories} className="bg-brand-envies/50" onDelete={handleDeleteWithToast} onEdit={handleOpenEditModal} />
        <CategoryColumn title="Épargne" categories={savingsCategories} className="bg-brand-epargne/50" onDelete={handleDeleteWithToast} onEdit={handleOpenEditModal} />
      </div>

      {editingCategory && (
        <Modal
          isOpen={!!editingCategory}
          onClose={handleCloseModal}
          title={editingCategory.id ? "Modifier la catégorie" : "Ajouter une catégorie"}
        >
          <AddCategoryForm 
            onFormSubmit={handleCloseModal} 
            categoryToEdit={editingCategory}
          />
        </Modal>
      )}
    </div>
  );
};

export default CategoriesPage;