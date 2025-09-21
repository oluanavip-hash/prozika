import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SizeModal from './SizeModal';
import FloatingCart from './FloatingCart';
import FloatingCartButton from './FloatingCartButton';
import AuthModal from './AuthModal';
import Checkout from './Checkout';
import { supabase } from '../lib/supabaseClient';
import { Team, CartItem, League } from '../types';
import { useAuth } from '../contexts/AuthContext';

function Layout() {
  const { user } = useAuth();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<number | 'all'>('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProceedingToCheckout, setIsProceedingToCheckout] = useState(false);

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data, error } = await supabase.from('leagues').select('*').order('name');
      if (error) console.error('Error fetching leagues:', error);
      else setLeagues(data || []);
    };
    fetchLeagues();
  }, []);

  useEffect(() => {
    if (user && isProceedingToCheckout) {
      setIsCheckoutOpen(true);
      setIsProceedingToCheckout(false);
    }
  }, [user, isProceedingToCheckout]);

  const handleAddToCart = (team: Team) => {
    setSelectedTeam(team);
    setIsSizeModalOpen(true);
  };

  const handleSizeConfirm = (size: string) => {
    if (selectedTeam) {
      const existingItem = cartItems.find(item => item.team.id === selectedTeam.id && item.size === size);
      if (existingItem) {
        setCartItems(cartItems.map(item => item.team.id === selectedTeam.id && item.size === size ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        setCartItems([...cartItems, { team: selectedTeam, size, quantity: 1 }]);
      }
    }
  };

  const handleUpdateQuantity = (teamId: number, size: string, quantity: number) => {
    setCartItems(cartItems.map(item => item.team.id === teamId && item.size === size ? { ...item, quantity } : item).filter(item => item.quantity > 0));
  };

  const handleRemoveItem = (teamId: number, size: string) => {
    setCartItems(cartItems.filter(item => !(item.team.id === teamId && item.size === size)));
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    if (user) {
      setIsCheckoutOpen(true);
    } else {
      setIsProceedingToCheckout(true);
      setIsAuthModalOpen(true);
    }
  };

  const handleOrderSuccess = () => {
    alert('Pedido finalizado com sucesso! Você pode acompanhar o status em "Meus Pedidos".');
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  const handleAuthModalClose = () => {
    setIsAuthModalOpen(false);
    if (!user) {
      setIsProceedingToCheckout(false);
    }
  };

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        leagues={leagues}
        selectedLeague={selectedLeague}
        onLeagueChange={setSelectedLeague}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onProfileClick={() => setIsAuthModalOpen(true)}
      />
      
      <main className="flex-grow">
        <Outlet context={{ selectedLeague, handleAddToCart, searchTerm }} />
      </main>

      <SizeModal
        isOpen={isSizeModalOpen}
        onClose={() => setIsSizeModalOpen(false)}
        team={selectedTeam}
        onConfirm={handleSizeConfirm}
      />

      <FloatingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onGoToCheckout={handleGoToCheckout}
      />

      <FloatingCartButton 
        cartItemsCount={cartItemsCount}
        onClick={() => setIsCartOpen(true)}
      />

      <AuthModal isOpen={isAuthModalOpen} onClose={handleAuthModalClose} />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      <footer className="bg-red-600 text-white py-4 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <img src="https://i.ibb.co/NnpRnXHn/1000022407-removebg-preview.png" alt="Malha Pro" className="h-6 w-auto mr-2" />
              <div>
                <h3 className="text-lg font-bold">Malha Pro</h3>
                <p className="text-red-200 text-xs">O melhor fornecedor de malha tailandesa do Brasil</p>
              </div>
            </div>
            <div className="text-center md:text-right text-xs">
              <p className="text-red-100 mb-1">Malha Pro Ltda. | CNPJ: 39.241.290/0001-09 | FLORIANÓPOLIS, SC</p>
              <p className="text-red-200">© 2025 Malha Pro. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
