import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useEffect, useMemo } from 'react';
import type { Pillar } from '../types';
import toast from 'react-hot-toast';

const transactionSchema = z.object({
  type: z.enum(['revenu', 'depense']),
  pillar: z.enum(['Besoins', 'Envies', 'Épargne']).optional(),
  categoryId: z.string().min(1, "Veuillez sélectionner une catégorie."),
  amount: z.coerce.number().positive({ message: "Le montant doit être un nombre positif." }),
  date: z.string().min(1, { message: "La date est requise." }),
  description: z.string().min(3, { message: "La description doit contenir au moins 3 caractères." }),
}).refine(data => data.type === 'revenu' || (data.type === 'depense' && !!data.pillar), {
  message: "Veuillez sélectionner un pilier.",
  path: ["pillar"],
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionFormProps {
  onFormSubmit: () => void;
  editingTransactionId: string | null;
}

const AddTransactionForm = ({ onFormSubmit, editingTransactionId }: AddTransactionFormProps) => {
  const { transactions, addTransaction, updateTransaction } = useTransactionStore();
  const allCategories = useCategoryStore((state) => state.categories);

  const isEditing = !!editingTransactionId;
  const transactionToEdit = useMemo(() => isEditing ? transactions.find(t => t.id === editingTransactionId) : undefined, [isEditing, editingTransactionId, transactions]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
  });
  
  useEffect(() => {
    if (transactionToEdit) {
      const category = allCategories.find(c => c.id === transactionToEdit.categoryId);
      reset({ ...transactionToEdit, pillar: category?.pillar });
    } else {
      reset({ type: 'depense', date: new Date().toISOString().split('T')[0], description: '', amount: undefined, categoryId: '', pillar: undefined });
    }
  }, [transactionToEdit, reset, allCategories]);

  const transactionType = watch('type');
  const selectedPillar = watch('pillar');

  const availableCategories = useMemo(() => {
    if (transactionType === 'revenu') {
      return allCategories.filter(c => c.type === 'revenu');
    }
    if (transactionType === 'depense' && selectedPillar) {
      return allCategories.filter(c => c.pillar === selectedPillar);
    }
    return [];
  }, [allCategories, transactionType, selectedPillar]);

  useEffect(() => {
    const currentCategoryId = watch('categoryId');
    const categoryExists = availableCategories.some(c => c.id === currentCategoryId);
    
    if(!isEditing) {
      if(transactionType === 'revenu') setValue('pillar', undefined);
      if(!categoryExists) setValue('categoryId', '');
    }
  }, [transactionType, selectedPillar, availableCategories, setValue, isEditing, watch]);

  const onSubmit = (data: TransactionFormData) => {
    const { pillar, ...transactionData } = data; 
    if (isEditing && editingTransactionId) {
      updateTransaction(editingTransactionId, transactionData);
      toast.success('Transaction modifiée avec succès !');
    } else {
      addTransaction(transactionData);
      toast.success('Transaction ajoutée avec succès !');
    }
    onFormSubmit();
  };

  const pillars: Pillar[] = ['Besoins', 'Envies', 'Épargne'];
  const baseInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className={labelClass}>Type de transaction</label>
        <select {...register("type")} id="type" className={baseInputClass}>
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </select>
      </div>

      {transactionType === 'depense' && (
        <div>
          <label htmlFor="pillar" className={labelClass}>Pilier</label>
          <select {...register("pillar")} id="pillar" className={baseInputClass}>
            <option value="">Sélectionner un pilier...</option>
            {pillars.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.pillar && <p className="text-red-500 text-sm mt-1">{errors.pillar.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="categoryId" className={labelClass}>Catégorie</label>
        <select {...register("categoryId")} id="categoryId" className={baseInputClass} disabled={!transactionType || availableCategories.length === 0}>
          <option value="">Sélectionner une catégorie...</option>
          {availableCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
      </div>
      
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <input {...register("description")} id="description" type="text" placeholder="Ex: Courses de la semaine" className={baseInputClass} />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label htmlFor="amount" className={labelClass}>Montant (€)</label>
        <input {...register("amount")} id="amount" type="number" step="0.01" placeholder="0.00" className={baseInputClass} />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
      </div>

      <div>
        <label htmlFor="date" className={labelClass}>Date</label>
        <input {...register("date")} id="date" type="date" className={baseInputClass} />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Sauvegarder les modifications' : 'Ajouter la transaction')}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;