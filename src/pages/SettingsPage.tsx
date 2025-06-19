import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettingsStore } from '../stores/settingsStore';
import { useTransactionStore } from '../stores/transactionStore';
import { useCategoryStore } from '../stores/categoryStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const settingsSchema = z.object({
  needs: z.coerce.number().min(0).max(100),
  wants: z.coerce.number().min(0).max(100),
  savings: z.coerce.number().min(0).max(100),
}).refine(data => data.needs + data.wants + data.savings === 100, {
  message: "La somme des pourcentages doit être égale à 100.",
  path: ['needs'],
});

type SettingsFormData = z.infer<typeof settingsSchema>;

const SettingsPage = () => {
  const { budget, currency, setBudget, setCurrency } = useSettingsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: budget,
  });
  
  useEffect(() => {
    reset(budget);
  }, [budget, reset]);

  const onSubmit = (data: SettingsFormData) => {
    setBudget(data);
    reset(data);
    toast.success('Modifications enregistrées avec succès !');
  };

  const handleResetData = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer TOUTES vos données ? Cette action est irréversible.")) {
      useTransactionStore.persist.clearStorage();
      useCategoryStore.persist.clearStorage();
      useSettingsStore.persist.clearStorage();
      window.location.reload(); 
    }
  };

  const baseCardClass = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg";
  const guidelineBaseInputClass = "w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins transition-colors duration-150";
  const guidelineLabelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Paramètres</h1>
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* Section Règle Budgétaire */}
        <div className={baseCardClass}>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Règle Budgétaire (%)</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="needs" className={guidelineLabelClass}>Besoins</label>
                <input {...register('needs')} type="number" id="needs" className={guidelineBaseInputClass} />
              </div>
              <div>
                <label htmlFor="wants" className={guidelineLabelClass}>Envies</label>
                <input {...register('wants')} type="number" id="wants" className={guidelineBaseInputClass} />
              </div>
              <div>
                <label htmlFor="savings" className={guidelineLabelClass}>Épargne</label>
                <input {...register('savings')} type="number" id="savings" className={guidelineBaseInputClass} />
              </div>
            </div>
            
            {(errors.needs || errors.wants || errors.savings) && (
              <p className="text-red-500 text-sm mt-4">{errors.needs?.message || errors.wants?.message || errors.savings?.message}</p>
            )}

            <div className="mt-6">
              <button type="submit" disabled={isSubmitting || !isDirty} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 disabled:bg-gray-400 disabled:dark:bg-gray-500 disabled:text-gray-600 disabled:dark:text-gray-400 disabled:cursor-not-allowed">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        {/* Section Devise */}
        <div className={baseCardClass}>
          <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Devise</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choisissez la devise à afficher dans toute l'application.</p>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={guidelineBaseInputClass} // Applied to select as well
          >
            <option value="EUR">Euro (€)</option>
            <option value="USD">Dollar Américain ($)</option>
            <option value="GBP">Livre Sterling (£)</option>
          </select>
        </div>

        {/* Section Zone Danger */}
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-500 dark:text-red-400">Zone de Danger</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
            Cette action supprimera définitivement toutes vos transactions, catégories et paramètres sauvegardés.
          </p>
          <button
            onClick={handleResetData}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150"
          >
            Réinitialiser l'Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;