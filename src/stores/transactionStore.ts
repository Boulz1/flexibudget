import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Pillar, Transaction } from '../types';
import { useCategoryStore } from './categoryStore';

const initialTransactions: Transaction[] = [
    // ... vos transactions initiales restent les mêmes
];

interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'pillar'>) => void;
  deleteTransaction: (transactionId: string) => void;
  updateTransaction: (id: string, data: Omit<Transaction, 'id' | 'pillar'>) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,

      addTransaction: (transactionData) => {
        // --- CORRECTION : Déclaration de pillar avant le if ---
        let pillar: Pillar | undefined; 

        if (transactionData.type === 'depense' && transactionData.categoryId) {
          const categories = useCategoryStore.getState().categories;
          const category = categories.find(c => c.id === transactionData.categoryId);
          pillar = category?.pillar; // On assigne la valeur
        }

        const newTransaction: Transaction = {
          id: uuidv4(),
          ...transactionData,
          pillar, // Maintenant, pillar est accessible ici
        };

        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
      },
      
      deleteTransaction: (transactionId) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== transactionId) }));
      },

      updateTransaction: (id, data) => {
        // --- CORRECTION : Déclaration de pillar avant le if ---
        let pillar: Pillar | undefined;

        if (data.type === 'depense' && data.categoryId) {
          const categories = useCategoryStore.getState().categories;
          const category = categories.find(c => c.id === data.categoryId);
          pillar = category?.pillar; // On assigne la valeur
        }

        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              // Maintenant, pillar est accessible ici
              ? { ...transaction, ...data, pillar: data.type === 'depense' ? pillar : undefined } 
              : transaction 
          ),
        }));
      },
    }),
    {
      name: 'flexibudget-transactions-storage',
    }
  )
);