import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Transaction } from '../types'; // Pillar type import can be removed if not used directly in this file's public API

// const initialTransactions: Transaction[] = [ // This line was present in the read_files output
//     // ... vos transactions initiales restent les mêmes
// ];
// Assuming initialTransactions is handled by persist or defaults to empty array if not specified.
const initialTransactions: Transaction[] = []; // Standardizing to empty for clarity if persist handles seeding.


interface TransactionState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (transactionId: string) => void;
  updateTransaction: (id: string, data: Partial<Omit<Transaction, 'id'>>) => void;
}

/**
 * Zustand store for managing transactions.
 * Persists transaction data to local storage and sorts transactions by date upon modification.
 */
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: initialTransactions, // Uses the initialTransactions defined above.

      /**
       * Adds a new transaction to the store.
       * Expects `pillar` to be part of `transactionData` if `type` is 'depense'.
       * @param transactionData - The transaction data to add (excluding ID, which is auto-generated using UUID).
       */
      addTransaction: (transactionData) => {
        const newTransaction: Transaction = {
          id: uuidv4(), // Using UUID for more robust ID generation.
          ...transactionData,
        };
        // Transactions are sorted by date (descending) after add/update to keep the list ordered chronologically.
        set((state) => ({ transactions: [newTransaction, ...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) }));
      },
      
      /**
       * Deletes a transaction from the store by its ID.
       * @param transactionId - The ID of the transaction to delete.
       */
      deleteTransaction: (transactionId) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== transactionId) }));
      },

      /**
       * Updates an existing transaction in the store.
       * Expects `pillar` to be part of `data` if `type` is 'depense' and pillar is being changed.
       * @param id - The ID of the transaction to update.
       * @param data - An object containing the partial transaction fields to update.
       */
      updateTransaction: (id, data) => {
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...data }
              : transaction 
          ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), // Transactions are sorted by date (descending) after add/update.
        }));
      },
    }),
    {
      name: 'flexibudget-transactions-storage',
    }
  )
);