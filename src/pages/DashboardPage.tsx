import { useState, useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import { useTransactionStore } from '../stores/transactionStore';
import { useSettingsStore } from '../stores/settingsStore';
import SummaryCard from '../components/SummaryCard';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const getCurrentMonth = () => new Date().toISOString().substring(0, 7);

const chartColors = {
  besoins: '#2563eb',
  envies: '#d97706',
  epargne: '#7c3aed',
};

const DashboardPage = () => {
  const [theme] = useTheme();
  const allTransactions = useTransactionStore((state) => state.transactions);
  const { budget: budgetPercentages, currency } = useSettingsStore();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());

  // Calculates derived data for the dashboard based on transactions and settings.
  // Memoized to optimize performance, re-calculating only when dependencies change.
  const { totalRevenu, depensesParPilier, budget, availableMonths } = useMemo(() => {
    const months = new Set(allTransactions.map(t => t.date.substring(0, 7)));
    const sortedMonths = Array.from(months).sort((a, b) => b.localeCompare(a));
    const transactionsDuMois = allTransactions.filter(t => t.date.substring(0, 7) === selectedMonth);
    const revenu = transactionsDuMois.filter(t => t.type === 'revenu').reduce((acc, t) => acc + t.amount, 0);
    const depenses = { Besoins: 0, Envies: 0, Épargne: 0 };
    transactionsDuMois.filter(t => t.type === 'depense' && t.pillar).forEach(t => {
      if (t.pillar) depenses[t.pillar] += t.amount;
    });
    const budgetMensuel = {
      besoins: revenu * (budgetPercentages.needs / 100),
      envies: revenu * (budgetPercentages.wants / 100),
      epargne: revenu * (budgetPercentages.savings / 100),
    };
    return { totalRevenu: revenu, depensesParPilier: depenses, budget: budgetMensuel, availableMonths: sortedMonths };
  }, [allTransactions, selectedMonth, budgetPercentages]);

  const chartTextColor = theme === 'light' ? '#374151' : '#E5E7EB';

  // Common chart options for both Bar and Doughnut charts.
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { // Scales configuration (relevant for Bar chart, ignored by Doughnut)
      x: { ticks: { color: chartTextColor }, grid: { color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' } },
      y: { ticks: { color: chartTextColor }, grid: { color: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' } },
    },
    plugins: {
      legend: {
        labels: {
          color: chartTextColor,
        },
      },
    },
  };

  const labels = ['Besoins', 'Envies', 'Épargne'];
  // Data configuration for the Bar chart displaying budget vs actual expenses per pillar.
  const barChartData = {
    labels,
    datasets: [
      {
        label: `Budget Alloué (${currency})`,
        data: [budget.besoins, budget.envies, budget.epargne],
        backgroundColor: theme === 'light' ? 'rgba(54, 162, 235, 0.6)' : 'rgba(54, 162, 235, 0.4)',
        borderColor: theme === 'light' ? 'rgb(54, 162, 235)' : 'rgba(54, 162, 235, 0.8)',
        borderWidth: 1,
      },
      {
        label: `Dépenses Réelles (${currency})`,
        data: [depensesParPilier.Besoins, depensesParPilier.Envies, depensesParPilier.Épargne],
        backgroundColor: theme === 'light' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 99, 132, 0.4)',
        borderColor: theme === 'light' ? 'rgb(255, 99, 132)' : 'rgba(255, 99, 132, 0.8)',
        borderWidth: 1,
      },
    ],
  };

  // Data configuration for the Doughnut chart showing distribution of expenses per pillar.
  const doughnutChartData = {
    labels,
    datasets: [
      {
        label: 'Répartition des Dépenses',
        data: [depensesParPilier.Besoins, depensesParPilier.Envies, depensesParPilier.Épargne],
        backgroundColor: [chartColors.besoins, chartColors.envies, chartColors.epargne],
        borderColor: theme === 'light' ? '#ffffff' : '#1f2937', // Border color for doughnut segments
        borderWidth: 3,
      },
    ],
  };

  
  const cardBaseClass = "bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Tableau de bord</h1>
        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="w-full sm:w-auto bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-brand-besoins focus:border-brand-besoins transition-colors duration-150">
          {availableMonths.map(month => <option key={month} value={month}>{month}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Revenus du mois" amount={totalRevenu} className="bg-brand-revenu" />
        <SummaryCard title="Dépenses (Besoins)" amount={depensesParPilier.Besoins} className="bg-brand-besoins" budgetPercentage={budgetPercentages.needs} budgetAmount={budget.besoins} />
        <SummaryCard title="Dépenses (Envies)" amount={depensesParPilier.Envies} className="bg-brand-envies" budgetPercentage={budgetPercentages.wants} budgetAmount={budget.envies} />
        <SummaryCard title="Épargne & Invest." amount={depensesParPilier.Épargne} className="bg-brand-epargne" budgetPercentage={budgetPercentages.savings} budgetAmount={budget.epargne} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={cardBaseClass}>
          <h2 className="text-xl font-semibold mb-4 text-left text-gray-900 dark:text-gray-100">Budget vs Dépenses</h2>
          <div className="relative h-80">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
        <div className={`${cardBaseClass} flex flex-col items-center`}>
          <h2 className="text-xl font-semibold mb-4 text-left text-gray-900 dark:text-gray-100">Répartition des Dépenses</h2>
          <div className="w-full max-w-xs">
            <Doughnut data={doughnutChartData} options={{ plugins: { legend: { labels: { color: chartTextColor } } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;