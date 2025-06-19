import { useSettingsStore } from "../stores/settingsStore";
import { AlertTriangle } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  amount: number;
  className?: string;
  budgetPercentage?: number;
  budgetAmount?: number;
}

const SummaryCard = ({ title, amount, className, budgetPercentage, budgetAmount }: SummaryCardProps) => {
  const currency = useSettingsStore((state) => state.currency);
  let statusText = "";
  // Couleur neutre pour le texte de statut pour une meilleure lisibilité sur fonds variables
  const statusColorClass = "text-gray-200 dark:text-gray-300";
  let showWarningIcon = false;

  if (budgetAmount !== undefined) {
    const diff = budgetAmount - amount;
    if (diff >= 0) {
      statusText = `Marge restante: ${diff.toLocaleString('fr-FR', { style: 'currency', currency: currency })}`;
    } else {
      statusText = `Dépassement: ${Math.abs(diff).toLocaleString('fr-FR', { style: 'currency', currency: currency })}`;
      showWarningIcon = true;
    }
  }

  const baseCardClasses = "p-4 rounded-xl shadow-lg flex flex-col transition-transform duration-200 ease-in-out hover:scale-105";

  return (
    <div className={`${baseCardClasses} ${className || ""}`}>
      <div className="flex justify-between items-start mb-1"> {/* items-start pour aligner titre et icône si elle est à côté du % */}
        <h3 className="text-base font-semibold text-white/90">{title}</h3>
        <div className="flex flex-col items-end">
          {budgetPercentage !== undefined && (
            <span className="text-xs font-bold text-white/60">
              {budgetPercentage}% du budget
            </span>
          )}
          {showWarningIcon && (
            // Icône d'avertissement. Ajuster la couleur pour bonne visibilité.
            <AlertTriangle size={20} className="text-yellow-400 dark:text-yellow-300 mt-1" />
          )}
        </div>
      </div>
      
      <p className="text-2xl font-bold text-white mt-1">
        {amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })}
      </p>

      {budgetAmount !== undefined && (
        <p className="text-xs text-white/60 mt-1">
          Objectif: {budgetAmount.toLocaleString('fr-FR', { style: 'currency', currency: currency })}
        </p>
      )}

      {statusText && (
        <p className={`text-sm font-medium mt-2 ${statusColorClass}`}>
          {statusText}
        </p>
      )}
    </div>
  );
};

export default SummaryCard;