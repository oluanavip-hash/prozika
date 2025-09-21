import React, { useState, useEffect } from 'react';
import { X, Package, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Team, ProductStock } from '../types';
import { supabase } from '../lib/supabaseClient';

interface SizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onConfirm: (size: string) => void;
}

const SizeModal: React.FC<SizeModalProps> = ({ isOpen, onClose, team, onConfirm }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [stock, setStock] = useState<ProductStock[]>([]);
  const [loadingStock, setLoadingStock] = useState(false);

  const sizes = ['P', 'M', 'G', 'GG', 'XG'];

  useEffect(() => {
    const fetchStock = async () => {
      if (!team || !isOpen) return;
      
      setLoadingStock(true);
      try {
        const { data, error } = await supabase
          .from('product_stock')
          .select('*')
          .eq('team_id', team.id);

        if (error) {
          console.error('Erro ao buscar estoque:', error);
          setStock([]);
        } else {
          setStock(data || []);
        }
      } catch (error) {
        console.error('Erro na conexão:', error);
        setStock([]);
      }
      setLoadingStock(false);
    };

    fetchStock();
  }, [team, isOpen]);

  const getStockForSize = (size: string): number => {
    const stockItem = stock.find(item => item.size === size);
    return stockItem ? stockItem.stock_quantity : 0;
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { color: 'text-red-500', icon: XCircle, text: 'Esgotado' };
    if (quantity <= 5) return { color: 'text-orange-500', icon: AlertTriangle, text: `${quantity} unid.` };
    return { color: 'text-green-600', icon: CheckCircle, text: `${quantity} unid.` };
  };

  const handleConfirm = () => {
    if (selectedSize && team) {
      const stockQuantity = getStockForSize(selectedSize);
      if (stockQuantity > 0) {
        onConfirm(selectedSize);
        setSelectedSize('');
        onClose();
      } else {
        alert('Este tamanho está fora de estoque.');
      }
    }
  };

  const handleClose = () => {
    setSelectedSize('');
    onClose();
  };

  if (!isOpen || !team) return null;

  const originalPrice = team.price;
  const discountedPrice = originalPrice * 0.30;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="text-center mb-6">
          <img
            src={team.image1}
            alt={team.name}
            className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover shadow-md"
          />
          <h3 className="text-xl font-bold text-gray-800">{team.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{team.leagues.name}</p>
          <div className="flex items-baseline justify-center gap-2">
            <p className="text-2xl text-red-600 font-bold">R$ {discountedPrice.toFixed(2).replace('.', ',')}</p>
            <p className="text-sm text-gray-500 line-through">R$ {originalPrice.toFixed(2).replace('.', ',')}</p>
          </div>
          <div className="mt-2">
            <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
              70% OFF
            </span>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4 text-center">Selecione o Tamanho:</h4>
          
          {loadingStock ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-500 mt-3">Carregando estoque...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sizes.map((size) => {
                const stockQuantity = getStockForSize(size);
                const isOutOfStock = stockQuantity === 0;
                const status = getStockStatus(stockQuantity);
                const IconComponent = status.icon;
                
                return (
                  <div key={size} className="relative">
                    <button
                      onClick={() => !isOutOfStock && setSelectedSize(size)}
                      disabled={isOutOfStock}
                      className={`w-full py-4 px-4 rounded-lg border-2 font-semibold transition-all duration-200 flex items-center justify-between ${
                        isOutOfStock
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                          : selectedSize === size
                          ? 'border-red-600 bg-red-50 text-red-600 shadow-md scale-105'
                          : 'border-gray-300 hover:border-red-300 text-gray-700 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-lg font-bold">{size}</span>
                      <div className={`flex items-center gap-2 ${status.color}`}>
                        <IconComponent size={16} />
                        <span className="text-sm font-medium">{status.text}</span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 text-sm mb-3">
              <Package size={16} />
              <span className="font-semibold">Informações de Estoque:</span>
            </div>
            <div className="space-y-2 text-xs text-blue-600">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-600" />
                <span><span className="font-medium">Verde:</span> Mais de 5 unidades disponíveis</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-orange-500" />
                <span><span className="font-medium">Laranja:</span> Últimas unidades (5 ou menos)</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle size={14} className="text-red-500" />
                <span><span className="font-medium">Vermelho:</span> Produto esgotado</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSize || getStockForSize(selectedSize) === 0}
            className="flex-1 py-3 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default SizeModal;
