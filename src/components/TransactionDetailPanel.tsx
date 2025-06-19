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
                <div className="flex items-center gap-2">
                  {/* Boutons d'action avec les nouvelles icônes */}
                  <button onClick={() => onEdit(t.id)} className="text-gray-400 ... hover:text-brand-besoins transition-transform hover:scale-125">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => onDelete(t.id)} className="text-gray-400 ... hover:text-red-500 transition-transform hover:scale-125">
                    <Trash2 size={16} />
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