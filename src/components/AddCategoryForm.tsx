import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoryStore } from '../stores/categoryStore';
import type { Pillar, Category } from '../types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const categorySchema = z.object({
  type: z.enum(['revenu', 'depense']),
  pillar: z.enum(['Besoins', 'Envies', 'Épargne']).optional(),
  name: z.string().min(2, { message: 'Le nom doit faire au moins 2 caractères.' }),
}).refine(data => data.type === 'revenu' || (data.type === 'depense' && !!data.pillar), {
  message: "Un pilier est requis pour une dépense.",
  path: ["pillar"],
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface AddCategoryFormProps {
  onFormSubmit: () => void;
  categoryToEdit: Category | null;
}

const AddCategoryForm = ({ onFormSubmit, categoryToEdit }: AddCategoryFormProps) => {
  const { addCategory, updateCategory } = useCategoryStore();
  const isEditing = !!categoryToEdit?.id;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: categoryToEdit || { type: 'depense', name: '' },
  });
  
  useEffect(() => {
    if (categoryToEdit) {
      reset(categoryToEdit);
    }
  }, [categoryToEdit, reset]);

  const categoryType = watch('type');
  
  useEffect(() => {
    if (categoryType === 'revenu') {
      setValue('pillar', undefined);
    }
  }, [categoryType, setValue]);

  const onSubmit = (data: CategoryFormData) => {
    const { name, type, pillar } = data;
    if (isEditing && categoryToEdit) {
      updateCategory(categoryToEdit.id, { name, type, pillar });
      toast.success('Catégorie modifiée avec succès !');
    } else {
      if (type === 'depense' && pillar) {
        addCategory({ name, type, pillar });
        toast.success('Catégorie ajoutée avec succès !');
      } else if (type === 'revenu') {
        addCategory({ name, type });
        toast.success('Catégorie ajoutée avec succès !');
      }
    }
    onFormSubmit();
  };

  const pillars: Pillar[] = ['Besoins', 'Envies', 'Épargne'];
  const baseInputClass = "mt-1 w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type de catégorie</label>
        <select {...register('type')} id="type" className={baseInputClass}>
          <option value="depense">Dépense</option>
          <option value="revenu">Revenu</option>
        </select>
      </div>

      {categoryType === 'depense' && (
        <div>
          <label htmlFor="pillar" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pilier</label>
          <select {...register('pillar')} id="pillar" className={baseInputClass}>
            <option value="">Sélectionner un pilier...</option>
            {pillars.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          {errors.pillar && <p className="text-red-500 text-sm mt-1">{errors.pillar.message}</p>}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nom de la catégorie</label>
        <input {...register('name')} id="name" type="text" placeholder="Ex: Courses, Salaire..." className={baseInputClass} />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Sauvegarder les modifications' : 'Ajouter la catégorie')}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;