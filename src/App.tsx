import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import { Toaster } from 'react-hot-toast'; // 1. Importer le Toaster
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
      {/* 2. Ajouter le composant Toaster ici */}
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#374151',
            color: '#ffffff',
          },
        }}
      />
      
      <Header />
      <main className="container mx-auto p-4">
        {/* On ajoute mode="wait" à AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            // La clé unique est essentielle pour qu'AnimatePresence détecte le changement
            key={location.pathname}
            
            // État initial de la nouvelle page
            initial={{ opacity: 0, y: 20 }}
            
            // État animé de la nouvelle page
            animate={{ opacity: 1, y: 0 }}
            
            // État final de l'ancienne page
            exit={{ opacity: 0, y: -20 }}
            
            // Durée et type de la transition
            transition={{ duration: 0.2 }} // Une durée plus courte est souvent plus agréable
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App