import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // Importer les fonctions

import App from './App.tsx'
import './index.css'

// Importer nos pages
import DashboardPage from './pages/DashboardPage.tsx'
import TransactionsPage from './pages/TransactionsPage.tsx'
import CategoriesPage from './pages/CategoriesPage.tsx'
import SettingsPage from './pages/SettingsPage.tsx'

// Définir nos routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // Le composant App devient notre layout de base
    children: [
      // Les "enfants" seront affichés à l'intérieur de App
      {
        path: '/',
        element: <DashboardPage />,
      },
      {
        path: '/transactions',
        element: <TransactionsPage />,
      },
      {
        path: '/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} /> 
    {/* Remplacer <App /> par le RouterProvider */}
  </React.StrictMode>,
)