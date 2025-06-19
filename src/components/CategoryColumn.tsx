import type { Category } from '../types';
import { Pencil, Trash2 } from 'lucide-react';

interface CategoryColumnProps {
  title: string;
  categories: Category[];
  className?: string;
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
}

const CategoryColumn = ({ title, categories, className, onDelete, onEdit }: CategoryColumnProps) => {
  return (
    <div className={`rounded-xl shadow-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="group flex items-center justify-between bg-white/10 p-2 rounded-md transition-colors duration-150 hover:bg-white/20">
              <span className="truncate text-sm text-white/90" title={category.name}>{category.name}</span>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(category)}
                  className="p-1 rounded-md hover:bg-gray-200/20 dark:hover:bg-gray-700/50 text-white/70 hover:text-blue-400 dark:hover:text-blue-500 transition-colors"
                  title="Modifier la catégorie"
                >
                  <Pencil size={18} />
                </button>
                <button 
                  onClick={() => onDelete(category.id)}
                  className="p-1 rounded-md hover:bg-gray-200/20 dark:hover:bg-gray-700/50 text-white/70 hover:text-red-500 transition-colors"
                  title="Supprimer la catégorie"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white/50 italic text-sm">Aucune catégorie</p>
        )}
      </div>
    </div>
  );
};

export default CategoryColumn;