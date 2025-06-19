import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

export const useTheme = (): [Theme, () => void] => {
  // 1. Déterminer le thème initial
  const getInitialTheme = (): Theme => {
    // Si un thème est déjà sauvegardé dans localStorage, on l'utilise
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      return storedTheme as Theme;
    }
    // Sinon, on respecte la préférence du système d'exploitation
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // 2. Fonction pour basculer le thème
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // 3. Appliquer le thème à l'application
  useEffect(() => {
    const root = window.document.documentElement; // La balise <html>
    
    // On retire l'ancienne classe
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    // On ajoute la nouvelle
    root.classList.add(theme);

    // On sauvegarde le choix dans le localStorage pour la prochaine visite
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, toggleTheme];
};