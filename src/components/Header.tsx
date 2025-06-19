import { NavLink } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { Moon, Sun } from 'lucide-react'; // Importer les icônes

const Header = () => {
  const [theme, toggleTheme] = useTheme();

  // Styles pour les liens de navigation
  const linkStyle = "p-2 rounded-md hover:bg-gray-700 transition-colors";
  const activeLinkStyle = "bg-gray-600";

  return (
    <header className="bg-gray-800 p-4 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Flexibudget</h1>
        <nav className="flex gap-2 sm:gap-4 items-center">
          <NavLink to="/" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
            Tableau de bord
          </NavLink>
          <NavLink to="/transactions" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
            Transactions
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
            Catégories
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `${linkStyle} ${isActive ? activeLinkStyle : ''}`}>
            Paramètres
          </NavLink>
          
          {/* Bouton de changement de thème avec les nouvelles icônes */}
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
            title={theme === 'light' ? 'Passer au mode sombre' : 'Passer au mode clair'}
          >
            {theme === 'light' ? 
              ( <Moon size={20} /> ) : 
              ( <Sun size={20} /> )
            }
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;