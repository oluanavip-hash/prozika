import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Home, ShoppingCart, Users, BarChart2, Settings, LifeBuoy, LogOut, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { signOut } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
      isActive
        ? 'bg-red-100 text-red-700'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`;

  const sidebarContent = (
    <div className="flex h-full max-h-screen flex-col gap-2">
      <div className="flex h-14 items-center border-b px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold">
           <img src="https://i.ibb.co/NnpRnXHn/1000022407-removebg-preview.png" alt="Malha Pro" className="h-8 w-auto" />
          <span className="text-red-600">Malha Pro</span>
        </Link>
        <button onClick={onClose} className="lg:hidden ml-auto h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          <NavLink to="/dashboard" end className={navLinkClass}>
            <Home className="h-4 w-4" />
            Início
          </NavLink>
          <NavLink to="/dashboard/pedidos" className={navLinkClass}>
            <ShoppingCart className="h-4 w-4" />
            Pedidos
          </NavLink>
          <NavLink to="/dashboard/clientes" className={navLinkClass}>
            <Users className="h-4 w-4" />
            Clientes
          </NavLink>
          <NavLink to="/dashboard/relatorios" className={navLinkClass}>
            <BarChart2 className="h-4 w-4" />
            Relatórios
          </NavLink>
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <nav className="grid items-start text-sm font-medium gap-1">
          <NavLink to="/dashboard/configuracoes" className={navLinkClass}>
            <Settings className="h-4 w-4" />
            Configurações
          </NavLink>
          <NavLink to="/dashboard/suporte" className={navLinkClass}>
            <LifeBuoy className="h-4 w-4" />
            Suporte
          </NavLink>
          <button onClick={signOut} className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all w-full text-left">
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-gray-50/40 border-r z-50 transform transition-transform lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block border-r bg-gray-50/40">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;
