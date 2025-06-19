import { useMemo } from 'react';
import { 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  startOfMonth, 
  startOfWeek 
} from 'date-fns';

export const useCalendar = (currentDate: Date) => {
  // useMemo garantit que ces calculs ne sont pas refaits inutilement
  const calendarData = useMemo(() => {
    // 1. Déterminer le premier et le dernier jour du mois
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    
    // 2. Déterminer le début et la fin de la période à afficher
    // Pour commencer la semaine le Lundi, on ajoute { weekStartsOn: 1 }
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    // 3. Créer un tableau de tous les jours dans cet intervalle
    const daysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return {
      days: daysInMonth, // Le tableau complet des jours à afficher
      firstDayOfMonth,   // Le premier jour du mois actuel
      lastDayOfMonth,    // Le dernier jour du mois actuel
    };
  }, [currentDate]);

  return calendarData;
};