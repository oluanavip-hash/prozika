import React from 'react';
import { Minus, Plus, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { CartItem } from '../types';
import { calculateCartTotals } from '../utils/cartUtils';

interface FloatingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (teamId: number, size: string, quantity: number) => void;
  onRemoveItem: (teamId: number, size: string) => void;
  onGoToCheckout: () => void;
}

const FloatingCart: React.FC<FloatingCartProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onGoToCheckout
}) => {
  const { subtotal, discount, total, numberOfFreeItems, totalQuantity } = calculateCartTotals(cartItems);
  const MIN_ITEMS_FOR_CHECKOUT = 5;
  const canCheckout = totalQuantity >= MIN_ITEMS_FOR_CHECKOUT;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-red-600 text-white sticky top-0">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h3 className="text-xl font-bold">Seu Carrinho</h3>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8 flex flex-col h-full justify-center items-center">
              <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              {numberOfFreeItems > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center mb-4">
                  <p className="font-bold text-green-700">🎉 Leve 3, Pague 2! 🎉</p>
                  <p className="text-sm text-green-600">Você ganhou {numberOfFreeItems} camisa de graça!</p>
                </div>
              )}
              <div className="space-y-4">
                {cartItems.map((item) => {
                  const itemDiscountedPrice = item.team.price * 0.30;
                  return (
                    <div key={`${item.team.id}-${item.size}`} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex gap-3">
                        <img
                          src={item.team.image1}
                          alt={item.team.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.team.name}</h4>
                          <p className="text-sm text-gray-600">Tamanho: {item.size}</p>
                          <p className="text-red-600 font-semibold">R$ {itemDiscountedPrice.toFixed(2).replace('.', ',')}</p>
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.team.id, item.size)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.team.id, item.size, Math.max(1, item.quantity - 1))}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.team.id, item.size, item.quantity + 1)}
                            className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <p className="font-bold text-gray-800">
                          R$ {(itemDiscountedPrice * item.quantity).toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Desconto (Leve 3, Pague 2):</span>
                  <span>- R$ {discount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-2">
              <span className="text-xl font-bold">Total:</span>
              <span className="text-2xl font-bold text-red-600">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <button 
              onClick={onGoToCheckout}
              disabled={!canCheckout}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors ${
                !canCheckout
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Ir para Checkout
            </button>
            {!canCheckout && (
              <div className="text-center text-red-600 text-sm mt-2 flex items-center justify-center gap-1">
                <AlertCircle size={14} />
                <span>Pedido mínimo de {MIN_ITEMS_FOR_CHECKOUT} peças.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingCart;
