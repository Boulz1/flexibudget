import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BudgetPercentages {
  needs: number;
  wants: number;
  savings: number;
}

interface SettingsState {
  budget: BudgetPercentages;
  currency: string; // <-- Ajouter la devise
  setBudget: (newBudget: BudgetPercentages) => void;
  setCurrency: (newCurrency: string) => void; // <-- Ajouter l'action pour la devise
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      budget: {
        needs: 50,
        wants: 30,
        savings: 20,
      },
      currency: 'EUR', // <-- Définir une valeur par défaut

      setBudget: (newBudget) => {
        set({ budget: newBudget });
      },
      setCurrency: (newCurrency) => { // <-- Implémenter l'action
        set({ currency: newCurrency });
      },
    }),
    {
      name: 'flexibudget-settings-storage',
    }
  )
);