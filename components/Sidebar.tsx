// components/Sidebar.tsx
import React from 'react';
import { DashboardIcon, TruckIcon, ExpensesIcon, FleetLogoIcon } from './icons';

type View = 'dashboard' | 'truck-logs' | 'expenses';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  clearFilters: () => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  currentView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, currentView, onClick }) => {
  const isActive = currentView === view;
  return (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onClick(view);
        }}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary text-white'
            : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
        }`}
      >
        {icon}
        <span className="ml-3 font-medium">{label}</span>
      </a>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen, clearFilters }) => {
  
  const handleViewChange = (view: View) => {
    clearFilters(); 
    setCurrentView(view);
    setIsOpen(false);
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside className={`absolute lg:relative flex-shrink-0 w-64 h-full bg-surface shadow-lg z-40 transform transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-center h-20 border-b border-secondary">
            <FleetLogoIcon />
            <h1 className="text-2xl font-bold ml-2">Unidade SC 🚛💨</h1>
        </div>
        <nav className="p-4">
          <ul>
            <NavItem
              view="dashboard"
              label="Dashboard"
              icon={<DashboardIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              view="truck-logs"
              label="Registros de Frota"
              icon={<TruckIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
            <NavItem
              view="expenses"
              label="Despesas"
              icon={<ExpensesIcon />}
              currentView={currentView}
              onClick={handleViewChange}
            />
          </ul>
        </nav>
      </aside>
    </>
  );
};
