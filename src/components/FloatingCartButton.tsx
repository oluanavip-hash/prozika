import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  cartItemsCount: number;
  onClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ cartItemsCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40"
    >
      <ShoppingCart size={24} />
      {cartItemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {cartItemsCount}
        </span>
      )}
    </button>
  );
};

export default FloatingCartButton;
