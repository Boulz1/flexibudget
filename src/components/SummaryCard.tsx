import { useSettingsStore } from "../stores/settingsStore";

interface SummaryCardProps { title: string; amount: number; className?: string; budgetPercentage?: number; budgetAmount?: number; }

const SummaryCard = ({ title, amount, className, budgetPercentage, budgetAmount }: SummaryCardProps) => {
  const currency = useSettingsStore((state) => state.currency);

  return (
    <div className={`p-4 rounded-xl shadow-lg flex flex-col transition-transform duration-200 ease-in-out hover:scale-105 ${className}`}>
      <div className="flex justify-between items-baseline mb-1">
        <h3 className="text-base font-semibold text-white/90">{title}</h3>
        {/* Affichage conditionnel du pourcentage */}
        {budgetPercentage !== undefined && (
          <span className="text-xs font-bold text-white/60">
            {budgetPercentage}% du budget
          </span>
        )}
      </div>
      
      <p className="text-2xl font-bold text-white mt-1">
        {amount.toLocaleString('fr-FR', { style: 'currency', currency: currency })}
      </p>

      {/* Affichage conditionnel de l'objectif */}
      {budgetAmount !== undefined && (
        <p className="text-xs text-white/60 mt-auto pt-2">
          Objectif: {budgetAmount.toLocaleString('fr-FR', { style: 'currency', currency: currency })}
        </p>
      )}
    </div>
  );
};

export default SummaryCard;