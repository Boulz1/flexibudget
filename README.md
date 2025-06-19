# Flexibudget - Personal Budgeting Application

Flexibudget is a responsive personal budgeting application designed to help users track their income and expenses, categorize transactions, and manage their finances effectively based on the 50/30/20 budgeting rule (Needs, Wants, Savings).

## Key Features

*   **Transaction Management:** Add, edit, and delete income and expense transactions.
*   **Categorization:** Assign transactions to predefined categories (e.g., Loyer, Courses, Salaire) which are grouped under three main pillars: Besoins (Needs), Envies (Wants), and Épargne (Savings).
*   **Monthly Budget Overview:** Dashboard with a summary of monthly income, expenses per pillar, and budget allocation vs. actual spending.
*   **Visualizations:** Bar chart comparing budgeted amounts vs. actual spending per pillar, and a doughnut chart showing the distribution of expenses.
*   **Calendar View:** View transactions on a monthly calendar.
*   **Settings:**
    *   Customize budget rule percentages (Needs, Wants, Savings).
    *   Select display currency (EUR, USD, GBP).
    *   Toggle between Light and Dark themes.
    *   Reset all application data.
*   **Local Data Storage:** All data is saved in the browser's local storage.

## Tech Stack

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **State Management:** Zustand
*   **Charts:** Chart.js (via `react-chartjs-2`)
*   **Date Utilities:** date-fns
*   **Icons:** Lucide React
*   **Forms:** React Hook Form with Zod for validation
*   **Notifications:** React Hot Toast

## Getting Started

To run Flexibudget locally:

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd flexibudget
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # pnpm install
    # or
    # yarn install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    # or
    # pnpm dev
    # or
    yarn dev
    ```
4.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Project Structure (Brief Overview)

*   `src/components/`: Reusable UI components.
    *   `src/components/forms/`: Reusable form field components.
*   `src/pages/`: Top-level page components corresponding to routes.
*   `src/stores/`: Zustand stores for global state management (categories, transactions, settings).
*   `src/hooks/`: Custom React hooks.
*   `src/types/`: TypeScript type definitions.
*   `src/constants/`: Application-wide constants (e.g., `PILLARS`).
*   `public/`: Static assets.
