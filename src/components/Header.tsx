import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, LogOut, ChevronDown, Search, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { League } from '../types';

interface HeaderProps {
  leagues: League[];
  selectedLeague: number | 'all';
  onLeagueChange: (leagueId: number | 'all') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ leagues, selectedLeague, onLeagueChange, searchTerm, onSearchChange, onProfileClick }) => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md border-b-2 border-red-500 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img 
              src="https://i.ibb.co/NnpRnXHn/1000022407-removebg-preview.png" 
              alt="Malha Pro" 
              className="h-12 w-auto mr-3"
            />
            <div>
              <h1 className="text-2xl font-bold text-red-600">Malha Pro</h1>
              <p className="text-xs text-gray-600 hidden sm:block">O melhor fornecedor de malha tailandesa do Brasil</p>
            </div>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="relative flex items-center">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Buscar"
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              >
                <Search size={24} />
              </button>
              {isSearchOpen && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-white rounded-full shadow-lg border border-gray-200 p-1 animate-fade-in-right z-20">
                  <input
                    type="text"
                    placeholder="Pesquisar camisa..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-48 sm:w-64 px-3 py-1 bg-transparent focus:outline-none text-gray-700"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    aria-label="Fechar busca"
                    className="p-1 text-gray-500 hover:text-red-600"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              {user ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <User size={24} />
                </button>
              ) : (
                <button
                  onClick={onProfileClick}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <User size={24} />
                </button>
              )}

              {isDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LayoutDashboard size={16} />
                    Painel
                  </Link>
                  <Link
                    to="/meus-pedidos"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <ShoppingBag size={16} />
                    Meus Pedidos
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <nav className="mt-4">
          <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 scrollbar-custom">
            <button
              onClick={() => onLeagueChange('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                selectedLeague === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
              }`}
            >
              Todos
            </button>
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => onLeagueChange(league.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedLeague === league.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-600'
                }`}
              >
                {league.name}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
