import type { Category } from '../types';

interface CategoryColumnProps {
  title: string;
  categories: Category[];
  className?: string;
  onDelete: (categoryId: string) => void;
  onEdit: (category: Category) => void;
}

const CategoryColumn = ({ title, categories, className, onDelete, onEdit }: CategoryColumnProps) => {
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-bold mb-4 text-white">{title}</h3>
      <div className="space-y-2">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div key={category.id} className="group flex ... bg-white/10 ... rounded-md ... transition-colors duration-150 hover:bg-white/20">
              <span className="truncate" title={category.name}>{category.name}</span>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(category)}
                  className="text-white/70 hover:text-blue-400 p-1"
                  title="Modifier la catégorie"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button 
                  onClick={() => onDelete(category.id)}
                  className="text-white/70 hover:text-red-500 p-1"
                  title="Supprimer la catégorie"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
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