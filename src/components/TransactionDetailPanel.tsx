import type { Transaction } from '../types';
import { useSettingsStore } from '../stores/settingsStore';
import { useCategoryStore } from '../stores/categoryStore';
import { Pencil, Trash2 } from 'lucide-react'; // Importer les icônes

interface TransactionDetailPanelProps {
  transactions: Transaction[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TransactionDetailPanel = ({ transactions, onEdit, onDelete }: TransactionDetailPanelProps) => {
  const { currency } = useSettingsStore();
  const { categories } = useCategoryStore();

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return '';
    return categories.find(c => c.id === categoryId)?.name || 'Catégorie supprimée';
  };
  
  return (
    <div className="mt-2">
      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Aucune transaction pour ce jour.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map(t => (
            <li key={t.id} className="flex items-center justify-between gap-4">
              <div className="flex-grow truncate mr-4">
                <p className="font-medium truncate text-gray-800 dark:text-gray-100">{t.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">{getCategoryName(t.categoryId)}</p>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <p className={`font-bold w-28 text-right ${t.type === 'revenu' ? 'text-brand-revenu' : 'text-red-500'}`}>
                  {t.type === 'revenu' ? '+' : '-'} {t.amount.toLocaleString('fr-FR', {style: 'currency', currency})}
                </p>
                <div className="flex items-center gap-1"> {/* Reduced gap for tighter buttons if p-2 is used */}
                  {/* Boutons d'action avec les nouvelles icônes */}
                  <button
                    onClick={() => onEdit(t.id)}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-600 transition-colors duration-150"
                    title="Modifier la transaction"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(t.id)}
                    className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-red-500 transition-colors duration-150"
                    title="Supprimer la transaction"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionDetailPanel;