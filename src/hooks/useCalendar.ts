import { useMemo } from 'react';
import { 
  eachDayOfInterval, 
  endOfMonth, 
  endOfWeek, 
  startOfMonth, 
  startOfWeek 
} from 'date-fns';

/**
 * Custom hook for generating calendar days for a given month.
 * It provides an array of Date objects representing the days to be displayed
 * on a calendar grid, including leading and trailing days from adjacent months
 * to fill a complete week view starting on Monday.
 *
 * @param currentDate - A Date object representing any day within the target month.
 * @returns An object containing:
 *  - `days`: An array of Date objects for the calendar grid.
 *  - `firstDayOfMonth`: A Date object representing the first day of the target month.
 *  - `lastDayOfMonth`: A Date object representing the last day of the target month.
 */
export const useCalendar = (currentDate: Date) => {
  // useMemo ensures these calculations are only re-done if currentDate changes.
  const calendarData = useMemo(() => {
    // Determine the first and last day of the target month.
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);
    
    // Determine the start and end dates of the full weeks to display.
    // weekStartsOn: 1 ensures the week starts on Monday.
    const startDate = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 });
    const endDate = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 });

    // Create an array of all days within that interval.
    const daysInMonth = eachDayOfInterval({
      start: startDate,
      end: endDate,
    });

    return {
      days: daysInMonth,    // Array of all days to display on the grid.
      firstDayOfMonth,      // First day of the actual selected month.
      lastDayOfMonth,       // Last day of the actual selected month.
    };
  }, [currentDate]);

  return calendarData;
};