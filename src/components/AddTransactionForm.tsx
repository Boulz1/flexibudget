import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import TextInputFormField from './forms/TextInputFormField';
import SelectFormField from './forms/SelectFormField';
import { PILLARS } from '../constants';

const transactionSchema = z.object({
  type: z.enum(['revenu', 'depense']),
  pillar: z.enum(PILLARS).optional(),
  categoryId: z.string().min(1, "Veuillez sélectionner une catégorie."),
  amount: z.coerce.number().positive({ message: "Le montant doit être un nombre positif." }),
  date: z.string().min(1, { message: "La date est requise." }),
  description: z.string().optional(),
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
  const [lastUsedDate, setLastUsedDate] = useState<string | null>(null);

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
      reset({
        type: 'depense',
        date: lastUsedDate || new Date().toISOString().split('T')[0],
        description: '',
        amount: undefined,
        categoryId: '',
        pillar: undefined
      });
    }
  }, [transactionToEdit, reset, allCategories, lastUsedDate]);

  const transactionType = watch('type');
  const selectedPillar = watch('pillar');

  const availableCategoryOptions = useMemo(() => {
    let filteredCategories: any[] = [];
    if (transactionType === 'revenu') {
      filteredCategories = allCategories.filter(c => c.type === 'revenu');
    } else if (transactionType === 'depense' && selectedPillar) {
      filteredCategories = allCategories.filter(c => c.pillar === selectedPillar);
    }
    return filteredCategories.map(cat => ({ value: cat.id, label: cat.name }));
  }, [allCategories, transactionType, selectedPillar]);

  useEffect(() => {
    const currentCategoryId = watch('categoryId');
    const categoryExists = availableCategoryOptions.some(c => c.value === currentCategoryId);
    
    if(!isEditing) {
      if(transactionType === 'revenu') setValue('pillar', undefined);
      if(!categoryExists) setValue('categoryId', '');
    }
  }, [transactionType, selectedPillar, availableCategoryOptions, setValue, isEditing, watch]);

  const onSubmit = (data: TransactionFormData) => {
    const submissionData = { ...data };

    // Ensure pillar is undefined if it's a 'revenu' type transaction
    // The schema ensures pillar is present for 'depense' if required by its logic
    if (submissionData.type === 'revenu') {
      submissionData.pillar = undefined;
    }
    // For 'depense', data.pillar should already be correctly set by the form's state,
    // driven by the schema and useEffect hooks.

    if (isEditing && editingTransactionId) {
      updateTransaction(editingTransactionId, submissionData);
      toast.success('Transaction modifiée avec succès !');
    } else {
      addTransaction(submissionData);
      toast.success('Transaction ajoutée avec succès !');
    }
    setLastUsedDate(data.date); // Store the submitted date
    // onFormSubmit(); // Removed to prevent modal from closing automatically
  };

  const typeOptions = [
    { value: 'depense', label: 'Dépense' },
    { value: 'revenu', label: 'Revenu' },
  ];
  const pillarOptions = PILLARS.map(p => ({ value: p, label: p }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SelectFormField
        id="type"
        label="Type de transaction"
        register={register('type')}
        error={errors.type}
        options={typeOptions}
      />

      {transactionType === 'depense' && (
        <SelectFormField
          id="pillar"
          label="Pilier"
          register={register('pillar')}
          error={errors.pillar}
          options={pillarOptions}
          placeholderOptionLabel="Sélectionner un pilier..."
        />
      )}

      <SelectFormField
        id="categoryId"
        label="Catégorie"
        register={register('categoryId')}
        error={errors.categoryId}
        options={availableCategoryOptions}
        disabled={availableCategoryOptions.length === 0}
        placeholderOptionLabel="Sélectionner une catégorie..."
      />
      
      <TextInputFormField
        id="description"
        label="Description"
        register={register('description')}
        error={errors.description}
        type="text"
        placeholder="Ex: Courses de la semaine"
      />

      <TextInputFormField
        id="amount"
        label="Montant (€)"
        register={register('amount')}
        error={errors.amount}
        type="number"
        step="0.01"
        placeholder="0.00"
      />

      <TextInputFormField
        id="date"
        label="Date"
        register={register('date')}
        error={errors.date}
        type="date"
      />

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 disabled:bg-gray-400 disabled:dark:bg-gray-500 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Sauvegarder les modifications' : 'Ajouter la transaction')}
        </button>
      </div>
    </form>
  );
};

export default AddTransactionForm;