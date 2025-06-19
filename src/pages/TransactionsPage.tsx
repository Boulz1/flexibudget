import { useState, useMemo } from 'react';
import { useCalendar } from '../hooks/useCalendar';
import { addMonths, subMonths, format, isSameMonth, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import Modal from '../components/Modal';
import AddTransactionForm from '../components/AddTransactionForm';
import TransactionDetailPanel from '../components/TransactionDetailPanel';
import { useTransactionStore } from '../stores/transactionStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { Transaction } from '../types';
import toast from 'react-hot-toast';

const TransactionsPage = () => {
  // --- ÉTATS ---
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the current month/year being viewed in the calendar.
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Stores the date clicked by the user to view details or add transactions.
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null); // ID of the transaction being edited, or 'new' for adding. Controls modal visibility.

  // --- HOOKS & STORES ---
  const { days, firstDayOfMonth } = useCalendar(currentDate);
  const { transactions: allTransactions, deleteTransaction } = useTransactionStore();
  const { currency } = useSettingsStore();

  // Groups transactions by date for efficient lookup and display in the calendar.
  const transactionsByDate = useMemo(() => {
    return allTransactions.reduce((acc, transaction) => {
      const dateKey = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(transaction);
      return acc;
    }, {} as Record<string, Transaction[]>);
  }, [allTransactions]);

  // --- GESTIONNAIRES D'ÉVÉNEMENTS ---
  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());
  
  /** Handles selection of a day on the calendar to show transaction details. */
  const handleSelectDay = (day: Date) => setSelectedDate(day);
  /** Opens the modal for adding a new transaction. */
  const handleOpenAddModal = () => setEditingTransactionId('new');
  const handleOpenEditModal = (id: string) => setEditingTransactionId(id);

  /** Closes all modals (transaction detail and add/edit form). */
  const handleCloseAllModals = () => {
    setSelectedDate(null);
    setEditingTransactionId(null);
  };

  const weekdays = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim'];

  return (
    <div>
      {/* EN-TÊTE DE NAVIGATION */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Page title is now the dynamic month/year */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <button onClick={goToPreviousMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">‹</button>
            <button onClick={goToToday} className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">Aujourd'hui</button>
            <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">›</button>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-150 w-full sm:w-auto"
        >
          + Ajouter une transaction
        </button>
      </div>

      {/* GRILLE DU CALENDRIER */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        {weekdays.map(day => (
          <div key={day} className="text-center font-bold py-2 text-sm bg-white dark:bg-gray-800 uppercase text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const transactionsForDay = transactionsByDate[dayKey] || [];
          const isCurrentMonth = isSameMonth(day, firstDayOfMonth);
          const isCurrentDay = isToday(day);

          return (
            <div 
              key={day.toString()}
              onClick={() => handleSelectDay(day)}
              className={`relative min-h-[120px] p-2 pt-8 flex flex-col gap-1 bg-white dark:bg-gray-800 transition-colors cursor-pointer ${isCurrentMonth ? 'hover:bg-gray-50 dark:hover:bg-gray-700/50' : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400'}`}>
              <span className={`absolute top-2 right-2 text-sm font-semibold ${isCurrentDay ? 'bg-brand-besoins text-white rounded-full flex items-center justify-center h-6 w-6' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="overflow-y-auto space-y-1">
                {transactionsForDay.slice(0, 2).map(transaction => (
                  <div 
                    key={transaction.id}
                    className={`p-1 text-xs rounded text-white truncate ${transaction.type === 'revenu' ? 'bg-brand-revenu' : 'bg-red-500'}`}
                    title={`${transaction.description}: ${transaction.amount.toLocaleString('fr-FR', {style: 'currency', currency})}`}
                  >
                    {transaction.description}
                  </div>
                ))}
                {transactionsForDay.length > 2 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    + {transactionsForDay.length - 2} autre(s)
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* MODALE D'AJOUT/ÉDITION (contrôlée par editingTransactionId) */}
      {!!editingTransactionId && (
        <Modal
          isOpen={!!editingTransactionId}
          onClose={handleCloseAllModals}
          title={editingTransactionId === 'new' ? "Ajouter une transaction" : "Modifier la transaction"}
        >
          <AddTransactionForm 
            onFormSubmit={handleCloseAllModals} 
            editingTransactionId={editingTransactionId === 'new' ? null : editingTransactionId} 
          />
        </Modal>
      )}

      {/* MODALE DE DÉTAILS (contrôlée par selectedDate) */}
      {selectedDate && (
        <Modal
          isOpen={!!selectedDate}
          onClose={handleCloseAllModals}
          title={`Transactions du ${format(selectedDate, 'd MMMM yyyy', { locale: fr })}`}
        >
          <TransactionDetailPanel 
            transactions={(transactionsByDate[format(selectedDate, 'yyyy-MM-dd')] || []).sort((a,b) => b.amount - a.amount)}
            onEdit={(id) => {
              handleCloseAllModals();
              setTimeout(() => handleOpenEditModal(id), 150);
            }}
            onDelete={(id) => {
              deleteTransaction(id);
              toast.error('Transaction supprimée.');
              if ((transactionsByDate[format(selectedDate, 'yyyy-MM-dd')] || []).length === 1) {
                handleCloseAllModals();
              }
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsPage;