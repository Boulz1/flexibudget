import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCategoryStore } from '../stores/categoryStore';
import type { Category } from '../types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import TextInputFormField from './forms/TextInputFormField';
import SelectFormField from './forms/SelectFormField';
import { PILLARS } from '../constants'; // Adjusted path

const categorySchema = z.object({
  type: z.enum(['revenu', 'depense']),
  pillar: z.enum(PILLARS).optional(), // Use imported PILLARS
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

  const pillarOptions = PILLARS.map(p => ({ value: p, label: p }));
  const typeOptions = [
    { value: 'depense', label: 'Dépense' },
    { value: 'revenu', label: 'Revenu' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <SelectFormField
        id="type"
        label="Type de catégorie"
        register={register('type')}
        error={errors.type}
        options={typeOptions}
      />

      {categoryType === 'depense' && (
        <SelectFormField
          id="pillar"
          label="Pilier"
          register={register('pillar')}
          error={errors.pillar}
          options={pillarOptions}
          placeholderOptionLabel="Sélectionner un pilier..."
        />
      )}

      <TextInputFormField
        id="name"
        label="Nom de la catégorie"
        register={register('name')}
        error={errors.name}
        type="text"
        placeholder="Ex: Courses, Salaire..."
      />

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 disabled:bg-gray-400 disabled:dark:bg-gray-500 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sauvegarde...' : (isEditing ? 'Sauvegarder les modifications' : 'Ajouter la catégorie')}
        </button>
      </div>
    </form>
  );
};

export default AddCategoryForm;