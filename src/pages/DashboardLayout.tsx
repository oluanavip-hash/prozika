import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Menu, ShoppingBag } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-white px-6 sticky top-0 z-30">
          <button 
            className="lg:hidden p-2 -ml-2"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu de navegação</span>
          </button>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Olá, Acompanhe seus resultados</h1>
          </div>
          <Link 
            to="/" 
            className="bg-red-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Comprar Estoque</span>
          </Link>
        </header>
        <main className="flex-1 bg-gray-50/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
